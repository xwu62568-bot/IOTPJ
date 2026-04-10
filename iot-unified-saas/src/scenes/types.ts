import type { CardDefinition, PageSchema, StrategyPageSchema } from '../platform/types';

export type SceneStatus = 'active' | 'preview' | 'planned';

export interface SceneCapability {
  key: string;
  label: string;
}

export interface ScenePackage {
  key: string;
  name: string;
  tagline: string;
  status: SceneStatus;
  capabilities: SceneCapability[];
  cardPalette: CardDefinition[];
  defaultPage: PageSchema;
  strategyPages: StrategyPageSchema[];
}
