import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Header } from './Header';
import { CreateWorkspaceModal } from '../modals/CreateWorkspaceModal';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateSectionModal } from '../modals/CreateSectionModal';
import { authSyncedAtom } from '../../state/atoms';
import './layout.css';

export function BoardLayout() {
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

      {/* Body without Sidebar */}
      <div className="app-body">
        <main className="board-main">
          <Outlet />
        </main>
      </div>

      {/* Global Creation Modals */}
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateSectionModal />
    </div>
  );
}

