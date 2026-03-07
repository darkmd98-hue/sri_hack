import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppServices } from '../context/AppContext';
import {
  ChatUserSearchState,
  ConversationsScreen,
  OpenConversationPayload,
} from './chats/ConversationsScreen';
import { ChatScreen } from './chats/ChatScreen';
import { ExploreScreen } from './explore/ExploreScreen';
import { HomeScreen } from './home/HomeScreen';
import { ProfileScreen } from './profile/ProfileScreen';
import { RequestsScreen } from './requests/RequestsScreen';
import { VerificationScreen } from './verification/VerificationScreen';
import { useStoreSelector } from '../state/store';
import { colors, radius, spacing } from '../ui/theme';

type TabKey = 'home' | 'explore' | 'requests' | 'chats' | 'profile';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'explore', label: 'Explore' },
  { key: 'requests', label: 'Requests' },
  { key: 'chats', label: 'Chats' },
  { key: 'profile', label: 'Profile' },
];

export function AppShell() {
  const { authStore } = useAppServices();
  const authLoading = useStoreSelector(authStore, store => store.isLoading);
  const [tab, setTab] = useState<TabKey>('home');
  const [openConversation, setOpenConversation] = useState<OpenConversationPayload | null>(
    null,
  );
  const [showVerification, setShowVerification] = useState(false);
  const [chatUserSearchState, setChatUserSearchState] = useState<ChatUserSearchState>({
    text: '',
    searched: false,
  });

  const nestedTitle = openConversation !== null
    ? openConversation.title
    : showVerification
      ? 'Verification'
      : 'Skill Swap';

  const showBack = openConversation !== null || showVerification;

  const renderContent = () => {
    if (openConversation !== null) {
      return <ChatScreen conversationId={openConversation.conversationId} />;
    }
    if (showVerification) {
      return <VerificationScreen />;
    }

    switch (tab) {
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'requests':
        return <RequestsScreen />;
      case 'chats':
        return (
          <ConversationsScreen
            onOpenConversation={payload => {
              setOpenConversation(payload);
            }}
            onSearchStateChange={setChatUserSearchState}
            searchState={chatUserSearchState}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onOpenVerification={() => {
              setShowVerification(true);
            }}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBack ? (
          <Pressable
            onPress={() => {
              if (openConversation !== null) {
                setOpenConversation(null);
                return;
              }
              setShowVerification(false);
            }}
            style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}
          >
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.headerButtonPlaceholder} />
        )}

        <View style={styles.headerTitleWrap}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {nestedTitle}
          </Text>
          <Text style={styles.headerSubtitle}>
            {showBack ? 'Detail view' : 'Peer learning network'}
          </Text>
        </View>

        <Pressable
          disabled={authLoading}
          onPress={() => {
            authStore.logout().catch(() => {
              // Logout errors are already ignored in store.
            });
          }}
          style={({ pressed }) => [
            styles.headerButton,
            authLoading ? styles.disabled : null,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.headerButtonText}>{authLoading ? '...' : 'Logout'}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {!showBack ? (
        <View style={styles.tabBar}>
          {tabs.map(item => (
            <Pressable
              key={item.key}
              onPress={() => setTab(item.key)}
              style={[styles.tabButton, tab === item.key ? styles.activeTabButton : null]}
            >
              {tab === item.key ? <View style={styles.activeDot} /> : null}
              <Text style={[styles.tabText, tab === item.key ? styles.activeTabText : null]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    minHeight: 70,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panel,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    marginTop: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  headerButton: {
    minWidth: 72,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  headerButtonPlaceholder: {
    minWidth: 72,
  },
  headerButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    minHeight: 62,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    backgroundColor: colors.panel,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: colors.primarySoft,
  },
  activeDot: {
    position: 'absolute',
    top: 4,
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.82,
  },
});
