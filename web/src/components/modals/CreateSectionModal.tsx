import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';
import { createSectionModalOpenAtom } from '../../state/atoms';
import { sectionApi } from '../../api/sectionApi';

export function CreateSectionModal() {
  const [isOpen, setIsOpen] = useAtom(createSectionModalOpenAtom);
  const { projectHandle } = useParams<{ projectHandle: string }>();
  const [name, setName] = useState('');
  
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      if (!projectHandle) throw new Error('No project handle');
      return sectionApi.createSection(projectHandle, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', projectHandle] });
      handleClose();
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectHandle) return;
    createMutation.mutate({ name: name.trim() });
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Create Section</div>
          <button className="modal-close-btn" onClick={handleClose}>
            <IconX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '32px' }}>
            <label htmlFor="sectionName" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#292a2e', marginBottom: '8px' }}>
              Section name
            </label>
            <input
              id="sectionName"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. To Do, In Progress, Done"
              autoFocus
              required
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button 
              type="button" 
              className="button-secondary" 
              style={{ minHeight: '36px', padding: '0 20px', fontSize: '14px' }}
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button-primary"
              style={{ minHeight: '36px', padding: '0 24px', fontSize: '14px' }}
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? '...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

