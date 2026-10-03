export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: 'What is Destroy Website and how does it work?',
    a: 'Destroy Website (destroywebsite.com) is a free browser-based physics destruction sandbox and anti-stress arcade game. It allows players to input any web address or select preset targets (like Google, Wikipedia, or School Portals) and smash, burn, or vaporize their layout elements into pixel particles using weapons like lasers, shotguns, and rockets. Everything runs locally in your browser canvas with character movement, projectile effects, and falling particles.',
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
    a: 'Choose pistol (1), Uzi (2), shotgun (3), Gatling (4), laser beam (5), rocket (6), cannon (7), or grenade (8). G or right click throws a grenade without switching weapons. All are available from the start.',
  },
  {
    q: 'How can I destroy any custom URL not listed in the presets?',
    a: 'Simply type or paste any valid URL (e.g., https://example.com) into the input box at the top of the homepage and click "Load & Destroy". Alternatively, drag our free Bookmarklet button to your browser bookmarks bar to launch the floating weapon HUD on any webpage on the internet with a single click.',
  },
  {
    q: 'Can I play Destroy Website on Chromebooks, iPads, and smartphones?',
    a: 'Destroy Website is built on Astro 5 and lightweight HTML5 Canvas with a responsive layout; the current game controls are designed for a keyboard and mouse. It works smoothly on Google Chrome, Safari, Firefox, Edge, Chromebooks, Android phones, and iOS tablets without requiring any downloads or browser extensions.',
  },
  {
    q: 'How do I use the cannon?',
    a: 'Press 7 or select Cannon in the weapon dock, then click to fire a cluster of blasts. It has a cooldown and destroys the area around your aim point. Progress reflects actual removed page area.',
  },
];
