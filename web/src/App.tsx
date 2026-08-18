import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

// Component layout chính cho người đã đăng nhập
function MainLayout() {
  return (
    <>
      <header style={{ borderBottom: '1px solid var(--trello-border)', padding: 'var(--space-4) var(--space-5)', background: 'var(--trello-white)' }}>
        <h2 style={{ margin: 0, color: 'var(--trello-blue)' }}>Pensa</h2>
      </header>
      <main style={{ padding: 'var(--space-6)' }}>
        <Routes>
          <Route path="/" element={<div className="hero-display">Welcome to Pensa</div>} />
          {/* Các trang /workspaces, /projects sẽ nằm ở đây */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Route công khai cho đăng nhập/đăng ký */}
      <Route path="/signin/*" element={<SignInPage />} />
      <Route path="/signup/*" element={<SignUpPage />} />

      {/* Bắt tất cả các Route khác */}
      <Route path="*" element={
        <>
          <SignedIn>
            <MainLayout />
          </SignedIn>
          <SignedOut>
            {/* Nếu chưa đăng nhập mà đòi truy cập MainLayout, đẩy về /signin */}
            <Navigate to="/signin" replace />
          </SignedOut>
        </>
      } />
    </Routes>
  );
}

export default App;
