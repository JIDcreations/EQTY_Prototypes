import { glossaryTerms } from '../data/glossary';

const normalizeKey = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildGlossaryIndex = (terms) => {
  const byId = {};
  const map = {};
  const keys = [];

  terms.forEach((term) => {
    if (!term) return;
    if (term.id) byId[term.id] = term;
    const base = normalizeKey(term.term);
    if (base) {
      map[base] = term;
      keys.push(base);
    }
    (term.aliases || []).forEach((alias) => {
      const key = normalizeKey(alias);
      if (!key) return;
      map[key] = term;
      keys.push(key);
    });
  });

  const uniqueKeys = Array.from(new Set(keys))
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);

  const regex =
    uniqueKeys.length > 0 ? new RegExp(`\\b(${uniqueKeys.join('|')})\\b`, 'gi') : null;

  return {
    regex,
    map,
    byId,
  };
};

export const glossaryIndex = buildGlossaryIndex(glossaryTerms);

export const splitGlossaryText = (text, index = glossaryIndex) => {
  if (!text || typeof text !== 'string' || !index.regex) {
    return [{ text }];
  }
  return text.split(index.regex).map((part) => {
    const term = index.map[normalizeKey(part)];
    return term ? { text: part, term } : { text: part };
  });
};

export const normalizeGlossarySegments = (segments, index = glossaryIndex) => {
  if (!Array.isArray(segments)) {
    return splitGlossaryText(segments, index);
  }

  const parts = [];
  segments.forEach((segment) => {
    if (segment === null || segment === undefined) return;
    if (Array.isArray(segment)) {
      parts.push(...normalizeGlossarySegments(segment, index));
      return;
    }
    if (typeof segment === 'string' || typeof segment === 'number') {
      parts.push(...splitGlossaryText(String(segment), index));
      return;
    }
    if (typeof segment === 'object') {
      if (segment.type === 'term' || segment.termId || segment.termKey) {
        const term =
          index.byId[segment.termId] ||
          index.map[normalizeKey(segment.termKey)] ||
          index.map[normalizeKey(segment.text)];
        const label = segment.text || term?.term || '';
        if (!label) return;
        parts.push({ text: label, term });
        return;
      }
      if (segment.type === 'text' && typeof segment.text === 'string') {
        parts.push(...splitGlossaryText(segment.text, index));
        return;
      }
      Object.values(segment).forEach((value) => {
        parts.push(...normalizeGlossarySegments(value, index));
      });
      return;
    }
    parts.push({ text: String(segment) });
  });

  return parts;
};

const findTermIdsInText = (text, index = glossaryIndex) => {
  if (!text || typeof text !== 'string' || !index.regex) return [];
  const ids = [];
  index.regex.lastIndex = 0;
  let match;
  while ((match = index.regex.exec(text))) {
    const term = index.map[normalizeKey(match[0])];
    if (term?.id) ids.push(term.id);
  }
  return ids;
};

const IGNORED_KEYS = new Set([
  'id',
  'termId',
  'termKey',
  'value',
  'order',
  'index',
  'step',
  'total',
  'min',
  'max',
  'icon',
  'route',
  'target',
  'entrySource',
  'lessonId',
  'moduleId',
]);

export const collectGlossaryTermIds = (content, index = glossaryIndex) => {
  const seen = new Set();
  const ordered = [];

  const addId = (id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    ordered.push(id);
  };

  const walk = (value) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const valueType = typeof value;
    if (valueType === 'string' || valueType === 'number') {
      findTermIdsInText(String(value), index).forEach(addId);
      return;
    }
    if (valueType === 'object') {
      if (value.type === 'term' || value.termId || value.termKey) {
        if (value.termId) addId(value.termId);
        if (value.termKey) {
          const term = index.map[normalizeKey(value.termKey)];
          if (term?.id) addId(term.id);
        }
        if (value.text) findTermIdsInText(String(value.text), index).forEach(addId);
        return;
      }
      if (value.type === 'text' && typeof value.text === 'string') {
        findTermIdsInText(value.text, index).forEach(addId);
        return;
      }
      Object.entries(value).forEach(([key, entry]) => {
        if (IGNORED_KEYS.has(key)) return;
        walk(entry);
      });
    }
  };

  walk(content);
  return ordered;
};
