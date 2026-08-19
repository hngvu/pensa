import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import { AppLayout } from './components/layout/AppLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import { AuthSync } from './components/auth/AuthSync';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/signin/*" element={<SignInPage />} />
      <Route path="/signup/*" element={<SignUpPage />} />

      {/* Authenticated Application with Master Layout */}
      <Route
        path="*"
        element={
          <>
            <SignedIn>
              <AuthSync />
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/workspaces/:workspaceHandle" element={<DashboardPage />} />
                  <Route
                    path="/projects/:projectHandle"
                    element={
                      <div style={{ padding: '24px' }}>
                        <h2>Project Board</h2>
                        <p style={{ color: 'var(--trello-muted)' }}>Kanban board is coming in the next step!</p>
                      </div>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </SignedIn>
            <SignedOut>
              <Navigate to="/signin" replace />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;
