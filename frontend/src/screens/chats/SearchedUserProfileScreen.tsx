import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SearchedUserProfile } from './ConversationsScreen';
import { colors, radius, spacing } from '../../ui/theme';

export function SearchedUserProfileScreen({
  user,
}: {
  user: SearchedUserProfile;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.workStatus}>{user.workStatus}</Text>
          <Text style={styles.infoLine}>{user.oneLineInfo}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{user.location}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Primary Skill</Text>
        <Text style={styles.value}>{user.primarySkill}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Experience</Text>
        <Text style={styles.value}>{user.yearsExperience}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>About</Text>
        <Text style={styles.value}>{user.about}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.label}>Contact</Text>
        <Text style={styles.value}>{user.contact}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  heroCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  workStatus: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoLine: {
    color: colors.textMuted,
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
});

