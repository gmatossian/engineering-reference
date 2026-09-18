import { describe, expect, it } from 'vitest';
import {
  TOPIC_DOMAIN_KEYS,
  TOPIC_DOMAIN_LABELS,
  TOPIC_KIND_KEYS,
  TOPIC_KIND_LABELS,
} from '../../contracts/runtime-catalog.ts';

describe('runtime catalog vocabularies', () => {
  it('exposes domains in canonical order with display labels', () => {
    expect(TOPIC_DOMAIN_KEYS).toEqual([
      'java',
      'collections',
      'concurrency',
      'persistence',
      'databases',
      'http',
      'system-design',
      'algorithms-data-structures',
    ]);
    expect(TOPIC_DOMAIN_KEYS.map((key) => TOPIC_DOMAIN_LABELS[key])).toEqual([
      'Java',
      'Collections',
      'Concurrency',
      'Persistence',
      'Databases',
      'HTTP',
      'System Design',
      'Algorithms and data structures',
    ]);
  });

  it('exposes content kinds in canonical order with display labels', () => {
    expect(TOPIC_KIND_KEYS).toEqual([
      'area',
      'concept',
      'operations',
      'decision-aid',
      'exercise',
      'pattern',
    ]);
    expect(TOPIC_KIND_KEYS.map((key) => TOPIC_KIND_LABELS[key])).toEqual([
      'Area',
      'Concept',
      'Operations',
      'Decision aid',
      'Exercise',
      'Pattern or technique',
    ]);
  });
});
