export type ModelType = 'standard' | 'lowpoly';
export type Quality = 'draft' | 'standard' | '4k';
export type Pose = 'none' | 'a-pose' | 't-pose';
export type JobStatus = 'queued' | 'processing' | 'done' | 'error';
export type ExportFormat = 'glb' | 'obj' | 'fbx' | 'stl' | 'blend';

export interface ViewSlot {
  front: File | null;
  side: File | null;
  back: File | null;
  top: File | null;
}

export interface GenerateSettings {
  modelType: ModelType;
  quality: Quality;
  pose: Pose;
}

export interface FeatureToggles {
  imageEnhancement: boolean;
  pbrTextures: boolean;
  autoRemesh: boolean;
  backgroundRemoval: boolean;
  autoSize: boolean;
}

export interface GenerateRequest {
  settings: GenerateSettings;
  features: FeatureToggles;
  texturePrompt: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  message: string;
  model_url?: string;
  created_at: string;
  credits_used: number;
}

export interface CreditPack {
  id: 'starter' | 'pro' | 'studio';
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular?: boolean;
}
