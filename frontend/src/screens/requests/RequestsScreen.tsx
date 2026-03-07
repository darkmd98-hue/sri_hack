import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { SwapRequest } from '../../models/swapRequest';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

type Tab = 'inbox' | 'sent';

function RequestCard({
  item,
  isInbox,
  processingId,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  onOpenReview,
}: {
  item: SwapRequest;
  isInbox: boolean;
  processingId: number | null;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
  onOpenReview: (item: SwapRequest) => void;
}) {
  const pendingInbox = isInbox && item.status === 'pending';
  const pendingSent = !isInbox && item.status === 'pending';
  const accepted = item.status === 'accepted';
  const completed = item.status === 'completed';
  const busy = processingId === item.id;

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.name}>{item.otherUserName ?? 'Unknown'}</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {item.message !== undefined && item.message.length > 0
          ? item.message
          : 'No message added to this request.'}
      </Text>
      {item.teachSkillName !== undefined || item.learnSkillName !== undefined ? (
        <Text style={styles.meta}>
          Teach: {item.teachSkillName ?? '-'} | Learn: {item.learnSkillName ?? '-'}
        </Text>
      ) : null}
      {item.proposedTime !== undefined ? (
        <Text style={styles.meta}>Proposed: {item.proposedTime}</Text>
      ) : null}
      {pendingInbox ? (
        <View style={styles.actions}>
          <Pressable
            disabled={busy}
            onPress={() => onAccept(item.id)}
            style={({ pressed }) => [
              styles.acceptButton,
              busy ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.acceptText}>{busy ? 'Working...' : 'Accept'}</Text>
          </Pressable>
          <Pressable
            disabled={busy}
            onPress={() => onReject(item.id)}
            style={({ pressed }) => [
              styles.rejectButton,
              busy ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
        </View>
      ) : null}
      {pendingSent ? (
        <View style={styles.actions}>
          <Pressable
            disabled={busy}
            onPress={() => onCancel(item.id)}
            style={({ pressed }) => [
              styles.secondaryButton,
              busy ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.secondaryText}>{busy ? 'Working...' : 'Cancel Request'}</Text>
          </Pressable>
        </View>
      ) : null}
      {accepted ? (
        <View style={styles.actions}>
          <Pressable
            disabled={busy}
            onPress={() => onComplete(item.id)}
            style={({ pressed }) => [
              styles.acceptButton,
              busy ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.acceptText}>{busy ? 'Working...' : 'Mark Complete'}</Text>
          </Pressable>
        </View>
      ) : null}
      {completed ? (
        <View style={styles.actions}>
          <Pressable
            disabled={busy}
            onPress={() => onOpenReview(item)}
            style={({ pressed }) => [
              styles.secondaryButton,
              busy ? styles.disabled : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.secondaryText}>Add Review</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export function RequestsScreen() {
  const { requestStore, reviewApi } = useAppServices();
  const loading = useStoreSelector(requestStore, store => store.isLoading);
  const error = useStoreSelector(requestStore, store => store.error);
  const inbox = useStoreSelector(requestStore, store => store.inbox);
  const sent = useStoreSelector(requestStore, store => store.sent);
  const [tab, setTab] = useState<Tab>('inbox');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);

  useEffect(() => {
    requestStore.refresh().catch(() => {
      // Store exposes refresh errors through state.
    });
  }, [requestStore]);

  const items = tab === 'inbox' ? inbox : sent;

  const runAction = async (requestId: number, action: () => Promise<void>): Promise<void> => {
    setProcessingId(requestId);
    setStatus(null);
    try {
      await action();
    } catch (actionError) {
      setStatus(String(actionError));
    } finally {
      setProcessingId(null);
    }
  };

  const submitReview = async (): Promise<void> => {
    if (reviewTarget === null) {
      return;
    }
    const parsedRating = Number.parseInt(rating.trim(), 10);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      setStatus('Rating must be between 1 and 5.');
      return;
    }

    setReviewSaving(true);
    setStatus(null);
    try {
      await reviewApi.addReview({
        swapRequestId: reviewTarget.id,
        rating: parsedRating,
        comment: comment.trim(),
      });
      setStatus('Review submitted.');
      setReviewTarget(null);
      setComment('');
      setRating('5');
    } catch (reviewError) {
      setStatus(String(reviewError));
    } finally {
      setReviewSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swap Requests</Text>
      <Text style={styles.description}>Manage incoming and sent exchange requests.</Text>
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setTab('inbox')}
          style={[styles.tabButton, tab === 'inbox' ? styles.activeTab : null]}
        >
          <Text style={[styles.tabText, tab === 'inbox' ? styles.activeTabText : null]}>
            Inbox
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('sent')}
          style={[styles.tabButton, tab === 'sent' ? styles.activeTab : null]}
        >
          <Text style={[styles.tabText, tab === 'sent' ? styles.activeTabText : null]}>
            Sent
          </Text>
        </Pressable>
      </View>
      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={item => String(item.id)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {tab === 'inbox' ? 'No incoming requests' : 'No sent requests'}
            </Text>
          }
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                requestStore.refresh().catch(() => {
                  // Store exposes refresh errors through state.
                });
              }}
              refreshing={loading}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <RequestCard
              isInbox={tab === 'inbox'}
              item={item}
              processingId={processingId}
              onAccept={id => {
                runAction(id, async () => {
                  await requestStore.respond(id, 'accept');
                }).catch(() => {
                  // Screen state handles action errors.
                });
              }}
              onReject={id => {
                runAction(id, async () => {
                  await requestStore.respond(id, 'reject');
                }).catch(() => {
                  // Screen state handles action errors.
                });
              }}
              onCancel={id => {
                runAction(id, async () => {
                  await requestStore.respond(id, 'cancel');
                }).catch(() => {
                  // Screen state handles action errors.
                });
              }}
              onComplete={id => {
                runAction(id, async () => {
                  await requestStore.complete(id);
                }).catch(() => {
                  // Screen state handles action errors.
                });
              }}
              onOpenReview={target => {
                setReviewTarget(target);
                setComment('');
                setRating('5');
              }}
            />
          )}
        />
      )}

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        animationType="fade"
        onRequestClose={() => {
          if (!reviewSaving) {
            setReviewTarget(null);
          }
        }}
        transparent
        visible={reviewTarget !== null}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Review</Text>
            <Text style={styles.modalSubtitle}>
              {reviewTarget !== null ? `For ${reviewTarget.otherUserName ?? 'swap partner'}` : ''}
            </Text>
            <TextInput
              editable={!reviewSaving}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={setRating}
              placeholder="Rating (1-5)"
              style={styles.input}
              value={rating}
            />
            <TextInput
              editable={!reviewSaving}
              multiline
              onChangeText={setComment}
              placeholder="Comment (optional)"
              style={[styles.input, styles.commentInput]}
              textAlignVertical="top"
              value={comment}
            />
            <View style={styles.modalActions}>
              <Pressable
                disabled={reviewSaving}
                onPress={() => {
                  submitReview().catch(() => {
                    // Screen state handles review errors.
                  });
                }}
                style={({ pressed }) => [
                  styles.acceptButton,
                  reviewSaving ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.acceptText}>{reviewSaving ? 'Saving...' : 'Submit Review'}</Text>
              </Pressable>
              <Pressable
                disabled={reviewSaving}
                onPress={() => {
                  setReviewTarget(null);
                }}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  reviewSaving ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.secondaryText}>Close</Text>
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
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.md,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    paddingHorizontal: spacing.md,
  },
  statusText: {
    color: colors.primary,
    fontSize: 13,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    backgroundColor: colors.panel,
  },
  activeTab: {
    backgroundColor: colors.primarySoft,
  },
  tabText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  statusPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 13,
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rejectButton: {
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rejectText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.panelMuted,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.84,
  },
  disabled: {
    opacity: 0.68,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    paddingHorizontal: spacing.md,
    paddingBottom: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    padding: spacing.md,
    gap: spacing.xs,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fffefb',
    color: colors.text,
    fontSize: 14,
  },
  commentInput: {
    minHeight: 90,
  },
  modalActions: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
});
