import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  defaultAuthUser,
  defaultOnboardingContext,
  defaultPreferences,
  defaultProgress,
  defaultUserContext,
} from '../data/defaults';
import { deriveUserContextFromOnboarding, getNextLessonId, getTextScale } from './helpers';
import {
  clearAuthUser,
  loadAuthUser,
  loadOnboardingContext,
  loadPreferences,
  loadProgress,
  loadReflections,
  loadUserContext,
  saveAuthUser,
  saveOnboardingContext,
  savePreferences,
  saveProgress,
  saveReflections,
  saveUserContext,
} from './storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(defaultAuthUser);
  const [onboardingContext, setOnboardingContext] = useState(defaultOnboardingContext);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [userContext, setUserContext] = useState(defaultUserContext);
  const [progress, setProgress] = useState(defaultProgress);
  const [reflections, setReflections] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      const [
        storedAuthUser,
        storedOnboarding,
        storedPreferences,
        storedContext,
        storedProgress,
        storedReflections,
      ] = await Promise.all([
        loadAuthUser(),
        loadOnboardingContext(),
        loadPreferences(),
        loadUserContext(),
        loadProgress(),
        loadReflections(),
      ]);
      if (isMounted) {
        setAuthUser(storedAuthUser);
        setOnboardingContext(storedOnboarding);
        setPreferences(storedPreferences);
        setUserContext(storedContext);
        setProgress(storedProgress);
        setReflections(storedReflections);
        setIsReady(true);
      }
    }
    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateAuthUser = async (updates) => {
    const base = authUser || defaultAuthUser;
    const next = { ...base, ...updates };
    setAuthUser(next);
    await saveAuthUser(next);
  };

  const logOut = async () => {
    setAuthUser(null);
    await clearAuthUser();
  };

  const updateOnboardingContext = async (updates) => {
    const next = { ...onboardingContext, ...updates };
    setOnboardingContext(next);
    await saveOnboardingContext(next);
    const derived = deriveUserContextFromOnboarding(next);
    await updateUserContext(derived);
  };

  const updatePreferences = async (updates) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    await savePreferences(next);
  };

  const updateUserContext = async (updates) => {
    const next = { ...userContext, ...updates };
    setUserContext(next);
    await saveUserContext(next);
  };

  const updateProgress = async (next) => {
    setProgress(next);
    await saveProgress(next);
  };

  const addReflection = async (text, lessonId) => {
    const entry = {
      id: `${lessonId}_${Date.now()}`,
      lessonId,
      text,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...reflections];
    setReflections(next);
    await saveReflections(next);
  };

  const completeLesson = async (lessonId) => {
    const completed = progress.completedLessonIds.includes(lessonId)
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, lessonId];
    const nextLessonId = getNextLessonId(lessonId);
    const nextProgress = {
      completedLessonIds: completed,
      currentLessonId: nextLessonId,
    };
    await updateProgress(nextProgress);
    return nextProgress;
  };

  const value = useMemo(
    () => ({
      authUser,
      onboardingContext,
      preferences,
      userContext,
      progress,
      reflections,
      isReady,
      textScale: getTextScale(preferences?.textSize),
      updateAuthUser,
      updateOnboardingContext,
      updatePreferences,
      logOut,
      updateUserContext,
      updateProgress,
      addReflection,
      completeLesson,
    }),
    [authUser, onboardingContext, preferences, userContext, progress, reflections, isReady]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
