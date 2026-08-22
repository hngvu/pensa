import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconCircleCheckFilled, IconCircle, IconGripVertical } from '@tabler/icons-react';
import type { Item } from '../../types';

interface ItemCardProps {
  item: Item;
  onItemClick: (item: Item) => void;
  onToggleComplete: (e: React.MouseEvent, item: Item) => void;
  isDraggingOverlay?: boolean;
  dragHandleProps?: any;
}

export const ItemCard = React.forwardRef<HTMLDivElement, ItemCardProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ item, onItemClick, onToggleComplete, isDraggingOverlay, dragHandleProps, style, ...props }, ref) => {
    
    const cardStyle = {
      ...style,
      background: '#ffffff', 
      borderRadius: '8px', 
      padding: '8px 12px', 
      border: 'none',
      boxShadow: isDraggingOverlay 
        ? '0px 8px 12px -4px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31)' 
        : '0px 1px 1px #091e4240, 0px 0px 1px #091e424f',
      fontSize: '14px',
      color: '#172b4d',
      cursor: isDraggingOverlay ? 'grabbing' : 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      minHeight: '36px',
      touchAction: 'none',
      transform: isDraggingOverlay && !style?.transform ? 'scale(1.02)' : style?.transform,
    };

    return (
      <div 
        ref={ref}
        style={cardStyle}
        className="board-item-card"
        onClick={() => onItemClick(item)}
        {...props}
      >
        {/* Labels */}
        {item.labels && item.labels.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '4px' }}>
            {item.labels.map(label => (
              <div key={label.id} style={{
                backgroundColor: label.backgroundColor,
                height: '8px',
                minWidth: '40px',
                borderRadius: '4px'
              }} title={label.name} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', paddingRight: '28px' }}>
          {/* Checkbox Icon Container */}
          <div className={`item-checkbox-container ${item.isCompleted ? 'completed-icon' : ''}`}>
            <button 
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: item.isCompleted ? '#1f845a' : '#8590a2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}
              onClick={(e) => onToggleComplete(e, item)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {item.isCompleted ? <IconCircleCheckFilled size={16} /> : <IconCircle size={16} stroke={1.5} />}
            </button>
          </div>

          {/* Item Title */}
          <div style={{ 
            flex: 1,
            lineHeight: '20px', 
            wordBreak: 'break-word',
            textAlign: 'left',
            color: '#172b4d'
          }}>
            {item.title}
          </div>
        </div>

        {/* Grip Icon (Centered Vertically Right) */}
        <button
          className="item-action-icon item-edit-btn"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '6px',
            background: '#f4f5f7',
            border: 'none',
            padding: '4px',
            cursor: isDraggingOverlay ? 'grabbing' : 'grab',
            color: '#44546f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
          onClick={(e) => e.stopPropagation()}
          {...dragHandleProps}
        >
          <IconGripVertical size={16} />
        </button>
      </div>
    );
  }
);

interface SortableItemProps {
  item: Item;
  onItemClick: (item: Item) => void;
  onToggleComplete: (e: React.MouseEvent, item: Item) => void;
}

export function SortableItem({ item, onItemClick, onToggleComplete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.handle, data: { type: 'Item', item } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={{
          ...style,
          background: '#091e420f', 
          borderRadius: '8px', 
          border: '2px dashed #091e4224',
          minHeight: '36px',
          height: '100%',
          opacity: 0.5
        }}
      />
    );
  }

  return (
    <ItemCard
      ref={setNodeRef}
      item={item}
      onItemClick={onItemClick}
      onToggleComplete={onToggleComplete}
      style={style}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}
