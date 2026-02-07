export type TattooStyle =
  | "minimal"
  | "tribal"
  | "japanese"
  | "watercolor"
  | "blackwork"
  | "geometric"
  | "realism"
  | "traditional";

export type GenerationQuality = "draft" | "hd";

export type AIModel = "gemini" | "openai-dalle3" | "openai-gpt-image";

export type BodyPart =
  | "arm"
  | "forearm"
  | "back"
  | "chest"
  | "leg"
  | "ankle"
  | "shoulder"
  | "neck"
  | "hand"
  | "other";

export interface TattooPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface GenerateRequest {
  prompt: string;
  style: TattooStyle;
  quality: GenerationQuality;
}

export interface GenerateResponse {
  imageUrl: string;
  generationId: string;
}

export interface UploadResponse {
  url: string;
  uploadId: string;
}

export interface PreviewRequest {
  uploadId: string;
  designId: string;
  position: TattooPosition;
}

export interface PreviewResponse {
  previewUrl: string;
}
