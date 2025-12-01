import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';
import { shadows } from '../design/shadows';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }) {
  const { colors } = useTheme();

  const handleRoleSelect = (role) => {
    navigation.navigate('SignIn', { role });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="bus-marker" size={40} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Shuttle Tracker</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose your role to get started
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleRoleSelect('driver')}
          style={styles.cardContainer}
        >
          <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <MaterialCommunityIcons name="steering" size={40} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.roleTitle, { color: colors.text }]}>Driver</Text>
              <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
                Manage routes and track your shuttle
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleRoleSelect('student')}
          style={styles.cardContainer}
        >
          <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
              <MaterialCommunityIcons name="school" size={40} color={colors.secondary || '#4CAF50'} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.roleTitle, { color: colors.text }]}>Student</Text>
              <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
                Track shuttles and view schedules
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Surface>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  title: {
    ...typography.styles.h2,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.styles.body,
    textAlign: 'center',
  },
  content: {
    gap: spacing.lg,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  roleTitle: {
    ...typography.styles.h3,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  roleDescription: {
    ...typography.styles.caption,
  },
});
