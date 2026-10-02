export interface ChangelogItem {
  version: string;
  date: string;
  badge: string;
  highlights: string[];
}

export const CHANGELOG: ChangelogItem[] = [
  {
    version: 'v2.4.0',
    date: 'October 2026',
    badge: 'Latest Major Release',
    highlights: [
      'Added Singularity Vortex Generator (Black Hole physics with rotational gravity pull).',
      'Engine upgrade to Astro 5 SSG with 0 KB JavaScript base payload.',
      'Implemented Web Audio API real-time sound synthesizer (no heavy external audio downloads).',
      'Added high-definition damage counter & screen shake intensity slider.',
    ],
  },
  {
    version: 'v2.2.0',
    date: 'September 2026',
    badge: 'Weapons Update',
    highlights: [
      'Introduced Tactical Quantum Nuke with siren countdown and whiteout flash effect.',
      'Added Dragonfire Flamethrower with lingering ash particles.',
      'Full touch and pinch gesture support for mobile Chrome and Safari players.',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'August 2026',
    badge: 'Engine Overhaul',
    highlights: [
      'Rewrote 2D physics engine from scratch with sub-pixel particle velocity.',
      'Added draggable universal Bookmarklet tool for destroying live third-party websites.',
      'Added Preset Target Zone (Google, Wikipedia, Reddit, School Portal, Hacker News).',
    ],
  },
];
