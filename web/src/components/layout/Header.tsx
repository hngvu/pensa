import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { UserButton } from '@clerk/clerk-react';
import {
  IconSearch,
  IconBell,
  IconHelp,
  IconFolder,
  IconBriefcase,
} from '@tabler/icons-react';
import {
  createWorkspaceModalOpenAtom,
  createProjectModalOpenAtom,
} from '../../state/atoms';

export function Header() {
  const [, setCreateWorkspaceOpen] = useAtom(createWorkspaceModalOpenAtom);
  const [, setCreateProjectOpen] = useAtom(createProjectModalOpenAtom);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header" ref={dropdownRef}>
      {/* Left section: Clean Brand Logo */}
      <div className="header-left">
        <Link to="/" className="brand-link" style={{ padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/logo.svg"
            alt="Pensa"
            style={{ height: '22px', width: '22px', display: 'block' }}
          />
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#172B4D', letterSpacing: '-0.2px' }}>
            Pensa
          </span>
        </Link>
      </div>

      {/* Middle section: Search Bar with Create button directly on the right */}
      <div className="header-center" style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '650px' }}>
        <div className="header-search" style={{ flex: 1 }}>
          <IconSearch size={16} className="search-icon" style={{ color: '#44546F', left: '10px' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            style={{
              height: '32px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #8c8f97',
              borderRadius: '4px',
              paddingLeft: '32px',
              fontSize: '14px',
              color: '#172B4D',
            }}
          />
        </div>

        {/* Create Button next to Search */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            style={{
              height: '32px',
              backgroundColor: '#0C66E4',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0055CC')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0C66E4')}
          >
            Create
          </button>

          {isCreateOpen && (
            <div className="dropdown-menu" style={{ width: 260, right: 0, left: 'auto', marginTop: '6px' }}>
              <button
                className="dropdown-item"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreateProjectOpen(true);
                }}
              >
                <IconFolder size={18} color="var(--trello-blue)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Create Project</div>
                  <div className="dropdown-item-desc">
                    A project is made up of task cards in sections.
                  </div>
                </div>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsCreateOpen(false);
                  setCreateWorkspaceOpen(true);
                }}
              >
                <IconBriefcase size={18} color="var(--trello-purple)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Create Workspace</div>
                  <div className="dropdown-item-desc">
                    A group of projects and people for your organization.
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right section: Notifications, Help & User Profile */}
      <div className="header-right">
        <button className="icon-btn" title="Notifications">
          <IconBell size={18} />
        </button>

        <button className="icon-btn" title="Help & Info">
          <IconHelp size={18} />
        </button>

        {/* Clerk User Profile Button */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: { width: 30, height: 30 },
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
