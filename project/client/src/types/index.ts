export interface Template {
  _id: string;
  title: string;
  slug: string;
  framework: string;
  category: string;
  price: number;
  currency?: string;
  isFree: boolean;
  thumbnailUrl: string;
  sourceZipUrl: string;
  zipPath?: string;
  previewUrl: string;
  previewIndexPath?: string;
  downloads: number;
  purchaseCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  admin?: Admin;
  user?: User;
  role?: string;
}

export interface DashboardStats {
  totalTemplates: number;
  latestTemplates: Template[];
}

export interface CommerceDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  totalDownloads: number;
  templatesSold: number;
  customers: number;
  totalTemplates: number;
  latestTemplates: Template[];
}

export interface DownloadResponse {
  downloadUrl: string;
  expiresIn: number;
  downloadCount: number;
  slug: string;
}

export interface OrderItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoiceNumber?: string;
  paymentMethod?: string;
  createdAt: string;
  template: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    price: number;
    isFree: boolean;
    currency?: string;
  } | null;
}

export interface DownloadItem {
  id: string;
  template: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    framework: string;
    category: string;
    price: number;
    isFree: boolean;
    currency?: string;
  } | null;
  downloadCount: number;
  lastDownloadAt?: string;
  purchasedAt: string;
  invoiceNumber?: string;
}

export interface RazorpayOrderResponse {
  free?: boolean;
  keyId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  dbOrderId?: string;
  template?: { id: string; title: string; slug: string };
  order?: { id: string; invoiceNumber: string; status: string };
  message?: string;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}
