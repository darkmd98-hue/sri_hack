import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StitchNavItem } from '../components/common';
import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const recommendedMatches = [
  {
    distance: '2.4 miles away',
    name: 'Sarah Jenkins',
    reportedUserId: 2,
    teaches: 'Python',
    wants: 'Spanish',
    uri: stitchImages.sarahJenkins,
    online: true,
  },
  {
    distance: '0.8 miles away',
    name: 'Marcus Chen',
    reportedUserId: 3,
    teaches: 'Guitar',
    wants: 'Photography',
    uri: stitchImages.marcusChen,
    online: false,
  },
  {
    distance: '5.1 miles away',
    name: 'Elena Rodriguez',
    reportedUserId: 4,
    teaches: 'Digital Marketing',
    wants: 'Cooking',
    uri: stitchImages.elenaRodriguez,
    online: false,
  },
];

export function HomeDashboardScreen({
  onNavigate,
  onOpenPublicProfile,
}: {
  onNavigate: (route: StitchAppRoute) => void;
  onOpenPublicProfile: (reportedUserId: number) => void;
}) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <StitchIcon color={stitchColors.primary} name="swap_horiz" size={20} />
            </View>
            <Text style={styles.brandText}>SkillSwap</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => onNavigate('requests')}
              style={({ pressed }) => [styles.iconButton, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.text} name="notifications" size={22} />
            </Pressable>
            <Pressable onPress={() => onNavigate('profile')}>
              <Image source={{ uri: stitchImages.homeAvatar }} style={styles.profileImage} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>{'Hi, Alex! \uD83D\uDC4B'}</Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to learn something new today?
            </Text>
          </View>

          <Pressable
            onPress={() => onNavigate('explore')}
            style={({ pressed }) => [styles.searchWrap, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.slate400} name="search" size={20} />
            <TextInput
              editable={false}
              placeholder="Search for skills (e.g. Figma, Python)"
              placeholderTextColor={stitchColors.slate400}
              style={styles.searchInput}
            />
          </Pressable>

          <View style={styles.statsRow}>
            <Pressable
              onPress={() => onNavigate('requests')}
              style={({ pressed }) => [styles.statCard, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.primary} name="send" size={22} />
              <Text style={styles.statLabel}>Requests</Text>
              <Text style={styles.statValue}>12</Text>
            </Pressable>
            <Pressable
              onPress={() => onNavigate('chats')}
              style={({ pressed }) => [styles.statCard, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.primary} name="chat_bubble" size={22} />
              <Text style={styles.statLabel}>Chats</Text>
              <Text style={styles.statValue}>5</Text>
            </Pressable>
            <Pressable
              onPress={() => onNavigate('manageSkills')}
              style={({ pressed }) => [styles.statCard, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.primary} name="star" size={22} />
              <Text style={styles.statLabel}>Skills</Text>
              <Text style={styles.statValue}>4</Text>
            </Pressable>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Trending Skills</Text>
            <Pressable onPress={() => onNavigate('explore')}>
              <Text style={styles.sectionAction}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.trendingRow}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>UI Design</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>React.js</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Data Analysis</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Spanish</Text>
            </View>
          </ScrollView>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recommended Matches</Text>
            <Pressable onPress={() => onNavigate('explore')}>
              <Text style={styles.sectionAction}>Filter</Text>
            </Pressable>
          </View>

          <View style={styles.cardList}>
            {recommendedMatches.map(match => (
              <Pressable
                key={match.name}
                onPress={() => onOpenPublicProfile(match.reportedUserId)}
                style={({ pressed }) => [styles.matchCard, pressed ? styles.pressed : null]}
              >
                <Image source={{ uri: match.uri }} style={styles.matchImage} />
                <View style={styles.matchBody}>
                  <View style={styles.matchTopRow}>
                    <View>
                      <Text style={styles.matchName}>{match.name}</Text>
                      <Text style={styles.matchDistance}>{match.distance}</Text>
                    </View>
                    {match.online ? (
                      <View style={styles.onlinePill}>
                        <Text style={styles.onlinePillText}>Online</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.skillPillRow}>
                    <View style={styles.teachPill}>
                      <Text style={styles.teachPillText}>{`TEACHES: ${match.teaches}`}</Text>
                    </View>
                    <View style={styles.wantPill}>
                      <Text style={styles.wantPillText}>{`WANTS: ${match.wants}`}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <StitchNavItem active icon="home" label="Home" onPress={() => onNavigate('home')} />
        <StitchNavItem icon="group" label="Matches" onPress={() => onNavigate('matches')} />
        <View style={styles.centerButtonWrap}>
          <Pressable
            onPress={() => onNavigate('manageSkills')}
            style={({ pressed }) => [styles.centerButton, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.white} name="add" size={28} />
          </Pressable>
        </View>
        <StitchNavItem icon="forum" label="Messages" onPress={() => onNavigate('chats')} />
        <StitchNavItem icon="person" label="Profile" onPress={() => onNavigate('profile')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: stitchColors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  brandText: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: stitchColors.primary,
    resizeMode: 'cover',
  },
  content: {
    paddingTop: 88,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    paddingVertical: 24,
  },
  welcomeTitle: {
    color: stitchColors.text,
    fontSize: 36,
    fontWeight: '700',
  },
  welcomeSubtitle: {
    marginTop: 4,
    color: stitchColors.slate500,
    fontSize: 16,
  },
  searchWrap: {
    height: 56,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    ...stitchShadow.card,
  },
  searchInput: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: stitchColors.white,
    padding: 16,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  statLabel: {
    marginTop: 8,
    color: stitchColors.slate500,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    marginTop: 4,
    color: stitchColors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  sectionRow: {
    marginTop: 32,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: stitchColors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionAction: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  trendingRow: {
    gap: 12,
    paddingBottom: 8,
  },
  activeTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    ...stitchShadow.primary,
  },
  activeTagText: {
    color: stitchColors.white,
    fontSize: 15,
    fontWeight: '500',
  },
  tag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
  },
  tagText: {
    color: stitchColors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  cardList: {
    gap: 16,
  },
  matchCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 24,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  matchBody: {
    flex: 1,
  },
  matchTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matchName: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  matchDistance: {
    marginTop: 2,
    color: stitchColors.slate500,
    fontSize: 14,
  },
  onlinePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.greenSoft,
  },
  onlinePillText: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  skillPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  teachPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  teachPillText: {
    color: stitchColors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  wantPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: stitchColors.slate100,
  },
  wantPillText: {
    color: stitchColors.slate600,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: stitchColors.white,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  centerButtonWrap: {
    marginTop: -28,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
    borderWidth: 4,
    borderColor: stitchColors.background,
    ...stitchShadow.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
