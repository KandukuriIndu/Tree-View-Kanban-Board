import React, { useState } from 'react';
import TreeView from './components/TreeView/TreeView';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import './App.css';

type Tab = 'tree' | 'kanban';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('kanban');

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo">
            <span>FE</span>
          </div>
          <div className="app-title-group">
            <h1 className="app-title">Frontend Developer Test</h1>
            <p className="app-subtitle">React + TypeScript · Tree View &amp; Kanban Board</p>
          </div>
        </div>
        <nav className="app-tabs">
          <button
            className={`app-tab ${activeTab === 'tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tree')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="3" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="11" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M7 4v3.5M7 7.5L3 8.5M7 7.5L11 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Tree View
          </button>
          <button
            className={`app-tab ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="3.5" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="5.25" y="1" width="3.5" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="9.5" y="1" width="3.5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            Kanban Board
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className={`app-panel ${activeTab === 'tree' ? 'active' : ''}`}>
          <TreeView />
        </div>
        <div className={`app-panel ${activeTab === 'kanban' ? 'active' : ''}`}>
          <KanbanBoard />
        </div>
      </main>

      <footer className="app-footer">
        <span>Built with React + TypeScript · Drag &amp; Drop with HTML5 DnD API · Lazy Loading with async simulation</span>
      </footer>
    </div>
  );
};

export default App;
