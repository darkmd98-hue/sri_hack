import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { useAppServices } from '../../context/AppContext';
import { parseAvailabilitySlot } from '../../models/availabilitySlot';
import { asArray, asInt, asRecord } from '../../models/parse';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

const TEACH_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const TEACH_MODES = ['online', 'offline', 'both'] as const;
const LEARN_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const WEEKDAY_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function dayLabel(dayOfWeek: number): string {
  const option = WEEKDAY_OPTIONS.find(item => item.value === dayOfWeek);
  return option === undefined ? `Day ${dayOfWeek}` : option.label;
}

function textValue(value: unknown, fallback = '-'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value);
  return normalized.length > 0 ? normalized : fallback;
}

export function ProfileScreen({
  onOpenVerification,
}: {
  onOpenVerification: () => void;
}) {
  const {
    authStore,
    profileApi,
    skillsApi,
    availabilityApi,
    reviewApi,
  } = useAppServices();
  const user = useStoreSelector(authStore, store => store.user);
  const authLoading = useStoreSelector(authStore, store => store.isLoading);

  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [skillsCatalog, setSkillsCatalog] = useState<Record<string, unknown>[]>([]);
  const [teachRows, setTeachRows] = useState<Record<string, unknown>[]>([]);
  const [learnRows, setLearnRows] = useState<Record<string, unknown>[]>([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [selectedTeachSkillId, setSelectedTeachSkillId] = useState<number | null>(null);
  const [selectedLearnSkillId, setSelectedLearnSkillId] = useState<number | null>(null);
  const [teachLevel, setTeachLevel] = useState<(typeof TEACH_LEVELS)[number]>('beginner');
  const [teachMode, setTeachMode] = useState<(typeof TEACH_MODES)[number]>('online');
  const [teachDescription, setTeachDescription] = useState('');
  const [learnLevel, setLearnLevel] = useState<(typeof LEARN_LEVELS)[number]>('beginner');
  const [learnNotes, setLearnNotes] = useState('');

  const [slotDay, setSlotDay] = useState('1');
  const [slotStart, setSlotStart] = useState('09:00');
  const [slotEnd, setSlotEnd] = useState('10:00');
  const [availabilitySlots, setAvailabilitySlots] = useState<
    Array<{ id: number; dayOfWeek: number; startTime: string; endTime: string }>
  >([]);

  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewRows, setReviewRows] = useState<Record<string, unknown>[]>([]);
  const [pendingDocs, setPendingDocs] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (user === null) {
      return;
    }
    setName(user.name);
    setDept(user.dept ?? '');
    setYear(user.year !== undefined ? String(user.year) : '');
    setBio(user.bio ?? '');
  }, [user]);

  const filteredSkills = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    const rows = query.length === 0
      ? skillsCatalog
      : skillsCatalog.filter(row =>
          textValue(row.name, '').toLowerCase().includes(query),
        );
    return rows.slice(0, 20);
  }, [skillQuery, skillsCatalog]);

  const refreshSkills = useCallback(async (): Promise<void> => {
    const [catalog, mineTeach, mineLearn] = await Promise.all([
      skillsApi.listSkills(),
      skillsApi.myTeach(),
      skillsApi.myLearn(),
    ]);
    setSkillsCatalog(catalog);
    setTeachRows(mineTeach);
    setLearnRows(mineLearn);
  }, [skillsApi]);

  const refreshAvailability = useCallback(async (): Promise<void> => {
    const slots = await availabilityApi.mySlots();
    setAvailabilitySlots(slots.map(parseAvailabilitySlot));
  }, [availabilityApi]);

  const refreshReviews = useCallback(async (): Promise<void> => {
    if (user === null) {
      setAvgRating(0);
      setTotalReviews(0);
      setReviewRows([]);
      return;
    }
    const payload = await reviewApi.userReviews(user.id);
    const summary = asRecord(payload.summary);
    const parsedAverage = Number(summary.avg_rating ?? 0);
    setAvgRating(Number.isFinite(parsedAverage) ? parsedAverage : 0);
    setTotalReviews(asInt(summary.total_reviews));
    setReviewRows(asArray(payload.reviews).map(item => asRecord(item)));
  }, [reviewApi, user]);

  const refreshAdminQueue = useCallback(async (): Promise<void> => {
    if (user?.role !== 'admin') {
      setPendingDocs([]);
      return;
    }
    const docs = await profileApi.listPendingVerificationDocs();
    setPendingDocs(docs);
  }, [profileApi, user]);

  useEffect(() => {
    if (user === null) {
      return;
    }

    setLoadingExtras(true);
    Promise.all([
      refreshSkills(),
      refreshAvailability(),
      refreshReviews(),
      refreshAdminQueue(),
    ])
      .catch(error => {
        setStatus(String(error));
      })
      .finally(() => {
        setLoadingExtras(false);
      });
  }, [refreshAdminQueue, refreshAvailability, refreshReviews, refreshSkills, user]);

  if (user === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Please login.</Text>
      </View>
    );
  }

  const runBusy = async (key: string, action: () => Promise<void>): Promise<void> => {
    setBusyKey(key);
    setStatus(null);
    try {
      await action();
    } catch (error) {
      setStatus(String(error));
    } finally {
      setBusyKey(null);
    }
  };

  const saveProfile = async (): Promise<void> => {
    setSaving(true);
    setStatus(null);
    try {
      await profileApi.updateProfile({
        name: name.trim(),
        dept: dept.trim(),
        year: year.trim().length > 0 ? Number.parseInt(year.trim(), 10) : undefined,
        bio: bio.trim(),
      });
      await authStore.bootstrap();
      setStatus('Profile updated');
    } catch (error) {
      setStatus(String(error));
    } finally {
      setSaving(false);
    }
  };

  const pickAndUploadAvatar = async (): Promise<void> => {
    const picker = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });
    if (picker.didCancel) {
      return;
    }
    const asset = picker.assets?.[0];
    const uri = asset?.uri;
    if (uri === undefined || uri.length === 0) {
      setStatus('Could not read selected image.');
      return;
    }

    const fileName = asset?.fileName ?? 'avatar.jpg';
    const fileType = asset?.type ?? 'image/jpeg';

    await runBusy('avatar', async () => {
      await profileApi.uploadAvatar({
        uri,
        name: fileName,
        type: fileType,
      });
      await authStore.bootstrap();
      setStatus('Avatar updated.');
    });
  };

  const addTeachSkill = async (): Promise<void> => {
    if (selectedTeachSkillId === null) {
      setStatus('Select a skill for teach profile.');
      return;
    }

    await runBusy('teach-add', async () => {
      await skillsApi.addTeach({
        skillId: selectedTeachSkillId,
        level: teachLevel,
        mode: teachMode,
        description: teachDescription.trim(),
      });
      setTeachDescription('');
      await refreshSkills();
      setStatus('Teach skill saved.');
    });
  };

  const addLearnSkill = async (): Promise<void> => {
    if (selectedLearnSkillId === null) {
      setStatus('Select a skill for learning profile.');
      return;
    }

    await runBusy('learn-add', async () => {
      await skillsApi.addLearn({
        skillId: selectedLearnSkillId,
        levelNeeded: learnLevel,
        notes: learnNotes.trim(),
      });
      setLearnNotes('');
      await refreshSkills();
      setStatus('Learn skill saved.');
    });
  };

  const addAvailability = async (): Promise<void> => {
    const dayOfWeek = Number.parseInt(slotDay.trim(), 10);
    if (!Number.isFinite(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      setStatus('Day must be between 0 and 6.');
      return;
    }

    await runBusy('availability-add', async () => {
      await availabilityApi.upsertSlot({
        dayOfWeek,
        startTime: slotStart.trim(),
        endTime: slotEnd.trim(),
      });
      await refreshAvailability();
      setStatus('Availability slot added.');
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <View style={styles.identityCard}>
        <View style={styles.identityRow}>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.identityTextBlock}>
            <Text style={styles.identityName}>{user.name}</Text>
            <Text style={styles.identityEmail}>{user.email}</Text>
          </View>
        </View>
        {user.avatarUrl !== undefined ? (
          <Text style={styles.metaText}>Avatar URL: {user.avatarUrl}</Text>
        ) : null}
        <Text style={styles.metaText}>Role: {user.role ?? 'user'}</Text>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>{user.verificationStatus ?? 'unverified'}</Text>
        </View>
        <Pressable
          disabled={busyKey !== null}
          onPress={() => {
            pickAndUploadAvatar().catch(() => {
              // Screen state handles avatar errors.
            });
          }}
          style={({ pressed }) => [
            styles.secondaryButton,
            busyKey !== null ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.secondaryButtonText}>
            {busyKey === 'avatar' ? 'Uploading...' : 'Upload Avatar'}
          </Text>
        </Pressable>
      </View>

      <TextInput
        editable={!saving && !authLoading}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
        value={name}
      />
      <TextInput
        editable={!saving && !authLoading}
        onChangeText={setDept}
        placeholder="Department"
        style={styles.input}
        value={dept}
      />
      <TextInput
        editable={!saving && !authLoading}
        keyboardType="number-pad"
        onChangeText={setYear}
        placeholder="Year"
        style={styles.input}
        value={year}
      />
      <TextInput
        editable={!saving && !authLoading}
        multiline
        onChangeText={setBio}
        placeholder="Bio"
        style={[styles.input, styles.bioInput]}
        textAlignVertical="top"
        value={bio}
      />

      {status !== null ? <Text style={styles.statusText}>{status}</Text> : null}
      {loadingExtras ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.infoText}>Syncing profile data...</Text>
        </View>
      ) : null}

      <Pressable
        disabled={saving || authLoading}
        onPress={() => {
          saveProfile().catch(() => {
            // Screen state handles save errors.
          });
        }}
        style={({ pressed }) => [
          styles.primaryButton,
          saving || authLoading ? styles.buttonDisabled : null,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.primaryButtonText}>Save Profile</Text>
      </Pressable>

      <Pressable
        onPress={onOpenVerification}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.secondaryButtonText}>Upload Verification Doc</Text>
      </Pressable>

      <View style={styles.sectionCard}>
        <Text style={styles.subheading}>Skills Setup</Text>
        <TextInput
          editable={busyKey === null}
          onChangeText={setSkillQuery}
          placeholder="Search skill"
          style={styles.input}
          value={skillQuery}
        />
        <View style={styles.skillGrid}>
          {filteredSkills.map(row => {
            const skillId = asInt(row.id);
            const selected = skillId === selectedTeachSkillId || skillId === selectedLearnSkillId;
            return (
              <Pressable
                key={skillId}
                onPress={() => {
                  setSelectedTeachSkillId(skillId);
                  setSelectedLearnSkillId(skillId);
                }}
                style={({ pressed }) => [
                  styles.skillChip,
                  selected ? styles.skillChipActive : null,
                  pressed ? styles.buttonPressed : null,
                ]}
              >
                <Text style={selected ? styles.skillChipActiveText : styles.skillChipText}>
                  {textValue(row.name, `Skill ${skillId}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Teach Profile</Text>
        <View style={styles.optionRow}>
          {TEACH_LEVELS.map(level => (
            <Pressable
              key={level}
              onPress={() => setTeachLevel(level)}
              style={[
                styles.optionChip,
                teachLevel === level ? styles.optionChipActive : null,
              ]}
            >
              <Text style={teachLevel === level ? styles.optionChipActiveText : styles.optionChipText}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.optionRow}>
          {TEACH_MODES.map(mode => (
            <Pressable
              key={mode}
              onPress={() => setTeachMode(mode)}
              style={[
                styles.optionChip,
                teachMode === mode ? styles.optionChipActive : null,
              ]}
            >
              <Text style={teachMode === mode ? styles.optionChipActiveText : styles.optionChipText}>
                {mode}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          editable={busyKey === null}
          onChangeText={setTeachDescription}
          placeholder="Teach description"
          style={styles.input}
          value={teachDescription}
        />
        <Pressable
          disabled={busyKey !== null}
          onPress={() => {
            addTeachSkill().catch(() => {
              // Screen state handles teach errors.
            });
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            busyKey !== null ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {busyKey === 'teach-add' ? 'Saving...' : 'Save Teach Skill'}
          </Text>
        </Pressable>

        <Text style={styles.label}>Learn Profile</Text>
        <View style={styles.optionRow}>
          {LEARN_LEVELS.map(level => (
            <Pressable
              key={level}
              onPress={() => setLearnLevel(level)}
              style={[
                styles.optionChip,
                learnLevel === level ? styles.optionChipActive : null,
              ]}
            >
              <Text style={learnLevel === level ? styles.optionChipActiveText : styles.optionChipText}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          editable={busyKey === null}
          onChangeText={setLearnNotes}
          placeholder="Learning notes"
          style={styles.input}
          value={learnNotes}
        />
        <Pressable
          disabled={busyKey !== null}
          onPress={() => {
            addLearnSkill().catch(() => {
              // Screen state handles learn errors.
            });
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            busyKey !== null ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {busyKey === 'learn-add' ? 'Saving...' : 'Save Learn Skill'}
          </Text>
        </Pressable>

        <Text style={styles.label}>Your Teach Skills</Text>
        {teachRows.length === 0 ? <Text style={styles.infoText}>No teach skills yet.</Text> : null}
        {teachRows.map(row => (
          <View key={asInt(row.id)} style={styles.listCard}>
            <Text style={styles.listTitle}>{textValue(row.skill_name)}</Text>
            <Text style={styles.listMeta}>
              {textValue(row.level)} | {textValue(row.mode)}
            </Text>
            <Pressable
              disabled={busyKey !== null}
              onPress={() => {
                runBusy(`teach-del-${asInt(row.id)}`, async () => {
                  await skillsApi.deleteTeach(asInt(row.id));
                  await refreshSkills();
                  setStatus('Teach skill removed.');
                }).catch(() => {
                  // Screen state handles delete errors.
                });
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                busyKey !== null ? styles.buttonDisabled : null,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.label}>Your Learn Skills</Text>
        {learnRows.length === 0 ? <Text style={styles.infoText}>No learn skills yet.</Text> : null}
        {learnRows.map(row => (
          <View key={asInt(row.id)} style={styles.listCard}>
            <Text style={styles.listTitle}>{textValue(row.skill_name)}</Text>
            <Text style={styles.listMeta}>{textValue(row.level_needed)}</Text>
            <Pressable
              disabled={busyKey !== null}
              onPress={() => {
                runBusy(`learn-del-${asInt(row.id)}`, async () => {
                  await skillsApi.deleteLearn(asInt(row.id));
                  await refreshSkills();
                  setStatus('Learn skill removed.');
                }).catch(() => {
                  // Screen state handles delete errors.
                });
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                busyKey !== null ? styles.buttonDisabled : null,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.subheading}>Availability</Text>
        <Text style={styles.infoText}>Day 0=Sun, 1=Mon ... 6=Sat. Time format HH:MM.</Text>
        <View style={styles.inlineInputRow}>
          <TextInput
            editable={busyKey === null}
            keyboardType="number-pad"
            onChangeText={setSlotDay}
            placeholder="Day"
            style={[styles.input, styles.inlineInput]}
            value={slotDay}
          />
          <TextInput
            editable={busyKey === null}
            onChangeText={setSlotStart}
            placeholder="Start"
            style={[styles.input, styles.inlineInput]}
            value={slotStart}
          />
          <TextInput
            editable={busyKey === null}
            onChangeText={setSlotEnd}
            placeholder="End"
            style={[styles.input, styles.inlineInput]}
            value={slotEnd}
          />
        </View>
        <Pressable
          disabled={busyKey !== null}
          onPress={() => {
            addAvailability().catch(() => {
              // Screen state handles availability errors.
            });
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            busyKey !== null ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {busyKey === 'availability-add' ? 'Saving...' : 'Add Availability'}
          </Text>
        </Pressable>

        {availabilitySlots.length === 0 ? (
          <Text style={styles.infoText}>No availability slots saved.</Text>
        ) : null}
        {availabilitySlots.map(slot => (
          <View key={slot.id} style={styles.listCard}>
            <Text style={styles.listTitle}>
              {dayLabel(slot.dayOfWeek)}: {slot.startTime} - {slot.endTime}
            </Text>
            <Pressable
              disabled={busyKey !== null}
              onPress={() => {
                runBusy(`slot-del-${slot.id}`, async () => {
                  await availabilityApi.deleteSlot(slot.id);
                  await refreshAvailability();
                  setStatus('Availability removed.');
                }).catch(() => {
                  // Screen state handles availability delete errors.
                });
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                busyKey !== null ? styles.buttonDisabled : null,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.subheading}>Your Reviews</Text>
        <Text style={styles.infoText}>
          Average {avgRating.toFixed(2)} from {totalReviews} review(s).
        </Text>
        {reviewRows.slice(0, 10).map((row, index) => (
          <View key={`${textValue(row.id, String(index))}`} style={styles.listCard}>
            <Text style={styles.listTitle}>
              {textValue(row.from_user_name, 'Anonymous')} | {textValue(row.rating, '0')}/5
            </Text>
            <Text style={styles.listMeta}>{textValue(row.comment, 'No comment')}</Text>
          </View>
        ))}
      </View>

      {user.role === 'admin' ? (
        <View style={styles.sectionCard}>
          <Text style={styles.subheading}>Pending Verifications (Admin)</Text>
          {pendingDocs.length === 0 ? (
            <Text style={styles.infoText}>No pending documents.</Text>
          ) : null}
          {pendingDocs.map(row => {
            const docId = asInt(row.id);
            const docBusy = busyKey === `doc-${docId}`;
            return (
              <View key={docId} style={styles.listCard}>
                <Text style={styles.listTitle}>
                  {textValue(row.user_name)} ({textValue(row.user_email)})
                </Text>
                <Text style={styles.listMeta}>
                  Type: {textValue(row.doc_type)} | URL: {textValue(row.doc_url)}
                </Text>
                <View style={styles.inlineButtonRow}>
                  <Pressable
                    disabled={docBusy || busyKey !== null}
                    onPress={() => {
                      runBusy(`doc-${docId}`, async () => {
                        await profileApi.reviewVerificationDoc(docId, 'approve');
                        await refreshAdminQueue();
                        setStatus(`Document ${docId} approved.`);
                      }).catch(() => {
                        // Screen state handles doc errors.
                      });
                    }}
                    style={({ pressed }) => [
                      styles.primaryButtonSmall,
                      docBusy || busyKey !== null ? styles.buttonDisabled : null,
                      pressed ? styles.buttonPressed : null,
                    ]}
                  >
                    <Text style={styles.primaryButtonSmallText}>Approve</Text>
                  </Pressable>
                  <Pressable
                    disabled={docBusy || busyKey !== null}
                    onPress={() => {
                      runBusy(`doc-${docId}`, async () => {
                        await profileApi.reviewVerificationDoc(docId, 'reject');
                        await refreshAdminQueue();
                        setStatus(`Document ${docId} rejected.`);
                      }).catch(() => {
                        // Screen state handles doc errors.
                      });
                    }}
                    style={({ pressed }) => [
                      styles.dangerButtonSmall,
                      docBusy || busyKey !== null ? styles.buttonDisabled : null,
                      pressed ? styles.buttonPressed : null,
                    ]}
                  >
                    <Text style={styles.primaryButtonSmallText}>Reject</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: colors.textMuted,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  identityCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: 2,
    gap: spacing.xs,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarBadge: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  identityTextBlock: {
    flex: 1,
  },
  identityName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  identityEmail: {
    marginTop: 2,
    color: colors.textMuted,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusChipText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fffefb',
    color: colors.text,
    fontSize: 15,
  },
  bioInput: {
    minHeight: 90,
  },
  statusText: {
    color: colors.primary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  primaryButton: {
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    backgroundColor: colors.panel,
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  sectionCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  subheading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fffefb',
  },
  skillChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  skillChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  skillChipActiveText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fffefb',
  },
  optionChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  optionChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  optionChipActiveText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  listCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#fffefb',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  listTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  listMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  inlineInputRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  inlineInput: {
    flex: 1,
  },
  inlineButtonRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  primaryButtonSmall: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonSmall: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonSmallText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
