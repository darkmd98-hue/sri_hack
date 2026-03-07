import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

export interface OpenConversationPayload {
  conversationId: number;
  title: string;
}

export interface ChatUserSearchState {
  text: string;
  searched: boolean;
}

export interface SearchedUserProfile {
  name: string;
  workStatus: string;
  oneLineInfo: string;
  role: string;
  location: string;
  about: string;
  primarySkill: string;
  yearsExperience: string;
  contact: string;
}

const DUMMY_SEARCH_USER: SearchedUserProfile = {
  name: 'Nivaan Rao',
  workStatus: 'Freelance Product Designer',
  oneLineInfo: 'Designing simple user-first mobile products.',
  role: 'UI/UX Designer',
  location: 'Bengaluru, India',
  about:
    'I help early-stage teams turn raw ideas into simple, usable mobile experiences.',
  primarySkill: 'Mobile UI and design systems',
  yearsExperience: '4 years',
  contact: 'nivaan.rao@example.com',
};

export function ConversationsScreen({
  onOpenConversation,
  onOpenSearchedUserProfile,
  searchState,
  onSearchStateChange,
}: {
  onOpenConversation: (payload: OpenConversationPayload) => void;
  onOpenSearchedUserProfile: (user: SearchedUserProfile) => void;
  searchState: ChatUserSearchState;
  onSearchStateChange: (nextState: ChatUserSearchState) => void;
}) {
  const { chatStore } = useAppServices();
  const loading = useStoreSelector(chatStore, store => store.isLoading);
  const error = useStoreSelector(chatStore, store => store.error);
  const conversations = useStoreSelector(chatStore, store => store.conversations);

  useEffect(() => {
    chatStore.loadConversations().catch(() => {
      // Store exposes load errors through state.
    });
  }, [chatStore]);

  const normalizedSearch = searchState.text.trim().toLowerCase();
  const foundUser =
    searchState.searched &&
    normalizedSearch.length > 0 &&
    DUMMY_SEARCH_USER.name.toLowerCase().includes(normalizedSearch)
      ? DUMMY_SEARCH_USER
      : null;
  const searchStatus =
    !searchState.searched
      ? null
      : normalizedSearch.length === 0
        ? 'Enter a username to search.'
        : foundUser === null
          ? 'No user found for this search.'
          : null;

  const runSearch = (): void => {
    onSearchStateChange({
      text: searchState.text,
      searched: true,
    });
  };

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={conversations}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={
        <View style={styles.headerSection}>
          <View style={styles.searchBox}>
            <Text style={styles.searchTitle}>Search Users</Text>
            <View style={styles.searchRow}>
              <TextInput
                autoCapitalize="words"
                onChangeText={value => {
                  onSearchStateChange({
                    text: value,
                    searched: false,
                  });
                }}
                placeholder="Enter username"
                style={styles.searchInput}
                value={searchState.text}
              />
              <Pressable
                onPress={runSearch}
                style={({ pressed }) => [styles.searchButton, pressed ? styles.pressed : null]}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </Pressable>
            </View>
          </View>

          {searchState.searched ? (
            foundUser !== null ? (
              <Pressable
                onPress={() => {
                  onOpenSearchedUserProfile(foundUser);
                }}
                style={({ pressed }) => [
                  styles.searchResultCard,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View style={styles.searchResultTextWrap}>
                  <Text style={styles.searchResultName}>{foundUser.name}</Text>
                  <Text style={styles.searchResultWork}>{foundUser.workStatus}</Text>
                  <Text style={styles.searchResultInfo}>{foundUser.oneLineInfo}</Text>
                </View>
                <View style={styles.searchResultAvatar}>
                  <Text style={styles.searchResultAvatarText}>
                    {foundUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            ) : (
              <Text style={styles.searchStatusText}>{searchStatus}</Text>
            )
          ) : (
            <Text style={styles.searchHintText}>Search by username to view a profile card.</Text>
          )}

          {error !== null ? <Text style={styles.errorText}>{error}</Text> : null}
          <Text style={styles.sectionLabel}>Conversations</Text>
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <Text style={styles.emptyText}>No conversations yet.</Text>
        )
      }
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            chatStore.loadConversations().catch(() => {
              // Store exposes load errors through state.
            });
          }}
          refreshing={loading}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            onOpenConversation({
              conversationId: item.id,
              title: item.otherUserName,
            });
          }}
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
        >
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.otherUserName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{item.otherUserName}</Text>
            {item.unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.subtitle}>{item.lastMessage ?? 'No messages yet'}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.xs,
    flexGrow: 1,
  },
  headerSection: {
    gap: spacing.xs,
  },
  searchBox: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  searchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: '#fffefb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
  },
  searchButton: {
    minWidth: 86,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  searchResultCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  searchResultTextWrap: {
    flex: 1,
    gap: 3,
  },
  searchResultName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  searchResultWork: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  searchResultInfo: {
    color: colors.textMuted,
    fontSize: 12,
  },
  searchResultAvatar: {
    width: 50,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultAvatarText: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '700',
  },
  searchHintText: {
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: 2,
  },
  searchStatusText: {
    color: colors.warning,
    fontSize: 12,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: 13,
    marginLeft: 42,
  },
  badge: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
