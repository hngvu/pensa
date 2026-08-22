import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../../api/projectApi';
import { sectionApi } from '../../api/sectionApi';
import { itemApi } from '../../api/itemApi';
import { ItemDetailModal } from '../../components/modals/ItemDetailModal';
import type { Item } from '../../types';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableItem, ItemCard } from '../../components/board/SortableItem';
import { generateRank } from '../../utils/rank';
import {
  IconLayoutKanban,
  IconChevronDown,
  IconPlug,
  IconBolt,
  IconFilter,
  IconUserPlus,
  IconDots,
  IconPlus,
  IconX,
} from '@tabler/icons-react';

export default function ProjectBoardPage() {
  const { projectHandle: projectHandleParam, itemHandle } = useParams<{ projectHandle?: string, itemHandle?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // If we only have itemHandle (URL is /i/:itemHandle), fetch the item to find the projectHandle
  const { data: routeItem } = useQuery({
    queryKey: ['item-route', itemHandle],
    queryFn: () => itemApi.getItem(itemHandle!),
    enabled: !projectHandleParam && !!itemHandle,
  });

  const projectHandle = projectHandleParam || routeItem?.projectHandle;

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', projectHandle],
    queryFn: () => projectApi.getProject(projectHandle!),
    enabled: !!projectHandle,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['sections', projectHandle],
    queryFn: () => sectionApi.getSections(projectHandle!),
    enabled: !!projectHandle,
  });

  const { data: items } = useQuery({
    queryKey: ['items', projectHandle],
    queryFn: () => itemApi.getItemsByProject(projectHandle!),
    enabled: !!projectHandle,
  });

  const [creatingItemForSection, setCreatingItemForSection] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [boardItems, setBoardItems] = useState<Item[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Ref to prevent useEffect from overriding optimistic state during/after drag
  const isDraggingRef = React.useRef(false);

  useEffect(() => {
    if (items && !isDraggingRef.current) {
      setBoardItems(items);
    }
  }, [items]);


  // Editing Section State
  const [editingSectionHandle, setEditingSectionHandle] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');

  const updateSectionMutation = useMutation({
    mutationFn: (payload: { handle: string, name: string }) => sectionApi.updateSection(payload.handle, { name: payload.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', projectHandle] });
      setEditingSectionHandle(null);
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: (payload: { handle: string, isCompleted: boolean }) => itemApi.updateItem(payload.handle, { isCompleted: payload.isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', projectHandle] });
    }
  });

  const createItemMutation = useMutation({
    mutationFn: (payload: { title: string, sectionHandle: string }) => itemApi.createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', projectHandle] });
      setNewItemTitle('');
      // Keep form open for fast continuous entry
    }
  });

  const handleCreateItem = (e: React.FormEvent, sectionHandle: string) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    createItemMutation.mutate({ title: newItemTitle.trim(), sectionHandle });
  };

  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    isDraggingRef.current = true;
    setActiveId(event.active.id);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveItem = active.data.current?.type === 'Item';
    const isOverItem = over.data.current?.type === 'Item';

    if (!isActiveItem || !isOverItem) return;

    setBoardItems((prev) => {
      const activeIndex = prev.findIndex((i) => i.handle === activeId);
      const overIndex = prev.findIndex((i) => i.handle === overId);

      if (activeIndex === -1 || overIndex === -1) return prev;

      // Cross-section: update the sectionId first, then reorder
      if (prev[activeIndex].sectionId !== prev[overIndex].sectionId) {
        const newItems = prev.map(i => ({ ...i }));
        newItems[activeIndex] = { ...newItems[activeIndex], sectionId: newItems[overIndex].sectionId };
        return arrayMove(newItems, activeIndex, overIndex);
      }

      // Same section: arrayMove handles correct up/down positioning
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  
  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
    duration: 250,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
  };

  const handleDragEnd = (event: any) => {
    isDraggingRef.current = false;
    setActiveId(null);
    document.body.style.cursor = '';
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;

    // boardItems is already correctly ordered & section-assigned by handleDragOver.
    // Just read the final state to compute positions and call API.
    setBoardItems((prev) => {
      const finalItems = prev;
      const targetSectionId = finalItems.find(i => i.handle === activeId)?.sectionId;
      if (!targetSectionId) return prev;

      const sectionItemsList = finalItems.filter(i => i.sectionId === targetSectionId);
      const itemInSectionIdx = sectionItemsList.findIndex(i => i.handle === activeId);
      if (itemInSectionIdx === -1) return prev;

      const prevItem = itemInSectionIdx > 0 ? sectionItemsList[itemInSectionIdx - 1] : null;
      const nextItem = itemInSectionIdx < sectionItemsList.length - 1 ? sectionItemsList[itemInSectionIdx + 1] : null;

      const newPos = generateRank(prevItem?.position, nextItem?.position);

      const updated = finalItems.map(i =>
        i.handle === activeId ? { ...i, position: newPos, sectionId: targetSectionId } : i
      );

      const targetSection = sections.find((s: any) => s.id === targetSectionId);
      const newSectionHandle = targetSection?.handle;

      // Fire-and-forget: UI is already updated optimistically, no need to invalidate after
      itemApi.updateItem(activeId, {
        sectionHandle: newSectionHandle || undefined,
        position: newPos,
      });

      return updated;
    });
  };

  if (isProjectLoading) return <div style={{ padding: '24px', color: 'var(--trello-ink)' }}>Loading board...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#d3d3d3', color: 'var(--trello-ink)' }}>
      {/* Board Sub-Header */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: '#ffffff',
          borderBottom: '1px solid var(--trello-border)',
          flexShrink: 0
        }}
      >
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, padding: '0 12px', lineHeight: '32px', borderRadius: '3px', cursor: 'pointer', color: 'var(--trello-ink)' }} className="board-header-btn-light">
            {project?.name || 'Board'}
          </h1>

          <button style={{
            display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(9, 30, 66, 0.04)', border: 'none',
            color: 'var(--trello-ink)', padding: '0 12px', height: '32px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', fontWeight: 500
          }}>
            <IconLayoutKanban size={16} />
            <IconChevronDown size={16} />
          </button>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0C66E4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
            HH
          </div>
          <button className="board-icon-btn-light"><IconPlug size={18} /></button>
          <button className="board-icon-btn-light"><IconBolt size={18} /></button>
          <button className="board-icon-btn-light"><IconFilter size={18} /></button>
          <div style={{ width: '1px', height: '16px', background: 'var(--trello-border)', margin: '0 4px' }} />
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(9, 30, 66, 0.04)', border: 'none',
            color: 'var(--trello-ink)', padding: '0 12px', height: '32px', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            marginLeft: '4px'
          }}>
            <IconUserPlus size={16} />
            <span>Share</span>
          </button>
          <button className="board-icon-btn-light"><IconDots size={18} /></button>
        </div>
      </div>

      {/* Board Canvas */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div style={{ flex: 1, position: 'relative', overflowX: 'auto', overflowY: 'hidden', padding: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', height: '100%', alignItems: 'flex-start' }}>

          {/* Render Existing Sections */}
          {sections.map(section => {
            const sectionItems = (boardItems || []).filter(item => item.sectionId === section.id);
            return (
              <div key={section.id} style={{
                width: '272px',
                flexShrink: 0,
                background: '#f1f2f4',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
                boxShadow: '0 1px 1px rgba(9, 30, 66, 0.25)'
              }}>
                {/* Section Header */}
                <div style={{
                  padding: '12px 12px 8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#172b4d',
                  minHeight: '44px'
                }}>
                  {editingSectionHandle === section.handle ? (
                    <input
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      onBlur={() => {
                        if (editingSectionName.trim() && editingSectionName !== section.name) {
                          updateSectionMutation.mutate({ handle: section.handle, name: editingSectionName.trim() });
                        } else {
                          setEditingSectionHandle(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                        if (e.key === 'Escape') {
                          setEditingSectionHandle(null);
                        }
                      }}
                      autoFocus
                      style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        padding: '4px 8px',
                        marginLeft: '-8px',
                        border: '2px solid #388bff',
                        borderRadius: '4px',
                        outline: 'none',
                        width: '100%',
                        color: '#172b4d',
                        fontFamily: 'inherit'
                      }}
                    />
                  ) : (
                    <div
                      style={{ fontWeight: 600, fontSize: '14px', cursor: 'pointer', flex: 1 }}
                      onClick={() => {
                        setEditingSectionHandle(section.handle);
                        setEditingSectionName(section.name);
                      }}
                    >
                      {section.name}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#44546f', fontWeight: 500 }}>
                      {sectionItems.length > 0 ? sectionItems.length : ''}
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#44546f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '4px' }}>
                      <IconDots size={16} />
                    </button>
                  </div>
                </div>

                {/* Items Container (Scrollable) */}
                <SortableContext items={sectionItems.map(i => i.handle)} strategy={verticalListSortingStrategy}>
                  <div style={{
                    padding: '2px 8px 4px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    overflowY: 'auto',
                    flex: creatingItemForSection === section.handle ? undefined : 1,
                    marginBottom: creatingItemForSection === section.handle ? '8px' : 0
                  }}>
                    {sectionItems.map(item => (
                      <SortableItem 
                        key={item.handle} 
                        item={item} 
                        onItemClick={(i) => navigate(`/i/${i.handle}/${i.slug}`)} 
                        onToggleComplete={(e, i) => { 
                          e.stopPropagation(); 
                          updateItemMutation.mutate({ handle: i.handle, isCompleted: !i.isCompleted }); 
                        }} 
                      />
                    ))}
                  </div>
                </SortableContext>

                {/* Add Item Footer or Form */}
                {creatingItemForSection === section.handle ? (
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <form onSubmit={(e) => handleCreateItem(e, section.handle)}>
                      <textarea
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        placeholder="Enter a title for this item..."
                        autoFocus
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(9, 30, 66, 0.1)',
                          boxShadow: '0 1px 1px rgba(9, 30, 66, 0.25)',
                          fontSize: '14px',
                          color: '#172b4d',
                          resize: 'none',
                          marginBottom: '8px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCreateItem(e as any, section.handle);
                          }
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="submit"
                          className="button-primary"
                          disabled={!newItemTitle.trim() || createItemMutation.isPending}
                          style={{ padding: '6px 12px', fontSize: '14px', height: '32px' }}
                        >
                          {createItemMutation.isPending ? '...' : 'Add item'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCreatingItemForSection(null);
                            setNewItemTitle('');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--trello-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.08)'; e.currentTarget.style.color = '#172b4d'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--trello-muted)'; }}
                        >
                          <IconX size={20} />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={() => {
                        setCreatingItemForSection(section.handle);
                        setNewItemTitle('');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#44546f',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(9, 30, 66, 0.08)'; e.currentTarget.style.color = '#172b4d'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#44546f'; }}
                    >
                      <IconPlus size={16} />
                      Add an item
                    </button>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeId ? (
              <ItemCard 
                item={boardItems.find(i => i.handle === activeId)!} 
                onItemClick={() => {}} 
                onToggleComplete={() => {}} 
                isDraggingOverlay={true} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      {itemHandle && <ItemDetailModal boardProjectHandle={projectHandle} />}
    </div>
  );
}
