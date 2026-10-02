export interface TargetSite {
  slug: string;
  name: string;
  url: string;
  category: 'Search Engine' | 'Encyclopedia' | 'Social Media' | 'Education' | 'E-Commerce' | 'Tech News';
  elementsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  description: string;
  themeColor: string;
  mockElements: Array<{
    type: 'nav' | 'header' | 'button' | 'card' | 'input' | 'image' | 'text' | 'ad';
    label: string;
    width: number; // percentage
    height: number; // px
    bg: string;
    text: string;
  }>;
}

export const TARGET_SITES: TargetSite[] = [
  {
    slug: 'google',
    name: 'Google Search Homepage',
    url: 'https://google.com',
    category: 'Search Engine',
    elementsCount: 28,
    difficulty: 'Easy',
    description: 'The iconic clean white search page. Smash the big colorful Google logo, shatter the "I\'m Feeling Lucky" button, and obliterate the search bar into millions of shards.',
    themeColor: '#4285F4',
    mockElements: [
      { type: 'nav', label: 'Gmail · Images · Sign In', width: 95, height: 35, bg: '#1E293B', text: '#94A3B8' },
      { type: 'header', label: 'G o o g l e', width: 60, height: 80, bg: '#0F172A', text: '#38BDF8' },
      { type: 'input', label: '🔍 Search Google or type a URL...', width: 80, height: 48, bg: '#1E293B', text: '#CBD5E1' },
      { type: 'button', label: 'Google Search', width: 35, height: 36, bg: '#334155', text: '#F8FAFC' },
      { type: 'button', label: "I'm Feeling Lucky", width: 35, height: 36, bg: '#334155', text: '#F8FAFC' },
      { type: 'text', label: 'Google offered in: English Español Français Deutsch', width: 70, height: 28, bg: '#0F172A', text: '#64748B' },
      { type: 'nav', label: 'About · Advertising · Business · Privacy · Terms', width: 95, height: 40, bg: '#1E293B', text: '#64748B' },
    ],
  },
  {
    slug: 'wikipedia',
    name: 'Wikipedia Main Page',
    url: 'https://wikipedia.org',
    category: 'Encyclopedia',
    elementsCount: 84,
    difficulty: 'Hard',
    description: 'Dense walls of academic knowledge and multi-column encyclopedia sidebars. Blast away the Featured Article of the Day, TOC links, and reference citations with explosive rockets.',
    themeColor: '#E2E8F0',
    mockElements: [
      { type: 'header', label: 'WIKIPEDIA - The Free Encyclopedia', width: 95, height: 50, bg: '#1E293B', text: '#F8FAFC' },
      { type: 'card', label: "From today's featured article: The Mariana Trench Expedition...", width: 95, height: 90, bg: '#0F172A', text: '#CBD5E1' },
      { type: 'card', label: 'Did you know... that krill bioluminescence is powered by luciferyl compounds?', width: 95, height: 80, bg: '#1E293B', text: '#94A3B8' },
      { type: 'card', label: 'In the news: Space probe reaches deep solar orbit milestone...', width: 95, height: 75, bg: '#0F172A', text: '#CBD5E1' },
      { type: 'nav', label: 'On this day · Community portal · Recent changes · Donate', width: 95, height: 40, bg: '#334155', text: '#38BDF8' },
    ],
  },
  {
    slug: 'school-portal',
    name: 'School / College Student Portal',
    url: 'https://schoolportal.edu',
    category: 'Education',
    elementsCount: 65,
    difficulty: 'Medium',
    description: 'The ultimate student stress-reliever! Demolish upcoming homework deadlines, pop quiz countdowns, overdue tuition balance banners, and strict attendance rosters.',
    themeColor: '#FF4365',
    mockElements: [
      { type: 'header', label: 'STUDENT PORTAL - Academic Dashboard', width: 95, height: 50, bg: '#881337', text: '#FFE4E6' },
      { type: 'card', label: '⚠️ URGENT: Calculus Final Exam Due in 2 Hours (Weight: 40%)', width: 95, height: 60, bg: '#4C0519', text: '#FDA4AF' },
      { type: 'card', label: '📊 Term GPA: 2.14 / 4.00 (Academic Probation Warning)', width: 95, height: 60, bg: '#1E293B', text: '#FCA5A5' },
      { type: 'card', label: '💸 Tuition Due Date: Overdue ($12,450.00 Outstanding)', width: 95, height: 60, bg: '#450A0A', text: '#FECACA' },
      { type: 'button', label: 'Submit Homework #9 (No Late Submissions Allowed)', width: 90, height: 44, bg: '#BE123C', text: '#FFFFFF' },
    ],
  },
  {
    slug: 'reddit',
    name: 'Reddit Feed & Karma Wall',
    url: 'https://reddit.com',
    category: 'Social Media',
    elementsCount: 92,
    difficulty: 'Extreme',
    description: 'Endless upvote buttons, downvote arrows, auto-moderator bots, and controversial debate threads. Unleash the Black Hole or Tactical Nuke to wipe out the whole thread.',
    themeColor: '#FF4500',
    mockElements: [
      { type: 'nav', label: 'r/all · r/popular · r/gaming · r/memes · r/AskReddit', width: 95, height: 40, bg: '#1E293B', text: '#FB923C' },
      { type: 'card', label: '▲ 42.5k ▼ Posted by u/destroyer: What is the most satisfying thing to smash?', width: 95, height: 85, bg: '#0F172A', text: '#F8FAFC' },
      { type: 'ad', label: 'PROMOTED: Tired of your slow internet? Switch to HyperFiber today!', width: 95, height: 60, bg: '#1C1917', text: '#A8A29E' },
      { type: 'card', label: '▲ 18.2k ▼ [Mod Sticky] AutoModerator: Remember to be civil in comments...', width: 95, height: 70, bg: '#0F172A', text: '#CBD5E1' },
      { type: 'button', label: '💬 2,451 Comments · ↗ Share · 🎁 Award', width: 85, height: 35, bg: '#292524', text: '#78716C' },
    ],
  },
  {
    slug: 'hacker-news',
    name: 'Hacker News Frontpage',
    url: 'https://news.ycombinator.com',
    category: 'Tech News',
    elementsCount: 45,
    difficulty: 'Easy',
    description: 'The minimalist orange header and plain-text numbered list. High-speed demolition for tech enthusiasts who want to vaporize startup pitch decks and framework drama.',
    themeColor: '#FF6600',
    mockElements: [
      { type: 'header', label: 'Hacker News | new | past | comments | ask | show | jobs | submit', width: 95, height: 38, bg: '#C2410C', text: '#FFF7ED' },
      { type: 'text', label: '1. Show HN: I built a physics engine that destroys any website in your browser (destroywebsite.com)', width: 95, height: 35, bg: '#0F172A', text: '#F8FAFC' },
      { type: 'text', label: '2. Why rewriting your backend in Rust took 3 years and cost $4M (techblog.io)', width: 95, height: 35, bg: '#1E293B', text: '#E2E8F0' },
      { type: 'text', label: '3. Ask HN: What are your favorite browser anti-stress games?', width: 95, height: 35, bg: '#0F172A', text: '#E2E8F0' },
      { type: 'text', label: '4. Memory safety vulnerabilities dropped 70% in Android 15 (android-developers.googleblog.com)', width: 95, height: 35, bg: '#1E293B', text: '#94A3B8' },
    ],
  },
];
