import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, Button, Divider, List, Switch } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Avatar.Text
          size={96}
          label={getInitials(user?.name)}
          style={[styles.avatar, { backgroundColor: colors.primary }]}
          labelStyle={styles.avatarLabel}
        />
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.name || 'User'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email || ''}
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.cardBg }]} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account Information
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <TouchableOpacity activeOpacity={0.7}>
            <List.Item
              title="Full Name"
              description={user?.name || 'Not set'}
              left={(props) => (
                <List.Icon 
                  {...props} 
                  icon="account" 
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
              descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
              style={styles.listItem}
            />
          </TouchableOpacity>
          
          <List.Item
            title="Email"
            description={user?.email || 'Not set'}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="email" 
                iconColor={colors.primary}
                style={styles.listIcon}
              />
            )}
            titleStyle={[styles.listTitle, { color: colors.text }]}
            descriptionStyle={[styles.listDescription, { color: colors.textSecondary }]}
            style={styles.listItem}
          />
          
          <List.Item
            title="User ID"
            description={user?.id || 'N/A'}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon="identifier" 
                iconColor={colors.primary}
                style={styles.listIcon}
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
            Preferences
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <List.Item
            title="Push Notifications"
            description="Receive updates about shuttle locations"
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
            title="Location Sharing"
            description="Share your location for better tracking"
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
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={locationSharing ? colors.primary : colors.textTertiary}
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
            Actions
          </Text>
          <Divider style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <Button
            mode="contained"
            onPress={() => {}}
            style={[styles.button, { backgroundColor: colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="pencil"
          >
            Edit Profile
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {}}
            style={[styles.button, { borderColor: colors.border }]}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, { color: colors.text }]}
            icon="help-circle"
          >
            Help & Support
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {}}
            style={[styles.button, { borderColor: colors.border }]}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, { color: colors.text }]}
            icon="information"
          >
            About
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={[styles.button, styles.signOutButton, { backgroundColor: colors.error }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="logout"
          >
            Sign Out
          </Button>
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
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  avatar: {
    marginBottom: spacing.md,
    ...typography.styles.h3,
  },
  avatarLabel: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
  },
  name: {
    ...typography.styles.h4,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  email: {
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
  button: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography.styles.button,
    color: '#fff',
  },
  signOutButton: {
    marginTop: spacing.md,
  },
});
