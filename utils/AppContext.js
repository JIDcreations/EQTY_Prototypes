import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultProgress, defaultUserContext } from '../data/defaults';
import { getNextLessonId } from './helpers';
import {
  loadProgress,
  loadReflections,
  loadUserContext,
  saveProgress,
  saveReflections,
  saveUserContext,
} from './storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [userContext, setUserContext] = useState(defaultUserContext);
  const [progress, setProgress] = useState(defaultProgress);
  const [reflections, setReflections] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      const [storedContext, storedProgress, storedReflections] = await Promise.all([
        loadUserContext(),
        loadProgress(),
        loadReflections(),
      ]);
      if (isMounted) {
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
      userContext,
      progress,
      reflections,
      isReady,
      updateUserContext,
      updateProgress,
      addReflection,
      completeLesson,
    }),
    [userContext, progress, reflections, isReady]
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
