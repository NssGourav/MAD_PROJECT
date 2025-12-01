import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, AppState } from 'react-native';
import { Text, Button, Card, ActivityIndicator, IconButton, Chip } from 'react-native-paper';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';
import { shadows } from '../design/shadows';
import { API_CONFIG } from '../config/api';

export default function DriverDashboardScreen() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [error, setError] = useState('');
  const [updateCount, setUpdateCount] = useState(0);

  const locationSubscription = useRef(null);
  const updateInterval = useRef(null);
  const appState = useRef(AppState.currentState);

  const startLocationSharing = async () => {
    try {
      setError('');
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to share your location with students.',
          [{ text: 'OK' }]
        );
        return;
      }
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        Alert.alert(
          'Background Permission',
          'For best results, allow background location access so students can track you even when the app is in background.',
          [{ text: 'OK' }]
        );
      }

      setIsSharing(true);
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          updateLocationOnServer(latitude, longitude);
        }
      );

    } catch (err) {
      console.error('Error starting location sharing:', err);
      setError('Failed to start location sharing');
      setIsSharing(false);
    }
  };

  // Stop location sharing
  const stopLocationSharing = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
    setIsSharing(false);
    setCurrentLocation(null);
    setLastUpdateTime(null);
    setUpdateCount(0);
  };

  // Update location on server
  const updateLocationOnServer = async (lat, lng) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/update-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          lat,
          lng,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLastUpdateTime(new Date());
        setUpdateCount(prev => prev + 1);
        setError('');
      } else {
        console.error('Server error:', data.message);
        setError(data.message || 'Failed to update location');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection.');
    }
  };

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationSharing();
    };
  }, []);

  const handleSignOut = async () => {
    stopLocationSharing();
    await signOut();
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Driver Dashboard</Text>
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
        {/* Status Card */}
        <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={3}>
          <Card.Content>
            <View style={styles.statusHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Location Sharing</Text>
              <Chip
                mode="flat"
                selected
                style={[
                  styles.statusChip,
                  { backgroundColor: isSharing ? colors.success : colors.textTertiary }
                ]}
                textStyle={styles.statusChipText}
                icon={isSharing ? 'check-circle' : 'circle-outline'}
              >
                {isSharing ? 'Active' : 'Inactive'}
              </Chip>
            </View>

            {isSharing && currentLocation && (
              <View style={styles.locationInfo}>
                <View style={styles.infoRow}>
                  <IconButton
                    icon="map-marker"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.infoIcon}
                  />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Current Location
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <IconButton
                    icon="clock-outline"
                    size={20}
                    iconColor={colors.secondary}
                    style={styles.infoIcon}
                  />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Last Updated
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {formatTime(lastUpdateTime)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <IconButton
                    icon="counter"
                    size={20}
                    iconColor={colors.accent}
                    style={styles.infoIcon}
                  />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Updates Sent
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {updateCount}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
                <IconButton icon="alert-circle" size={20} iconColor={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          {!isSharing ? (
            <Button
              mode="contained"
              onPress={startLocationSharing}
              style={[styles.button, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="map-marker-radius"
            >
              Start Sharing Location
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={stopLocationSharing}
              style={[styles.button, { backgroundColor: colors.error }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="stop-circle"
            >
              Stop Sharing
            </Button>
          )}
        </View>

        {/* Info Card */}
        <Card style={[styles.infoCard, { backgroundColor: colors.primary + '10' }]}>
          <Card.Content>
            <View style={styles.infoCardHeader}>
              <IconButton icon="information" size={24} iconColor={colors.primary} />
              <Text style={[styles.infoCardTitle, { color: colors.primary }]}>
                How it works
              </Text>
            </View>
            <Text style={[styles.infoCardText, { color: colors.text }]}>
              • Your location is updated every 2-5 seconds{'\n'}
              • Students can track your bus in real-time{'\n'}
              • Location sharing works in background{'\n'}
              • Tap "Stop Sharing" when your route is complete
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.styles.h5,
    fontWeight: typography.fontWeight.bold,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusChip: {
    height: 32,
  },
  statusChipText: {
    color: '#fff',
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.semibold,
  },
  locationInfo: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: spacing.sm,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.styles.bodySmall,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  button: {
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.semibold,
  },
  infoCard: {
    borderRadius: borderRadius.xl,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoCardTitle: {
    ...typography.styles.h6,
    fontWeight: typography.fontWeight.bold,
  },
  infoCardText: {
    ...typography.styles.bodySmall,
    lineHeight: 24,
  },
});
