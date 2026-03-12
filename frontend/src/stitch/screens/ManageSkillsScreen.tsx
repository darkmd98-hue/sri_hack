import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

type SkillCard = {
  id: number;
  image: string;
  level: string;
  mode: string;
  modeIcon: string;
  title: string;
};

const teachingSkills: SkillCard[] = [
  {
    id: 1,
    image: stitchImages.uiWireframe,
    level: 'Expert',
    mode: 'Online',
    modeIcon: 'language',
    title: 'UI/UX Design',
  },
  {
    id: 2,
    image: stitchImages.neonCode,
    level: 'Intermediate',
    mode: 'Hybrid',
    modeIcon: 'location_on',
    title: 'Python Programming',
  },
];

const learningSkills: SkillCard[] = [
  {
    id: 101,
    image: stitchImages.cameraLens,
    level: 'Beginner',
    mode: 'In-person',
    modeIcon: 'person',
    title: 'Digital Photography',
  },
];

const teachingLibrary: SkillCard[] = [
  ...teachingSkills,
  {
    id: 3,
    image: stitchImages.cameraLens,
    level: 'Beginner',
    mode: 'Online',
    modeIcon: 'language',
    title: 'Portrait Lighting',
  },
  {
    id: 4,
    image: stitchImages.uiWireframe,
    level: 'Intermediate',
    mode: 'Hybrid',
    modeIcon: 'location_on',
    title: 'Design Systems',
  },
];

const learningLibrary: SkillCard[] = [
  ...learningSkills,
  {
    id: 102,
    image: stitchImages.neonCode,
    level: 'Intermediate',
    mode: 'Online',
    modeIcon: 'language',
    title: 'Node.js APIs',
  },
  {
    id: 103,
    image: stitchImages.uiWireframe,
    level: 'Beginner',
    mode: 'In-person',
    modeIcon: 'person',
    title: 'Motion Design',
  },
];

const levelCycle = ['Beginner', 'Intermediate', 'Expert'] as const;
const modeCycle = [
  { mode: 'Online', modeIcon: 'language' },
  { mode: 'Hybrid', modeIcon: 'location_on' },
  { mode: 'In-person', modeIcon: 'person' },
] as const;

