import { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react';

import { ApiClient } from '../api/apiClient';
import { AuthApi } from '../api/authApi';
import { ChatApi } from '../api/chatApi';
import { MatchApi } from '../api/matchApi';
import { ProfileApi } from '../api/profileApi';
import { ReviewApi } from '../api/reviewApi';
import { SafetyApi } from '../api/safetyApi';
import { SkillsApi } from '../api/skillsApi';
import { SwapApi } from '../api/swapApi';
import { TokenStorage } from '../core/tokenStorage';
import { AuthStore } from '../state/authStore';
import { ChatStore } from '../state/chatStore';
import { MatchStore } from '../state/matchStore';
import { RequestStore } from '../state/requestStore';

export interface AppServices {
  tokenStorage: TokenStorage;
  apiClient: ApiClient;
  authApi: AuthApi;
  matchApi: MatchApi;
  skillsApi: SkillsApi;
  swapApi: SwapApi;
  chatApi: ChatApi;
  profileApi: ProfileApi;
  reviewApi: ReviewApi;
  safetyApi: SafetyApi;
  authStore: AuthStore;
  matchStore: MatchStore;
  requestStore: RequestStore;
  chatStore: ChatStore;
}

const AppContext = createContext<AppServices | null>(null);

function createServices(): AppServices {
  const tokenStorage = new TokenStorage();
  const apiClient = new ApiClient(tokenStorage);

  const authApi = new AuthApi(apiClient);
  const matchApi = new MatchApi(apiClient);
  const skillsApi = new SkillsApi(apiClient);
  const swapApi = new SwapApi(apiClient);
  const chatApi = new ChatApi(apiClient);
  const profileApi = new ProfileApi(apiClient);
  const reviewApi = new ReviewApi(apiClient);
  const safetyApi = new SafetyApi(apiClient);

  const authStore = new AuthStore(authApi, tokenStorage);
  const matchStore = new MatchStore(matchApi);
  const requestStore = new RequestStore(swapApi);
  const chatStore = new ChatStore(chatApi);

  return {
    tokenStorage,
    apiClient,
    authApi,
    matchApi,
    skillsApi,
    swapApi,
    chatApi,
    profileApi,
    reviewApi,
    safetyApi,
    authStore,
    matchStore,
    requestStore,
    chatStore,
  };
}

export function AppProvider({ children }: PropsWithChildren) {
  const servicesRef = useRef<AppServices | null>(null);
  if (servicesRef.current === null) {
    servicesRef.current = createServices();
  }

  useEffect(() => {
    return () => {
      servicesRef.current?.chatStore.dispose();
    };
  }, []);

  return <AppContext.Provider value={servicesRef.current}>{children}</AppContext.Provider>;
}

export function useAppServices(): AppServices {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppServices must be used inside AppProvider');
  }
  return context;
}
