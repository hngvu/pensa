import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CreateWorkspaceModal } from '../modals/CreateWorkspaceModal';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { authSyncedAtom } from '../../state/atoms';
import './layout.css';

export function AppLayout() {
  const [isSynced] = useAtom(authSyncedAtom);

  if (!isSynced) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--trello-muted)' }}>
        Syncing user data...
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header />

      {/* Body with Sidebar & Content */}
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>

      {/* Global Creation Modals */}
      <CreateWorkspaceModal />
      <CreateProjectModal />
    </div>
  );
}
