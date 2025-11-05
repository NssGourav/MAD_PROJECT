import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, Divider, IconButton } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';

export default function RoutesScreen() {
  const { colors } = useTheme();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockRoutes = [
    {
      id: '1',
      name: 'Main Campus Loop',
      description: 'Complete campus circuit connecting all major buildings',
      stops: ['Gate 1', 'Library', 'Cafeteria', 'Hostel', 'Gate 1'],
      frequency: 'Every 15 minutes',
      operatingHours: '6:00 AM - 10:00 PM',
      status: 'active',
    },
    {
      id: '2',
      name: 'North-South Express',
      description: 'Direct route between north and south gates',
      stops: ['North Gate', 'Main Building', 'South Gate'],
      frequency: 'Every 20 minutes',
      operatingHours: '7:00 AM - 9:00 PM',
      status: 'active',
    },
    {
      id: '3',
      name: 'East Wing Shuttle',
      description: 'Serves east side of campus including engineering and research facilities',
      stops: ['East Gate', 'Engineering Block', 'Research Lab', 'East Gate'],
      frequency: 'Every 30 minutes',
      operatingHours: '8:00 AM - 8:00 PM',
      status: 'active',
    },
  ];

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadRoutes} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Shuttle Routes
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          View all available shuttle routes and schedules
        </Text>
      </View>

      {routes.map((route, index) => (
        <TouchableOpacity key={route.id} activeOpacity={0.7} style={styles.cardWrapper}>
          <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.routeName, { color: colors.text }]}>
                      {route.name}
                    </Text>
                    <Chip
                      mode="flat"
                      selected={route.status === 'active'}
                      style={[styles.statusChip, { 
                        backgroundColor: route.status === 'active' 
                          ? colors.secondary + '20' 
                          : colors.textSecondary + '20',
                      }]}
                      textStyle={[styles.statusChipText, {
                        color: route.status === 'active' 
                          ? colors.secondary 
                          : colors.textSecondary,
                      }]}
                      icon={route.status === 'active' ? 'check-circle' : 'close-circle'}
                    >
                      {route.status === 'active' ? 'Active' : 'Inactive'}
                    </Chip>
                  </View>
                </View>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {route.description}
                </Text>
              </View>

              <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <IconButton 
                      icon="clock-outline" 
                      size={20} 
                      iconColor={colors.primary}
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Frequency
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {route.frequency}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '15' }]}>
                    <IconButton 
                      icon="clock-time-four-outline" 
                      size={20} 
                      iconColor={colors.secondary}
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Operating Hours
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {route.operatingHours}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.info + '15' }]}>
                    <IconButton 
                      icon="map-marker-outline" 
                      size={20} 
                      iconColor={colors.info}
                      style={styles.iconButton}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Route Stops
                    </Text>
                    <Text style={[styles.stopsText, { color: colors.text }]}>
                      {route.stops.join(' → ')}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}

      {routes.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <IconButton icon="map-marker-off" size={64} iconColor={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No routes available
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Routes will appear here when available
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.styles.h3,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.styles.bodySmall,
  },
  cardWrapper: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  routeName: {
    ...typography.styles.h5,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  statusChip: {
    height: 28,
    borderRadius: borderRadius.full,
  },
  statusChipText: {
    ...typography.styles.caption,
    fontWeight: typography.fontWeight.semibold,
  },
  description: {
    ...typography.styles.bodySmall,
    marginTop: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
    height: 1,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  iconButton: {
    margin: 0,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...typography.styles.caption,
    marginBottom: spacing.xs / 2,
    fontWeight: typography.fontWeight.medium,
  },
  infoValue: {
    ...typography.styles.body,
  },
  stopsText: {
    ...typography.styles.body,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  emptyContainer: {
    padding: spacing['3xl'],
    alignItems: 'center',
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