export function ManageSkillsScreen({
  onBack,
  onNavigate,
}: {
  onBack: () => void;
  onNavigate: (route: StitchAppRoute) => void;
}) {
  const [teachingRows, setTeachingRows] = useState<SkillCard[]>(teachingSkills);
  const [learningRows, setLearningRows] = useState<SkillCard[]>(learningSkills);

  const resetLists = (): void => {
    Alert.alert('Reset skills', 'Restore the original skill lists?', [
      {
        style: 'cancel',
        text: 'Cancel',
      },
      {
        onPress: () => {
          setTeachingRows(teachingSkills);
          setLearningRows(learningSkills);
        },
        text: 'Reset',
      },
    ]);
  };

  const addSkill = (type: 'teaching' | 'learning'): void => {
    const source = type === 'teaching' ? teachingLibrary : learningLibrary;
    const activeRows = type === 'teaching' ? teachingRows : learningRows;
    const nextRow = source.find(item => !activeRows.some(active => active.id === item.id));

    if (nextRow === undefined) {
      Alert.alert('All set', `All ${type === 'teaching' ? 'teaching' : 'learning'} skills are already added.`);
      return;
    }

    if (type === 'teaching') {
      setTeachingRows(previous => [...previous, nextRow]);
      return;
    }

    setLearningRows(previous => [...previous, nextRow]);
  };

  const cycleSkill = (type: 'teaching' | 'learning', skillId: number): void => {
    const updateRow = (row: SkillCard): SkillCard => {
      if (row.id !== skillId) {
        return row;
      }
      const nextLevel = levelCycle[(levelCycle.indexOf(row.level as (typeof levelCycle)[number]) + 1) % levelCycle.length];
      const currentModeIndex = modeCycle.findIndex(option => option.mode === row.mode);
      const nextMode = modeCycle[(currentModeIndex + 1) % modeCycle.length] ?? modeCycle[0];
      return {
        ...row,
        level: nextLevel,
        mode: nextMode.mode,
        modeIcon: nextMode.modeIcon,
      };
    };

    if (type === 'teaching') {
      setTeachingRows(previous => previous.map(updateRow));
      return;
    }

    setLearningRows(previous => previous.map(updateRow));
  };

  const deleteSkill = (type: 'teaching' | 'learning', skillId: number): void => {
    if (type === 'teaching') {
      setTeachingRows(previous => previous.filter(item => item.id !== skillId));
      return;
    }

    setLearningRows(previous => previous.filter(item => item.id !== skillId));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}>
          <StitchIcon color={stitchColors.primary} name="arrow_back" size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Skills</Text>
        <Pressable
          onPress={resetLists}
          style={({ pressed }) => [styles.moreButton, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.text} name="more_vert" size={22} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <Pressable
            onPress={() => addSkill('teaching')}
            style={({ pressed }) => [styles.primaryAction, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.white} name="add_circle" size={22} />
            <Text style={styles.primaryActionText}>Add Skill to Teach</Text>
          </Pressable>
          <Pressable
            onPress={() => addSkill('learning')}
            style={({ pressed }) => [styles.secondaryAction, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.primary} name="school" size={22} />
            <Text style={styles.secondaryActionText}>Add Skill to Learn</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills I&apos;m Teaching</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{`${teachingRows.length} Active`}</Text>
            </View>
          </View>

          <View style={styles.cardsColumn}>
            {teachingRows.map(skill => (
              <View key={skill.id} style={styles.skillCard}>
                <View style={styles.skillBody}>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillTitle}>{skill.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.levelPill}>
                        <Text style={styles.levelPillText}>{skill.level}</Text>
                      </View>
                      <View style={styles.modeRow}>
                        <StitchIcon color={stitchColors.slate500} name={skill.modeIcon} size={16} />
                        <Text style={styles.modeText}>{skill.mode}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.skillButtons}>
                    <Pressable
                      onPress={() => cycleSkill('teaching', skill.id)}
                      style={({ pressed }) => [styles.smallButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.slate700} name="edit" size={16} />
                      <Text style={styles.smallButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteSkill('teaching', skill.id)}
                      style={({ pressed }) => [styles.deleteButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.danger} name="delete" size={16} />
                    </Pressable>
                  </View>
                </View>
                <Image source={{ uri: skill.image }} style={styles.skillImage} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills I&apos;m Learning</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{`${learningRows.length} Active`}</Text>
            </View>
          </View>

          <View style={styles.cardsColumn}>
            {learningRows.map(skill => (
              <View key={skill.id} style={styles.skillCard}>
                <View style={styles.skillBody}>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillTitle}>{skill.title}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.levelPill}>
                        <Text style={styles.levelPillText}>{skill.level}</Text>
                      </View>
                      <View style={styles.modeRow}>
                        <StitchIcon color={stitchColors.slate500} name={skill.modeIcon} size={16} />
                        <Text style={styles.modeText}>{skill.mode}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.skillButtons}>
                    <Pressable
                      onPress={() => cycleSkill('learning', skill.id)}
                      style={({ pressed }) => [styles.smallButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.slate700} name="edit" size={16} />
                      <Text style={styles.smallButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteSkill('learning', skill.id)}
                      style={({ pressed }) => [styles.deleteButton, pressed ? styles.pressed : null]}
                    >
                      <StitchIcon color={stitchColors.danger} name="delete" size={16} />
                    </Pressable>
                  </View>
                </View>
                <Image source={{ uri: skill.image }} style={styles.skillImage} />
              </View>
            ))}
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
        <Pressable onPress={() => onNavigate('manageSkills')} style={styles.navItem}>
          <StitchIcon color={stitchColors.primary} name="menu_book" size={24} />
          <Text style={[styles.navText, styles.navTextActive]}>Skills</Text>
          <View style={styles.navDot} />
        </Pressable>
        <Pressable onPress={() => onNavigate('profile')} style={styles.navItem}>
          <StitchIcon color={stitchColors.slate400} name="person" size={24} />
          <Text style={styles.navText}>Profile</Text>
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
    borderBottomColor: stitchColors.slate200,
    backgroundColor: stitchColors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(55,19,236,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 16,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 112,
    gap: 24,
  },
  quickActions: {
    gap: 12,
  },
  primaryAction: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...stitchShadow.primary,
  },
  primaryActionText: {
    color: stitchColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(55,19,236,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionText: {
    color: stitchColors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    gap: 16,
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
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: stitchColors.slate200,
  },
  countBadgeText: {
    color: stitchColors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  cardsColumn: {
    gap: 16,
  },
  skillCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  skillBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skillInfo: {
    gap: 8,
  },
  skillTitle: {
    color: stitchColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: stitchRadius.pill,
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  levelPillText: {
    color: stitchColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modeText: {
    color: stitchColors.slate500,
    fontSize: 12,
  },
  skillButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  smallButton: {
    minHeight: 32,
    paddingHorizontal: 16,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  smallButtonText: {
    color: stitchColors.slate700,
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: stitchColors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: stitchColors.white,
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
    fontWeight: '500',
  },
  navTextActive: {
    color: stitchColors.primary,
    fontWeight: '700',
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: stitchColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
