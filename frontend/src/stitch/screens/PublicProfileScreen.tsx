import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const teachSkills = [
  'UI/UX Design (Figma)',
  'React & Tailwind CSS',
  'Public Speaking',
  'Intermediate Spanish',
];

const learningSkills = [
  'Analog Photography',
  'Python Data Science',
  'Jazz Piano Basics',
];

const recentReviews = [
  {
    avatar: stitchImages.publicReviewerOne,
    name: 'Sarah Jenkins',
    text:
      '"Alex is an amazing teacher! He simplified React components in a way that finally clicked for me. Very patient and helpful."',
    time: '2 days ago',
  },
  {
    avatar: stitchImages.publicReviewerTwo,
    name: 'Michael Chen',
    text:
      '"Great Figma workshop! We redesigned my portfolio together and I learned so many workflow shortcuts. 10/10 recommend."',
    time: '1 week ago',
  },
];

function RatingStars() {
  return (
    <View style={styles.ratingStars}>
      <StitchIcon color={stitchColors.amber} name="star" size={16} />
      <StitchIcon color={stitchColors.amber} name="star" size={16} />
      <StitchIcon color={stitchColors.amber} name="star" size={16} />
      <StitchIcon color={stitchColors.amber} name="star" size={16} />
      <StitchIcon color={stitchColors.amber} name="star_half" size={16} />
    </View>
  );
}

