import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../design/spacing';
import { typography } from '../design/typography';

export default function SignInScreen({ navigation, onSignIn }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignIn = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setSnackbarVisible(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      onSignIn(data.user);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
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
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to track your shuttle
          </Text>

          <View style={styles.form}>
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

            <Button
              mode="contained"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              style={[styles.button, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>

            <View style={styles.signupPrompt}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
                compact
                labelStyle={[styles.linkText, { color: colors.primary }]}
              >
                Sign Up
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
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signupText: {
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
