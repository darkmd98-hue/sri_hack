import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StitchNavItem } from '../components/common';
import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const cards = [
  {
    dept: 'Computer Science \u2022 Senior',
    match: '98% MATCH',
    name: 'Alex Rivera',
    reportedUserId: 1,
    rating: '4.9',
    reviews: '(42 reviews)',
    status: true,
    teaches: 'React \u2022 Node.js',
    uri: stitchImages.exploreAlex,
    wants: 'UI Design',
  },
  {
    dept: 'Digital Arts \u2022 Sophomore',
    match: '92% MATCH',
    name: 'Sarah Chen',
    reportedUserId: 2,
    rating: '5.0',
    reviews: '(18 reviews)',
    status: false,
    teaches: 'Figma \u2022 Illustration',
    uri: stitchImages.exploreSarah,
    wants: 'Python',
  },
  {
    dept: 'Business Administration \u2022 Junior',
    match: '85% MATCH',
    name: 'James Wilson',
    reportedUserId: 5,
    rating: '4.7',
    reviews: '(31 reviews)',
    status: false,
    teaches: 'Excel \u2022 Public Speaking',
    uri: stitchImages.exploreJames,
    wants: 'Data Vis',
  },
];

const filterOptions = ['Skill', 'Level', 'Mode', 'Location'] as const;
type ExploreFilter = (typeof filterOptions)[number];

export function ExploreSkillsScreen({
  onNavigate,
  onOpenPublicProfile,
}: {
  onNavigate: (route: StitchAppRoute) => void;
  onOpenPublicProfile: (reportedUserId: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>('Skill');

  const filteredCards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length === 0) {
      return cards;
    }

    return cards.filter(card => {
      if (activeFilter === 'Skill') {
        return `${card.teaches} ${card.wants}`.toLowerCase().includes(normalized);
      }
      if (activeFilter === 'Level') {
        return card.dept.toLowerCase().includes(normalized);
      }
      if (activeFilter === 'Mode') {
        return (card.status ? 'online' : 'offline').includes(normalized);
      }
      return `${card.name} ${card.dept} ${card.teaches} ${card.wants}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [activeFilter, query]);

  const searchPlaceholder =
    activeFilter === 'Skill'
      ? 'Search skills, departments, or names...'
      : activeFilter === 'Level'
        ? 'Search by year or level...'
        : activeFilter === 'Mode'
          ? 'Search online or offline...'
          : 'Search current demo cards...';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <StitchIcon color={stitchColors.primary} name="swap_calls" size={30} />
            <Text style={styles.brandTitle}>SkillSwap</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              onPress={() => onNavigate('requests')}
              style={({ pressed }) => [styles.roundButton, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.text} name="notifications" size={22} />
            </Pressable>
            <Pressable
              onPress={() => onNavigate('profile')}
              style={({ pressed }) => [styles.avatarBadge, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.primary} name="person" size={22} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.searchWrap}>
            <View style={styles.searchLeft}>
              <StitchIcon color={stitchColors.slate400} name="search" size={20} />
            </View>
            <TextInput
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={stitchColors.slate400}
              style={styles.searchInput}
              value={query}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.filterRow}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filterOptions.map(option => {
              const active = option === activeFilter;
              return (
                <Pressable
                  key={option}
                  onPress={() => setActiveFilter(option)}
                  style={active ? styles.filterChipActive : styles.filterChip}
                >
                  <Text style={active ? styles.filterChipActiveText : styles.filterChipText}>
                    {option}
                  </Text>
                  <StitchIcon
                    color={active ? stitchColors.white : stitchColors.text}
                    name={option === 'Location' ? 'near_me' : 'keyboard_arrow_down'}
                    size={16}
                  />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Matches</Text>
            <Text style={styles.sectionCaption}>Sorted by compatibility</Text>
          </View>

          <View style={styles.cards}>
            {filteredCards.map(card => (
              <View key={card.name} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.portraitWrap}>
                    <Image source={{ uri: card.uri }} style={styles.cardImage} />
                    {card.status ? <View style={styles.onlineDot} /> : null}
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeaderRow}>
                      <View>
                        <Text style={styles.cardName}>{card.name}</Text>
                        <Text style={styles.cardDept}>{card.dept}</Text>
                      </View>
                      <View style={[styles.matchPill, !card.status ? styles.matchPillMuted : null]}>
                        <Text
                          style={[
                            styles.matchPillText,
                            !card.status ? styles.matchPillTextMuted : null,
                          ]}
                        >
                          {card.match}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ratingRow}>
                      <StitchIcon color={stitchColors.amber} name="star" size={16} />
                      <Text style={styles.ratingText}>{card.rating}</Text>
                      <Text style={styles.ratingCaption}>{card.reviews}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.skillGrid}>
                  <View style={styles.skillCell}>
                    <Text style={styles.skillCellLabel}>Teaches</Text>
                    <Text style={styles.skillCellPrimary}>{card.teaches}</Text>
                  </View>
                  <View style={styles.skillCell}>
                    <Text style={styles.skillCellLabel}>Wants to Learn</Text>
                    <Text style={styles.skillCellText}>{card.wants}</Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => onOpenPublicProfile(card.reportedUserId)}
                  style={({ pressed }) => [styles.connectButton, pressed ? styles.pressed : null]}
                >
                  <Text style={styles.connectButtonText}>{`Connect with ${card.name.split(' ')[0]}`}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <StitchNavItem active icon="explore" label="Explore" onPress={() => onNavigate('explore')} />
        <StitchNavItem icon="group" label="Matches" onPress={() => onNavigate('matches')} />
        <StitchNavItem icon="chat_bubble" label="Messages" onPress={() => onNavigate('chats')} />
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
    paddingBottom: 96,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate200,
    backgroundColor: stitchColors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.30)',
    backgroundColor: 'rgba(55,19,236,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchWrap: {
    marginTop: 24,
    height: 52,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.white,
    ...stitchShadow.card,
    justifyContent: 'center',
  },
  searchLeft: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  searchInput: {
    paddingLeft: 44,
    paddingRight: 16,
    color: stitchColors.text,
    fontSize: 14,
  },
  filterRow: {
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterChipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
  },
  filterChipActiveText: {
    color: stitchColors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
  },
  filterChipText: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionCaption: {
    color: stitchColors.slate500,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  cards: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: stitchRadius.lg,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 16,
  },
  portraitWrap: {
    position: 'relative',
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  onlineDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: stitchColors.green,
    borderWidth: 2,
    borderColor: stitchColors.white,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardDept: {
    marginTop: 4,
    color: stitchColors.slate500,
    fontSize: 12,
    fontWeight: '500',
  },
  matchPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(55,19,236,0.10)',
    alignSelf: 'flex-start',
  },
  matchPillMuted: {
    backgroundColor: stitchColors.slate100,
  },
  matchPillText: {
    color: stitchColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  matchPillTextMuted: {
    color: stitchColors.slate500,
  },
  ratingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingCaption: {
    color: stitchColors.slate400,
    fontSize: 12,
  },
  skillGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  skillCell: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: stitchColors.background,
  },
  skillCellLabel: {
    color: stitchColors.slate400,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  skillCellPrimary: {
    color: stitchColors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  skillCellText: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  connectButton: {
    marginTop: 16,
    height: 44,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: stitchColors.white,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  pressed: {
    opacity: 0.85,
  },
});
