import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
  IconBriefcase,
  IconEdit,
  IconLock,
  IconUser,
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '24px',
        height: '124px',
        boxSizing: 'border-box',
        borderBottom: '1px solid var(--trello-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', paddingTop: '16px', paddingLeft: '32px' }}>
          <div
            style={{ 
              width: '60px', 
              height: '60px', 
              fontSize: '28px', 
              fontWeight: 700,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0C66E4, #0055CC)',
              color: '#FFFFFF'
            }}
          >
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--trello-ink)', margin: 0 }}>
                {workspace.name}
              </h3>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--trello-muted)', display: 'flex' }}
                title="Edit workspace details"
              >
                <IconEdit size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--trello-muted)', fontSize: '12px' }}>
              <IconLock size={12} />
              <span>Private</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingLeft: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--trello-ink)' }}>
          <IconUser size={20} />
          <h4 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Your projects</h4>
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
              onClick={() => navigate(`/p/${project.handle}/${project.slug}`)}
              style={{
                height: '110px',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1', /* Darker border */
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}
            >
              {/* Decorative Watermark */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-5px',
                fontSize: '100px',
                fontWeight: 800,
                color: 'rgba(12, 102, 228, 0.04)',
                lineHeight: 1,
                userSelect: 'none',
                zIndex: 0
              }}>
                {project.name.charAt(0).toUpperCase()}
              </div>

              {/* Icon */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#F0F7FF',
                color: '#0C66E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <IconBriefcase size={18} />
              </div>

              {/* Content */}
              <div style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#101828', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.name}
                </div>
              </div>
            </div>
          ))}

          {/* Create Project Card */}
          <div
            onClick={() => {
              setActiveWorkspaceHandle(workspace.handle);
              setCreateProjectOpen(true);
            }}
            style={{
              height: '110px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              color: 'var(--trello-ink)',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.04)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <span>Create new project</span>
          </div>
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
