import { useState } from 'react';

import { useAppServices } from '../context/AppContext';
import { useStoreSelector } from '../state/store';
import { ForgotPasswordScreen } from './auth/ForgotPasswordScreen';
import { LoginScreen } from './auth/LoginScreen';
import { OnboardingFlowScreen } from './auth/OnboardingFlowScreen';
import { ResetPasswordScreen } from './auth/ResetPasswordScreen';
import { RegisterScreen } from './auth/RegisterScreen';
import { StitchAuthRoute } from './types';

export function StitchAuthFlow() {
  const { authStore } = useAppServices();
  const loading = useStoreSelector(authStore, store => store.isLoading);
  const error = useStoreSelector(authStore, store => store.error);

  const [route, setRoute] = useState<StitchAuthRoute>('onboarding');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [registerName, setRegisterName] = useState('Alex Rivera');
  const [registerEmail, setRegisterEmail] = useState('alex.rivera@');
  const [registerPassword, setRegisterPassword] = useState('');
  const [department, setDepartment] = useState('Design');
  const [year, setYear] = useState('Freshman');

  const submitLogin = (): void => {
    authStore.login(loginEmail.trim(), loginPassword).catch(() => {
      // Store exposes errors for the current screen.
    });
  };

  const submitRegister = (): void => {
    authStore.register(registerName.trim(), registerEmail.trim(), registerPassword).catch(() => {
      // Store exposes errors for the current screen.
    });
  };

  switch (route) {
    case 'onboarding':
      return (
        <OnboardingFlowScreen
          onGetStarted={() => setRoute('login')}
          onSkip={() => setRoute('login')}
        />
      );
    case 'forgot':
      return (
        <ForgotPasswordScreen
          email={forgotEmail}
          onBack={() => setRoute('login')}
          onEmailChange={setForgotEmail}
          onLogin={() => setRoute('login')}
          onReset={() => setRoute('reset')}
        />
      );
    case 'reset':
      return (
        <ResetPasswordScreen
          onBack={() => setRoute('forgot')}
          onLogin={() => setRoute('login')}
        />
      );
    case 'register':
      return (
        <RegisterScreen
          department={department}
          email={registerEmail}
          loading={loading}
          name={registerName}
          onBack={() => setRoute('login')}
          onDepartmentChange={setDepartment}
          onEmailChange={setRegisterEmail}
          onLogin={() => setRoute('login')}
          onNameChange={setRegisterName}
          onPasswordChange={setRegisterPassword}
          onRegister={submitRegister}
          onShowPasswordToggle={() => setShowRegisterPassword(prev => !prev)}
          onTermsToggle={() => setTermsAccepted(prev => !prev)}
          onYearChange={setYear}
          password={registerPassword}
          showPassword={showRegisterPassword}
          termsAccepted={termsAccepted}
          year={year}
        />
      );
    case 'login':
    default:
      return (
        <LoginScreen
          email={loginEmail}
          error={error}
          loading={loading}
          onClose={() => setRoute('onboarding')}
          onEmailChange={setLoginEmail}
          onForgot={() => setRoute('forgot')}
          onLogin={submitLogin}
          onPasswordChange={setLoginPassword}
          onRegister={() => setRoute('register')}
          onRememberToggle={() => setRememberMe(prev => !prev)}
          onShowPasswordToggle={() => setShowLoginPassword(prev => !prev)}
          password={loginPassword}
          rememberMe={rememberMe}
          showPassword={showLoginPassword}
        />
      );
  }
}
