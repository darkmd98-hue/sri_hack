import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppServices } from '../context/AppContext';
import {
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

  const nestedTitle = useMemo(() => {
    if (openConversation !== null) {
      return openConversation.title;
    }
    if (showVerification) {
      return 'Verification';
    }
    return 'Skill Swap';
  }, [openConversation, showVerification]);

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

        <Text numberOfLines={1} style={styles.headerTitle}>
          {nestedTitle}
        </Text>

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
    backgroundColor: '#f4f7f4',
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d7e1da',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#16372d',
    paddingHorizontal: 8,
  },
  headerButton: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonPlaceholder: {
    minWidth: 64,
  },
  headerButtonText: {
    color: '#0a7a5a',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    minHeight: 58,
    borderTopWidth: 1,
    borderTopColor: '#d7e1da',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#e7f3ed',
  },
  tabText: {
    color: '#35574a',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0a7a5a',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.85,
  },
});
