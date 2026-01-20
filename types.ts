export enum CardType {
  MAGIC = 'MAGIC',
  ENCHANTMENT = 'ENCHANTMENT',
  SEAL = 'SEAL',
  // Barrier moved to Structure, but keeping here if needed for backward compat or instant spells
  BARRIER = 'BARRIER', 
}

export enum StructureType {
  ALTAR = 'ALTAR',
  BARRIER = 'BARRIER',
}

export enum ElementType {
  FIRE = 'FIRE',
  WATER = 'WATER',
  EARTH = 'EARTH',
  WIND = 'WIND',
  DARK = 'DARK',         // Replaces NEUTRAL
  ANCESTRAL = 'ANCESTRAL',
  TECNO = 'TECNO',
  DIVINE = 'DIVINE',
}

export enum CastTier {
  WEAK = 'WEAK',
  GOOD = 'GOOD',
  PERFECT = 'PERFECT',
}

export enum TargetType {
  PLAYER = 'PLAYER',
  FIELD = 'FIELD',
  OPPONENT = 'OPPONENT',
}

export enum AppMode {
  MENU = 'MENU',
  POWER_CARD = 'POWER_CARD',
  RUNE = 'RUNE',
  ARTEFACT = 'ARTEFACT',
  STRUCTURE = 'STRUCTURE', // Renamed from ALTAR
  SANCTUARY = 'SANCTUARY',
  IMAGE_CROPPER = 'IMAGE_CROPPER',
}

export type Language = 'pt-BR' | 'en-US';

export interface StatusEffect {
  id: string;
  name: string;
  level: number;
  chips: number;
}

export interface CastConfig {
  damage?: number;
  duration?: number;
  description: string;
  targets: TargetType[];
  effects: StatusEffect[];
  successRate?: number;
  barrierHealth?: number;
}

export interface CardData {
  id: string;
  name: string;
  type: CardType;
  element: ElementType;
  manaCost: number;
  cooldown: number;
  range: number;
  baseDescription: string;
  imageUrl?: string;
  imageOpacity: number;
  contentOpacity: number;
  noBackground: boolean;
  isCounter: boolean; // New Field
  
  castWeak: CastConfig;
  castGood: CastConfig;
  castPerfect: CastConfig;
}

export interface RuneData {
  id: string;
  name: string;
  activationEffect: string;
  continuousEffect: string;
  imageUrl?: string;
  imageOpacity: number;
  noBackground: boolean;
}

export interface ArtefactData {
  id: string;
  name: string;
  effect: string;
  cooldown: number;
  imageUrl?: string;
  imageOpacity: number;
  noBackground: boolean;
}

export interface StructureData { // Renamed from AltarData
  id: string;
  name: string;
  type: StructureType; // New Field
  description: string;
  manaCost: number; // New Field
  cooldown: number; // New Field
  element: ElementType; // New Field (replacing implicit logic)
  
  durability: number;
  
  resistanceElement: ElementType;
  resistanceLevel: number;
  
  // Specific to Altar usually, but Structure generic
  runicElement?: ElementType; 
  continuousEffect: string;
  
  // New Touch Effect
  touchEffectElement?: ElementType;
  touchEffectValue?: number;

  imageUrl?: string;
  imageOpacity: number;
  noBackground: boolean;
  isCounter: boolean; // New Field
}

export const DEFAULT_CAST_CONFIG: CastConfig = {
  description: '',
  targets: [],
  effects: [],
  damage: 0,
  duration: 0,
};