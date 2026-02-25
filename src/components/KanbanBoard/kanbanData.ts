import { KanbanColumn } from '../../types';

let idSeq = 200;
export function genCardId() { return `card-${++idSeq}`; }

export const STORAGE_KEY = 'kanban_board_data';

export const initialKanbanData: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'Todo',
    color: '#5b52f0',
    cards: [
      { id: 'card-1', title: 'Create initial project plan', description: 'Define milestones and deliverables', columnId: 'todo' },
      { id: 'card-2', title: 'Design landing page', description: 'Wireframes and mockups for homepage', columnId: 'todo' },
      { id: 'card-3', title: 'Review codebase structure', description: 'Audit existing code and identify tech debt', columnId: 'todo' },
      { id: 'card-9', title: 'Write unit tests for auth module', description: 'Cover edge cases with Jest', columnId: 'todo' },
      { id: 'card-10', title: 'Set up CI/CD pipeline', description: 'GitHub Actions + Docker', columnId: 'todo' },
      { id: 'card-11', title: 'Create component library', description: 'Storybook with Figma tokens', columnId: 'todo' },
      { id: 'card-12', title: 'SEO audit and improvements', description: 'Meta tags, sitemap, robots.txt', columnId: 'todo' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    color: '#d97706',
    cards: [
      { id: 'card-4', title: 'Implement authentication', description: 'OAuth + JWT flow with refresh tokens', columnId: 'inprogress' },
      { id: 'card-5', title: 'Set up database schema', description: 'ERD and migrations with Prisma', columnId: 'inprogress' },
      { id: 'card-6', title: 'Fix navbar bugs', description: 'Mobile responsiveness issues on iOS Safari', columnId: 'inprogress' },
      { id: 'card-13', title: 'Build dashboard analytics', description: 'Charts using Recharts + real API data', columnId: 'inprogress' },
      { id: 'card-14', title: 'Integrate payment gateway', description: 'Stripe checkout + webhook handlers', columnId: 'inprogress' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#16a34a',
    cards: [
      { id: 'card-7', title: 'Organize project repository', description: 'Folder structure and naming conventions finalized', columnId: 'done' },
      { id: 'card-8', title: 'Write API documentation', description: 'Swagger + README complete', columnId: 'done' },
      { id: 'card-15', title: 'Set up linting & formatting', description: 'ESLint + Prettier + Husky hooks', columnId: 'done' },
      { id: 'card-16', title: 'Deploy staging environment', description: 'Vercel preview deployments configured', columnId: 'done' },
      { id: 'card-17', title: 'Accessibility audit', description: 'WCAG 2.1 AA compliance checked', columnId: 'done' },
    ],
  },
];

// Load from localStorage, fall back to initial data
export function loadFromStorage(): KanbanColumn[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as KanbanColumn[];
      // Sync idSeq to avoid ID collisions with saved cards
      parsed.forEach(col => col.cards.forEach(card => {
        const num = parseInt(card.id.replace('card-', ''), 10);
        if (!isNaN(num) && num >= idSeq) idSeq = num + 1;
      }));
      return parsed;
    }
  } catch {
    // ignore corrupt data
  }
  return initialKanbanData;
}

// Save to localStorage
export function saveToStorage(columns: KanbanColumn[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}
