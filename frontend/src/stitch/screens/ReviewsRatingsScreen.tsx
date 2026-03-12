import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppServices } from '../../context/AppContext';
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

const starSlots = ['one', 'two', 'three', 'four', 'five'] as const;

type FeedbackItem = {
  avatar: string;
  id: number;
  liked?: boolean;
  likes: number;
  name: string;
  rating: number;
  roleTime: string;
  text: string;
};

type ReplyItem = {
  id: string;
  text: string;
};

const feedback: FeedbackItem[] = [
  {
    avatar: stitchImages.reviewAlexJohnson,
    id: 1,
    likes: 24,
    name: 'Alex Johnson',
    rating: 5,
    roleTime: 'Python Expert \u2022 2 days ago',
    text:
      'The session was incredible! Alex helped me debug a complex React-Python integration issue that had me stuck for weeks. Very patient and articulate teacher.',
  },
  {
    avatar: stitchImages.reviewMariaGarcia,
    id: 2,
    likes: 15,
    name: 'Maria Garcia',
    rating: 4,
    roleTime: 'UI/UX Designer \u2022 1 week ago',
    text:
      'Very detailed feedback on my portfolio. Maria has a great eye for typography and spacing. The session was slightly fast-paced, but I learned a lot.',
  },
  {
    avatar: stitchImages.reviewSamChen,
    id: 3,
    likes: 31,
    name: 'Sam Chen',
    rating: 5,
    roleTime: 'Full Stack Dev \u2022 2 weeks ago',
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
      {starSlots.map((slot, index) => (
        <StitchIcon
          key={slot}
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
  swapRequestId,
}: {
  onBack: () => void;
  swapRequestId: number | null;
}) {
  const { reviewApi } = useAppServices();
  const [feedbackRows, setFeedbackRows] = useState(feedback);
  const [replyDraft, setReplyDraft] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
  const [repliesByReviewId, setRepliesByReviewId] = useState<Record<number, ReplyItem[]>>({});
  const [reviewCommentDraft, setReviewCommentDraft] = useState('');
  const [reviewComposerVisible, setReviewComposerVisible] = useState(false);
  const [reviewRatingDraft, setReviewRatingDraft] = useState('5');
  const [submittingReview, setSubmittingReview] = useState(false);

  const toggleLike = (feedbackId: number): void => {
    setFeedbackRows(current =>
      current.map(item =>
        item.id === feedbackId
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? Math.max(0, item.likes - 1) : item.likes + 1,
            }
          : item,
      ),
    );
  };

  const shareReviews = async (): Promise<void> => {
    await Share.share({
      message: 'SkillSwap reviews: 4.8 rating across 128 reviews.',
      title: 'SkillSwap Reviews',
    });
  };

  const closeReplyComposer = (): void => {
    setReplyTargetId(null);
    setReplyDraft('');
  };

  const resetReviewComposer = (): void => {
    setReviewComposerVisible(false);
    setReviewCommentDraft('');
    setReviewRatingDraft('5');
  };

  const closeReviewComposer = (): void => {
    if (submittingReview) {
      return;
    }
    resetReviewComposer();
  };

  const openReviewComposer = (): void => {
    if (swapRequestId === null) {
      Alert.alert('Review unavailable', 'A completed swap request is required before adding a review.');
      return;
    }
    setReviewComposerVisible(true);
  };

  const submitReview = async (): Promise<void> => {
    if (swapRequestId === null) {
      Alert.alert('Review unavailable', 'A completed swap request is required before adding a review.');
      return;
    }

    const parsedRating = Number.parseInt(reviewRatingDraft, 10);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      Alert.alert('Invalid rating', 'Enter a rating between 1 and 5.');
      return;
    }

    setSubmittingReview(true);
    try {
      const comment = reviewCommentDraft.trim();
      await reviewApi.addReview({
        comment: comment.length > 0 ? comment : undefined,
        rating: parsedRating,
        swapRequestId,
      });
      setFeedbackRows(current => [
        {
          avatar: stitchImages.homeAvatar,
          id: Date.now(),
          likes: 0,
          name: 'You',
          rating: parsedRating,
          roleTime: 'New review \u2022 Just now',
          text: comment.length > 0 ? comment : 'Thanks for the swap.',
        },
        ...current,
      ]);
      resetReviewComposer();
      Alert.alert('Review added', 'Your review has been submitted.');
    } catch (error) {
      Alert.alert('Review failed', String(error));
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitReply = (): void => {
    const trimmed = replyDraft.trim();
    if (replyTargetId === null || trimmed.length === 0) {
      return;
    }

    setRepliesByReviewId(previous => ({
      ...previous,
      [replyTargetId]: [
        ...(previous[replyTargetId] ?? []),
        {
          id: `${replyTargetId}-${Date.now()}`,
          text: trimmed,
        },
      ],
    }));
    closeReplyComposer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.text} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>SkillSwap Reviews</Text>
        <Pressable
          onPress={() => {
            shareReviews().catch(() => {
              // Native share errors do not need inline UI state here.
            });
          }}
          style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}
        >
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
          {feedbackRows.map(item => (
            <View key={item.id} style={styles.feedbackCard}>
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
                <Pressable
                  onPress={() => toggleLike(item.id)}
                  style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}
                >
                  <StitchIcon color={stitchColors.slate500} name="thumb_up" size={20} />
                  <Text style={styles.actionText}>{String(item.likes)}</Text>
                </Pressable>
                <Pressable
                  onPress={() => setReplyTargetId(item.id)}
                  style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}
                >
                  <StitchIcon color={stitchColors.slate500} name="chat_bubble" size={20} />
                  <Text style={styles.actionText}>Reply</Text>
                </Pressable>
              </View>

              {(repliesByReviewId[item.id] ?? []).map(reply => (
                <View key={reply.id} style={styles.replyCard}>
                  <Text style={styles.replyLabel}>Your reply</Text>
                  <Text style={styles.replyText}>{reply.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.loadMoreButton, pressed ? styles.pressed : null]}>
          <Text style={styles.loadMoreText}>Load more reviews</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={openReviewComposer}
          style={({ pressed }) => [styles.primaryBottomButton, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.white} name="rate_review" size={20} />
          <Text style={styles.primaryBottomButtonText}>Add Review</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            shareReviews().catch(() => {
              // Native share errors do not need inline UI state here.
            });
          }}
          style={({ pressed }) => [styles.secondaryBottomButton, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.primary} name="share" size={22} />
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={closeReplyComposer}
        transparent
        visible={replyTargetId !== null}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reply to Review</Text>
            <Text style={styles.modalSubtitle}>Add a short response to this feedback.</Text>
            <TextInput
              multiline
              onChangeText={setReplyDraft}
              placeholder="Write your reply"
              placeholderTextColor={stitchColors.slate400}
              style={styles.modalInput}
              textAlignVertical="top"
              value={replyDraft}
            />
            <View style={styles.modalActions}>
              <Pressable
                disabled={replyDraft.trim().length === 0}
                onPress={submitReply}
                style={({ pressed }) => [
                  styles.modalPrimaryButton,
                  replyDraft.trim().length === 0 ? styles.disabledButton : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalPrimaryButtonText}>Send Reply</Text>
              </Pressable>
              <Pressable
                onPress={closeReplyComposer}
                style={({ pressed }) => [styles.modalSecondaryButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={closeReviewComposer}
        transparent
        visible={reviewComposerVisible}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Review</Text>
            <Text style={styles.modalSubtitle}>Share a quick rating and a short note about the swap.</Text>
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalLabel}>Rating (1-5)</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={setReviewRatingDraft}
                placeholder="5"
                placeholderTextColor={stitchColors.slate400}
                style={styles.ratingInput}
                value={reviewRatingDraft}
              />
            </View>
            <View style={styles.modalFieldGroup}>
              <Text style={styles.modalLabel}>Review</Text>
              <TextInput
                multiline
                onChangeText={setReviewCommentDraft}
                placeholder="Write a short review"
                placeholderTextColor={stitchColors.slate400}
                style={styles.modalInput}
                textAlignVertical="top"
                value={reviewCommentDraft}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable
                disabled={submittingReview}
                onPress={() => {
                  submitReview().catch(() => {
                    // Alert handling already covers failures.
                  });
                }}
                style={({ pressed }) => [
                  styles.modalPrimaryButton,
                  submittingReview ? styles.disabledButton : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Text>
              </Pressable>
              <Pressable
                disabled={submittingReview}
                onPress={closeReviewComposer}
                style={({ pressed }) => [
                  styles.modalSecondaryButton,
                  submittingReview ? styles.disabledButton : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: stitchColors.slate200,
    backgroundColor: stitchColors.background,
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
    borderColor: stitchColors.slate100,
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
    borderColor: stitchColors.slate100,
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
    resizeMode: 'cover',
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
    borderTopColor: stitchColors.slate100,
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
  replyCard: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate100,
  },
  replyLabel: {
    color: stitchColors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  replyText: {
    marginTop: 6,
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 21,
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
    backgroundColor: stitchColors.white,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.white,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: stitchColors.slate500,
    fontSize: 14,
    lineHeight: 21,
  },
  modalFieldGroup: {
    gap: 8,
  },
  modalLabel: {
    color: stitchColors.slate700,
    fontSize: 13,
    fontWeight: '600',
  },
  ratingInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.slate50,
    paddingHorizontal: 14,
    color: stitchColors.text,
    fontSize: 15,
  },
  modalInput: {
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    backgroundColor: stitchColors.slate50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: stitchColors.text,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalPrimaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalSecondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryButtonText: {
    color: stitchColors.slate600,
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
});
