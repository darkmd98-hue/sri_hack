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
import { MatchUser } from '../../models/matchUser';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

function MatchCard({
  user,
  onOpenActions,
}: {
  user: MatchUser;
  onOpenActions: (user: MatchUser) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.length > 0 ? user.name[0].toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{user.name}</Text>
          {user.verificationStatus === 'verified' ? (
            <Text style={styles.verified}>VERIFIED</Text>
          ) : (
            <Text style={styles.unverified}>OPEN</Text>
          )}
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.meta}>
          Match {user.matchScore}% | Rating {user.avgRating.toFixed(1)}
        </Text>
        <Text style={styles.skills}>
          {user.skills.length > 0 ? user.skills.join(', ') : 'No matching skills'}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => onOpenActions(user)}
          style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.actionButtonText}>Actions</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const { matchStore, swapApi, safetyApi, chatApi } = useAppServices();
  const loading = useStoreSelector(matchStore, store => store.isLoading);
  const error = useStoreSelector(matchStore, store => store.error);
  const recommended = useStoreSelector(matchStore, store => store.recommended);
  const [selectedUser, setSelectedUser] = useState<MatchUser | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [reportReason, setReportReason] = useState('Inappropriate behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    matchStore.loadRecommended().catch(() => {
      // Store exposes load errors through state.
    });
  }, [matchStore]);

  if (loading && recommended.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error !== null && recommended.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (recommended.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No recommendations yet.</Text>
      </View>
    );
  }

  const closeModal = (): void => {
    setSelectedUser(null);
    setRequestMessage('');
    setReportDetails('');
  };

  const sendSwapRequest = async (): Promise<void> => {
    if (selectedUser === null) {
      return;
    }
    setActionLoading(true);
    setStatus(null);
    try {
      await swapApi.requestSwap({
        toUserId: selectedUser.id,
        message: requestMessage.trim(),
      });
      setStatus(`Swap request sent to ${selectedUser.name}.`);
      closeModal();
    } catch (requestError) {
      setStatus(String(requestError));
    } finally {
      setActionLoading(false);
    }
  };

  const reportUser = async (): Promise<void> => {
    if (selectedUser === null) {
      return;
    }
    const normalizedReason = reportReason.trim();
    if (normalizedReason.length === 0) {
      setStatus('Report reason is required.');
      return;
    }

    setActionLoading(true);
    setStatus(null);
    try {
      await safetyApi.reportUser({
        reportedId: selectedUser.id,
        reason: normalizedReason,
        details: reportDetails.trim(),
      });
      setStatus(`Report submitted for ${selectedUser.name}.`);
      closeModal();
    } catch (reportError) {
      setStatus(String(reportError));
    } finally {
      setActionLoading(false);
    }
  };

  const blockUser = async (): Promise<void> => {
    if (selectedUser === null) {
      return;
    }
    setActionLoading(true);
    setStatus(null);
    try {
      await safetyApi.blockUser(selectedUser.id);
      setStatus(`${selectedUser.name} has been blocked.`);
      closeModal();
      await matchStore.loadRecommended();
    } catch (blockError) {
      setStatus(String(blockError));
    } finally {
      setActionLoading(false);
    }
  };

  const startChat = async (): Promise<void> => {
    if (selectedUser === null) {
      return;
    }
    setActionLoading(true);
    setStatus(null);
    try {
      await chatApi.startConversation(selectedUser.id);
      setStatus(`Conversation ready with ${selectedUser.name}. Open Chats tab.`);
      closeModal();
    } catch (chatError) {
      setStatus(String(chatError));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={recommended}
        keyExtractor={item => String(item.id)}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              matchStore.loadRecommended().catch(() => {
                // Store exposes refresh errors through state.
              });
            }}
            refreshing={loading}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => <MatchCard onOpenActions={setSelectedUser} user={item} />}
        ListHeaderComponent={
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Today's Recommended Partners</Text>
            <Text style={styles.bannerText}>
              People with complementary skills and active learning intent.
            </Text>
          </View>
        }
      />

      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}

      <Modal
        animationType="fade"
        onRequestClose={closeModal}
        transparent
        visible={selectedUser !== null}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedUser !== null ? selectedUser.name : 'Actions'}
            </Text>

            <Text style={styles.modalLabel}>Swap request message</Text>
            <TextInput
              editable={!actionLoading}
              onChangeText={setRequestMessage}
              placeholder="I'd like to exchange skills with you..."
              style={styles.modalInput}
              value={requestMessage}
            />

            <Text style={styles.modalLabel}>Report reason</Text>
            <TextInput
              editable={!actionLoading}
              onChangeText={setReportReason}
              placeholder="Reason"
              style={styles.modalInput}
              value={reportReason}
            />
            <TextInput
              editable={!actionLoading}
              multiline
              onChangeText={setReportDetails}
              placeholder="Details (optional)"
              style={[styles.modalInput, styles.modalInputMultiline]}
              textAlignVertical="top"
              value={reportDetails}
            />

            <View style={styles.modalActions}>
              <Pressable
                disabled={actionLoading}
                onPress={() => {
                  sendSwapRequest().catch(() => {
                    // Screen state handles request errors.
                  });
                }}
                style={({ pressed }) => [
                  styles.modalPrimary,
                  actionLoading ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalPrimaryText}>Send Request</Text>
              </Pressable>

              <Pressable
                disabled={actionLoading}
                onPress={() => {
                  startChat().catch(() => {
                    // Screen state handles chat errors.
                  });
                }}
                style={({ pressed }) => [
                  styles.modalSecondary,
                  actionLoading ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalSecondaryText}>Start Chat</Text>
              </Pressable>

              <Pressable
                disabled={actionLoading}
                onPress={() => {
                  reportUser().catch(() => {
                    // Screen state handles report errors.
                  });
                }}
                style={({ pressed }) => [
                  styles.modalSecondary,
                  actionLoading ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalSecondaryText}>Report</Text>
              </Pressable>

              <Pressable
                disabled={actionLoading}
                onPress={() => {
                  blockUser().catch(() => {
                    // Screen state handles block errors.
                  });
                }}
                style={({ pressed }) => [
                  styles.modalDanger,
                  actionLoading ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalDangerText}>Block</Text>
              </Pressable>

              <Pressable
                disabled={actionLoading}
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.modalClose,
                  actionLoading ? styles.disabled : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <Text style={styles.modalCloseText}>Close</Text>
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
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  banner: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  bannerText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
  },
  cardActions: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  verified: {
    color: '#1d7a40',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  unverified: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  skills: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 13,
  },
  statusText: {
    color: colors.primary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: 13,
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
    maxWidth: 440,
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  modalLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 11,
    paddingVertical: 9,
    color: colors.text,
    backgroundColor: '#fffefb',
    fontSize: 14,
  },
  modalInputMultiline: {
    minHeight: 68,
  },
  modalActions: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  modalPrimary: {
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modalSecondary: {
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryText: {
    color: colors.text,
    fontWeight: '700',
  },
  modalDanger: {
    minHeight: 42,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDangerText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modalClose: {
    minHeight: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
  },
  modalCloseText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.84,
  },
});
