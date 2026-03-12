import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

const distribution = [
  { label: '5', percent: 72 },
  { label: '4', percent: 18 },
  { label: '3', percent: 6 },
  { label: '2', percent: 3 },
  { label: '1', percent: 1 },
];

const feedback = [
  {
    avatar: stitchImages.reviewAlexJohnson,
    likes: '24',
    name: 'Alex Johnson',
    rating: 5,
    roleTime: 'Python Expert • 2 days ago',
    text:
      'The session was incredible! Alex helped me debug a complex React-Python integration issue that had me stuck for weeks. Very patient and articulate teacher.',
  },
  {
    avatar: stitchImages.reviewMariaGarcia,
    likes: '15',
    name: 'Maria Garcia',
    rating: 4,
    roleTime: 'UI/UX Designer • 1 week ago',
    text:
      'Very detailed feedback on my portfolio. Maria has a great eye for typography and spacing. The session was slightly fast-paced, but I learned a lot.',
  },
  {
    avatar: stitchImages.reviewSamChen,
    likes: '31',
    name: 'Sam Chen',
    rating: 5,
    roleTime: 'Full Stack Dev • 2 weeks ago',
    text:
      'Sam is a pro. He explained Docker concepts in a way that finally clicked for me. Definitely swapping skills with him again.',
  },
];

function StarRow({
  rating,
}: {
  rating: number;
}) {
  return (
    <View style={styles.starRow}>
      {[0, 1, 2, 3, 4].map(index => (
        <StitchIcon
          key={index}
          color={stitchColors.primary}
          name={index < rating ? 'star' : 'star_border'}
          size={16}
        />
      ))}
    </View>
  );
}

export function ReviewsRatingsScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.text} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>SkillSwap Reviews</Text>
        <Pressable style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.text} name="more_vert" size={22} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryColumn}>
            <Text style={styles.summaryScore}>4.8</Text>
            <View style={styles.summaryStars}>
              <StitchIcon color={stitchColors.primary} name="star" size={20} />
              <StitchIcon color={stitchColors.primary} name="star" size={20} />
              <StitchIcon color={stitchColors.primary} name="star" size={20} />
              <StitchIcon color={stitchColors.primary} name="star" size={20} />
              <StitchIcon color={stitchColors.primary} name="star_half" size={20} />
            </View>
            <Text style={styles.summaryCaption}>128 total reviews</Text>
          </View>

          <View style={styles.distributionColumn}>
            {distribution.map(item => (
              <View key={item.label} style={styles.distributionRow}>
                <Text style={styles.distributionLabel}>{item.label}</Text>
                <View style={styles.distributionTrack}>
                  <View
                    style={[
                      styles.distributionFill,
                      { width: `${item.percent}%` as `${number}%` },
                    ]}
                  />
                </View>
                <Text style={styles.distributionPercent}>{`${item.percent}%`}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackTitle}>Recent Feedback</Text>
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort by: Newest</Text>
            <StitchIcon color={stitchColors.slate500} name="expand_more" size={18} />
          </View>
        </View>

        <View style={styles.feedbackColumn}>
          {feedback.map(item => (
            <View key={item.name} style={styles.feedbackCard}>
              <View style={styles.feedbackCardHeader}>
                <View style={styles.feedbackIdentity}>
                  <Image source={{ uri: item.avatar }} style={styles.feedbackAvatar} />
                  <View>
                    <Text style={styles.feedbackName}>{item.name}</Text>
                    <Text style={styles.feedbackMeta}>{item.roleTime}</Text>
                  </View>
                </View>
                <StarRow rating={item.rating} />
              </View>

              <Text style={styles.feedbackBody}>{item.text}</Text>

              <View style={styles.feedbackActions}>
                <Pressable style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}>
                  <StitchIcon color={stitchColors.slate500} name="thumb_up" size={20} />
                  <Text style={styles.actionText}>{item.likes}</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}>
                  <StitchIcon color={stitchColors.slate500} name="chat_bubble" size={20} />
                  <Text style={styles.actionText}>Reply</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.loadMoreButton, pressed ? styles.pressed : null]}>
          <Text style={styles.loadMoreText}>Load more reviews</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={({ pressed }) => [styles.primaryBottomButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.white} name="rate_review" size={20} />
          <Text style={styles.primaryBottomButtonText}>Add Review</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.secondaryBottomButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.primary} name="share" size={22} />
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55,19,236,0.10)',
    backgroundColor: 'rgba(246,246,248,0.80)',
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
    flex: 1,
    textAlign: 'center',
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 112,
  },
  summaryCard: {
    backgroundColor: stitchColors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.05)',
    gap: 24,
    ...stitchShadow.card,
  },
  summaryColumn: {
    alignItems: 'center',
    gap: 4,
  },
  summaryScore: {
    color: stitchColors.primary,
    fontSize: 64,
    fontWeight: '900',
  },
  summaryStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  summaryCaption: {
    marginTop: 4,
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '500',
  },
  distributionColumn: {
    gap: 10,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distributionLabel: {
    width: 12,
    color: stitchColors.slate500,
    fontSize: 12,
    fontWeight: '700',
  },
  distributionTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: stitchColors.primary,
  },
  distributionPercent: {
    width: 32,
    color: stitchColors.slate500,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  feedbackHeader: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackTitle: {
    color: stitchColors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortLabel: {
    color: stitchColors.slate500,
    fontSize: 14,
    fontWeight: '500',
  },
  feedbackColumn: {
    gap: 20,
  },
  feedbackCard: {
    backgroundColor: stitchColors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.05)',
    ...stitchShadow.card,
  },
  feedbackCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  feedbackIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  feedbackAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(55,19,236,0.20)',
  },
  feedbackName: {
    color: stitchColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackMeta: {
    marginTop: 4,
    color: stitchColors.slate500,
    fontSize: 12,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  feedbackBody: {
    marginTop: 16,
    color: stitchColors.slate700,
    fontSize: 16,
    lineHeight: 24,
  },
  feedbackActions: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(55,19,236,0.05)',
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: stitchColors.slate500,
    fontSize: 14,
  },
  loadMoreButton: {
    marginTop: 24,
    marginBottom: 12,
    alignSelf: 'center',
  },
  loadMoreText: {
    color: stitchColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(55,19,236,0.10)',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBottomButton: {
    flex: 1,
    maxWidth: 420,
    minHeight: 56,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...stitchShadow.primary,
  },
  primaryBottomButtonText: {
    color: stitchColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBottomButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(55,19,236,0.20)',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  pressed: {
    opacity: 0.85,
  },
});
