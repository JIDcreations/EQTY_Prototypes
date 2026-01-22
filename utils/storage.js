import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultProgress, defaultReflections, defaultUserContext } from '../data/defaults';

const STORAGE_KEYS = {
  userContext: 'eqty_user_context',
  progress: 'eqty_progress',
  reflections: 'eqty_reflections',
};

export async function loadUserContext() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.userContext);
  return stored ? JSON.parse(stored) : defaultUserContext;
}

export async function saveUserContext(context) {
  await AsyncStorage.setItem(STORAGE_KEYS.userContext, JSON.stringify(context));
}

export async function loadProgress() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.progress);
  if (!stored) {
    return defaultProgress;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') {
      return defaultProgress;
    }
    return {
      ...defaultProgress,
      ...parsed,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : defaultProgress.completedLessonIds,
      currentLessonId: parsed.currentLessonId || defaultProgress.currentLessonId,
    };
  } catch (error) {
    return defaultProgress;
  }
}

export async function saveProgress(progress) {
  await AsyncStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export async function loadReflections() {
  const stored = await AsyncStorage.getItem(STORAGE_KEYS.reflections);
  return stored ? JSON.parse(stored) : defaultReflections;
}

export async function saveReflections(reflections) {
  await AsyncStorage.setItem(STORAGE_KEYS.reflections, JSON.stringify(reflections));
}
