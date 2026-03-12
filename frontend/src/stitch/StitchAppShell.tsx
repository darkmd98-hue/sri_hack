import { useState } from 'react';

import { HomeDashboardScreen } from './screens/HomeDashboardScreen';
import { ExploreSkillsScreen } from './screens/ExploreSkillsScreen';
import { YourMatchesScreen } from './screens/YourMatchesScreen';
import { ChatFlowScreen } from './screens/ChatFlowScreen';
import { ChatWithSarahScreen } from './screens/ChatWithSarahScreen';
import { ManageSkillsScreen } from './screens/ManageSkillsScreen';
import { ChatsScreen } from './screens/ChatsScreen';
import { MyProfileScreen } from './screens/MyProfileScreen';
import { PublicProfileScreen } from './screens/PublicProfileScreen';
import { ReviewsRatingsScreen } from './screens/ReviewsRatingsScreen';
import { SwapRequestsScreen } from './screens/SwapRequestsScreen';
import { AccountVerificationScreen } from './screens/AccountVerificationScreen';
import { StitchAppRoute } from './types';

export function StitchAppShell() {
  const [history, setHistory] = useState<StitchAppRoute[]>(['home']);

  const route = history[history.length - 1] ?? 'home';

  const navigate = (nextRoute: StitchAppRoute): void => {
    setHistory(previous =>
      previous[previous.length - 1] === nextRoute ? previous : [...previous, nextRoute],
    );
  };

  const goBack = (fallbackRoute: StitchAppRoute = 'home'): void => {
    setHistory(previous => {
      if (previous.length > 1) {
        return previous.slice(0, -1);
      }
      if (previous[0] === fallbackRoute) {
        return previous;
      }
      return [fallbackRoute];
    });
  };

  switch (route) {
    case 'explore':
      return <ExploreSkillsScreen onNavigate={navigate} />;
    case 'matches':
      return <YourMatchesScreen onNavigate={navigate} />;
    case 'requests':
      return <SwapRequestsScreen onNavigate={navigate} />;
    case 'chats':
      return <ChatsScreen onNavigate={navigate} />;
    case 'profile':
      return (
        <MyProfileScreen
          onBack={() => goBack('home')}
          onNavigate={navigate}
        />
      );
    case 'manageSkills':
      return (
        <ManageSkillsScreen
          onBack={() => goBack('profile')}
          onNavigate={navigate}
        />
      );
    case 'verification':
      return <AccountVerificationScreen onBack={() => goBack('profile')} />;
    case 'reviews':
      return <ReviewsRatingsScreen onBack={() => goBack('profile')} />;
    case 'publicProfile':
      return <PublicProfileScreen onNavigate={navigate} />;
    case 'chatFlow':
      return <ChatFlowScreen onBack={() => goBack('chats')} />;
    case 'chatWithSarah':
      return <ChatWithSarahScreen onBack={() => goBack('chats')} />;
    case 'home':
    default:
      return <HomeDashboardScreen onNavigate={navigate} />;
  }
}
