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
import { initialSavedUsers, SavedScreen } from './screens/SavedScreen';
import { SwapRequestsScreen } from './screens/SwapRequestsScreen';
import { AccountVerificationScreen } from './screens/AccountVerificationScreen';
import { StitchAppRoute } from './types';

export function StitchAppShell() {
  const [history, setHistory] = useState<StitchAppRoute[]>(['home']);
  const [selectedReportedUserId, setSelectedReportedUserId] = useState<number | null>(null);
  const [selectedSwapRequestId, setSelectedSwapRequestId] = useState<number | null>(null);
  const [savedUsers, setSavedUsers] = useState(initialSavedUsers);

  const route = history[history.length - 1] ?? 'home';

  const navigate = (nextRoute: StitchAppRoute): void => {
    setHistory(previous =>
      previous[previous.length - 1] === nextRoute ? previous : [...previous, nextRoute],
    );
  };

  const openPublicProfile = (reportedUserId: number): void => {
    setSelectedReportedUserId(reportedUserId);
    navigate('publicProfile');
  };

  const openReviews = (swapRequestId?: number): void => {
    setSelectedSwapRequestId(swapRequestId ?? null);
    navigate('reviews');
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

  const removeSavedUser = (userId: string): void => {
    setSavedUsers(previous => previous.filter(user => user.id !== userId));
  };

  switch (route) {
    case 'explore':
      return <ExploreSkillsScreen onNavigate={navigate} onOpenPublicProfile={openPublicProfile} />;
    case 'matches':
      return <YourMatchesScreen onNavigate={navigate} onOpenPublicProfile={openPublicProfile} />;
    case 'requests':
      return <SwapRequestsScreen onNavigate={navigate} onOpenReviews={openReviews} />;
    case 'chats':
      return <ChatsScreen onNavigate={navigate} />;
    case 'profile':
      return (
        <MyProfileScreen
          onBack={() => goBack('home')}
          onNavigate={navigate}
          onOpenReviews={() => openReviews()}
        />
      );
    case 'saved':
      return (
        <SavedScreen
          onRemoveSavedUser={removeSavedUser}
          onBack={() => goBack('profile')}
          onOpenPublicProfile={openPublicProfile}
          savedUsers={savedUsers}
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
      return <ReviewsRatingsScreen onBack={() => goBack('profile')} swapRequestId={selectedSwapRequestId} />;
    case 'publicProfile':
      return (
        <PublicProfileScreen
          onNavigate={navigate}
          onOpenReviews={() => openReviews()}
          reportedUserId={selectedReportedUserId}
        />
      );
    case 'chatFlow':
      return <ChatFlowScreen onBack={() => goBack('chats')} />;
    case 'chatWithSarah':
      return <ChatWithSarahScreen onBack={() => goBack('chats')} />;
    case 'home':
    default:
      return <HomeDashboardScreen onNavigate={navigate} onOpenPublicProfile={openPublicProfile} />;
  }
}
