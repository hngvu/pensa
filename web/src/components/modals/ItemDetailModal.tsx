import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IconX, IconAlignJustified, IconChevronDown, IconLayoutKanban,
  IconCircle, IconCircleCheckFilled, IconPlus, IconTag, IconClock, IconCheckbox, IconUserPlus, IconMessageCircle, IconPaperclip, IconList, IconH1, IconLink, IconPhoto, IconBold, IconItalic, IconH2, IconH3, IconTypography, IconMoodPlus
} from '@tabler/icons-react';
import { itemApi } from '../../api/itemApi';
import { labelApi } from '../../api/labelApi';
import { commentApi } from '../../api/commentApi';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Popover } from '../common/Popover';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format } from 'date-fns';

function DescriptionEditor({ initialContent, onSave, onCancel, placeholder = 'Add a more detailed description...' }: { initialContent: string, onSave: (content: string) => void, onCancel: () => void, placeholder?: string }) {
  const extensions = useMemo(() => [
    StarterKit,
    Placeholder.configure({
      placeholder: placeholder,
    }),
    Link.configure({
      openOnClick: false,
    }),
    Image,
  ], [placeholder]);

  const editor = useEditor({
    extensions: extensions,
    content: initialContent,
    autofocus: 'end',
  });

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const updateTick = () => setTick(t => t + 1);
    editor.on('transaction', updateTick);
    editor.on('selectionUpdate', updateTick);
    return () => {
      editor.off('transaction', updateTick);
      editor.off('selectionUpdate', updateTick);
    };
  }, [editor]);

  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false);
  const linkBtnRef = useRef<HTMLButtonElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  if (!editor) return null;

  const getCurrentStyleLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Normal text';
  };

  const btnFmtStyle: React.CSSProperties = {
    color: '#44546f', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', padding: '4px', borderRadius: '3px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ border: '1px solid #0c66e4', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #091e4224', display: 'flex', gap: '8px', backgroundColor: '#f1f2f4', alignItems: 'center' }}>
           <button
             ref={styleBtnRef}
             onClick={() => setIsStyleMenuOpen(true)}
             style={{ ...btnFmtStyle, padding: '4px 8px', gap: '4px', fontSize: '13px', fontWeight: 500 }}
           >
             {getCurrentStyleLabel()} <IconChevronDown size={14} />
           </button>
           <div style={{ width: '1px', height: '16px', background: '#091e4224', margin: '0 4px' }} />
           <button onClick={() => editor.chain().focus().toggleBold().run()} style={{ ...btnFmtStyle, color: editor.isActive('bold') ? '#0c66e4' : '#44546f', backgroundColor: editor.isActive('bold') ? '#e9f2ff' : 'transparent' }}><IconBold size={18} /></button>
           <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...btnFmtStyle, color: editor.isActive('italic') ? '#0c66e4' : '#44546f', backgroundColor: editor.isActive('italic') ? '#e9f2ff' : 'transparent' }}><IconItalic size={18} /></button>
           <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ ...btnFmtStyle, color: editor.isActive('bulletList') ? '#0c66e4' : '#44546f', backgroundColor: editor.isActive('bulletList') ? '#e9f2ff' : 'transparent' }}><IconList size={18} /></button>
           <div style={{ width: '1px', height: '16px', background: '#091e4224', margin: '0 4px' }} />
            <button ref={linkBtnRef} onClick={() => {
              const { view, state } = editor;
              const { from, to } = view.state.selection;
              const text = state.doc.textBetween(from, to, ' ');
              setLinkText(text);
              setLinkUrl(editor.getAttributes('link').href || '');
              setIsLinkMenuOpen(true);
            }} style={{ ...btnFmtStyle, color: editor.isActive('link') ? '#0c66e4' : '#44546f', backgroundColor: editor.isActive('link') ? '#e9f2ff' : 'transparent' }}><IconLink size={18} /></button>
           <button onClick={() => {
             const url = window.prompt('Image URL:');
             if (url) editor.chain().focus().setImage({ src: url }).run();
           }} style={btnFmtStyle}><IconPhoto size={18} /></button>
        </div>
        <div style={{ padding: '12px', minHeight: '120px', fontSize: '14px', backgroundColor: '#ffffff' }}>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onSave(editor.getHTML())} style={{ background: '#0c66e4', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>Save</button>
        <button onClick={onCancel} style={{ background: 'none', color: '#172b4d', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e420f'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Cancel</button>
      </div>

      <Popover isOpen={isStyleMenuOpen} onClose={() => setIsStyleMenuOpen(false)} triggerRef={styleBtnRef} width="fit-content" noPadding offsetX={-13} offsetY={9} borderColor="#dbdddb">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => { editor.chain().focus().setParagraph().run(); setIsStyleMenuOpen(false); }}
            style={{ padding: '12px 16px', textAlign: 'left', border: 'none', borderBottom: '1px solid #091e4224', background: editor.isActive('paragraph') && !editor.isActive('heading') ? '#e9f2ff' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: editor.isActive('paragraph') && !editor.isActive('heading') ? '#0c66e4' : '#172b4d', borderRadius: 0, whiteSpace: 'nowrap', paddingRight: '24px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = editor.isActive('paragraph') && !editor.isActive('heading') ? '#e9f2ff' : '#091e420f'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = editor.isActive('paragraph') && !editor.isActive('heading') ? '#e9f2ff' : 'transparent'}
          >
            <IconTypography size={18}/> Normal text
          </button>
          <button
            onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setIsStyleMenuOpen(false); }}
            style={{ padding: '12px 16px', textAlign: 'left', border: 'none', borderBottom: '1px solid #091e4224', background: editor.isActive('heading', { level: 1 }) ? '#e9f2ff' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: editor.isActive('heading', { level: 1 }) ? '#0c66e4' : '#172b4d', borderRadius: 0, whiteSpace: 'nowrap', paddingRight: '24px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 1 }) ? '#e9f2ff' : '#091e420f'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 1 }) ? '#e9f2ff' : 'transparent'}
          >
            <IconH1 size={18}/> Heading 1
          </button>
          <button
            onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setIsStyleMenuOpen(false); }}
            style={{ padding: '12px 16px', textAlign: 'left', border: 'none', borderBottom: '1px solid #091e4224', background: editor.isActive('heading', { level: 2 }) ? '#e9f2ff' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: editor.isActive('heading', { level: 2 }) ? '#0c66e4' : '#172b4d', borderRadius: 0, whiteSpace: 'nowrap', paddingRight: '24px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 2 }) ? '#e9f2ff' : '#091e420f'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 2 }) ? '#e9f2ff' : 'transparent'}
          >
            <IconH2 size={18}/> Heading 2
          </button>
          <button
            onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setIsStyleMenuOpen(false); }}
            style={{ padding: '12px 16px', textAlign: 'left', border: 'none', background: editor.isActive('heading', { level: 3 }) ? '#e9f2ff' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: editor.isActive('heading', { level: 3 }) ? '#0c66e4' : '#172b4d', borderRadius: 0, whiteSpace: 'nowrap', paddingRight: '24px' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 3 }) ? '#e9f2ff' : '#091e420f'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = editor.isActive('heading', { level: 3 }) ? '#e9f2ff' : 'transparent'}
          >
            <IconH3 size={18}/> Heading 3
          </button>
        </div>
      </Popover>

      <Popover isOpen={isLinkMenuOpen} onClose={() => setIsLinkMenuOpen(false)} triggerRef={linkBtnRef} width={300} offsetX={0} offsetY={8} borderColor="#dbdddb">
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px' }}>
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '8px' }}>Link <span style={{ color: '#c9372c' }}>*</span></div>
          <input 
            type="text" 
            placeholder="Paste a link" 
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #091e4224', borderRadius: '4px', outline: 'none', marginBottom: '16px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} 
            onFocus={e => e.target.style.border = '2px solid #388bff'}
            onBlur={e => e.target.style.border = '1px solid #091e4224'}
          />
          
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '8px' }}>Display text (optional)</div>
          <input 
            type="text" 
            placeholder="Text to display" 
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #091e4224', borderRadius: '4px', outline: 'none', marginBottom: '4px', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} 
            onFocus={e => e.target.style.border = '2px solid #388bff'}
            onBlur={e => e.target.style.border = '1px solid #091e4224'}
          />
          <div style={{ fontSize: '12px', color: '#626f86', marginBottom: '24px' }}>Give this link a title or description</div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button 
              onClick={() => setIsLinkMenuOpen(false)}
              style={{ background: 'none', color: '#44546f', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e420f'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (!linkUrl) return;
                if (linkText) {
                  editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
                } else {
                  editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
                }
                setIsLinkMenuOpen(false);
              }}
              style={{ background: '#0c66e4', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Insert
            </button>
          </div>
        </div>
      </Popover>
    </div>
  );
}

