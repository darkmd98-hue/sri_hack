import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function LoginScreen({
  email,
  error,
  loading,
  password,
  rememberMe,
  showPassword,
  onEmailChange,
  onForgot,
  onLogin,
  onPasswordChange,
  onRegister,
  onRememberToggle,
  onShowPasswordToggle,
}: {
  email: string;
  error: string | null;
  loading: boolean;
  password: string;
  rememberMe: boolean;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onForgot: () => void;
  onLogin: () => void;
  onPasswordChange: (value: string) => void;
  onRegister: () => void;
  onRememberToggle: () => void;
  onShowPasswordToggle: () => void;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [styles.topCircle, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.text} name="close" size={22} />
          </Pressable>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <StitchIcon color={stitchColors.white} name="swap_horiz" size={16} />
            </View>
            <Text style={styles.brandTitle}>SkillSwap</Text>
          </View>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.centerWrap}>
          <View style={styles.formWrap}>
            <View style={styles.heroText}>
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subheading}>
                Continue your journey of sharing and learning.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onEmailChange}
                placeholder="name@example.com"
                placeholderTextColor={stitchColors.slate400}
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  onChangeText={onPasswordChange}
                  placeholder="Enter your password"
                  placeholderTextColor={stitchColors.slate400}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  value={password}
                />
                <Pressable
                  onPress={onShowPasswordToggle}
                  style={({ pressed }) => [styles.eyeButton, pressed ? styles.pressed : null]}
                >
                  <StitchIcon color={stitchColors.slate400} name="visibility" size={22} />
                </Pressable>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Pressable
                onPress={onRememberToggle}
                style={({ pressed }) => [styles.rememberRow, pressed ? styles.pressed : null]}
              >
                <View style={[styles.checkbox, rememberMe ? styles.checkboxActive : null]}>
                  {rememberMe ? (
                    <StitchIcon color={stitchColors.white} name="check_circle" size={16} />
                  ) : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={onForgot}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              disabled={loading}
              onPress={onLogin}
              style={({ pressed }) => [
                styles.primaryButton,
                loading ? styles.disabled : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.primaryButtonText}>{loading ? 'Loading...' : 'Login'}</Text>
            </Pressable>

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={({ pressed }) => [styles.socialButton, pressed ? styles.pressed : null]}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkn-8CshMxDyna85pAbdX2jKmV3AgxdQP0PkjhW-qrj3ojt8txata4M_ybS1ryW9hzCOyfs-1PvuTTv4Bw3U4xXAbwmpMHRQJIm-xEecWlQA_0NgT4DBxs63BjhrTN7x4df8L_gpU-rP4x6jXziyTkhpN2yJY_6Ik0v5E03PGY4MvpWkWnnA5PZhlvzwZ83y1quOo8HDYfOchsZpncWzV8UgB06sP3Qw0zBwTyUL8XY10_9ZupjKDyj6n1gvD2NvJIEzsv1raRHZ8',
                  }}
                  style={styles.googleIcon}
                />
                <Text style={styles.socialText}>Google</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.socialButton, pressed ? styles.pressed : null]}>
                <StitchIcon color={stitchColors.text} name="ios" size={20} />
                <Text style={styles.socialText}>Apple</Text>
              </Pressable>
            </View>

            <Text style={styles.footerText}>
              Don't have an account?
              <Text onPress={onRegister} style={styles.footerLink}>
                {' '}
                Sign up for free
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.bottomLinks}>
          <View style={styles.bottomLinkRow}>
            <Text style={styles.bottomLink}>Privacy Policy</Text>
            <Text style={styles.bottomLink}>Terms of Service</Text>
          </View>
          <Text style={styles.bottomCopyright}>\u00A9 2024 SkillSwap Inc.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
  },
  brandTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  topSpacer: {
    width: 48,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  formWrap: {
    width: '100%',
    maxWidth: 440,
    gap: 20,
  },
  heroText: {
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    color: stitchColors.text,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  subheading: {
    color: stitchColors.slate600,
    fontSize: 16,
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: stitchColors.slate700,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    color: stitchColors.text,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: stitchColors.text,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: stitchColors.slate300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.white,
  },
  checkboxActive: {
    borderColor: stitchColors.primary,
    backgroundColor: stitchColors.primary,
  },
  rememberText: {
    color: stitchColors.slate600,
    fontSize: 14,
  },
  forgotText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: stitchColors.danger,
    fontSize: 13,
  },
  primaryButton: {
    height: 56,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: stitchColors.slate200,
  },
  dividerText: {
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    color: stitchColors.slate700,
    fontSize: 15,
    fontWeight: '600',
  },
  footerText: {
    color: stitchColors.slate600,
    fontSize: 15,
    textAlign: 'center',
  },
  footerLink: {
    color: stitchColors.primary,
    fontWeight: '700',
  },
  bottomLinks: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
    gap: 12,
  },
  bottomLinkRow: {
    flexDirection: 'row',
    gap: 24,
  },
  bottomLink: {
    color: stitchColors.slate400,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  bottomCopyright: {
    color: stitchColors.slate400,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.85,
  },
});