export function PublicProfileScreen({
  onNavigate,
}: {
  onNavigate: (route: StitchAppRoute) => void;
}) {
  const { width } = useWindowDimensions();
  const wide = width >= 920;

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Pressable onPress={() => onNavigate('home')} style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <StitchIcon color={stitchColors.white} name="swap_horiz" size={22} />
          </View>
          <Text style={styles.brandTitle}>SkillSwap</Text>
        </Pressable>

        <View style={styles.navActions}>
          <Pressable style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate600} name="search" size={22} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate600} name="notifications_none" size={22} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainWrap}>
          <View style={styles.heroCard}>
            <View style={[styles.heroRow, wide ? styles.heroRowWide : null]}>
              <View style={styles.heroImageWrap}>
                <Image source={{ uri: stitchImages.publicProfile }} style={styles.heroImage} />
                <View style={styles.heroStatusDot} />
              </View>

              <View style={styles.heroBody}>
                <View style={[styles.heroHeader, wide ? styles.heroHeaderWide : null]}>
                  <View style={styles.heroHeaderText}>
                    <Text style={styles.heroName}>Alex Rivera</Text>
                    <View style={styles.schoolRow}>
                      <StitchIcon color={stitchColors.primary} name="school" size={16} />
                      <Text style={styles.schoolText}>Computer Science &amp; Design • Junior Year</Text>
                    </View>
                    <View style={styles.ratingRow}>
                      <RatingStars />
                      <Text style={styles.ratingCopy}>4.8 (24 Swaps)</Text>
                    </View>
                  </View>

                  <View style={styles.heroButtons}>
                    <Pressable
                      onPress={() => onNavigate('requests')}
                      style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.white} name="handshake" size={16} />
                      <Text style={styles.primaryButtonText}>Request Swap</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onNavigate('chatWithSarah')}
                      style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.primary} name="chat_bubble_outline" size={16} />
                      <Text style={styles.secondaryButtonText}>Message</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.heroDescription}>
                  Passionate about UI/UX design and frontend development. Currently building a mobile app for sustainable living. Looking to improve my photography skills while helping others master React or Figma basics. Let&apos;s learn together!
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.columns, wide ? styles.columnsWide : null]}>
            <View style={styles.skillsColumn}>
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <View style={[styles.sectionIconBox, styles.sectionIconTeach]}>
                    <StitchIcon color="#16a34a" name="history_edu" size={20} />
                  </View>
                  <Text style={styles.sectionTitle}>Skills I Can Teach</Text>
                </View>
                <View style={styles.tagWrap}>
                  {teachSkills.map(skill => (
                    <View key={skill} style={styles.skillChip}>
                      <View style={styles.skillDot} />
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <View style={[styles.sectionIconBox, styles.sectionIconLearn]}>
                    <StitchIcon color="#d97706" name="lightbulb" size={20} />
                  </View>
                  <Text style={styles.sectionTitle}>What I Want to Learn</Text>
                </View>
                <View style={styles.tagWrap}>
                  {learningSkills.map(skill => (
                    <View key={skill} style={styles.learningChip}>
                      <StitchIcon color={stitchColors.primary} name="auto_awesome" size={14} />
                      <Text style={styles.learningChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Reviews</Text>
                  <Pressable onPress={() => onNavigate('reviews')}>
                    <Text style={styles.linkText}>View All</Text>
                  </Pressable>
                </View>

                <View style={styles.reviewColumn}>
                  {recentReviews.map((review, index) => (
                    <View
                      key={review.name}
                      style={[
                        styles.reviewPreview,
                        index < recentReviews.length - 1 ? styles.reviewDivider : null,
                      ]}
                    >
                      <View style={styles.reviewHeader}>
                        <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                        <View>
                          <Text style={styles.reviewName}>{review.name}</Text>
                          <RatingStars />
                        </View>
                        <Text style={styles.reviewTime}>{review.time}</Text>
                      </View>
                      <Text style={styles.reviewBody}>{review.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.sidebarColumn}>
              <View style={styles.sectionCard}>
                <Text style={styles.sidebarTitle}>Primary Location</Text>
                <View style={styles.mapWrap}>
                  <Image source={{ uri: stitchImages.publicMap }} style={styles.mapImage} />
                  <View style={styles.mapBadge}>
                    <Text style={styles.mapBadgeText}>Engineering Quad</Text>
                  </View>
                </View>
                <Text style={styles.sidebarCopy}>
                  Usually available in the Hub library or Science building on weekdays.
                </Text>
              </View>

              <View style={styles.sectionCard}>
                <Text style={styles.sidebarTitle}>Swap Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Taught</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>14</Text>
                    <Text style={styles.statLabel}>Learned</Text>
                  </View>
                </View>
              </View>

              <View style={styles.availabilityCard}>
                <View style={styles.sectionTitleRow}>
                  <StitchIcon color={stitchColors.primary} name="event_available" size={20} />
                  <Text style={styles.availabilityTitle}>Availability</Text>
                </View>
                <View style={styles.availabilityRow}>
                  <Text style={styles.availabilityDay}>Mon - Wed</Text>
                  <Text style={styles.availabilityTime}>4PM - 7PM</Text>
                </View>
                <View style={styles.availabilityRow}>
                  <Text style={styles.availabilityDay}>Saturday</Text>
                  <Text style={styles.availabilityTime}>11AM - 3PM</Text>
                </View>
              </View>

              <View style={styles.reportWrap}>
                <Pressable style={({ pressed }) => [styles.reportButton, pressed ? styles.pressed : null]}>
                  <StitchIcon color={stitchColors.slate400} name="flag" size={14} />
                  <Text style={styles.reportText}>Report Profile</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCopy}>{'\u00A9 2024 SkillSwap Platform. Education through connection.'}</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Safety</Text>
            <Text style={styles.footerLink}>Guidelines</Text>
          </View>
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
  nav: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate200,
    backgroundColor: 'rgba(246,246,248,0.80)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  mainWrap: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  heroCard: {
    backgroundColor: stitchColors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  heroRow: {
    gap: 24,
  },
  heroRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroImageWrap: {
    alignSelf: 'center',
    position: 'relative',
  },
  heroImage: {
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 4,
    borderColor: 'rgba(55,19,236,0.10)',
  },
  heroStatusDot: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: stitchColors.green,
    borderWidth: 4,
    borderColor: stitchColors.white,
  },
  heroBody: {
    flex: 1,
  },
  heroHeader: {
    gap: 16,
  },
  heroHeaderWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroHeaderText: {
    flex: 1,
  },
  heroName: {
    color: stitchColors.text,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 4,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  schoolText: {
    color: stitchColors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCopy: {
    color: stitchColors.slate600,
    fontSize: 14,
    fontWeight: '600',
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: stitchColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...stitchShadow.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(55,19,236,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  heroDescription: {
    marginTop: 24,
    color: stitchColors.slate600,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 720,
  },
  columns: {
    gap: 24,
  },
  columnsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  skillsColumn: {
    flex: 2,
    gap: 24,
  },
  sidebarColumn: {
    flex: 1,
    gap: 18,
  },
  sectionCard: {
    backgroundColor: stitchColors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconTeach: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  sectionIconLearn: {
    backgroundColor: 'rgba(245,158,11,0.16)',
  },
  sectionTitle: {
    color: stitchColors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.slate100,
  },
  skillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: stitchColors.primary,
  },
  skillChipText: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  learningChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.20)',
    backgroundColor: 'rgba(55,19,236,0.06)',
  },
  learningChipText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  linkText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewColumn: {
    gap: 20,
  },
  reviewPreview: {
    paddingBottom: 20,
  },
  reviewDivider: {
    borderBottomWidth: 1,
    borderBottomColor: stitchColors.slate100,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewName: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewTime: {
    marginLeft: 'auto',
    color: stitchColors.slate400,
    fontSize: 12,
  },
  reviewBody: {
    marginTop: 12,
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sidebarTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  mapWrap: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: stitchColors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  mapBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    ...stitchShadow.card,
  },
  mapBadgeText: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  sidebarCopy: {
    marginTop: 12,
    color: stitchColors.slate500,
    fontSize: 14,
    lineHeight: 21,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: stitchColors.slate50,
    alignItems: 'center',
  },
  statValue: {
    color: stitchColors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    marginTop: 4,
    color: stitchColors.slate500,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  availabilityCard: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(55,19,236,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.16)',
  },
  availabilityTitle: {
    color: stitchColors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  availabilityDay: {
    color: stitchColors.slate600,
    fontSize: 14,
  },
  availabilityTime: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  reportWrap: {
    alignItems: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportText: {
    color: stitchColors.slate400,
    fontSize: 12,
  },
  footer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
    backgroundColor: 'rgba(255,255,255,0.60)',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  footerCopy: {
    color: stitchColors.slate500,
    fontSize: 13,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  footerLink: {
    color: stitchColors.slate500,
    fontSize: 13,
  },
  pressed: {
    opacity: 0.85,
  },
});
