import type { ScenePackage } from './types';
import { greenhouseScenePackage } from './greenhouse-pack';
import { irrigationScenePackage } from './irrigation-pack';

const fertigationPreview: ScenePackage = {
  key: 'fertigation',
  name: '水肥一体化',
  tagline: '母液配比、通道选择与 EC/pH 闭环（占位）',
  status: 'preview',
  capabilities: [
    { key: 'recipe', label: '配方与母液' },
    { key: 'injection', label: '注入通道' },
    { key: 'flush', label: '冲洗与维护' },
  ],
  cardPalette: [],
  defaultPage: { ...greenhouseScenePackage.defaultPage, id: 'page.fertigation.placeholder', sceneKey: 'fertigation', cards: [] },
  strategyPages: [],
};

const energyPreview: ScenePackage = {
  key: 'energy',
  name: '能耗管理',
  tagline: '支路电能、需量与能效对标（占位）',
  status: 'planned',
  capabilities: [
    { key: 'metering', label: '分项计量' },
    { key: 'demand', label: '需量跟踪' },
    { key: 'benchmark', label: '对标与报表' },
  ],
  cardPalette: [],
  defaultPage: { ...greenhouseScenePackage.defaultPage, id: 'page.energy.placeholder', sceneKey: 'energy', cards: [] },
  strategyPages: [],
};

export const scenePackages: ScenePackage[] = [
  greenhouseScenePackage,
  irrigationScenePackage,
  fertigationPreview,
  energyPreview,
];

export function getScene(key: string): ScenePackage | undefined {
  return scenePackages.find(s => s.key === key);
}
