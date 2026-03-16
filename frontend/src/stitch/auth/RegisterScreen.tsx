import {
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

const departments = ['Design', 'Engineering', 'Business', 'Science'];
const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function RegisterScreen({
  department,
  email,
  loading,
  name,
  password,
  showPassword,
  termsAccepted,
  year,
  onBack,
  onDepartmentChange,
  onEmailChange,
  onLogin,
  onNameChange,
  onPasswordChange,
  onRegister,
  onShowPasswordToggle,
  onTermsToggle,
  onYearChange,
}: {
  department: string;
  email: string;
  loading: boolean;
  name: string;
  password: string;
  showPassword: boolean;
  termsAccepted: boolean;
  year: string;
  onBack: () => void;
  onDepartmentChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onLogin: () => void;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRegister: () => void;
  onShowPasswordToggle: () => void;
  onTermsToggle: () => void;
  onYearChange: (value: string) => void;
}) {
  const normalizedEmail = email.trim();
  const emailInvalid = normalizedEmail.length > 0 && !isValidEmail(normalizedEmail);
  const canSubmit =
    !loading &&
    name.trim().length > 0 &&
    password.trim().length > 0 &&
    normalizedEmail.length > 0 &&
    !emailInvalid &&
    termsAccepted;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.text} name="arrow_back" size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.heroText}>
            <Text style={styles.title}>Join SkillSwap</Text>
            <Text style={styles.subtitle}>
              Enter your details to start swapping skills with your peers.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrap, styles.validInput]}>
              <TextInput onChangeText={onNameChange} style={styles.input} value={name} />
              <StitchIcon color={stitchColors.green} name="check_circle" size={20} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrap, emailInvalid ? styles.errorInput : styles.validInput]}>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={onEmailChange}
                style={styles.input}
                value={email}
              />
              <StitchIcon
                color={emailInvalid ? stitchColors.danger : stitchColors.green}
                name={emailInvalid ? 'error' : 'check_circle'}
                size={20}
              />
            </View>
            {emailInvalid ? (
              <Text style={styles.errorText}>Please enter a valid email address.</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapDefault}>
              <TextInput
                onChangeText={onPasswordChange}
                placeholder="Min. 8 characters"
                placeholderTextColor={stitchColors.slate400}
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
              />
              <Pressable onPress={onShowPasswordToggle}>
                <StitchIcon color={stitchColors.slate400} name="visibility" size={20} />
              </Pressable>
            </View>
          </View>

          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, styles.flexField]}>
              <Text style={styles.label}>Department</Text>
              <Pressable
                onPress={() =>
                  onDepartmentChange(
                    departments[(departments.indexOf(department) + 1) % departments.length],
                  )
                }
                style={({ pressed }) => [styles.selectWrap, pressed ? styles.pressed : null]}
              >
                <Text style={styles.selectText}>{department}</Text>
                <StitchIcon color={stitchColors.slate400} name="keyboard_arrow_down" size={20} />
              </Pressable>
            </View>
            <View style={[styles.fieldGroup, styles.flexField]}>
              <Text style={styles.label}>Year</Text>
              <Pressable
                onPress={() =>
                  onYearChange(years[(years.indexOf(year) + 1) % years.length])
                }
                style={({ pressed }) => [styles.selectWrap, pressed ? styles.pressed : null]}
              >
                <Text style={styles.selectText}>{year}</Text>
                <StitchIcon color={stitchColors.slate400} name="keyboard_arrow_down" size={20} />
              </Pressable>
            </View>
          </View>

          <Pressable onPress={onTermsToggle} style={({ pressed }) => [styles.termsRow, pressed ? styles.pressed : null]}>
            <View style={[styles.checkbox, termsAccepted ? styles.checkboxActive : null]}>
              {termsAccepted ? (
                <StitchIcon color={stitchColors.white} name="check_circle" size={16} />
              ) : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </Pressable>

          <Pressable
            disabled={!canSubmit}
            onPress={onRegister}
            style={({ pressed }) => [
              styles.primaryButton,
              !canSubmit ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Loading...' : 'Create Account'}
            </Text>
            <StitchIcon color={stitchColors.white} name="arrow_forward" size={20} />
          </Pressable>

          <Text style={styles.footerText}>
            Already have an account?
            <Text onPress={onLogin} style={styles.footerLink}>
              {' '}
              Login
            </Text>
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  heroText: {
    paddingTop: 32,
    paddingBottom: 32,
    gap: 8,
  },
  title: {
    color: stitchColors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: stitchColors.slate600,
    fontSize: 16,
    lineHeight: 24,
  },
  fieldGroup: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    color: stitchColors.slate700,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrap: {
    height: 56,
    borderRadius: stitchRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: stitchColors.white,
  },
  validInput: {
    borderColor: stitchColors.green,
  },
  errorInput: {
    borderColor: stitchColors.danger,
  },
  inputWrapDefault: {
    height: 56,
    borderRadius: stitchRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
  },
  input: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    color: stitchColors.danger,
    fontSize: 12,
    marginLeft: 4,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 16,
  },
  flexField: {
    flex: 1,
  },
  selectWrap: {
    height: 56,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: stitchColors.text,
    fontSize: 16,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 8,
    marginBottom: 20,
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
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: stitchColors.primary,
    backgroundColor: stitchColors.primary,
  },
  termsText: {
    flex: 1,
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
  },
  linkText: {
    color: stitchColors.primary,
    fontWeight: '500',
  },
  primaryButton: {
    height: 56,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    marginTop: 32,
    color: stitchColors.slate600,
    fontSize: 15,
    textAlign: 'center',
  },
  footerLink: {
    color: stitchColors.primary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.85,
  },
});
