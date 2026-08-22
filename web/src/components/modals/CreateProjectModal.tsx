import { useState } from 'react';
import { useAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';
import { createProjectModalOpenAtom, activeWorkspaceHandleAtom } from '../../state/atoms';
import { projectApi } from '../../api/projectApi';
import { workspaceApi } from '../../api/workspaceApi';

export function CreateProjectModal() {
  const [isOpen, setIsOpen] = useAtom(createProjectModalOpenAtom);
  const [activeWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);
  const [workspaceHandle, setWorkspaceHandle] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Load workspaces for selection dropdown
  const { data: workspacesPage } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceApi.getWorkspaces(),
    enabled: isOpen,
  });

  const workspaces = workspacesPage?.data || [];
  const selectedWorkspace = workspaceHandle || activeWorkspaceHandle || (workspaces[0]?.handle ?? '');

  const createMutation = useMutation({
    mutationFn: ({ wsHandle, payload }: { wsHandle: string; payload: { name: string; description?: string } }) =>
      projectApi.createProject(wsHandle, payload),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects', selectedWorkspace] });
      setIsOpen(false);
      setName('');
      setDescription('');
      setError('');
      navigate(`/p/${newProject.handle}/${newProject.slug}`);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || 'Failed to create project');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace) {
      setError('Please select or create a workspace first');
      return;
    }
    if (!name.trim()) {
      setError('Project title is required');
      return;
    }
    createMutation.mutate({
      wsHandle: selectedWorkspace,
      payload: { name: name.trim(), description: description.trim() || undefined },
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create Project</div>
          <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
            <IconX size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FFEBE6', color: '#DE350B', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#292a2e', marginBottom: '8px' }}>
              Project Title <span style={{ color: 'var(--trello-red)' }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Marketing Campaign"
              autoFocus
              required
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#292a2e', marginBottom: '8px' }}>
              Workspace
            </label>
            <select
              className="input"
              value={selectedWorkspace}
              onChange={(e) => setWorkspaceHandle(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {workspaces.length === 0 ? (
                <option value="">No workspaces available</option>
              ) : (
                workspaces.map((ws) => (
                  <option key={ws.handle} value={ws.handle}>
                    {ws.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#292a2e', marginBottom: '8px' }}>
              Description <span style={{ color: 'var(--trello-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              className="input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button
              type="button"
              className="button-secondary"
              style={{ minHeight: '36px', padding: '0 20px', fontSize: '14px' }}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              style={{ minHeight: '36px', padding: '0 24px', fontSize: '14px' }}
              disabled={createMutation.isPending || !selectedWorkspace}
            >
              {createMutation.isPending ? '...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
