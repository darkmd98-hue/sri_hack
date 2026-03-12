import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

type SavedUser = {
  id: string;
  image: string;
  note: string;
  reportedUserId: number;
  role: string;
  title: string;
};

const initialSavedUsers: SavedUser[] = [
  {
    id: 'alex-rivera',
    image: stitchImages.publicProfile,
    note: 'Saved from Explore',
    reportedUserId: 1,
    role: 'UI/UX Design \u2022 React \u2022 Photography',
    title: 'Alex Rivera',
  },
  {
    id: 'sarah-jenkins',
    image: stitchImages.exploreSarah,
    note: 'Saved from Matches',
    reportedUserId: 2,
    role: 'Design Systems \u2022 Figma \u2022 Mentoring',
    title: 'Sarah Jenkins',
  },
];

export function SavedScreen({
  onBack,
  onOpenPublicProfile,
}: {
  onBack: () => void;
  onOpenPublicProfile: (reportedUserId: number) => void;
}) {
  const [savedUsers, setSavedUsers] = useState(initialSavedUsers);

  const removeSavedUser = (userId: string): void => {
    setSavedUsers(previous => previous.filter(user => user.id !== userId));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.slate700} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Saved</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Bookmarked Profiles</Text>
          <Text style={styles.heroCopy}>
            Keep track of people you may want to reconnect with later.
          </Text>
        </View>

        <View style={styles.cardColumn}>
          {savedUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userBody}>
                <View style={styles.identityRow}>
                  <Image source={{ uri: user.image }} style={styles.avatar} />
                  <View style={styles.identityText}>
                    <Text style={styles.userTitle}>{user.title}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                    <Text style={styles.userNote}>{user.note}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => onOpenPublicProfile(user.reportedUserId)}
                    style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
                  >
                    <Text style={styles.primaryButtonText}>Open Profile</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => removeSavedUser(user.id)}
                    style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
                  >
                    <StitchIcon color={stitchColors.slate500} name="bookmark_remove" size={18} />
                    <Text style={styles.secondaryButtonText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {savedUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <StitchIcon color={stitchColors.slate400} name="favorite_border" size={28} />
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.emptyCopy}>Profiles you bookmark will appear here.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: stitchColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  heroCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    ...stitchShadow.card,
  },
  heroTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  heroCopy: {
    marginTop: 6,
    color: stitchColors.slate500,
    fontSize: 14,
    lineHeight: 21,
  },
  cardColumn: {
    gap: 16,
  },
  userCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    ...stitchShadow.card,
  },
  userBody: {
    gap: 16,
  },
  identityRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  identityText: {
    flex: 1,
  },
  userTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  userRole: {
    marginTop: 4,
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  userNote: {
    marginTop: 6,
    color: stitchColors.slate500,
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    minWidth: 120,
    minHeight: 44,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  secondaryButtonText: {
    color: stitchColors.slate600,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyCopy: {
    color: stitchColors.slate500,
    fontSize: 14,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
