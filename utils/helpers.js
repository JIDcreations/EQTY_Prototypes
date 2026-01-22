import { lessons } from '../data/curriculum';

export function getLessonById(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonStatus(lessonId, progress) {
  if (progress.completedLessonIds.includes(lessonId)) {
    return 'completed';
  }
  if (progress.currentLessonId === lessonId) {
    return 'current';
  }
  return 'upcoming';
}

export function getNextLessonId(currentLessonId) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((lesson) => lesson.id === currentLessonId);
  if (index === -1 || index === sorted.length - 1) {
    return currentLessonId;
  }
  return sorted[index + 1].id;
}

export function getScenarioVariant(userContext) {
  const experience = userContext?.experience || 'new';
  if (experience === 'seasoned') {
    return 'seasoned';
  }
  if (experience === 'growing') {
    return 'growing';
  }
  return 'new';
}

export function getGlossaryExplanation(term, userContext) {
  const knowledge = userContext?.knowledge || 'basic';
  if (knowledge === 'advanced') {
    return term.advanced || term.definition;
  }
  if (knowledge === 'basic') {
    return term.simple || term.definition;
  }
  return term.definition;
}
