import { useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StitchNavItem } from '../components/common';
import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const matchCards = [
  {
    activeWithin: 'Active 8 min ago',
    distance: '1.2 miles away',
    location: 'San Francisco, CA',
    match: '95% Match',
    name: 'Alex Rivera, 28',
    nearby: false,
    offering: 'UI/UX Design',
    recentlyActive: true,
    reportedUserId: 1,
    seeking: 'Swift Dev',
    uri: stitchImages.publicProfile,
  },
  {
    activeWithin: 'Active 2 hours ago',
    distance: '0.8 miles away',
    location: 'Austin, TX',
    match: '88% Match',
    name: 'Sarah Chen, 31',
    nearby: true,
    offering: 'SEO & Ads',
    recentlyActive: false,
    reportedUserId: 2,
    seeking: 'Python Scripting',
    uri: stitchImages.exploreSarah,
  },
  {
    activeWithin: 'Active just now',
    distance: '0.3 miles away',
    location: 'San Jose, CA',
    match: '81% Match',
    name: 'Jordan Lee, 24',
    nearby: true,
    offering: 'Motion Design',
    recentlyActive: true,
    reportedUserId: 6,
    seeking: 'React Native',
    uri: stitchImages.exploreAlex,
  },
];

const matchTabs = ['Best Matches', 'Recently Active', 'New Near You'] as const;
type MatchTab = (typeof matchTabs)[number];

export function YourMatchesScreen({
  onNavigate,
  onOpenPublicProfile,
}: {
  onNavigate: (route: StitchAppRoute) => void;
  onOpenPublicProfile: (reportedUserId: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<MatchTab>('Best Matches');

  const visibleCards = useMemo(() => {
    if (activeTab === 'Recently Active') {
      return matchCards.filter(card => card.recentlyActive);
    }
    if (activeTab === 'New Near You') {
      return matchCards.filter(card => card.nearby);
    }
    return matchCards;
  }, [activeTab]);

  const tabCaption =
    activeTab === 'Best Matches'
      ? 'Top compatibility picks for you'
      : activeTab === 'Recently Active'
        ? 'People who were online recently'
        : 'Fresh matches closest to your area';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => onNavigate('home')}
          style={({ pressed }) => [styles.circleButton, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.primary} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Match Recommendations</Text>
        <Pressable
          onPress={() => onNavigate('explore')}
          style={({ pressed }) => [styles.circleButton, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.primary} name="tune" size={22} />
        </Pressable>
      </View>

      <View style={styles.tabRow}>
        {matchTabs.map(tab => {
          const isActive = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => [
                styles.tabButton,
                isActive ? styles.tabButtonActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={isActive ? styles.activeTab : styles.inactiveTab}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.tabCaption}>{tabCaption}</Text>
        {visibleCards.map((card, index) => (
          <View key={card.name} style={[styles.card, index === 0 ? styles.cardPrimary : null]}>
            <ImageBackground imageStyle={styles.heroImageStyle} source={{ uri: card.uri }} style={styles.heroImage}>
              <View style={[styles.badge, index === 0 ? styles.badgePrimary : styles.badgeDark]}>
                <Text style={styles.badgeText}>{card.match}</Text>
              </View>
              <View style={styles.heroGradient} />
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroName}>{card.name}</Text>
                <View style={styles.locationRow}>
                  <StitchIcon color={stitchColors.white} name="location_on" size={14} />
                  <Text style={styles.locationText}>{card.location}</Text>
                </View>
                <Text style={styles.metaText}>{`${card.activeWithin} • ${card.distance}`}</Text>
              </View>
            </ImageBackground>

            <View style={styles.cardBody}>
              <View style={styles.offerRow}>
                <View style={styles.offerBoxPrimary}>
                  <Text style={styles.offerLabelPrimary}>Offering</Text>
                  <Text style={styles.offerText}>{card.offering}</Text>
                </View>
                <View style={styles.offerBoxSecondary}>
                  <Text style={styles.offerLabelSecondary}>Seeking</Text>
                  <Text style={styles.offerText}>{card.seeking}</Text>
                </View>
              </View>

              {index === 0 ? (
                <Text style={styles.quote}>
                  "Hey! I'm a senior designer looking to build a fitness app. I can help you
                  polish your app's visual identity in exchange for some iOS mentorship."
                </Text>
              ) : null}

              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => onOpenPublicProfile(card.reportedUserId)}
                  style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.secondaryButtonText}>View Profile</Text>
                </Pressable>
                <Pressable
                  onPress={() => onNavigate('requests')}
                  style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.primaryButtonText}>Request Swap</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
        {visibleCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No matches in this view yet</Text>
            <Text style={styles.emptyStateText}>Try another tab to browse the current demo recommendations.</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomNav}>
        <StitchNavItem icon="explore" label="Explore" onPress={() => onNavigate('explore')} uppercase />
        <StitchNavItem active icon="auto_awesome" label="Matches" onPress={() => onNavigate('matches')} uppercase />
        <StitchNavItem badge icon="chat_bubble" label="Chats" onPress={() => onNavigate('chats')} uppercase />
        <StitchNavItem icon="account_circle" label="Profile" onPress={() => onNavigate('profile')} uppercase />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate200,
    backgroundColor: stitchColors.background,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate200,
  },
  tabButton: {
    paddingVertical: 16,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: stitchColors.primary,
  },
  activeTab: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  inactiveTab: {
    paddingVertical: 16,
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 112,
    gap: 24,
  },
  tabCaption: {
    color: stitchColors.slate500,
    fontSize: 13,
    marginTop: -8,
  },
  card: {
    borderRadius: stitchRadius.lg,
    overflow: 'hidden',
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  cardPrimary: {
    shadowColor: stitchColors.primary,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 5,
  },
  heroImage: {
    aspectRatio: 4 / 3,
    justifyContent: 'space-between',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 16,
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: stitchRadius.pill,
  },
  badgePrimary: {
    backgroundColor: stitchColors.primary,
  },
  badgeDark: {
    backgroundColor: 'rgba(15,23,42,0.80)',
  },
  badgeText: {
    color: stitchColors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    height: 112,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  heroTextWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroName: {
    color: stitchColors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  locationRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
  },
  metaText: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
  },
  cardBody: {
    padding: 20,
    gap: 16,
  },
  offerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  offerBoxPrimary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.10)',
    backgroundColor: 'rgba(55,19,236,0.06)',
  },
  offerBoxSecondary: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.slate100,
  },
  offerLabelPrimary: {
    color: stitchColors.primary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  offerLabelSecondary: {
    color: stitchColors.slate500,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  offerText: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  quote: {
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: stitchRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.slate100,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
  },
  secondaryButtonText: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1.5,
    height: 48,
    borderRadius: stitchRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    padding: 24,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateTitle: {
    color: stitchColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateText: {
    color: stitchColors.slate500,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: stitchColors.white,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  pressed: {
    opacity: 0.85,
  },
});
