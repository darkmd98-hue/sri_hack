import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppServices } from '../../context/AppContext';
import { ChatMessage } from '../../models/chatMessage';
import { useStoreSelector } from '../../state/store';
import { colors, radius, spacing } from '../../ui/theme';

function MessageBubble({
  message,
  mine,
}: {
  message: ChatMessage;
  mine: boolean;
}) {
  return (
    <View style={[styles.messageRow, mine ? styles.mineRow : styles.otherRow]}>
      <View style={[styles.bubble, mine ? styles.mineBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, mine ? styles.mineText : styles.otherText]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export function ChatScreen({
  conversationId,
}: {
  conversationId: number;
}) {
  const { authStore, chatStore } = useAppServices();
  const myId = useStoreSelector(authStore, store => store.user?.id ?? -1);
  const messages = useStoreSelector(chatStore, store =>
    store.messagesFor(conversationId),
  );
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage> | null>(null);

  useEffect(() => {
    chatStore.loadMessages(conversationId).catch(() => {
      // Store exposes message load errors through state.
    });
    chatStore.startPolling(conversationId);
    return () => {
      chatStore.stopPolling(conversationId);
    };
  }, [chatStore, conversationId]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const sendMessage = (): void => {
    const content = text;
    setText('');
    chatStore.sendMessage(conversationId, content).catch(() => {
      // Store exposes send errors through state.
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ref={listRef}
        renderItem={({ item }) => (
          <MessageBubble message={item} mine={item.senderId === myId} />
        )}
      />

      <View style={styles.composer}>
        <TextInput
          onChangeText={setText}
          placeholder="Type message"
          style={styles.input}
          value={text}
        />
        <Pressable
          onPress={sendMessage}
          style={({ pressed }) => [styles.sendButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageRow: {
    marginVertical: 3,
    flexDirection: 'row',
  },
  mineRow: {
    justifyContent: 'flex-end',
  },
  otherRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
  },
  mineBubble: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  otherBubble: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 14,
  },
  mineText: {
    color: '#ffffff',
  },
  otherText: {
    color: colors.text,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.panel,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#fffefb',
  },
  sendButton: {
    backgroundColor: colors.primary,
    minHeight: 42,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});
