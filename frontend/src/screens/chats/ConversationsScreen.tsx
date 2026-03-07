import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

export interface OpenConversationPayload {
  conversationId: number;
  title: string;
}

export function ConversationsScreen({
  onOpenConversation,
}: {
  onOpenConversation: (payload: OpenConversationPayload) => void;
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

  if (loading && conversations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error !== null && conversations.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No conversations yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={conversations}
      keyExtractor={item => String(item.id)}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pressed: {
    opacity: 0.85,
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
});
