export interface Template {
  _id: string;
  title: string;
  slug: string;
  framework: string;
  category: string;
  price: number;
  isFree: boolean;
  thumbnailUrl: string;
  sourceZipUrl: string;
  previewUrl: string;
  previewIndexPath?: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface DashboardStats {
  totalTemplates: number;
  latestTemplates: Template[];
}

export interface DownloadResponse {
  downloadUrl: string;
  downloads: number;
}
