import React, { useState, useEffect, useRef } from 'react';
import { getStudentRecordKey } from '../utils/studentRecord';

const CommandPalette = ({ students, onSelectStudent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const closePalette = () => {
    setIsOpen(false);
    setSearch('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          setIsOpen(true);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = search.trim() === '' ? [] : students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '10vh' }} onClick={closePalette}>
      <div 
        className="command-palette futuristic-modal" 
        onClick={e => e.stopPropagation()}
        style={{ width: '600px', maxWidth: '90%', background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', marginRight: '1rem', color: 'var(--text-secondary)' }}>🔍</span>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search students... (Ctrl+K to close)" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', outline: 'none' }}
          />
        </div>
        {results.length > 0 && (
          <div style={{ padding: '0.5rem' }}>
            {results.map(student => (
              <div 
                key={getStudentRecordKey(student)} 
                onClick={() => {
                  onSelectStudent(student);
                  closePalette();
                }}
                style={{ padding: '1rem', cursor: 'pointer', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{student.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.id} • {student.subject}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{student.marks}%</div>
              </div>
            ))}
          </div>
        )}
        {search.trim() !== '' && results.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No students found matching "{search}"
          </div>
        )}
        <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Search by Name or ID</span>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
