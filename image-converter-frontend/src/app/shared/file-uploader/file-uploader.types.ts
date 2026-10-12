export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  thumbUrl?: string;
  type: string;
  missing?: boolean;
}
