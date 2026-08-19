import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  IconPlus,
  IconBriefcase,
} from '@tabler/icons-react';
import { workspaceApi } from '../../api/workspaceApi';
import { projectApi } from '../../api/projectApi';
import { createProjectModalOpenAtom, activeWorkspaceHandleAtom } from '../../state/atoms';
import type { Workspace } from '../../types';

function WorkspaceSection({ workspace }: { workspace: Workspace }) {
  const navigate = useNavigate();
  const [, setCreateProjectOpen] = useAtom(createProjectModalOpenAtom);
  const [, setActiveWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);

  const { data: projectsPage } = useQuery({
    queryKey: ['projects', workspace.handle],
    queryFn: () => projectApi.getProjectsByWorkspace(workspace.handle),
  });

  const projects = projectsPage?.data || [];

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="workspace-badge"
            style={{ width: '32px', height: '32px', fontSize: '15px', borderRadius: '6px' }}
          >
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--trello-ink)', margin: 0 }}>
              {workspace.name}
            </h3>
            {workspace.description && (
              <p style={{ fontSize: '13px', color: 'var(--trello-muted)', margin: '2px 0 0 0' }}>
                {workspace.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Project Cards */}
        {projects.map((project) => (
          <div
            key={project.handle}
            onClick={() => navigate(`/projects/${project.handle}`)}
            style={{
              height: '100px',
              borderRadius: '8px',
              padding: '12px 14px',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #0C66E4, #0055CC)',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-soft)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.2px' }}>
              {project.name}
            </div>
            {project.description && (
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {project.description}
              </div>
            )}
          </div>
        ))}

        {/* Create Project Card */}
        <div
          onClick={() => {
            setActiveWorkspaceHandle(workspace.handle);
            setCreateProjectOpen(true);
          }}
          style={{
            height: '100px',
            borderRadius: '8px',
            padding: '12px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'rgba(9, 30, 66, 0.04)',
            color: 'var(--trello-ink)',
            fontSize: '14px',
            fontWeight: 500,
            border: '2px dashed var(--trello-border)',
            transition: 'background-color 0.15s, border-color 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.08)';
            e.currentTarget.style.borderColor = 'var(--trello-blue)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.04)';
            e.currentTarget.style.borderColor = 'var(--trello-border)';
          }}
        >
          <IconPlus size={18} color="var(--trello-muted)" />
          <span>Create new project</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: workspacesPage, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceApi.getWorkspaces(),
  });

  const workspaces = workspacesPage?.data || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner / Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--trello-ink)', marginBottom: '8px' }}>
          Your Projects
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--trello-muted)' }}>
          Manage your team workspaces and project workflows.
        </p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--trello-muted)' }}>
          Loading workspaces and projects...
        </div>
      ) : workspaces.length === 0 ? (
        <div
          style={{
            background: 'var(--trello-white)',
            border: '1px solid var(--trello-border)',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--trello-blue-soft)',
              color: 'var(--trello-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <IconBriefcase size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            No Workspaces Found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--trello-muted)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            Get started by creating your first workspace to organize projects and collaborate with teammates.
          </p>
        </div>
      ) : (
        workspaces.map((ws) => <WorkspaceSection key={ws.handle} workspace={ws} />)
      )}
    </div>
  );
}
