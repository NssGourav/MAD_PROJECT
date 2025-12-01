import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar, HelperText } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';
import { getApiUrl, API_CONFIG } from '../config/api';

export default function SignUpScreen({ navigation, route, onSignUp }) {
  const { colors } = useTheme();
  const { role } = route.params || { role: 'student' }; // Default to student
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setSnackbarVisible(true);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    try {
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP);
      console.log('📤 Signup request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }), // Include role
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      onSignUp({ ...data.user, token: data.token, role }); // Ensure role and token are passed
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>ST</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {role === 'driver' ? 'Driver Sign Up' : 'Student Sign Up'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {role === 'driver' ? 'Create an account to manage routes' : 'Create an account to track shuttles'}
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              autoCapitalize="words"
              autoComplete="name"
              disabled={loading}
              style={styles.input}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon="account-outline" iconColor={colors.textSecondary} />}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{ colors: { onSurface: colors.text } }}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              disabled={loading}
              style={styles.input}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon="email-outline" iconColor={colors.textSecondary} />}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{ colors: { onSurface: colors.text } }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              disabled={loading}
              style={styles.input}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon="lock-outline" iconColor={colors.textSecondary} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  iconColor={colors.textSecondary}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{ colors: { onSurface: colors.text } }}
            />
            <HelperText type="info" visible={true} style={styles.helperText}>
              Password must be at least 6 characters
            </HelperText>

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password"
              disabled={loading}
              style={styles.input}
              contentStyle={styles.inputContent}
              left={<TextInput.Icon icon="lock-check-outline" iconColor={colors.textSecondary} />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  iconColor={colors.textSecondary}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              theme={{ colors: { onSurface: colors.text } }}
            />

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              style={[styles.button, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign Up
            </Button>

            <View style={styles.signinPrompt}>
              <Text style={[styles.signinText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('SignIn', { role })}
                disabled={loading}
                compact
                labelStyle={[styles.linkText, { color: colors.primary }]}
              >
                Sign In
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: colors.error }]}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
          textColor: '#fff',
        }}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...typography.styles.h3,
    fontWeight: typography.fontWeight.bold,
    color: '#fff',
  },
  title: {
    ...typography.styles.h2,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputContent: {
    ...typography.styles.body,
  },
  helperText: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    ...typography.styles.button,
    color: '#fff',
  },
  signinPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signinText: {
    ...typography.styles.body,
  },
  linkText: {
    ...typography.styles.body,
    fontWeight: typography.fontWeight.semibold,
  },
  snackbar: {
    borderRadius: borderRadius.md,
  },
});
