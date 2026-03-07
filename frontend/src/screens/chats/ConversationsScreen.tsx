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
        <ActivityIndicator size="large" color="#0a7a5a" />
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
          tintColor="#0a7a5a"
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
    padding: 16,
  },
  errorText: {
    color: '#b00020',
    textAlign: 'center',
  },
  emptyText: {
    color: '#40665a',
    textAlign: 'center',
  },
  listContent: {
    padding: 12,
    gap: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8e3db',
    borderRadius: 10,
    padding: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: '#17382d',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    marginTop: 4,
    color: '#34584b',
    fontSize: 13,
  },
  badge: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0a7a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
