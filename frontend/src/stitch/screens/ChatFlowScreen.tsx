import { ChatConversationScreen } from './ChatConversationScreen';

export function ChatFlowScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  return <ChatConversationScreen onBack={onBack} variant="marcus" />;
}
