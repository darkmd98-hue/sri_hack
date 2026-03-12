import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { stitchImages } from '../data';
import { StitchIcon } from '../icons';
import { stitchColors, stitchRadius, stitchShadow } from '../theme';

const variants = {
  alex: {
    accentText: 'UI Design Mentor • Online',
    addIcon: 'add_circle',
    addInsideComposer: true,
    avatar: stitchImages.chatAlexLarge,
    composerBackground: stitchColors.slate100,
    composerInputBackground: 'transparent',
    composerPill: true,
    dateBackground: stitchColors.slate100,
    dateTextColor: stitchColors.slate500,
    moodIcon: 'mood',
    name: 'Alex Rivera',
    showBottomIndicator: true,
  },
  marcus: {
    accentText: 'UI/UX Expert',
    addIcon: 'add',
    addInsideComposer: false,
    avatar: stitchImages.chatMarcusLarge,
    composerBackground: 'transparent',
    composerInputBackground: stitchColors.white,
    composerPill: false,
    dateBackground: 'rgba(55,19,236,0.05)',
    dateTextColor: 'rgba(55,19,236,0.60)',
    moodIcon: 'sentiment_satisfied',
    name: 'Marcus Sterling',
    showBottomIndicator: false,
  },
} as const;

type ConversationMessage = {
  avatar?: string;
  avatarHidden?: boolean;
  mine: boolean;
  text: string;
  time: string;
};

const messagesByVariant: Record<keyof typeof variants, ConversationMessage[]> = {
  alex: [
    {
      avatar: stitchImages.chatAlexSmall,
      mine: false,
      text:
        "Hey there! I saw your post about wanting to learn Python. I can definitely help with that! I've been a dev for 5 years.",
      time: '10:24 AM',
    },
    {
      avatarHidden: true,
      mine: false,
      text: 'Would you be interested in teaching me some UI design basics in exchange? 🎨',
      time: '10:25 AM',
    },
    {
      mine: true,
      text:
        "That sounds like a perfect swap! I'm definitely interested. I can show you my process in Figma.",
      time: '10:28 AM',
    },
    {
      avatar: stitchImages.chatAlexSmall,
      mine: false,
      text:
        'Awesome! I\'m free on weekday evenings. Maybe we can do a quick intro call tomorrow around 6 PM?',
      time: '10:30 AM',
    },
    {
      mine: true,
      text: '6 PM works for me! See you then. 🚀',
      time: '10:32 AM',
    },
  ],
  marcus: [
    {
      avatar: stitchImages.chatMarcusSmall,
      mine: false,
      text:
        'Hey! I saw your portfolio. Your Python skills are exactly what I need for a project. Interested in a swap? I can help you with Figma and design systems.',
      time: '10:30 AM',
    },
    {
      mine: true,
      text:
        "That sounds like a perfect match! I've been wanting to dive deeper into design systems for a while. 🎨",
      time: '10:32 AM',
    },
    {
      avatar: stitchImages.chatMarcusSmall,
      mine: false,
      text:
        'Awesome! Should we jump on a quick call this evening to discuss how we want to structure our sessions?',
      time: '10:35 AM',
    },
    {
      mine: true,
      text:
        "I'm free after 6 PM. Does that work for you? I can send over my initial learning goals too.",
      time: '10:40 AM',
    },
  ],
};

