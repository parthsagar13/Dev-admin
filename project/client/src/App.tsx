import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { UserAuthProvider } from '@/context/UserAuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserProtectedRoute } from '@/components/UserProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LandingPage } from '@/pages/LandingPage';
import { TemplatesPage } from '@/pages/TemplatesPage';
import { TemplateDetailsPage } from '@/pages/TemplateDetailsPage';
import { PreviewPage } from '@/pages/PreviewPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { SuccessPage } from '@/pages/SuccessPage';
import { PaymentFailedPage } from '@/pages/PaymentFailedPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UserDashboardPage } from '@/pages/user/UserDashboardPage';
import { DownloadsPage } from '@/pages/user/DownloadsPage';
import { PurchasesPage } from '@/pages/user/PurchasesPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminTemplates } from '@/pages/admin/AdminTemplates';
import { UploadTemplate } from '@/pages/admin/UploadTemplate';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminPayments } from '@/pages/admin/AdminPayments';
import { AdminDownloads } from '@/pages/admin/AdminDownloads';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:slug" element={<TemplateDetailsPage />} />
            <Route path="/preview/:slug" element={<PreviewPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />

            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<UserProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/dashboard/downloads" element={<DownloadsPage />} />
              <Route path="/dashboard/purchases" element={<PurchasesPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="templates" element={<AdminTemplates />} />
                <Route path="templates/upload" element={<UploadTemplate />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="downloads" element={<AdminDownloads />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