function getContrastTextColor(hexColor: string | null) {
  if (!hexColor) return '#172b4d';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  // Adjusted threshold to 150 for better contrast on mid-tones like Trello's purple
  return yiq >= 150 ? '#172b4d' : '#ffffff';
}

export function ItemDetailModal({ boardProjectHandle }: { boardProjectHandle?: string }) {
  const { projectHandle: projectHandleParam, projectSlug, itemHandle } = useParams<{ projectHandle?: string, projectSlug?: string, itemHandle: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [popoverState, setPopoverState] = useState<string | null>(null);
  const [labelSearch, setLabelSearch] = useState('');
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>('#216e4e');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const labelsBtnRef = useRef<HTMLButtonElement>(null);
  const datesBtnRef = useRef<HTMLButtonElement>(null);
  const attachmentBtnRef = useRef<HTMLButtonElement>(null);

  const btnStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: '#ffffff', border: '1px solid #091e4224',
    padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
    color: '#44546f', fontSize: '14px', fontWeight: 500
  };

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', itemHandle],
    queryFn: () => itemApi.getItem(itemHandle!),
    enabled: !!itemHandle,
  });

  const [titleValue, setTitleValue] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (item && !isEditingTitle) {
      setTitleValue(item.title);
    }
  }, [item, isEditingTitle]);

  const updateItemMutation = useMutation({
    mutationFn: (payload: any) => {
      // payload might be a string (title) or an object (for dates/other fields)
      if (typeof payload === 'string') {
        return itemApi.updateItem(itemHandle!, { title: payload });
      }
      return itemApi.updateItem(payload.handle || itemHandle!, payload);
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(['item', itemHandle], updatedItem);
      // Optional: invalidate board query if needed, but UI usually updates instantly from this
    }
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', itemHandle],
    queryFn: () => commentApi.getCommentsByItem(itemHandle!),
    enabled: !!itemHandle,
  });
  const [isCommentFocused, setIsCommentFocused] = useState(false);

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => commentApi.createComment(itemHandle!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', itemHandle] });
      setIsCommentFocused(false);
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', itemHandle] });
    }
  });

  const resolvedProjectHandle = boardProjectHandle || projectHandleParam || item?.projectHandle;
  const resolvedProjectSlug = projectSlug || item?.projectSlug;

  const { data: projectLabels } = useQuery({
    queryKey: ['labels', resolvedProjectHandle],
    queryFn: () => labelApi.getLabelsByProject(resolvedProjectHandle!),
    enabled: !!resolvedProjectHandle,
  });

  const assignLabelMutation = useMutation({
    mutationFn: (labelId: string) => itemApi.assignLabel(itemHandle!, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', itemHandle] });
      queryClient.invalidateQueries({ queryKey: ['board', resolvedProjectHandle] });
    }
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId: string) => itemApi.removeLabel(itemHandle!, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', itemHandle] });
      queryClient.invalidateQueries({ queryKey: ['board', resolvedProjectHandle] });
    }
  });

  const createLabelMutation = useMutation({
    mutationFn: (payload: { name: string; backgroundColor: string; textColor: string }) =>
      labelApi.createLabel(resolvedProjectHandle!, payload),
    onSuccess: (newLabel) => {
      queryClient.invalidateQueries({ queryKey: ['labels', resolvedProjectHandle] });
      assignLabelMutation.mutate(newLabel.id);
    }
  });

  useEffect(() => {
    if (item && !dateRange) {
      if (item.startAt || item.dueAt) {
        setDateRange({
          from: item.startAt ? new Date(item.startAt) : undefined,
          to: item.dueAt ? new Date(item.dueAt) : undefined,
        });
      }
    }
  }, [item, dateRange]);

  const close = () => {
    navigate(`/p/${resolvedProjectHandle}${resolvedProjectSlug ? `/${resolvedProjectSlug}` : ''}`);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  if (!itemHandle) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} style={{ zIndex: 200, alignItems: 'flex-start', paddingTop: '48px', overflowY: 'auto' }}>
      <div
        ref={modalRef}
        style={{
          width: '1040px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          color: '#172b4d',
          boxShadow: '0 8px 16px -4px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '48px'
        }}
      >
        {isLoading ? (
          <div style={{ padding: '32px' }}>Loading...</div>
        ) : item ? (
          <>
            {/* Top Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #091e4224'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: '#f1f2f4', border: 'none', padding: '4px 8px',
                  borderRadius: '3px', cursor: 'pointer', color: '#172b4d', fontSize: '14px', fontWeight: 500
                }}>
                  {item.sectionId ? 'todo' : 'list'} <IconChevronDown size={16} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#44546f', borderRadius: '3px' }}><IconLayoutKanban size={20} /></button>
                <button style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#44546f', borderRadius: '3px' }}>...</button>
                <button onClick={close} style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#44546f', borderRadius: '3px' }}><IconX size={20} /></button>
              </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', minHeight: '600px' }}>

              {/* Left Column (Main) */}
              <div style={{ flex: '0 0 65%', padding: '24px 32px', backgroundColor: '#ffffff' }}>

                {/* Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  {item.isCompleted ? (
                    <IconCircleCheckFilled size={24} color="#1f845a" />
                  ) : (
                    <IconCircle size={24} stroke={2} color="#44546f" />
                  )}
                  <input
                    value={titleValue}
                    onChange={e => setTitleValue(e.target.value)}
                    onFocus={() => setIsEditingTitle(true)}
                    onBlur={() => {
                      setIsEditingTitle(false);
                      if (titleValue.trim() !== item.title && titleValue.trim() !== '') {
                        updateItemMutation.mutate(titleValue.trim());
                      } else {
                        setTitleValue(item.title);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      if (e.key === 'Escape') {
                        setTitleValue(item.title);
                        setIsEditingTitle(false);
                        e.currentTarget.blur();
                      }
                    }}
                    style={{
                      flex: 1,
                      fontSize: '24px', fontWeight: 600, margin: 0, color: '#172b4d',
                      border: isEditingTitle ? '2px solid #388bff' : '2px solid transparent',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      marginLeft: '-10px',
                      outline: 'none',
                      background: isEditingTitle ? '#ffffff' : 'transparent',
                      cursor: isEditingTitle ? 'text' : 'pointer'
                    }}
                  />
                </div>



                {/* Quick Add Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', paddingLeft: '40px' }}>
                  <button ref={addBtnRef} onClick={() => setPopoverState('add')} style={btnStyle}><IconPlus size={16} /> Add</button>
                  <button ref={labelsBtnRef} onClick={() => setPopoverState('labels')} style={btnStyle}><IconTag size={16} /> Labels</button>
                  <button ref={datesBtnRef} onClick={() => setPopoverState('dates')} style={btnStyle}><IconClock size={16} /> Dates</button>
                  <button style={btnStyle}><IconCheckbox size={16} /> Checklist</button>
                  <button style={btnStyle}><IconUserPlus size={16} /> Members</button>
                  <button ref={attachmentBtnRef} onClick={() => setPopoverState('attachment')} style={btnStyle}><IconPaperclip size={16} /> Attachment</button>
                </div>


                {/* Assigned Labels */}
                {item.labels && item.labels.length > 0 && (
                  <div style={{ paddingLeft: '40px', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '8px' }}>Labels</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {item.labels.map(label => (
                        <div key={label.id} style={{
                          backgroundColor: label.backgroundColor,
                          color: label.textColor,
                          padding: '0 12px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          minWidth: '48px',
                          boxSizing: 'border-box'
                        }} onClick={() => {
                          setPopoverState('labels');
                        }}>
                          {label.name}
                        </div>
                      ))}
                      <button
                        onClick={() => setPopoverState('labels')}
                        style={{
                          height: '32px',
                          width: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#091e420f',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: '#44546f'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
                      >
                        <IconPlus size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Dates */}
                {(item.startAt || item.dueAt) && (
                  <div style={{ paddingLeft: '40px', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '8px' }}>
                      {item.startAt && item.dueAt ? 'Dates' : item.dueAt ? 'Due date' : 'Start date'}
                    </div>
                    <div 
                      onClick={() => setPopoverState('dates')}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#091e420f', border: '1px solid #091e4224', padding: '6px 12px', borderRadius: '4px', width: 'fit-content', color: '#172b4d', fontSize: '14px', cursor: 'pointer' }} 
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'} 
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
                    >
                      <span>
                        {item.startAt && item.dueAt 
                          ? `${format(new Date(item.startAt), "MMM d")} - ${format(new Date(item.dueAt), "MMM d" + (new Date(item.dueAt).getHours() !== 0 ? " HH:mm" : ""))}` 
                          : item.dueAt 
                            ? format(new Date(item.dueAt), "MMM d" + (new Date(item.dueAt).getHours() !== 0 ? " HH:mm" : "")) 
                            : format(new Date(item.startAt!), "MMM d")}
                      </span>
                      <IconChevronDown size={14} />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <IconAlignJustified size={24} color="#44546f" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0', color: '#172b4d' }}>Description</h3>
                    {isEditingDescription ? (
                      <DescriptionEditor
                        initialContent={item.description || ''}
                        onSave={(content) => {
                          updateItemMutation.mutate({
                            handle: item.handle,
                            description: content
                          });
                          setIsEditingDescription(false);
                        }}
                        onCancel={() => setIsEditingDescription(false)}
                      />
                    ) : (
                      <div
                        onClick={() => setIsEditingDescription(true)}
                        style={{
                          border: '1px solid #8c8f97',
                          padding: '12px 16px',
                          borderRadius: '4px',
                          minHeight: '60px',
                          color: item.description ? '#172b4d' : '#44546f',
                          backgroundColor: item.description ? 'transparent' : '#091e420f',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = item.description ? '#091e420f' : '#091e4214'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = item.description ? 'transparent' : '#091e420f'; }}
                        dangerouslySetInnerHTML={{ __html: item.description || 'Add a more detailed description...' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (Sidebar/Activity) */}
              <div style={{ flex: 1, padding: '24px', backgroundColor: '#f1f2f4' }}>

                {/* Comments & Activity Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconMessageCircle size={20} color="#44546f" />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#172b4d' }}>Comments and activity</h3>
                  </div>
                  <button style={{
                    background: '#091e420f', border: 'none', padding: '6px 12px',
                    borderRadius: '4px', cursor: 'pointer', color: '#172b4d', fontSize: '14px', fontWeight: 500
                  }}>
                    Show details
                  </button>
                </div>

                {/* Comment Input */}
                <div style={{ marginBottom: '24px' }}>
                  {!isCommentFocused ? (
                    <div 
                      onClick={() => setIsCommentFocused(true)}
                      style={{ 
                        backgroundColor: '#ffffff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0px 1px 1px #091e4240, 0px 0px 1px #091e424f',
                        padding: '12px 16px', 
                        color: '#44546f', 
                        fontSize: '14px', 
                        cursor: 'pointer' 
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f4f5f7'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      Write a comment...
                    </div>
                  ) : (
                    <DescriptionEditor 
                      initialContent=""
                      placeholder="Write a comment..."
                      onSave={(content) => {
                        // Tiptap empty content is usually <p></p>
                        if (content.trim() && content !== '<p></p>') {
                          createCommentMutation.mutate(content);
                        }
                      }}
                      onCancel={() => setIsCommentFocused(false)}
                    />
                  )}
                </div>

                {/* Activity Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {comments?.map(comment => (
                    <div key={comment.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#09326c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>
                        {comment.authorName?.substring(0, 2).toUpperCase() || 'U'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', color: '#172b4d', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {comment.authorName}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <a href="#" style={{ fontWeight: 400, color: '#0c66e4', fontSize: '12px', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}>{format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}</a>
                          </div>
                        </div>
                        <div 
                          className="tiptap"
                          style={{ background: '#ffffff', border: '1px solid #091e4224', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#172b4d', boxShadow: '0 1px 1px #091e420f' }}
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        <div style={{ fontSize: '12px', color: '#44546f', marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 500 }}>
                          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}><IconMoodPlus size={16} /></span>
                          <span style={{ fontSize: '14px', lineHeight: 1 }}>•</span>
                          <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Edit</span>
                          <span style={{ fontSize: '14px', lineHeight: 1 }}>•</span>
                          <span 
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                              if (confirm('Delete comment?')) {
                                deleteCommentMutation.mutate(comment.id);
                              }
                            }}
                          >Delete</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '32px' }}>Item not found.</div>
        )}
      </div>

      <Popover title="Add to card" isOpen={popoverState === 'add'} onClose={() => setPopoverState(null)} triggerRef={addBtnRef} width={280}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setPopoverState('labels')} style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#172b4d' }}><IconTag size={16}/> Labels</button>
          <button onClick={() => setPopoverState('dates')} style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#172b4d' }}><IconClock size={16}/> Dates</button>
          <button style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#172b4d' }}><IconCheckbox size={16}/> Checklist</button>
          <button style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#172b4d' }}><IconUserPlus size={16}/> Members</button>
          <button onClick={() => setPopoverState('attachment')} style={{ padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#172b4d' }}><IconPaperclip size={16}/> Attachment</button>
        </div>
      </Popover>

      <Popover title={isCreatingLabel ? "Create label" : "Labels"} isOpen={popoverState === 'labels'} onClose={() => { setPopoverState(null); setLabelSearch(''); setIsCreatingLabel(false); }} triggerRef={labelsBtnRef} width={300}>
        {!isCreatingLabel ? (
          <>
            <input
              type="text"
              value={labelSearch}
              onChange={(e) => setLabelSearch(e.target.value)}
              placeholder="Search labels..."
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #091e4224', borderRadius: '4px', marginBottom: '12px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#388bff'} onBlur={(e) => e.target.style.borderColor = '#091e4224'}
            />
            <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '8px' }}>Labels</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projectLabels?.filter(l => l.name.toLowerCase().includes(labelSearch.toLowerCase())).map((label) => {
                const isAssigned = item?.labels?.some(il => il.id === label.id);
                return (
                  <div key={label.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => {
                    if (isAssigned) {
                      removeLabelMutation.mutate(label.id);
                    } else {
                      assignLabelMutation.mutate(label.id);
                    }
                  }}>
                    <input type="checkbox" checked={isAssigned || false} readOnly style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <div style={{ flex: 1, padding: '0 12px', display: 'flex', alignItems: 'center', height: '32px', backgroundColor: label.backgroundColor, color: label.textColor, borderRadius: '4px', fontWeight: 600, fontSize: '14px' }}>
                      {label.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setIsCreatingLabel(true)}
              style={{ width: '100%', padding: '8px', marginTop: '12px', background: '#091e420f', color: '#172b4d', border: '1px solid #091e4224', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
            >
              Create a new label
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '100%', height: '32px', backgroundColor: selectedColor || '#091e420f', color: getContrastTextColor(selectedColor), borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 12px', fontWeight: 600, fontSize: '14px', transition: 'background-color 0.2s, color 0.2s' }}>
                {labelSearch}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '4px' }}>Title</div>
              <input
                type="text"
                value={labelSearch}
                onChange={(e) => setLabelSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #091e4224', borderRadius: '4px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#388bff'} onBlur={(e) => e.target.style.borderColor = '#091e4224'}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '4px' }}>Select a color</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {[
                  '#b7ddb0', '#f5ea92', '#fad29c', '#efb3ab', '#dfc0eb',
                  '#7bc86c', '#f5dd29', '#ffaf3f', '#ef7564', '#cd8de5',
                  '#5aac44', '#e6c60d', '#e79217', '#cf513d', '#a86cc1',
                  '#8bbdd9', '#8fdfeb', '#b3f1d0', '#f9c2e4', '#c1c7d0',
                  '#29cce5', '#00aecc', '#4bce97', '#e774bb', '#97a0af',
                  '#0079bf', '#0098b7', '#216e4e', '#cd5a91', '#5e6c84'
                ].map(color => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ height: '32px', backgroundColor: color, borderRadius: '4px', cursor: 'pointer', border: selectedColor === color ? '2px solid #388bff' : '2px solid transparent' }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  />
                ))}
              </div>
              <button
                onClick={() => setSelectedColor(null)}
                style={{ width: '100%', padding: '8px', marginTop: '12px', background: 'transparent', color: '#172b4d', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e420f'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ✕ Remove color
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => {
                  createLabelMutation.mutate({ name: labelSearch.trim(), backgroundColor: selectedColor || '#091e420f', textColor: getContrastTextColor(selectedColor) });
                  setLabelSearch('');
                  setIsCreatingLabel(false);
                }}
                style={{ flex: 1, padding: '6px 12px', background: '#0c66e4', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#0052cc'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#0c66e4'}
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingLabel(false)}
                style={{ flex: 1, padding: '6px 12px', background: '#091e420f', color: '#172b4d', border: '1px solid #091e4224', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Popover>

      <Popover title="Dates" isOpen={popoverState === 'dates'} onClose={() => setPopoverState(null)} triggerRef={datesBtnRef} width={340}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="trello-calendar"
              styles={{
                root: { '--rdp-accent-color': '#0c66e4', '--rdp-background-color': '#e9f2ff', margin: 0 } as React.CSSProperties
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '4px' }}>Start date</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="checkbox" checked={!!dateRange?.from} onChange={(e) => {
                setDateRange(prev => {
                  if (e.target.checked) return { from: new Date(), to: prev?.to };
                  return { from: undefined, to: prev?.to };
                });
              }} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <input type="text" value={dateRange?.from ? format(dateRange.from, 'dd/MM/yyyy') : ''} readOnly placeholder="DD/MM/YYYY" style={{ width: '120px', padding: '6px 8px', border: '1px solid #091e4224', borderRadius: '4px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#388bff'} onBlur={(e) => e.target.style.borderColor = '#091e4224'} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '12px', color: '#44546f', marginBottom: '4px' }}>Due date</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="checkbox" checked={!!dateRange?.to} onChange={(e) => {
                setDateRange(prev => {
                  if (e.target.checked) {
                    const nextDay = new Date();
                    nextDay.setDate(nextDay.getDate() + 1);
                    return { from: prev?.from, to: nextDay };
                  }
                  return { from: prev?.from, to: undefined };
                });
              }} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <input type="text" value={dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : ''} readOnly placeholder="DD/MM/YYYY" style={{ width: '120px', padding: '6px 8px', border: '1px solid #091e4224', borderRadius: '4px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#388bff'} onBlur={(e) => e.target.style.borderColor = '#091e4224'} />
              <select
                value={dateRange?.to ? format(dateRange.to, 'h:mm a').toUpperCase() : '12:00 PM'}
                onChange={(e) => {
                  if (!dateRange?.to) return;
                  const timeString = e.target.value;
                  const [time, ampm] = timeString.split(' ');
                  let [hours, minutes] = time.split(':').map(Number);
                  if (ampm === 'PM' && hours < 12) hours += 12;
                  if (ampm === 'AM' && hours === 12) hours = 0;
                  const newTo = new Date(dateRange.to);
                  newTo.setHours(hours, minutes, 0, 0);
                  setDateRange(prev => (prev ? { ...prev, to: newTo } : { from: undefined, to: newTo }));
                }}
                style={{ width: 'fit-content', padding: '6px 8px', border: '1px solid #091e4224', borderRadius: '4px', background: '#fff', outline: 'none', cursor: 'pointer' }}
                onFocus={(e) => e.target.style.borderColor = '#388bff'} onBlur={(e) => e.target.style.borderColor = '#091e4224'}
              >
                {Array.from({ length: 48 }).map((_, i) => {
                  const hours = Math.floor(i / 2);
                  const minutes = i % 2 === 0 ? '00' : '30';
                  const ampm = hours < 12 ? 'AM' : 'PM';
                  const h = hours % 12 === 0 ? 12 : hours % 12;
                  const timeString = `${h}:${minutes} ${ampm}`;
                  return <option key={timeString} value={timeString}>{timeString}</option>;
                })}
              </select>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!item) return;
              updateItemMutation.mutate({
                handle: item.handle,
                startAt: dateRange?.from ? dateRange.from.toISOString() : undefined,
                dueAt: dateRange?.to ? dateRange.to.toISOString() : undefined
              });
              setPopoverState(null);
            }}
            style={{ width: '100%', padding: '8px', background: '#0c66e4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#0052cc'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#0c66e4'}
          >Save</button>
          <button 
            onClick={() => {
              setDateRange(undefined);
              if (!item) return;
              updateItemMutation.mutate({
                handle: item.handle,
                startAt: null,
                dueAt: null
              });
              setPopoverState(null);
            }}
            style={{ width: '100%', padding: '8px', background: '#091e420f', color: '#172b4d', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
          >Remove</button>
        </div>
      </Popover>

      <Popover title="Attach" isOpen={popoverState === 'attachment'} onClose={() => setPopoverState(null)} triggerRef={attachmentBtnRef} width={320}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, color: '#172b4d', marginBottom: '8px' }}>Attach a file from your computer</div>
            <div style={{ fontSize: '12px', color: '#44546f', marginBottom: '12px' }}>You can also drag and drop files to upload them.</div>
            <button style={{ padding: '8px 12px', background: '#091e420f', border: '1px solid #8c8f97', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#091e4214'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#091e420f'}
            >Choose a file</button>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #091e4224', margin: '0' }} />
          <div>
            <div style={{ fontWeight: 600, color: '#172b4d', marginBottom: '8px' }}>Search or paste a link <span style={{color: 'red'}}>*</span></div>
            <input type="text" placeholder="Find recent links or paste a new link" style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f97', borderRadius: '4px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }} onFocus={e => e.target.style.border = '2px solid #388bff'} onBlur={e => e.target.style.border = '1px solid #8c8f97'} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#172b4d', marginBottom: '8px' }}>Display text (optional)</div>
            <input type="text" placeholder="Text to display" style={{ width: '100%', padding: '8px 12px', border: '1px solid #8c8f97', borderRadius: '4px', marginBottom: '4px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }} onFocus={e => e.target.style.border = '2px solid #388bff'} onBlur={e => e.target.style.border = '1px solid #8c8f97'} />
            <div style={{ fontSize: '12px', color: '#44546f' }}>Give this link a title or description</div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
