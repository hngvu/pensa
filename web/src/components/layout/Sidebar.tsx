import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  IconPlus,
  IconChevronDown,
  IconChevronRight,
  IconUsers,
  IconSettings,
  IconActivity,
  IconFolder,
} from '@tabler/icons-react';
import {
  sidebarCollapsedAtom,
  createWorkspaceModalOpenAtom,
  createProjectModalOpenAtom,
  activeWorkspaceHandleAtom,
} from '../../state/atoms';
import { workspaceApi } from '../../api/workspaceApi';
import { projectApi } from '../../api/projectApi';
import type { Project } from '../../types';

export function Sidebar() {
  const [isCollapsed] = useAtom(sidebarCollapsedAtom);
  const [, setCreateWorkspaceOpen] = useAtom(createWorkspaceModalOpenAtom);
  const [, setCreateProjectOpen] = useAtom(createProjectModalOpenAtom);
  const [activeWorkspaceHandle, setActiveWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);

  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // Load workspaces
  const { data: workspacesPage } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceApi.getWorkspaces(),
  });

  const workspaces = workspacesPage?.data || [];
  const currentWorkspaceHandle = activeWorkspaceHandle || workspaces[0]?.handle;

  // Load projects for active workspace
  const { data: projectsPage } = useQuery({
    queryKey: ['projects', currentWorkspaceHandle],
    queryFn: () =>
      currentWorkspaceHandle
        ? projectApi.getProjectsByWorkspace(currentWorkspaceHandle)
        : Promise.resolve({ content: [] } as any),
    enabled: !!currentWorkspaceHandle,
  });

  const projects = projectsPage?.data || [];

  const toggleWorkspaceExpand = (handle: string) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [handle]: prev[handle] === undefined ? false : !prev[handle],
    }));
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Global Navigation */}
      <div className="sidebar-nav-list">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconFolder size={18} />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/home"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconActivity size={18} />
          <span>Home</span>
        </NavLink>
      </div>

      <div className="sidebar-divider" />

      {/* Workspaces Section */}
      <div className="sidebar-section-header">
        <span>Workspaces</span>
        <button
          className="add-btn"
          onClick={() => setCreateWorkspaceOpen(true)}
          title="Create Workspace"
        >
          <IconPlus size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {workspaces.length === 0 ? (
          <div style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--trello-muted)' }}>
            No workspaces yet. Click + to add one.
          </div>
        ) : (
          workspaces.map((ws) => {
            const isExpanded = expandedWorkspaces[ws.handle] !== false; // expanded by default
            const isActiveWorkspace = ws.handle === currentWorkspaceHandle;

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
                    {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="workspace-sub-items">
                    <NavLink
                      to={`/workspaces/${ws.handle}`}
                      className={({ isActive }) =>
                        `workspace-sub-item ${isActive || location.pathname === `/workspaces/${ws.handle}` ? 'active' : ''}`
                      }
                    >
                      <IconFolder size={16} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>Projects</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveWorkspaceHandle(ws.handle);
                            setCreateProjectOpen(true);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--trello-muted)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            borderRadius: '3px',
                          }}
                          title="Create Project"
                        >
                          <IconPlus size={14} />
                        </button>
                      </div>
                    </NavLink>

                    {/* Show nested project list if this is the active workspace */}
                    {isActiveWorkspace && projects.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '2px 0 4px 0' }}>
                        {projects.map((project: Project) => (
                          <NavLink
                            key={project.handle}
                            to={`/projects/${project.handle}`}
                            className={({ isActive }) =>
                              `workspace-sub-item ${isActive ? 'active' : ''}`
                            }
                            style={{ paddingLeft: '44px' }}
                          >
                            <IconFolder size={16} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {project.name}
                            </span>
                          </NavLink>
                        ))}
                      </div>
                    )}

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
