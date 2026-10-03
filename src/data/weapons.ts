export interface Weapon {
  delay: number;
  blastRadius: number;
  speed: number;
  pellets: number;
  clusters: number;
  id: string;
  name: string;
  icon: string;
  tagline: string;
  category: 'Projectile' | 'Energy' | 'Explosive' | 'Superweapon' | 'Elemental';
  shortcut: string;
  radius: string;
  rateOfFire: string;
  recoil: string;
  description: string;
  secretUnlock: string;
  color: string;
  unlockedByDefault: boolean;
}

export const WEAPONS: Weapon[] = [
  {
    "id": "pistol",
    "name": "Pistol",
    "icon": "🔫",
    "tagline": "Small circular shots for precise cuts.",
    "category": "Projectile",
    "shortcut": "1",
    "radius": "15 px",
    "rateOfFire": "140 ms",
    "recoil": "Light",
    "description": "Small circular shots for precise cuts.",
    "secretUnlock": "Available by default",
    "color": "#ffd7a7",
    "unlockedByDefault": true,
    "delay": 0.14,
    "blastRadius": 15,
    "speed": 2300,
    "pellets": 1,
    "clusters": 0
  },
  {
    "id": "uzi",
    "name": "Uzi",
    "icon": "🔫",
    "tagline": "Hold fire for a rapid stream of small jagged holes.",
    "category": "Projectile",
    "shortcut": "2",
    "radius": "18 px",
    "rateOfFire": "70 ms",
    "recoil": "Light",
    "description": "Hold fire for a rapid stream of small jagged holes.",
    "secretUnlock": "Available by default",
    "color": "#a4f1cd",
    "unlockedByDefault": true,
    "delay": 0.07,
    "blastRadius": 18,
    "speed": 2600,
    "pellets": 1,
    "clusters": 0
  },
  {
    "id": "shotgun",
    "name": "Shotgun",
    "icon": "💥",
    "tagline": "Seven pellets spread around the crosshair with each shot.",
    "category": "Projectile",
    "shortcut": "3",
    "radius": "18 px per pellet",
    "rateOfFire": "480 ms",
    "recoil": "Strong",
    "description": "Seven pellets spread around the crosshair with each shot.",
    "secretUnlock": "Available by default",
    "color": "#ffd2ac",
    "unlockedByDefault": true,
    "delay": 0.48,
    "blastRadius": 18,
    "speed": 2200,
    "pellets": 7,
    "clusters": 0
  },
  {
    "id": "gatling",
    "name": "Gatling",
    "icon": "🌪️",
    "tagline": "Hold fire to shred a wider area with rapid shots.",
    "category": "Projectile",
    "shortcut": "4",
    "radius": "23 px",
    "rateOfFire": "45 ms",
    "recoil": "Light",
    "description": "Hold fire to shred a wider area with rapid shots.",
    "secretUnlock": "Available by default",
    "color": "#ffb598",
    "unlockedByDefault": true,
    "delay": 0.045,
    "blastRadius": 23,
    "speed": 2900,
    "pellets": 1,
    "clusters": 0
  },
  {
    "id": "magic",
    "name": "Laser Beam",
    "icon": "⭐",
    "tagline": "Cuts a line between the player and the crosshair.",
    "category": "Energy",
    "shortcut": "5",
    "radius": "18 px beam / 19 px tip",
    "rateOfFire": "90 ms",
    "recoil": "None",
    "description": "Cuts a line between the player and the crosshair.",
    "secretUnlock": "Available by default",
    "color": "#c4aaff",
    "unlockedByDefault": true,
    "delay": 0.09,
    "blastRadius": 19,
    "speed": 0,
    "pellets": 1,
    "clusters": 0
  },
  {
    "id": "rocket",
    "name": "Rocket",
    "icon": "🚀",
    "tagline": "A traveling rocket explodes at the aimed position.",
    "category": "Explosive",
    "shortcut": "6",
    "radius": "88 px",
    "rateOfFire": "650 ms",
    "recoil": "Light",
    "description": "A traveling rocket explodes at the aimed position.",
    "secretUnlock": "Available by default",
    "color": "#ffc795",
    "unlockedByDefault": true,
    "delay": 0.65,
    "blastRadius": 88,
    "speed": 850,
    "pellets": 1,
    "clusters": 0
  },
  {
    "id": "nuke",
    "name": "Cannon",
    "icon": "☢️",
    "tagline": "A large blast followed by five nearby explosions.",
    "category": "Superweapon",
    "shortcut": "7",
    "radius": "140 px + cluster",
    "rateOfFire": "1.8 sec",
    "recoil": "Light",
    "description": "A large blast followed by five nearby explosions.",
    "secretUnlock": "Available by default",
    "color": "#f6a5cc",
    "unlockedByDefault": true,
    "delay": 1.8,
    "blastRadius": 140,
    "speed": 1100,
    "pellets": 1,
    "clusters": 5
  },
  {
    "id": "grenade",
    "name": "Grenade",
    "icon": "🍓",
    "tagline": "An arcing grenade explodes at its position after a short flight.",
    "category": "Explosive",
    "shortcut": "8 / G / Right click",
    "radius": "92 px",
    "rateOfFire": "450 ms",
    "recoil": "None",
    "description": "An arcing grenade explodes at its position after a short flight.",
    "secretUnlock": "Available by default",
    "color": "#efa9c2",
    "unlockedByDefault": true,
    "delay": 0.45,
    "blastRadius": 92,
    "speed": 0,
    "pellets": 1,
    "clusters": 0
  }
];
