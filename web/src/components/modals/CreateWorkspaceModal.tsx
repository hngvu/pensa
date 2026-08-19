import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconX, IconLock, IconWorld, IconChevronDown } from '@tabler/icons-react';
import { createWorkspaceModalOpenAtom, activeWorkspaceHandleAtom } from '../../state/atoms';
import { workspaceApi } from '../../api/workspaceApi';

export function CreateWorkspaceModal() {
  const [isOpen, setIsOpen] = useAtom(createWorkspaceModalOpenAtom);
  const [, setActiveWorkspaceHandle] = useAtom(activeWorkspaceHandleAtom);
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
  const [error, setError] = useState('');
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const visibilityRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (visibilityRef.current && !visibilityRef.current.contains(event.target as Node)) {
        setIsVisibilityOpen(false);
      }
    }
    if (isVisibilityOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisibilityOpen]);

  const createMutation = useMutation({
    mutationFn: workspaceApi.createWorkspace,
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setActiveWorkspaceHandle(newWorkspace.handle);
      setIsOpen(false);
      setName('');
      setVisibility('PRIVATE');
      setError('');
      setIsVisibilityOpen(false);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || 'Failed to create workspace');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }
    createMutation.mutate({ name: name.trim(), visibility });
  };

  const visibilityOptions = [
    {
      value: 'PRIVATE',
      label: 'Private',
      description: 'Only workspace members can see this workspace. Admins must explicitly invite people to join.',
      icon: <IconLock size={20} />
    },
    {
      value: 'PUBLIC',
      label: 'Public',
      description: 'Anyone on the internet can see this workspace. Only workspace members can edit.',
      icon: <IconWorld size={20} />
    }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create Workspace</div>
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
              Workspace name
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="AlphaB Co."
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#292a2e', marginBottom: '8px' }}>
              Visibility
            </label>
            <div ref={visibilityRef} style={{ position: 'relative' }}>
              <div
                className="input"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
              >
                <span>{visibilityOptions.find(o => o.value === visibility)?.label}</span>
                <IconChevronDown size={16} style={{ color: 'var(--trello-muted)' }} />
              </div>

              {isVisibilityOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  background: '#fff',
                  border: '1px solid var(--trello-border)',
                  borderRadius: '4px',
                  boxShadow: 'var(--shadow-card)',
                  marginTop: '4px',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  {visibilityOptions.map((option, index) => (
                    <div
                      key={option.value}
                      onClick={() => { setVisibility(option.value as 'PRIVATE'|'PUBLIC'); setIsVisibilityOpen(false); }}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: visibility === option.value ? '#E9F2FF' : 'transparent',
                        borderBottom: index === visibilityOptions.length - 1 ? 'none' : '1px solid var(--trello-border)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = visibility === option.value ? '#E9F2FF' : 'var(--trello-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = visibility === option.value ? '#E9F2FF' : 'transparent'}
                    >
                      <div style={{ color: visibility === option.value ? 'var(--trello-blue)' : 'var(--trello-ink)', paddingTop: '2px' }}>
                        {option.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: visibility === option.value ? 'var(--trello-blue)' : 'var(--trello-ink)', marginBottom: '4px' }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: '12px', color: visibility === option.value ? 'var(--trello-blue)' : 'var(--trello-muted)', lineHeight: 1.4 }}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? '...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
