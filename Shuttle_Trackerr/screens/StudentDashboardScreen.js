import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, IconButton, Chip, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';
import { shadows } from '../design/shadows';
import { API_CONFIG } from '../config/api';

export default function StudentDashboardScreen() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all drivers
  const fetchDrivers = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError('');

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/drivers`);
      const data = await response.json();

      if (response.ok) {
        setDrivers(data.drivers || []);
        setFilteredDrivers(data.drivers || []);
      } else {
        setError(data.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh drivers list
  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchDrivers();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchDrivers(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter drivers based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrivers(filtered);
    }
  }, [searchQuery, drivers]);

  // Open Google Maps with driver location
  const trackDriverOnMaps = (driver) => {
    if (!driver.location || !driver.location.lat || !driver.location.lng) {
      Alert.alert(
        'Location Unavailable',
        `${driver.name}'s location is not available at the moment. The driver may not be sharing their location.`,
        [{ text: 'OK' }]
      );
      return;
    }

    const { lat, lng } = driver.location;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open Google Maps');
        }
      })
      .catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Failed to open Google Maps');
      });
  };

  const formatLastUpdate = (updatedAt) => {
    if (!updatedAt) return 'Never';

    const now = new Date();
    const updateTime = new Date(updatedAt);
    const diffMs = now - updateTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;

    return updateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLocationActive = (updatedAt) => {
    if (!updatedAt) return false;
    const now = new Date();
    const updateTime = new Date(updatedAt);
    const diffMs = now - updateTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins < 5; // Active if updated within last 5 minutes
  };

  const renderDriverCard = ({ item: driver }) => {
    const hasLocation = driver.location && driver.location.lat && driver.location.lng;
    const isActive = hasLocation && isLocationActive(driver.location.updatedAt);

    return (
      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.driverInfo}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconButton
                  icon="account"
                  size={28}
                  iconColor={colors.primary}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  {driver.name}
                </Text>
                <Text style={[styles.driverEmail, { color: colors.textSecondary }]}>
                  {driver.email}
                </Text>
              </View>
            </View>
            <Chip
              mode="flat"
              selected
              style={[
                styles.statusChip,
                { backgroundColor: isActive ? colors.success : colors.textTertiary }
              ]}
              textStyle={styles.statusChipText}
              icon={isActive ? 'circle' : 'circle-outline'}
            >
              {isActive ? 'Live' : 'Offline'}
            </Chip>
          </View>

          {hasLocation && (
            <View style={styles.locationSection}>
              <View style={styles.locationRow}>
                <IconButton
                  icon="map-marker"
                  size={18}
                  iconColor={colors.primary}
                  style={styles.locationIcon}
                />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>
                    Location
                  </Text>
                  <Text style={[styles.locationValue, { color: colors.text }]}>
                    {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}
                  </Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <IconButton
                  icon="clock-outline"
                  size={18}
                  iconColor={colors.secondary}
                  style={styles.locationIcon}
                />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>
                    Last Updated
                  </Text>
                  <Text style={[styles.locationValue, { color: colors.text }]}>
                    {formatLastUpdate(driver.location.updatedAt)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Button
            mode="contained"
            onPress={() => trackDriverOnMaps(driver)}
            style={[
              styles.trackButton,
              { backgroundColor: hasLocation ? colors.primary : colors.textTertiary }
            ]}
            contentStyle={styles.trackButtonContent}
            labelStyle={styles.trackButtonLabel}
            icon="google-maps"
            disabled={!hasLocation}
          >
            {hasLocation ? 'Track Bus Live on Google Maps' : 'Location Not Available'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading drivers...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Student Dashboard</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {user?.name}
            </Text>
          </View>
          <IconButton
            icon="logout"
            size={24}
            iconColor={colors.error}
            onPress={handleSignOut}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search drivers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.cardBg }]}
          iconColor={colors.textSecondary}
          inputStyle={styles.searchInput}
          placeholderTextColor={colors.textTertiary}
        />

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
            <IconButton icon="alert-circle" size={20} iconColor={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        <FlatList
          data={filteredDrivers}
          renderItem={renderDriverCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconButton icon="bus-alert" size={64} iconColor={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'No drivers found' : 'No drivers available'}
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                {searchQuery ? 'Try a different search term' : 'Drivers will appear here when they start sharing their location'}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.styles.body,
  },
  header: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.styles.h4,
    fontWeight: typography.fontWeight.bold,
  },
  headerSubtitle: {
    ...typography.styles.body,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  searchBar: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  searchInput: {
    ...typography.styles.body,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.styles.bodySmall,
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing['3xl'],
  },
  card: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  avatar: {
    margin: 0,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    ...typography.styles.h6,
    fontWeight: typography.fontWeight.bold,
  },
  driverEmail: {
    ...typography.styles.caption,
    marginTop: spacing.xs / 2,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    color: '#fff',
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 11,
  },
  locationSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    ...typography.styles.caption,
    fontSize: 11,
  },
  locationValue: {
    ...typography.styles.bodySmall,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  trackButton: {
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  trackButtonContent: {
    paddingVertical: spacing.xs,
  },
  trackButtonLabel: {
    ...typography.styles.bodySmall,
    fontWeight: typography.fontWeight.semibold,
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
    paddingHorizontal: spacing.lg,
  },
});
