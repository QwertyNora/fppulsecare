import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { LoginPage } from "@/features/auth/LoginPage";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Patient Features
import { PatientDashboard } from "@/features/patient/dashboard/PatientDashboard";
import { HealthStatsPage } from "@/features/patient/health-stats/HealthStatsPage";
import { MedicationsPage } from "@/features/patient/medications/MedicationsPage";
import { AppointmentsPage } from "@/features/patient/appointments/AppointmentsPage";
import { PatientMessagesPage } from "@/features/patient/messages/PatientMessagesPage";
import { NotesPage } from "@/features/patient/notes/NotesPage";

// Admin Features
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { PatientsListPage } from "@/features/admin/patients/PatientsListPage";
import { PatientDetailPage } from "@/features/admin/patients/PatientDetailPage";
import { CalendarPage } from "@/features/admin/calendar/CalendarPage";
import { MessagesPage } from "@/features/admin/messages/MessagesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Patient Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/health-stats" element={
              <ProtectedRoute requiredRole="patient">
                <HealthStatsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/medications" element={
              <ProtectedRoute requiredRole="patient">
                <MedicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/appointments" element={
              <ProtectedRoute requiredRole="patient">
                <AppointmentsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/messages" element={
              <ProtectedRoute requiredRole="patient">
                <PatientMessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/notes" element={
              <ProtectedRoute requiredRole="patient">
                <NotesPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/patients" element={
              <ProtectedRoute requiredRole="admin">
                <PatientsListPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/patients/:patientId" element={
              <ProtectedRoute requiredRole="admin">
                <PatientDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/calendar" element={
              <ProtectedRoute requiredRole="admin">
                <CalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute requiredRole="admin">
                <MessagesPage />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