export function ChatConversationScreen({
  onBack,
  variant,
}: {
  onBack: () => void;
  variant: keyof typeof variants;
}) {
  const [draft, setDraft] = useState('');
  const [threadMessages, setThreadMessages] = useState<ConversationMessage[]>(
    messagesByVariant[variant],
  );
  const screen = variants[variant];

  const sendDraft = (): void => {
    const normalized = draft.trim();
    if (normalized.length === 0) {
      return;
    }

    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    setThreadMessages(previous => [
      ...previous,
      {
        mine: true,
        text: normalized,
        time,
      },
    ]);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={onBack} style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate700} name="arrow_back" size={22} />
          </Pressable>
          <View style={styles.headerAvatarWrap}>
            <Image source={{ uri: screen.avatar }} style={styles.headerAvatar} />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <Text style={styles.headerName}>{screen.name}</Text>
            <Text style={[styles.headerSubtitle, variant === 'marcus' ? styles.headerSubtitlePrimary : null]}>
              {screen.accentText}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate700} name="videocam" size={22} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.headerButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.slate700} name="more_vert" size={22} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.datePill, { backgroundColor: screen.dateBackground }]}>
          <Text style={[styles.datePillText, { color: screen.dateTextColor }]}>Today</Text>
        </View>

        {threadMessages.map((message, index) => (
          <View
            key={`${variant}-${index}`}
            style={[
              styles.messageRow,
              message.mine ? styles.messageRowMine : styles.messageRowOther,
            ]}
          >
            {!message.mine ? (
              message.avatarHidden ? (
                <View style={[styles.messageAvatar, styles.avatarPlaceholder]} />
              ) : (
                <Image source={{ uri: message.avatar }} style={styles.messageAvatar} />
              )
            ) : null}

            <View style={[styles.messageColumn, message.mine ? styles.messageColumnMine : null]}>
              <View
                style={[
                  styles.messageBubble,
                  message.mine ? styles.messageBubbleMine : styles.messageBubbleOther,
                  variant === 'marcus' && !message.mine ? styles.messageBubbleMarcus : null,
                ]}
              >
                <Text style={[styles.messageText, message.mine ? styles.messageTextMine : null]}>
                  {message.text}
                </Text>
              </View>
              <View style={[styles.timeRow, message.mine ? styles.timeRowMine : null]}>
                <Text style={styles.messageTime}>{message.time}</Text>
                {message.mine ? (
                  <StitchIcon color={stitchColors.primary} name="done_all" size={14} />
                ) : null}
              </View>
            </View>

            {message.mine ? (
              <Image
                source={{ uri: variant === 'alex' ? stitchImages.chatSelfOne : stitchImages.chatSelfTwo }}
                style={styles.messageAvatar}
              />
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, variant === 'marcus' ? styles.footerMarcus : null]}>
        {screen.addInsideComposer ? null : (
          <Pressable style={({ pressed }) => [styles.outerAddButton, pressed ? styles.pressed : null]}>
            <StitchIcon color={stitchColors.primary} name={screen.addIcon} size={24} />
          </Pressable>
        )}

        <View
          style={[
            styles.composer,
            screen.composerPill ? styles.composerPill : styles.composerPlain,
            { backgroundColor: screen.composerBackground },
          ]}
        >
          {screen.addInsideComposer ? (
            <Pressable style={({ pressed }) => [styles.innerComposerIcon, pressed ? styles.pressed : null]}>
              <StitchIcon color={stitchColors.slate500} name={screen.addIcon} size={24} />
            </Pressable>
          ) : null}

          <View style={[styles.inputWrap, { backgroundColor: screen.composerInputBackground }]}>
            <TextInput
              onChangeText={setDraft}
              onSubmitEditing={sendDraft}
              placeholder="Type your message..."
              placeholderTextColor={stitchColors.slate500}
              style={styles.composerInput}
              value={draft}
            />
            <Pressable style={({ pressed }) => [styles.innerComposerIcon, pressed ? styles.pressed : null]}>
              <StitchIcon color="rgba(55,19,236,0.60)" name={screen.moodIcon} size={22} />
            </Pressable>
          </View>

          <Pressable
            onPress={sendDraft}
            style={({ pressed }) => [styles.sendButton, pressed ? styles.pressed : null]}
          >
            <StitchIcon color={stitchColors.white} name="send" size={20} />
          </Pressable>
        </View>

        {screen.showBottomIndicator ? <View style={styles.bottomIndicator} /> : <View style={styles.safePad} />}
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: stitchColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarWrap: {
    position: 'relative',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(55,19,236,0.20)',
    resizeMode: 'cover',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: stitchColors.green,
    borderWidth: 2,
    borderColor: stitchColors.background,
  },
  headerName: {
    color: stitchColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 2,
    color: stitchColors.slate500,
    fontSize: 11,
    fontWeight: '500',
  },
  headerSubtitlePrimary: {
    color: stitchColors.primary,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },
  datePill: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: stitchRadius.pill,
  },
  datePillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '88%',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  messageRowMine: {
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    opacity: 0,
  },
  messageColumn: {
    gap: 4,
    flexShrink: 1,
  },
  messageColumnMine: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageBubbleOther: {
    backgroundColor: stitchColors.slate100,
    borderBottomLeftRadius: 4,
  },
  messageBubbleMarcus: {
    backgroundColor: stitchColors.white,
    borderWidth: 1,
    borderColor: stitchColors.slate100,
    ...stitchShadow.card,
  },
  messageBubbleMine: {
    backgroundColor: stitchColors.primary,
    borderBottomRightRadius: 4,
    ...stitchShadow.primary,
  },
  messageText: {
    color: stitchColors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  messageTextMine: {
    color: stitchColors.white,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 4,
  },
  timeRowMine: {
    justifyContent: 'flex-end',
  },
  messageTime: {
    color: stitchColors.slate400,
    fontSize: 10,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: stitchColors.white,
    borderTopWidth: 1,
    borderTopColor: stitchColors.slate200,
  },
  footerMarcus: {
    backgroundColor: stitchColors.background,
  },
  outerAddButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(55,19,236,0.10)',
    zIndex: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  composerPill: {
    borderRadius: stitchRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  composerPlain: {
    marginLeft: 48,
  },
  inputWrap: {
    flex: 1,
    minHeight: 48,
    borderRadius: stitchRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: stitchColors.white,
    ...stitchShadow.card,
  },
  composerInput: {
    flex: 1,
    color: stitchColors.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  innerComposerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: stitchColors.primary,
    ...stitchShadow.primary,
  },
  bottomIndicator: {
    alignSelf: 'center',
    width: 96,
    height: 4,
    borderRadius: 2,
    backgroundColor: stitchColors.slate200,
    marginTop: 16,
    marginBottom: 16,
  },
  safePad: {
    height: 8,
  },
  pressed: {
    opacity: 0.85,
  },
});
