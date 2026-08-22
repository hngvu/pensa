import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  IconChevronUp,
  IconChevronDown,
  IconUsers,
  IconSettings,
  IconActivity,
  IconFolder,
  IconSquarePlus2,
} from '@tabler/icons-react';
import {
  sidebarCollapsedAtom,
  activeWorkspaceHandleAtom,
} from '../../state/atoms';
import { workspaceApi } from '../../api/workspaceApi';

export function Sidebar() {
  const { user } = useUser();
  const username = user?.username || user?.id || 'me';

  const [isCollapsed] = useAtom(sidebarCollapsedAtom);
      const [, setActiveWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);

  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // Load workspaces
  const { data: workspacesPage } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceApi.getWorkspaces(),
  });

  const workspaces = workspacesPage?.data || [];
  
  const toggleWorkspaceExpand = (handle: string) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Global Navigation */}
      <div className="sidebar-nav-list">
        <NavLink
          to={`/${username}`}
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconFolder size={16} />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/templates"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconSquarePlus2 size={16} style={{ transform: 'rotate(-90deg)' }} />
          <span>Templates</span>
        </NavLink>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconActivity size={16} />
          <span>Home</span>
        </NavLink>
      </div>

      <div className="sidebar-divider" />

      {/* Workspaces Section */}
      <div className="sidebar-section-header">
        <span>Workspaces</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {workspaces.length === 0 ? (
          <div style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--trello-muted)' }}>
            No workspaces yet.
          </div>
        ) : (
          workspaces.map((ws) => {
            const isExpanded = expandedWorkspaces[ws.handle] !== false; // expanded by default

            return (
              <div key={ws.handle} className="workspace-item">
                <div
                  className="workspace-header-card"
                  onClick={() => {
                    setActiveWorkspaceHandle(ws.handle);
                    toggleWorkspaceExpand(ws.handle);
                  }}
                >
                  <div className="workspace-info">
                    <div className="workspace-badge">{ws.name.charAt(0).toUpperCase()}</div>
                    <span className="workspace-name">{ws.name}</span>
                  </div>
                  <div style={{ color: 'var(--trello-muted)', display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="workspace-sub-items">
                    <NavLink
                      to={`/workspaces/${ws.handle}`}
                      end
                      className={({ isActive }) =>
                        `workspace-sub-item ${isActive || location.pathname === `/workspaces/${ws.handle}` ? 'active' : ''}`
                      }
                    >
                      <IconFolder size={16} />
                      <span>Projects</span>
                    </NavLink>

                    <NavLink
                      to={`/workspaces/${ws.handle}/members`}
                      className={({ isActive }) =>
                        `workspace-sub-item ${isActive ? 'active' : ''}`
                      }
                    >
                      <IconUsers size={16} />
                      <span>Members</span>
                    </NavLink>

                    <NavLink
                      to={`/workspaces/${ws.handle}/settings`}
                      className={({ isActive }) =>
                        `workspace-sub-item ${isActive ? 'active' : ''}`
                      }
                    >
                      <IconSettings size={16} />
                      <span>Settings</span>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
