import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

export function ForgotPasswordScreen({
  email,
  onBack,
  onEmailChange,
  onLogin,
}: {
  email: string;
  onBack: () => void;
  onEmailChange: (value: string) => void;
  onLogin: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.topCircle, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.text} name="arrow_back" size={22} />
        </Pressable>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <StitchIcon color={stitchColors.white} name="swap_horiz" size={20} />
          </View>
          <Text style={styles.brandText}>SkillSwap</Text>
        </View>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.centerWrap}>
        <View style={styles.card}>
          <View style={styles.heroIconWrap}>
            <StitchIcon color={stitchColors.primary} name="lock_reset" size={42} />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries, it happens. Enter your email below and we'll send you instructions to
              reset your password.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leftIcon}>
                <StitchIcon color={stitchColors.slate400} name="mail" size={20} />
              </View>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onEmailChange}
                placeholder="name@email.com"
                placeholderTextColor={stitchColors.slate400}
                style={styles.input}
                value={email}
              />
            </View>
          </View>

          <Pressable style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}>
            <Text style={styles.primaryButtonText}>Send Reset Link</Text>
            <StitchIcon color={stitchColors.white} name="send" size={18} />
          </Pressable>

          <Pressable onPress={onLogin} style={({ pressed }) => [styles.backLink, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.primary} name="arrow_back" size={18} />
            <Text style={styles.backLinkText}>Back to Login</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footer}>SkillSwap \u00A9 2024. All rights reserved.</Text>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: stitchColors.background,
    paddingBottom: 24,
  },
  header: {
    maxWidth: 576,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  topCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(226,232,240,0.8)',
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
  brandText: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  topSpacer: {
    width: 40,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 448,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    padding: 32,
    ...stitchShadow.large,
  },
  heroIconWrap: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
    marginBottom: 32,
  },
  textWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: stitchColors.text,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 12,
    color: stitchColors.slate600,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 8,
    marginBottom: 24,
  },
  label: {
    color: stitchColors.slate700,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrap: {
    height: 56,
    borderRadius: stitchRadius.md,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.slate50,
    paddingLeft: 44,
    paddingRight: 16,
    justifyContent: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    top: 18,
  },
  input: {
    color: stitchColors.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  primaryButton: {
    height: 56,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  backLink: {
    marginTop: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backLinkText: {
    color: stitchColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    color: stitchColors.slate400,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  decorTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(55,19,236,0.05)',
  },
  decorBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(55,19,236,0.05)',
  },
  pressed: {
    opacity: 0.85,
  },
});
