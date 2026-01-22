import { lessons } from '../data/curriculum';
import { defaultUserContext } from '../data/defaults';

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

export function getTextScale(textSize) {
  if (textSize === 'Large') return 1.2;
  if (textSize === 'Comfort') return 1.1;
  return 1;
}

export function deriveUserContextFromOnboarding(context) {
  const experienceText = (context?.experienceAnswer || '').toLowerCase();
  const knowledgeText = (context?.knowledgeAnswer || '').toLowerCase();
  const motivationText = context?.motivationAnswer?.trim();

  let experience = defaultUserContext.experience;
  if (/(seasoned|professional|advisor|decade|advanced)/.test(experienceText)) {
    experience = 'seasoned';
  } else if (/(year|years|portfolio|stock|crypto|etf|bond|fund|index)/.test(experienceText)) {
    experience = 'growing';
  } else if (/(none|nothing|new|starting|beginner)/.test(experienceText)) {
    experience = 'new';
  }

  let knowledge = defaultUserContext.knowledge;
  if (/(advanced|expert|professional)/.test(knowledgeText)) {
    knowledge = 'advanced';
  } else if (/(intermediate|familiar|comfortable|some)/.test(knowledgeText)) {
    knowledge = 'intermediate';
  } else if (/(basic|new|beginner|none)/.test(knowledgeText)) {
    knowledge = 'basic';
  }

  return {
    experience,
    knowledge,
    motivation: motivationText || defaultUserContext.motivation,
  };
}
