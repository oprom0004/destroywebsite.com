export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: 'What is Destroy Website and how does it work?',
    a: 'Destroy Website (destroywebsite.com) is a free browser-based physics destruction sandbox and anti-stress arcade game. It allows players to input any web address or select preset targets (like Google, Wikipedia, or School Portals) and smash, burn, or vaporize their layout elements into pixel particles using weapons like lasers, sledgehammers, and rockets. Everything runs locally in your browser canvas using 2D rigid-body simulation.',
  },
  {
    q: 'Is using Destroy Website legal and safe?',
    a: 'Yes, 100% legal and completely safe. Destroy Website does NOT perform any hacking, DDoS attacks, or server tampering. It only renders a client-side visual simulation within an isolated HTML5 canvas in your local browser. The actual live target website and its servers remain completely unaffected and untouched.',
  },
  {
    q: 'Does Destroy Website delete or modify the target website\'s real database?',
    a: 'No. The real website, its database, and other visitors are never affected. All explosions, particle effects, and broken UI elements occur entirely in your local temporary browser session. When you refresh or close the tab, nothing has changed on the actual website.',
  },
  {
    q: 'What weapons are available in the game?',
    a: 'Destroy Website features 8 unique destruction tools: Cyber Sledgehammer (melee blunt force), Plasma Laser Beam (continuous cutting), RPG-77 Rocket (wide blast radius), Vulcan Gatling (rapid-fire barrage), Dragonfire Flamethrower (charring thermal burn), Meteor Cataclysm (orbital strike), Singularity Black Hole (gravitational vortex), and the Tactical Quantum Nuke (100% total screen wipeout).',
  },
  {
    q: 'How can I destroy any custom URL not listed in the presets?',
    a: 'Simply type or paste any valid URL (e.g., https://example.com) into the input box at the top of the homepage and click "Load & Destroy". Alternatively, drag our free Bookmarklet button to your browser bookmarks bar to launch the floating weapon HUD on any webpage on the internet with a single click.',
  },
  {
    q: 'Can I play Destroy Website on Chromebooks, iPads, and smartphones?',
    a: 'Yes! Destroy Website is engineered on Astro 5 and lightweight HTML5 Canvas with full responsive touch support. It works smoothly on Google Chrome, Safari, Firefox, Edge, Chromebooks, Android phones, and iOS tablets without requiring any downloads or browser extensions.',
  },
  {
    q: 'How do I unlock the Tactical Quantum Nuke superweapon?',
    a: 'The Tactical Quantum Nuke is unlocked by default in our arcade sandbox for maximum catharsis! You can also trigger an instant orbital wipeout by clicking the ☢️ Nuke icon or pressing the "7" shortcut key on your keyboard.',
  },
];
