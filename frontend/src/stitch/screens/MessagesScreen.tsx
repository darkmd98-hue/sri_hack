import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StitchNavItem } from '../components/common';
import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const filters = [
  { active: true, label: 'All' },
  { active: false, label: 'Unread' },
  { active: false, label: 'Skill Requests' },
  { active: false, label: 'Archived' },
];

const conversations: Array<{
  active?: boolean;
  attachment?: boolean;
  avatar?: string;
  highlighted?: boolean;
  initials?: string;
  name: string;
  online?: boolean;
  preview: string;
  route: StitchAppRoute;
  time: string;
  unread?: string;
}> = [
  {
    active: true,
    avatar: stitchImages.chatsAlex,
    name: 'Alex Rivera',
    online: true,
    preview: "Can you help me with React? I'm struggling with hooks...",
    route: 'chatWithSarah',
    time: '12:45 PM',
    unread: '2',
  },
  {
    avatar: stitchImages.chatsJordan,
    name: 'Jordan Smith',
    online: false,
    preview: "The UI design looks great! Let's schedule the swap.",
    route: 'chatWithSarah',
    time: 'Yesterday',
  },
  {
    attachment: true,
    avatar: stitchImages.chatsSarah,
    name: 'Sarah Chen',
    preview: 'Sent an attachment: Syllabus.pdf',
    route: 'chatWithSarah',
    time: 'Tuesday',
  },
  {
    avatar: stitchImages.chatsMarco,
    highlighted: true,
    name: 'Marco Rossi',
    online: true,
    preview: 'Grazie mille! See you on Friday at the cafe.',
    route: 'chatFlow',
    time: 'Oct 24',
    unread: '1',
  },
  {
    avatar: stitchImages.chatsElena,
    name: 'Elena Gilbert',
    preview: "I'm interested in learning French. Do you still teach?",
    route: 'chatFlow',
    time: 'Oct 22',
  },
  {
    initials: 'DK',
    name: 'David Kim',
    preview: 'That sounds like a fair trade to me!',
    route: 'chatFlow',
    time: 'Oct 20',
  },
];

export function MessagesScreen({
  onNavigate,
}: {
  onNavigate: (route: StitchAppRoute) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.phoneFrame}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.menuBadge}>
              <StitchIcon color={stitchColors.primary} name="menu" size={24} />
            </View>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.editButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate700} name="edit_square" size={22} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <StitchIcon color={stitchColors.slate400} name="search" size={22} />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor={stitchColors.slate500}
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.filterRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map(filter => (
            <View
              key={filter.label}
              style={[styles.filterChip, filter.active ? styles.filterChipActive : null]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter.active ? styles.filterChipTextActive : null,
                ]}
              >
                {filter.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {conversations.map(item => (
            <Pressable
              key={item.name}
              onPress={() => onNavigate(item.route)}
              style={({ pressed }) => [
                styles.conversationRow,
                item.active || item.highlighted ? styles.conversationRowActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={styles.avatarWrap}>
                {item.avatar ? (
                  <Image
                    source={{ uri: item.avatar }}
                    style={[
                      styles.avatar,
                      item.active || item.highlighted ? styles.avatarActive : null,
                    ]}
                  />
                ) : (
                  <View style={styles.initialsAvatar}>
                    <Text style={styles.initialsText}>{item.initials}</Text>
                  </View>
                )}
                {item.online !== undefined ? (
                  <View
                    style={[
                      styles.onlineDot,
                      { backgroundColor: item.online ? stitchColors.green : stitchColors.slate400 },
                    ]}
                  />
                ) : null}
              </View>

              <View style={styles.conversationBody}>
                <View style={styles.rowBetween}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.timeText,
                      item.active || item.highlighted ? styles.timeTextActive : null,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                <View style={[styles.rowBetween, styles.previewRow]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.previewText,
                      item.active || item.highlighted ? styles.previewTextActive : null,
                    ]}
                  >
                    {item.preview}
                  </Text>
                  {item.unread ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                    </View>
                  ) : item.attachment ? (
                    <StitchIcon color={stitchColors.slate400} name="attach_file" size={18} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.bottomNav}>
          <StitchNavItem icon="home" label="Home" onPress={() => onNavigate('home')} uppercase />
          <StitchNavItem
            icon="explore"
            label="Explore"
            onPress={() => onNavigate('explore')}
            uppercase
          />
          <StitchNavItem
            active
            icon="chat_bubble"
            label="Chats"
            onPress={() => onNavigate('chats')}
            uppercase
          />
          <StitchNavItem
            icon="person"
            label="Profile"
            onPress={() => onNavigate('profile')}
            uppercase
          />
        </View>

        <Pressable
          onPress={() => onNavigate('manageSkills')}
          style={({ pressed }) => [styles.fab, pressed ? styles.pressed : null]}
        >
          <StitchIcon color={stitchColors.white} name="add" size={30} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: stitchColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    backgroundColor: stitchColors.background,
    ...stitchShadow.large,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(246,246,248,0.80)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  headerTitle: {
    color: stitchColors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(226,232,240,0.50)',
  },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(226,232,240,0.50)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 14,
  },
  filterRow: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: stitchRadius.pill,
    backgroundColor: 'rgba(226,232,240,0.50)',
  },
  filterChipActive: {
    backgroundColor: stitchColors.primary,
  },
  filterChipText: {
    color: stitchColors.slate600,
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: stitchColors.white,
  },
  listContent: {
    paddingBottom: 96,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  conversationRowActive: {
    backgroundColor: 'rgba(55,19,236,0.05)',
    borderLeftColor: stitchColors.primary,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarActive: {
    borderWidth: 2,
    borderColor: 'rgba(55,19,236,0.20)',
  },
  initialsAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
  },
  initialsText: {
    color: stitchColors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: stitchColors.white,
  },
  conversationBody: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  conversationName: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    color: stitchColors.slate500,
    fontSize: 12,
  },
  timeTextActive: {
    color: stitchColors.primary,
    fontWeight: '500',
  },
  previewRow: {
    marginTop: 2,
  },
  previewText: {
    flex: 1,
    color: stitchColors.slate500,
    fontSize: 14,
    paddingRight: 8,
  },
  previewTextActive: {
    color: stitchColors.slate600,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
  },
  unreadBadgeText: {
    color: stitchColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(246,246,248,0.95)',
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
    ...stitchShadow.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
