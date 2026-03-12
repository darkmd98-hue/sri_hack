import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';
import { StitchAppRoute } from '../types';

const tabs = [
  { active: true, badge: '3', label: 'Incoming' },
  { active: false, label: 'Sent' },
  { active: false, label: 'Accepted' },
  { active: false, label: 'Completed' },
];

const requests = [
  {
    actionTime: '2 hours ago',
    avatar: stitchImages.requestSarah,
    badge: 'New Request',
    badgeColor: 'rgba(55,19,236,0.10)',
    badgeTextColor: stitchColors.primary,
    message:
      `"Hey! I saw you're looking for UI design help. I'd love to swap that for some Python backend basics for my new project."`,
    name: 'Sarah Chen',
    online: true,
    primarySkill: 'UI Design',
    primarySkillIcon: 'psychology',
    secondarySkill: 'Python Dev',
    secondarySkillIcon: 'code',
  },
  {
    actionTime: 'Yesterday, 4:15 PM',
    avatar: stitchImages.requestMarcus,
    badge: 'Pending',
    badgeColor: stitchColors.slate100,
    badgeTextColor: stitchColors.slate500,
    message:
      `"I can teach you how to make authentic handmade pasta if you can help me with my restaurant photography! Check my portfolio."`,
    name: 'Marcus Thorne',
    online: false,
    primarySkill: 'Italian Cooking',
    primarySkillIcon: 'restaurant',
    secondarySkill: 'Photography',
    secondarySkillIcon: 'camera_alt',
  },
  {
    actionTime: 'Oct 22, 11:30 AM',
    avatar: stitchImages.requestElena,
    badge: 'Pending',
    badgeColor: stitchColors.slate100,
    badgeTextColor: stitchColors.slate500,
    message:
      `"Looking to brush up on my Spanish for an upcoming trip. I can offer a deep dive into SEO for your blog in return."`,
    name: 'Elena Rodriguez',
    online: true,
    primarySkill: 'SEO Strategy',
    primarySkillIcon: 'trending_up',
    secondarySkill: 'Spanish Tutor',
    secondarySkillIcon: 'translate',
  },
];

export function SwapRequestsScreen({
  onNavigate,
}: {
  onNavigate: (route: StitchAppRoute) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.brandBadge}>
            <StitchIcon color={stitchColors.white} name="swap_calls" size={20} />
          </View>
          <Text style={styles.brandTitle}>SkillSwap</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={({ pressed }) => [styles.circleButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate600} name="notifications" size={22} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable onPress={() => onNavigate('profile')} style={styles.headerAvatarWrap}>
            <Image source={{ uri: stitchImages.homeAvatar }} style={styles.headerAvatar} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Swap Requests</Text>
          <Text style={styles.pageSubtitle}>
            Manage your skill exchanges and connect with others.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.tabsRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map(tab => (
            <Pressable
              key={tab.label}
              style={[
                styles.tabButton,
                tab.active ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Text style={[styles.tabText, tab.active ? styles.tabTextActive : styles.tabTextInactive]}>
                {tab.label}
              </Text>
              {tab.badge ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.cardList}>
          {requests.map(request => (
            <View key={request.name} style={styles.requestCard}>
              <View style={styles.requestTop}>
                <View style={styles.requestIdentity}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: request.avatar }} style={styles.avatar} />
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: request.online ? stitchColors.green : stitchColors.slate400 },
                      ]}
                    />
                  </View>
                  <View style={styles.identityBody}>
                    <View style={styles.identityHeader}>
                      <Text style={styles.requestName}>{request.name}</Text>
                      <View style={[styles.requestBadge, { backgroundColor: request.badgeColor }]}>
                        <Text style={[styles.requestBadgeText, { color: request.badgeTextColor }]}>
                          {request.badge}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.skillRow}>
                      <View style={styles.primarySkillPill}>
                        <StitchIcon
                          color={stitchColors.slate500}
                          name={request.primarySkillIcon}
                          size={16}
                        />
                        <Text style={styles.primarySkillText}>{request.primarySkill}</Text>
                      </View>
                      <StitchIcon color={stitchColors.slate300} name="swap_horiz" size={16} />
                      <View style={styles.secondarySkillPill}>
                        <StitchIcon
                          color={stitchColors.primary}
                          name={request.secondarySkillIcon}
                          size={16}
                        />
                        <Text style={styles.secondarySkillText}>{request.secondarySkill}</Text>
                      </View>
                    </View>

                    <Text style={styles.messageText}>{request.message}</Text>
                  </View>
                </View>

                <View style={styles.requestActions}>
                  <Text style={styles.requestTime}>{request.actionTime}</Text>
                  <View style={styles.buttonRow}>
                    <Pressable
                      onPress={() => onNavigate('chats')}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        pressed ? styles.pressed : null,
                      ]}
                    >
                      <Text style={styles.primaryButtonText}>Accept</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]}>
                      <Text style={styles.secondaryButtonText}>Reject</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.historyButton, pressed ? styles.pressed : null]}>
          <Text style={styles.historyButtonText}>View Past History</Text>
          <StitchIcon color={stitchColors.primary} name="history" size={20} />
        </Pressable>
      </ScrollView>

      <Pressable
        onPress={() => onNavigate('manageSkills')}
        style={({ pressed }) => [styles.fab, pressed ? styles.pressed : null]}
      >
        <StitchIcon color={stitchColors.white} name="add" size={28} />
      </Pressable>
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
    backgroundColor: 'rgba(255,255,255,0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: stitchColors.primary,
    borderWidth: 2,
    borderColor: stitchColors.white,
  },
  headerAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: stitchColors.primary,
    padding: 2,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 112,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    color: stitchColors.text,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },
  pageSubtitle: {
    color: stitchColors.slate500,
    fontSize: 16,
  },
  tabsRow: {
    gap: 8,
    paddingBottom: 16,
    marginBottom: 8,
  },
  tabButton: {
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: stitchRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: stitchColors.primary,
    ...stitchShadow.primary,
  },
  tabButtonInactive: {
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  tabTextActive: {
    color: stitchColors.white,
  },
  tabTextInactive: {
    color: stitchColors.slate600,
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: stitchRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  tabBadgeText: {
    color: stitchColors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  cardList: {
    gap: 16,
  },
  requestCard: {
    backgroundColor: stitchColors.white,
    borderRadius: stitchRadius.lg,
    borderWidth: 1,
    borderColor: stitchColors.slate200,
    padding: 24,
    ...stitchShadow.card,
  },
  requestTop: {
    gap: 24,
  },
  requestIdentity: {
    flexDirection: 'row',
    gap: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  statusDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: stitchColors.white,
  },
  identityBody: {
    flex: 1,
  },
  identityHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requestName: {
    color: stitchColors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  requestBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: stitchRadius.pill,
  },
  requestBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  primarySkillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: stitchColors.slate100,
  },
  secondarySkillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(55,19,236,0.05)',
  },
  primarySkillText: {
    color: stitchColors.slate500,
    fontSize: 13,
  },
  secondarySkillText: {
    color: stitchColors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  messageText: {
    color: stitchColors.slate600,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  requestActions: {
    alignItems: 'flex-start',
    gap: 12,
  },
  requestTime: {
    color: stitchColors.slate400,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.primary,
  },
  primaryButtonText: {
    color: stitchColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: stitchRadius.pill,
    backgroundColor: stitchColors.slate100,
  },
  secondaryButtonText: {
    color: stitchColors.slate600,
    fontSize: 14,
    fontWeight: '600',
  },
  historyButton: {
    marginTop: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyButtonText: {
    color: stitchColors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: stitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...stitchShadow.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
