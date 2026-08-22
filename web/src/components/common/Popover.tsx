import React, { useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';

interface PopoverProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  width?: number | 'fit-content';
  noPadding?: boolean;
  offsetX?: number;
  offsetY?: number;
  borderColor?: string;
}

export function Popover({ title, isOpen, onClose, triggerRef, children, width = 300, noPadding = false, offsetX = 0, offsetY = 8, borderColor = 'none' }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !triggerRef.current) return null;

  const rect = triggerRef.current.getBoundingClientRect();
  const top = rect.bottom + offsetY;
  const left = rect.left + offsetX;

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        backgroundColor: '#ffffff',
        borderRadius: noPadding ? '0' : '8px',
        border: borderColor !== 'none' ? `1px solid ${borderColor}` : 'none',
        boxShadow: '0 8px 12px #091e4224, 0 0 1px #091e424f',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        color: '#172b4d',
        fontSize: '14px',
        overflow: 'hidden'
      }}
    >
      {title && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          height: '40px',
          borderBottom: '1px solid #091e4224',
          position: 'relative'
        }}>
          <div style={{ flex: 1 }} />
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#44546f' }}>{title}</h4>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={onClose}
              style={{ 
                background: 'none', border: 'none', padding: '4px', 
                cursor: 'pointer', color: '#44546f', borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#091e420f'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
      )}
      <div style={{ padding: noPadding ? '0' : '12px' }}>
        {children}
      </div>
    </div>
  );
}
