import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

function FiveStars() {
  return (
    <View style={styles.fiveStars}>
      <StitchIcon color="#eab308" name="star" size={14} />
      <StitchIcon color="#eab308" name="star" size={14} />
      <StitchIcon color="#eab308" name="star" size={14} />
      <StitchIcon color="#eab308" name="star" size={14} />
      <StitchIcon color="#eab308" name="star" size={14} />
    </View>
  );
}

export function MyProfileScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (route: StitchAppRoute) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.slate700} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Pressable style={({ pressed }) => [styles.editBadge, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.primary} name="edit" size={20} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: stitchImages.myProfile }} style={styles.heroAvatar} />
            </View>
            <Pressable
              onPress={() => onNavigate('verification')}
              style={({ pressed }) => [styles.cameraButton, pressed ? styles.pressed : null]}
            >
              <StitchIcon color={stitchColors.white} name="photo_camera" size={16} />
            </Pressable>
          </View>

          <View style={styles.heroText}>
            <View style={styles.nameRow}>
              <Text style={styles.heroName}>Alex Rivers</Text>
              <Pressable
                onPress={() => onNavigate('verification')}
                style={({ pressed }) => [styles.verifiedBadge, pressed ? styles.pressed : null]}
              >
                <StitchIcon color="#15803d" name="verified" size={14} />
                <Text style={styles.verifiedText}>Verified</Text>
              </Pressable>
            </View>
            <Text style={styles.heroRole}>Product Designer &amp; Photographer</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Swaps</Text>
              <Text style={styles.statValue}>24</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Rating</Text>
              <View style={styles.ratingStat}>
                <StitchIcon color="#eab308" name="star" size={18} />
                <Text style={styles.statValueDark}>4.9</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Reviews</Text>
              <Text style={styles.statValueDark}>18</Text>
            </View>
          </View>
        </View>

        <View style={styles.sections}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Pressable>
                <Text style={styles.linkText}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.sectionBody}>
              Passionate about visual storytelling and clean interfaces. Looking to swap UI/UX design mentoring for advanced portrait photography tips and studio lighting techniques.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Pressable
                onPress={() => onNavigate('manageSkills')}
                style={({ pressed }) => [styles.inlineAction, pressed ? styles.pressed : null]}
              >
                <StitchIcon color={stitchColors.primary} name="add" size={16} />
                <Text style={styles.linkText}>Add New</Text>
              </Pressable>
            </View>
            <View style={styles.skillWrap}>
              {['UI/UX Design', 'Figma', 'Photography', 'React Basics'].map(skill => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <Pressable onPress={() => onNavigate('manageSkills')}>
                    <StitchIcon color={stitchColors.slate400} name="close" size={14} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Pressable>
                <Text style={styles.linkText}>Update</Text>
              </Pressable>
            </View>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityIcon}>
                <StitchIcon color={stitchColors.white} name="calendar_today" size={20} />
              </View>
              <View>
                <Text style={styles.availabilityTitle}>Weekends &amp; Weekdays after 6PM</Text>
                <Text style={styles.availabilitySubtitle}>Timezone: UTC-5 (EST)</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews Received</Text>
              <Pressable onPress={() => onNavigate('reviews')}>
                <Text style={styles.linkText}>See All</Text>
              </Pressable>
            </View>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewIdentity}>
                  <Image source={{ uri: stitchImages.reviewSarahSmall }} style={styles.reviewAvatar} />
                  <View>
                    <Text style={styles.reviewName}>Sarah Jenkins</Text>
                    <Text style={styles.reviewTime}>2 weeks ago</Text>
                  </View>
                </View>
                <FiveStars />
              </View>
              <Text style={styles.reviewBody}>
                &quot;Alex is a fantastic teacher. He simplified complex UI concepts for me in just two sessions. Highly recommend!&quot;
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable onPress={() => onNavigate('explore')} style={styles.navItem}>
          <StitchIcon color={stitchColors.slate400} name="explore" size={24} />
          <Text style={styles.navText}>Explore</Text>
        </Pressable>
        <Pressable onPress={() => onNavigate('chats')} style={styles.navItem}>
          <StitchIcon color={stitchColors.slate400} name="chat_bubble" size={24} />
          <Text style={styles.navText}>Messages</Text>
        </Pressable>
        <View style={styles.centerButtonWrap}>
          <Pressable
            onPress={() => onNavigate('manageSkills')}
            style={({ pressed }) => [styles.centerButton, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.white} name="add" size={30} />
          </Pressable>
        </View>
        <Pressable style={styles.navItem}>
          <StitchIcon color={stitchColors.slate400} name="favorite" size={24} />
          <Text style={styles.navText}>Saved</Text>
        </Pressable>
        <Pressable onPress={() => onNavigate('profile')} style={styles.navItem}>
          <StitchIcon color={stitchColors.primary} name="person" size={24} />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
        </Pressable>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.80)',
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
  editBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  scrollContent: {
    paddingBottom: 112,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarRing: {
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 4,
    borderColor: 'rgba(55,19,236,0.20)',
    padding: 4,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
  },
  cameraButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: stitchColors.white,
    ...stitchShadow.primary,
  },
  heroText: {
    marginTop: 16,
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroName: {
    color: stitchColors.text,
    fontSize: 30,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: stitchRadius.pill,
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  verifiedText: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroRole: {
    marginTop: 6,
    color: stitchColors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(55,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.10)',
  },
  statLabel: {
    color: stitchColors.slate500,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  statValue: {
    color: stitchColors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  statValueDark: {
    color: stitchColors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  ratingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sections: {
    paddingHorizontal: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionBody: {
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: stitchColors.slate100,
  },
  skillChipText: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(55,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.10)',
  },
  availabilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityTitle: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  availabilitySubtitle: {
    marginTop: 2,
    color: stitchColors.slate500,
    fontSize: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    ...stitchShadow.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  reviewIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  reviewName: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  reviewTime: {
    color: stitchColors.slate500,
    fontSize: 12,
    marginTop: 2,
  },
  fiveStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  reviewBody: {
    marginTop: 12,
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    color: stitchColors.slate400,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  navTextActive: {
    color: stitchColors.primary,
  },
  centerButtonWrap: {
    marginTop: -20,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: stitchColors.white,
    ...stitchShadow.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
