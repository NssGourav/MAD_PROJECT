import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Switch, List, Divider, RadioButton, SegmentedButtons } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';

export default function SettingsScreen() {
  const { theme, changeTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('3');
  const [mapType, setMapType] = useState('standard');

  const handleThemeChange = (newTheme) => {
    if (newTheme !== 'auto') {
      changeTheme(newTheme);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your app experience
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <List.Item
            title="Enable Notifications"
            description="Receive alerts about shuttle updates"
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="bell" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
          
          <List.Item
            title="Shuttle Arrival Alerts"
            description="Get notified when your shuttle is nearby"
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="bell-ring" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                disabled={!notificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Location Services
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <List.Item
            title="Location Tracking"
            description="Allow app to access your location"
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="map-marker" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            right={() => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={locationEnabled ? colors.primary : colors.textTertiary}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Data Refresh
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <List.Item
            title="Auto Refresh"
            description="Automatically update shuttle locations"
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="refresh" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            right={() => (
              <Switch
                value={autoRefresh}
                onValueChange={setAutoRefresh}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={autoRefresh ? colors.primary : colors.textTertiary}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
          
          <View style={[styles.refreshInterval, { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Refresh Interval
            </Text>
            <SegmentedButtons
              value={refreshInterval}
              onValueChange={setRefreshInterval}
              buttons={[
                { value: '1', label: '1s' },
                { value: '3', label: '3s' },
                { value: '5', label: '5s' },
                { value: '10', label: '10s' },
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
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Map Settings
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={[styles.mapType, { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Map Type
            </Text>
            <RadioButton.Group
              onValueChange={setMapType}
              value={mapType}
            >
              <RadioButton.Item 
                label="Standard" 
                value="standard" 
                color={colors.primary} 
                labelStyle={[styles.radioLabel, { color: colors.text }]} 
              />
              <RadioButton.Item 
                label="Satellite" 
                value="satellite" 
                color={colors.primary} 
                labelStyle={[styles.radioLabel, { color: colors.text }]} 
              />
              <RadioButton.Item 
                label="Terrain" 
                value="terrain" 
                color={colors.primary} 
                labelStyle={[styles.radioLabel, { color: colors.text }]} 
              />
            </RadioButton.Group>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={[styles.theme, { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Theme
            </Text>
            <SegmentedButtons
              value={theme}
              onValueChange={handleThemeChange}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
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
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="information" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
          
          <TouchableOpacity activeOpacity={0.7}>
            <List.Item
              title="Privacy Policy"
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon="shield-lock" 
                  iconColor={colors.primary}
                  style={styles.listIcon}
                />
              )}
              right={(props) => (
                <List.Icon 
                  {...props} 
                  icon="chevron-right" 
                  iconColor={colors.textTertiary}
                />
              )}
              titleStyle={[styles.listTitle, { color: colors.text }]}
              style={styles.listItem}
            />
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.7}>
            <List.Item
              title="Terms of Service"
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon="file-document" 
                  iconColor={colors.primary}
                  style={styles.listIcon}
                />
              )}
              right={(props) => (
                <List.Icon 
                  {...props} 
                  icon="chevron-right" 
                  iconColor={colors.textTertiary}
                />
              )}
              titleStyle={[styles.listTitle, { color: colors.text }]}
              style={styles.listItem}
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>
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
  card: {
    margin: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
  },
  cardContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.styles.h5,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.md,
  },
  divider: {
    marginBottom: spacing.md,
    height: 1,
  },
  listItem: {
    paddingVertical: spacing.sm,
  },
  listIcon: {
    marginLeft: 0,
  },
  listTitle: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.medium,
  },
  listDescription: {
    ...typography.styles.bodySmall,
  },
  refreshInterval: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  mapType: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  theme: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  label: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.md,
  },
  segmentedButtons: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  radioLabel: {
    ...typography.styles.body,
  },
});
