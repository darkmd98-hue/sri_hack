import { ChatConversationScreen } from './ChatConversationScreen';

export function ChatWithSarahScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  return <ChatConversationScreen onBack={onBack} variant="alex" />;
}
