import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import { AppLayout } from './components/layout/AppLayout';
import { BoardLayout } from './components/layout/BoardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectBoardPage from './pages/board/ProjectBoardPage';
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
                  {/* Global Nav */}
                  <Route 
                    path="/" 
                    element={
                      <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Home Feed</h2>
                        <p style={{ color: 'var(--trello-muted)' }}>Activity feed is coming soon!</p>
                      </div>
                    } 
                  />
                  <Route path="/:username" element={<DashboardPage />} />
                  <Route 
                    path="/templates" 
                    element={
                      <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Templates</h2>
                        <p style={{ color: 'var(--trello-muted)' }}>Template gallery is coming soon!</p>
                      </div>
                    } 
                  />

                  {/* Workspace Nav */}
                  <Route path="/w/:workspaceHandle" element={<DashboardPage />} />
                  <Route path="/w/:workspaceHandle/:workspaceSlug" element={<DashboardPage />} />
                  <Route 
                    path="/w/:workspaceHandle/members" 
                    element={
                      <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Workspace Members</h2>
                        <p style={{ color: 'var(--trello-muted)' }}>Member management is coming soon!</p>
                      </div>
                    } 
                  />
                  <Route 
                    path="/w/:workspaceHandle/settings" 
                    element={
                      <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Workspace Settings</h2>
                        <p style={{ color: 'var(--trello-muted)' }}>Workspace configuration is coming soon!</p>
                      </div>
                    } 
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
                
                {/* Project / Board without Sidebar */}
                <Route element={<BoardLayout />}>
                  {/* Base Project Routes */}
                  <Route path="/p/:projectHandle" element={<ProjectBoardPage />} />
                  <Route path="/p/:projectHandle/:projectSlug" element={<ProjectBoardPage />} />
                  
                  {/* Item Routes (Standalone, without project prefix!) */}
                  <Route path="/i/:itemHandle" element={<ProjectBoardPage />} />
                  <Route path="/i/:itemHandle/:itemSlug" element={<ProjectBoardPage />} />
                  
                  {/* Legacy/Nested Item Routes (just in case) */}
                  <Route path="/p/:projectHandle/i/:itemHandle" element={<ProjectBoardPage />} />
                  <Route path="/p/:projectHandle/:projectSlug/i/:itemHandle" element={<ProjectBoardPage />} />
                  <Route path="/p/:projectHandle/i/:itemHandle/:itemSlug" element={<ProjectBoardPage />} />
                  <Route path="/p/:projectHandle/:projectSlug/i/:itemHandle/:itemSlug" element={<ProjectBoardPage />} />
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
