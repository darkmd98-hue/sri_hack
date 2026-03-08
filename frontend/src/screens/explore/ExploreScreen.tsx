import { useEffect, useState } from 'react';
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
import { asInt } from '../../models/parse';
import { colors, radius, spacing } from '../../ui/theme';

const LEVEL_FILTERS = ['', 'beginner', 'intermediate', 'advanced'] as const;
const MODE_FILTERS = ['', 'online', 'offline', 'both'] as const;

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
  const [skills, setSkills] = useState<Record<string, unknown>[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<(typeof LEVEL_FILTERS)[number]>('');
  const [selectedMode, setSelectedMode] = useState<(typeof MODE_FILTERS)[number]>('');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [reportReason, setReportReason] = useState('Inappropriate listing');
  const [reportDetails, setReportDetails] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    skillsApi.listSkills().then(setSkills).catch(() => {
      // Search works with query even if preloaded skill list fails.
    });
  }, [skillsApi]);

  const search = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const rows = await skillsApi.searchTeach({
        query: query.trim(),
        skillId: selectedSkillId === null ? undefined : selectedSkillId,
        level: selectedLevel.length === 0 ? undefined : selectedLevel,
        mode: selectedMode.length === 0 ? undefined : selectedMode,
      });
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
        <Text style={styles.title}>Discover by Skill</Text>
        <View style={styles.searchRow}>
          <Pressable
            accessibilityLabel="Toggle filters"
            accessibilityRole="button"
            onPress={() => setShowFilters(prev => !prev)}
            style={({ pressed }) => [
              styles.filterToggle,
              showFilters ? styles.filterToggleActive : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={styles.filterIcon}>
              <View style={styles.filterIconRow}>
                <View
                  style={[
                    styles.filterIconLine,
                    showFilters ? styles.filterIconLineActive : null,
                  ]}
                />
                <View
                  style={[
                    styles.filterIconDot,
                    styles.filterIconDotTop,
                    showFilters ? styles.filterIconDotActive : null,
                  ]}
                />
              </View>
              <View style={styles.filterIconRow}>
                <View
                  style={[
                    styles.filterIconLine,
                    showFilters ? styles.filterIconLineActive : null,
                  ]}
                />
                <View
                  style={[
                    styles.filterIconDot,
                    styles.filterIconDotMiddle,
                    showFilters ? styles.filterIconDotActive : null,
                  ]}
                />
              </View>
              <View style={styles.filterIconRow}>
                <View
                  style={[
                    styles.filterIconLine,
                    showFilters ? styles.filterIconLineActive : null,
                  ]}
                />
                <View
                  style={[
                    styles.filterIconDot,
                    styles.filterIconDotBottom,
                    showFilters ? styles.filterIconDotActive : null,
                  ]}
                />
              </View>
            </View>
          </Pressable>
          <TextInput
            autoCapitalize="none"
            editable={!loading}
            onChangeText={setQuery}
            placeholder="Search skill name"
            style={styles.input}
            value={query}
          />
          <Pressable
            accessibilityLabel="Search skills"
            accessibilityRole="button"
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
              <View style={styles.searchIcon}>
                <View style={styles.searchIconRing} />
                <View style={styles.searchIconHandle} />
                <View style={styles.searchIconDot} />
              </View>
            )}
          </Pressable>
        </View>
        {showFilters ? (
          <View style={styles.filtersPanel}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Skill Filter</Text>
              <View style={styles.filterRow}>
                {skills.slice(0, 10).map(skill => {
                  const skillId = asInt(skill.id);
                  const selected = selectedSkillId === skillId;
                  return (
                    <Pressable
                      key={skillId}
                      onPress={() => setSelectedSkillId(selected ? null : skillId)}
                      style={[
                        styles.filterChip,
                        selected ? styles.filterChipActive : null,
                      ]}
                    >
                      <Text style={selected ? styles.filterChipActiveText : styles.filterChipText}>
                        {displayValue(skill.name, `Skill ${skillId}`)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Level</Text>
              <View style={styles.filterRow}>
                {LEVEL_FILTERS.map(level => {
                  const selected = selectedLevel === level;
                  return (
                    <Pressable
                      key={`level-${level || 'any'}`}
                      onPress={() => setSelectedLevel(level)}
                      style={[
                        styles.filterChip,
                        selected ? styles.filterChipActive : null,
                      ]}
                    >
                      <Text style={selected ? styles.filterChipActiveText : styles.filterChipText}>
                        {level.length === 0 ? 'Any' : level}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Mode</Text>
              <View style={styles.filterRow}>
                {MODE_FILTERS.map(mode => {
                  const selected = selectedMode === mode;
                  return (
                    <Pressable
                      key={`mode-${mode || 'any'}`}
                      onPress={() => setSelectedMode(mode)}
                      style={[
                        styles.filterChip,
                        selected ? styles.filterChipActive : null,
                      ]}
                    >
                      <Text style={selected ? styles.filterChipActiveText : styles.filterChipText}>
                        {mode.length === 0 ? 'Any' : mode}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Pressable
              onPress={() => {
                setSelectedSkillId(null);
                setSelectedLevel('');
                setSelectedMode('');
                setQuery('');
              }}
              style={({ pressed }) => [
                styles.clearButton,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}
      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={results}
        keyExtractor={(item, index) => String(item.id ?? `search-${index}`)}
        ListEmptyComponent={
          loading ? null : <Text style={styles.emptyText}>No skill matches found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <View style={styles.skillChip}>
              <Text style={styles.skillChipText}>{displayValue(item.skill_name, 'Skill')}</Text>
            </View>
            <Text style={styles.resultTitle}>{displayValue(item.user_name, 'User')}</Text>
            <Text style={styles.resultSubtitle}>
              Level {displayValue(item.level)} | {displayValue(item.mode)} | Rating{' '}
              {displayValue(item.avg_rating, '0')} | Dept {displayValue(item.dept, '-')}
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
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterToggle: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panelMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  filterIcon: {
    width: 17,
    gap: 3,
  },
  filterIconRow: {
    width: 17,
    height: 4,
    justifyContent: 'center',
  },
  filterIconLine: {
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
  },
  filterIconLineActive: {
    backgroundColor: colors.primary,
  },
  filterIconDot: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.text,
  },
  filterIconDotActive: {
    backgroundColor: colors.primary,
  },
  filterIconDotTop: {
    left: 1,
  },
  filterIconDotMiddle: {
    left: 7,
  },
  filterIconDotBottom: {
    left: 12,
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
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  searchIconRing: {
    width: 11,
    height: 11,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  searchIconHandle: {
    position: 'absolute',
    width: 7,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff',
    right: 0,
    bottom: 0,
    transform: [{ rotate: '45deg' }],
  },
  searchIconDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: '#ffffff',
    left: 4,
    top: 4,
  },
  filtersPanel: {
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  filterSection: {
    marginTop: 2,
    gap: spacing.xs,
  },
  filterLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fffefb',
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipActiveText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.panelMuted,
  },
  clearButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
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
