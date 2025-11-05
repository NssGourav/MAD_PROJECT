import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Animated, TouchableOpacity } from 'react-native';
import { Appbar, Text, SegmentedButtons, Card, Chip, Menu, IconButton, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';
import { shadows } from '../design/shadows';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [shuttles, setShuttles] = useState([]);
  const [filteredShuttles, setFilteredShuttles] = useState([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 17.4462,
    longitude: 78.3497,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [cardAnimations] = useState({});

  const filterShuttles = useCallback((shuttleList, query) => {
    if (!query.trim()) {
      setFilteredShuttles(shuttleList);
      return;
    }
    const filtered = shuttleList.filter(shuttle =>
      shuttle.name.toLowerCase().includes(query.toLowerCase()) ||
      shuttle.routeId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredShuttles(filtered);
  }, []);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadShuttles() {
      try {
        const res = await fetch('http://localhost:4000/api/shuttles', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isActive) {
          const loadedShuttles = data.shuttles || [];
          setShuttles(loadedShuttles);
          filterShuttles(loadedShuttles, searchQuery);
        }
      } catch (e) {
        if (isActive) setError(String(e.message || e));
      }
    }

    loadShuttles();
    const id = setInterval(loadShuttles, 3000);
    return () => {
      isActive = false;
      controller.abort();
      clearInterval(id);
    };
  }, [filterShuttles, searchQuery]);

  useEffect(() => {
    filterShuttles(shuttles, searchQuery);
  }, [searchQuery, shuttles, filterShuttles]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateETA = (shuttle) => {
    if (!userLocation) return null;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      shuttle.latitude,
      shuttle.longitude
    );
    if (shuttle.speedKph && shuttle.speedKph > 0) {
      const hours = distance / shuttle.speedKph;
      const minutes = Math.round(hours * 60);
      return minutes > 0 ? `${minutes} min` : '< 1 min';
    }
    return null;
  };

  const toggleFavorite = (shuttleId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(shuttleId)) {
      newFavorites.delete(shuttleId);
    } else {
      newFavorites.add(shuttleId);
    }
    setFavorites(newFavorites);
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      } catch { }
    })();
  }, []);

  const handleSignOut = async () => {
    setMenuVisible(false);
    await signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content 
            title="Shuttle Tracker" 
            titleStyle={[styles.headerTitle, { color: colors.text }]}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="account-circle"
                size={28}
                iconColor={colors.text}
                onPress={() => setMenuVisible(true)}
              />
            }
            contentStyle={[styles.menuContent, { backgroundColor: colors.cardBg }]}
          >
            <Menu.Item
              leadingIcon="account"
              title={user?.name || 'User'}
              titleStyle={{ color: colors.text }}
              disabled
            />
            <Menu.Item
              leadingIcon="email"
              title={user?.email || ''}
              titleStyle={{ color: colors.textSecondary }}
              disabled
            />
            <Menu.Item
              leadingIcon="logout"
              onPress={handleSignOut}
              title="Sign Out"
              titleStyle={{ color: colors.text }}
            />
          </Menu>
        </Appbar.Header>
      </View>
      
      <View style={[styles.controlsRow, { backgroundColor: colors.background }]}>
        <SegmentedButtons
          value={mode}
          onValueChange={setMode}
          buttons={[
            { value: 'list', label: 'List View' },
            { value: 'map', label: 'Map View' },
          ]}
          style={styles.segmentedButtons}
          theme={{ 
            colors: { 
              secondaryContainer: colors.primary, 
              onSecondaryContainer: '#fff',
              outline: colors.border,
            } 
          }}
        />
        {error && (
          <Chip 
            mode="flat" 
            selected 
            style={[styles.errorChip, { backgroundColor: colors.error }]}
            textStyle={styles.errorChipText}
            icon="alert-circle"
          >
            {error}
          </Chip>
        )}
      </View>
      
      {mode === 'list' && (
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <TextInput
            mode="outlined"
            placeholder="Search shuttles by name or route..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            contentStyle={styles.searchInputContent}
            left={<TextInput.Icon icon="magnify" iconColor={colors.textSecondary} />}
            right={searchQuery ? <TextInput.Icon icon="close-circle" iconColor={colors.textSecondary} onPress={() => setSearchQuery('')} /> : null}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            theme={{ colors: { onSurface: colors.text } }}
          />
        </View>
      )}
      
      {mode === 'list' ? (
        <FlatList
          data={filteredShuttles}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const eta = calculateETA(item);
            const isFavorite = favorites.has(item.id);
            if (!cardAnimations[item.id]) {
              cardAnimations[item.id] = new Animated.Value(0);
              Animated.timing(cardAnimations[item.id], {
                toValue: 1,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
              }).start();
            }
            const opacity = cardAnimations[item.id];
            
            return (
              <Animated.View
                style={[
                  styles.cardWrapper,
                  {
                    opacity,
                    transform: [{
                      translateY: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    }],
                  },
                ]}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.cardHeader}>
                        <View style={styles.cardTitleContainer}>
                          <Text style={[styles.cardTitle, { color: colors.text }]}>
                            {item.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => toggleFavorite(item.id)}
                            activeOpacity={0.7}
                            style={styles.favoriteButton}
                          >
                            <IconButton
                              icon={isFavorite ? 'star' : 'star-outline'}
                              iconColor={isFavorite ? '#FBBF24' : colors.textSecondary}
                              size={24}
                              style={styles.favoriteIcon}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.routeBadge, { backgroundColor: colors.secondary + '15' }]}>
                          <Text style={[styles.routeText, { color: colors.secondary }]}>
                            Route {item.routeId}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.cardInfo}>
                        <View style={styles.infoRow}>
                          <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <IconButton icon="speedometer" size={20} iconColor={colors.primary} style={styles.infoIcon} />
                          </View>
                          <View style={styles.infoTextContainer}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Speed</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{item.speedKph} km/h</Text>
                          </View>
                        </View>
                        
                        {eta && (
                          <View style={styles.infoRow}>
                            <View style={[styles.infoIconContainer, { backgroundColor: colors.secondary + '15' }]}>
                              <IconButton icon="clock-outline" size={20} iconColor={colors.secondary} style={styles.infoIcon} />
                            </View>
                            <View style={styles.infoTextContainer}>
                              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Estimated Arrival</Text>
                              <Chip 
                                style={[styles.etaChip, { backgroundColor: colors.secondary }]} 
                                textStyle={styles.etaChipText}
                              >
                                {eta}
                              </Chip>
                            </View>
                          </View>
                        )}
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconButton icon="shuttle-van" size={64} iconColor={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No shuttles found</Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                {searchQuery ? 'Try a different search term' : 'Shuttles will appear here when available'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.mapContainer, { backgroundColor: colors.background }]}>
          <MapView 
            style={styles.map} 
            initialRegion={region} 
            region={region}
            onRegionChangeComplete={setRegion}
            mapType="standard"
          >
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor={colors.primary}
              />
            )}
            {shuttles.map((s) => (
              <Marker
                key={s.id}
                coordinate={{ latitude: s.latitude, longitude: s.longitude }}
                title={s.name}
                description={`Route: ${s.routeId} | ${s.speedKph} km/h`}
                pinColor={colors.secondary}
              />
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 1,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    ...typography.styles.h4,
    fontWeight: typography.fontWeight.bold,
  },
  menuContent: {
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  controlsRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  segmentedButtons: {
    borderRadius: borderRadius.lg,
  },
  errorChip: {
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  errorChipText: {
    color: '#fff',
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.medium,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  searchInputContent: {
    ...typography.styles.body,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.styles.h5,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  favoriteButton: {
    marginLeft: spacing.sm,
  },
  favoriteIcon: {
    margin: 0,
  },
  routeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  routeText: {
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.semibold,
  },
  cardInfo: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  infoIcon: {
    margin: 0,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...typography.styles.caption,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.semibold,
  },
  etaChip: {
    height: 32,
    alignSelf: 'flex-start',
  },
  etaChipText: {
    color: '#fff',
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.semibold,
  },
  mapContainer: {
    flex: 1,
    margin: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.styles.h5,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.styles.bodySmall,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
