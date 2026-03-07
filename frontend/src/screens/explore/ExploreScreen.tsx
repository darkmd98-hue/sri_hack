import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { colors, radius, spacing } from '../../ui/theme';

function displayValue(value: unknown, fallback = '-'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value);
  return normalized.length > 0 ? normalized : fallback;
}

function displayInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

export function ExploreScreen() {
  const { skillsApi, swapApi, safetyApi, chatApi } = useAppServices();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [reportReason, setReportReason] = useState('Inappropriate listing');
  const [reportDetails, setReportDetails] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const search = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const rows = await skillsApi.searchTeach({ query: query.trim() });
      setResults(rows);
    } catch (searchError) {
      setError(String(searchError));
    } finally {
      setLoading(false);
    }
  };

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
      setResults(prev => prev.filter(row => displayInt(row.user_id) !== selectedUser.id));
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
      <View style={styles.searchCard}>
        <Text style={styles.title}>Discover Teach Listings</Text>
        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            editable={!loading}
            onChangeText={setQuery}
            placeholder="Search skill or person"
            style={styles.input}
            value={query}
          />
          <Pressable
            disabled={loading}
            onPress={() => {
              search().catch(() => {
                // Screen state handles search errors.
              });
            }}
            style={({ pressed }) => [
              styles.button,
              loading ? styles.buttonDisabled : null,
              pressed ? styles.buttonPressed : null,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Search</Text>
            )}
          </Pressable>
        </View>
      </View>

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}
      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={results}
        keyExtractor={(item, index) => String(item.id ?? `search-${index}`)}
        ListEmptyComponent={
          loading ? null : <Text style={styles.emptyText}>No search results yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <View style={styles.skillChip}>
              <Text style={styles.skillChipText}>{displayValue(item.skill_name, 'Skill')}</Text>
            </View>
            <Text style={styles.resultTitle}>{displayValue(item.user_name, 'User')}</Text>
            <Text style={styles.resultSubtitle}>
              {displayValue(item.level)} | {displayValue(item.mode)} | Rating{' '}
              {displayValue(item.avg_rating, '0')}
            </Text>
            <View style={styles.resultActions}>
              <Pressable
                onPress={() => {
                  const userId = displayInt(item.user_id);
                  if (userId === null) {
                    setStatus('Unable to identify selected user.');
                    return;
                  }
                  setSelectedUser({
                    id: userId,
                    name: displayValue(item.user_name, 'User'),
                  });
                }}
                style={({ pressed }) => [styles.actionButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.actionButtonText}>Actions</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

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
              placeholder="Let's exchange skills..."
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
    padding: spacing.md,
    gap: spacing.sm,
  },
  searchCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fffefb',
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  statusText: {
    color: colors.primary,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  resultTitle: {
    marginTop: spacing.xs,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  resultSubtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted,
  },
  resultActions: {
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
