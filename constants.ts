
import { Boost, CivPower, Heading, GamePhase, MapType, PresetMode, PointUsageMode, Archetype, SynergyRule, MapInfo, MapSize, Resources, GameSpeed } from './types';

export const EPOCHS = [
    { id: 1, name: "Stone Age" },
    { id: 2, name: "Tool Age" },
    { id: 3, name: "Copper Age" },
    { id: 4, name: "Bronze Age" },
    { id: 5, name: "Dark Age" },
    { id: 6, name: "Middle Ages" },
    { id: 7, name: "Renaissance" },
    { id: 8, name: "Imperial Age" },
    { id: 9, name: "Enlightenment Age" },
    { id: 10, name: "Industrial Age" },
    { id: 11, name: "Atomic Age" },
    { id: 12, name: "Information Age" },
    { id: 13, name: "Nano Age" },
    { id: 14, name: "Space Age" },
    { id: 15, name: "Digital Age" },
];

export const MAP_TYPES_INFO: Record<MapType, MapInfo> = {
    'Continental': { id: 'Continental', label: 'Continental', description: 'Large landmasses separated by oceans.', category: 'land', navalSupport: false },
    'Mediterranean': { id: 'Mediterranean', label: 'Mediterranean', description: 'Inland sea surrounded by land.', category: 'mixed', navalSupport: true },
    'Highlands': { id: 'Highlands', label: 'Highlands', description: 'Mountainous terrain with chokepoints.', category: 'land', navalSupport: false },
    'Plains': { id: 'Plains', label: 'Plains', description: 'Open flatlands ideal for cavalry.', category: 'land', navalSupport: false },
    'Large Islands': { id: 'Large Islands', label: 'Large Islands', description: 'Multiple large islands.', category: 'mixed', navalSupport: true },
    'Small Islands': { id: 'Small Islands', label: 'Small Islands', description: 'Archipelago of small islands.', category: 'water', navalSupport: true },
    'Tournament Islands': { id: 'Tournament Islands', label: 'Tournament Islands', description: 'Balanced islands for competitive play.', category: 'water', navalSupport: true },
    'Planets – Earth': { id: 'Planets – Earth', label: 'Planets – Earth', description: 'The homeworld.', category: 'space', navalSupport: false, minEpoch: 14 },
    'Planets – Large': { id: 'Planets – Large', label: 'Planets – Large', description: 'A massive alien world.', category: 'space', navalSupport: false, minEpoch: 14 },
    'Planets – Small': { id: 'Planets – Small', label: 'Planets – Small', description: 'A small rocky planetoid.', category: 'space', navalSupport: false, minEpoch: 14 },
    'Planets – Mars': { id: 'Planets – Mars', label: 'Planets – Mars', description: 'The red planet.', category: 'space', navalSupport: false, minEpoch: 14 },
    'Planets – Satellite': { id: 'Planets – Satellite', label: 'Planets – Satellite', description: 'Orbital station warfare.', category: 'space', navalSupport: false, minEpoch: 14 }
};

export const PRESET_MODES_INFO: Record<PresetMode, { description: string }> = {
    'Casual': { description: 'Focus on flavor and fun over rigid balance.' },
    'Tournament': { description: 'Strict balance rules and no individual rerolls.' },
    'Chaos': { description: 'Highly varied power levels and strange combinations.' },
    'Historical': { description: 'Attempts to match real-world historical archetypes.' }
};

export const POINT_MODES_INFO: Record<PointUsageMode, { description: string }> = {
    'Efficient': { description: 'AI tries to squeeze maximum value from every point.' },
    'Exact': { description: 'AI targets exactly 100 points, even if suboptimal.' },
    'Loose': { description: 'AI prioritizes flavor, potentially leaving points unspent.' }
};

export const MAP_TYPES: MapType[] = Object.keys(MAP_TYPES_INFO) as MapType[];
export const PRESET_MODES: PresetMode[] = Object.keys(PRESET_MODES_INFO) as PresetMode[];
export const POINT_MODES: PointUsageMode[] = Object.keys(POINT_MODES_INFO) as PointUsageMode[];
export const MAP_SIZES: MapSize[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge'];
export const RESOURCES: Resources[] = ['Low', 'Standard', 'High'];
export const GAME_SPEEDS: GameSpeed[] = ['Slow', 'Standard', 'Fast'];

export const ARCHETYPES: Archetype[] = [
    'Random', 'Economic', 'Aggressive', 'Defensive', 'Naval', 'Balanced'
];

export const DEFAULT_NAMES = [
    'Taco', 'Piert', 'DjonLuc', 'Justin', 'Naldo', 'Pash', 'Kuban', "Player 8", "Player 9", "Player 10"
];

// Headings with their inflation costs (Multiple Bonus Cost)
export const HEADINGS: Heading[] = [
    { name: "Civ – Economy", bonusCost: 6, minEpoch: 1 },
    { name: "Civ – Buildings, Walls & Towers", bonusCost: 3, minEpoch: 1 },
    { name: "Civ – General", bonusCost: 0, minEpoch: 1 },
    { name: "Citizens & Fishing Boats", bonusCost: 2, minEpoch: 1 },
    { name: "Infantry – Ranged", bonusCost: 5, minEpoch: 1 },
    { name: "Infantry – Sword / Spear", bonusCost: 3, minEpoch: 1 },
    { name: "Cavalry – Ranged", bonusCost: 4, minEpoch: 3 },
    { name: "Cavalry – Melee", bonusCost: 4, minEpoch: 3 },
    { name: "Siege Weapons & Mobile AA", bonusCost: 2, minEpoch: 3 },
    { name: "Ships", bonusCost: 4, minEpoch: 2 },
    { name: "Tanks", bonusCost: 5, minEpoch: 10 },
    { name: "Aircraft", bonusCost: 5, minEpoch: 10 },
    { name: "Cyber", bonusCost: 6, minEpoch: 13 },
    { name: "Religion", bonusCost: 2, minEpoch: 3 },
];

// Boosts Data - Expanded for Map Filtering
export const BOOSTS: Boost[] = [
    // Civ – Economy
    { name: "20% Farming", baseCost: 9, category: "Civ – Economy", tags: [GamePhase.EARLY] },
    { name: "20% Fishing", baseCost: 9, category: "Civ – Economy", tags: [GamePhase.EARLY] },
    { name: "15% Gold Mining", baseCost: 11, category: "Civ – Economy", tags: [GamePhase.EARLY, GamePhase.MID] },
    { name: "20% Hunting & Foraging", baseCost: 11, category: "Civ – Economy", tags: [GamePhase.EARLY] },
    { name: "15% Iron Mining", baseCost: 11, category: "Civ – Economy", tags: [GamePhase.MID, GamePhase.LATE] },
    { name: "20% Stone Mining", baseCost: 9, category: "Civ – Economy", tags: [GamePhase.EARLY, GamePhase.MID] },
    { name: "15% Wood Cutting", baseCost: 13, category: "Civ – Economy", tags: [GamePhase.EARLY] },

    // Civ – Buildings
    { name: "20% Attack (Buildings)", baseCost: 3, category: "Civ – Buildings, Walls & Towers", tags: [GamePhase.EARLY] },
    { name: "30% Build Time Decrease (Buildings)", baseCost: 4, category: "Civ – Buildings, Walls & Towers", tags: [GamePhase.EARLY] },
    { name: "15% Cost Reduction (Buildings)", baseCost: 11, category: "Civ – Buildings, Walls & Towers", tags: [GamePhase.EARLY, GamePhase.MID] },
    { name: "50% Hit Points (Buildings)", baseCost: 11, category: "Civ – Buildings, Walls & Towers", tags: [GamePhase.MID] },
    { name: "20% Range (Buildings)", baseCost: 4, category: "Civ – Buildings, Walls & Towers", tags: [GamePhase.MID] },

    // Civ – General
    { name: "50% Conversion Resistance", baseCost: 10, category: "Civ – General", tags: [GamePhase.MID, GamePhase.LATE] },
    { name: "20% Mountain Combat Bonus", baseCost: 4, category: "Civ – General", tags: [GamePhase.MID] },
    { name: "15% Population Cap", baseCost: 9, category: "Civ – General", tags: [GamePhase.LATE] },

    // Citizens
    { name: "30% Attack (Citizens)", baseCost: 1, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },
    { name: "10% Build Time Decrease (Citizens)", baseCost: 20, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },
    { name: "20% Cost Reduction (Citizens)", baseCost: 25, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },
    { name: "30% Hit Points (Citizens)", baseCost: 3, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },
    { name: "35% Range (Citizens)", baseCost: 2, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },
    { name: "20% Speed (Citizens)", baseCost: 4, category: "Citizens & Fishing Boats", tags: [GamePhase.EARLY] },

    // Infantry - Ranged
    { name: "20% Armor (Ranged Inf)", baseCost: 3, category: "Infantry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Attack (Ranged Inf)", baseCost: 5, category: "Infantry – Ranged", tags: [GamePhase.EARLY, GamePhase.MID] },
    { name: "30% Build Time (Ranged Inf)", baseCost: 4, category: "Infantry – Ranged", tags: [GamePhase.EARLY] },
    { name: "20% Cost Reduction (Ranged Inf)", baseCost: 9, category: "Infantry – Ranged", tags: [GamePhase.EARLY] },
    { name: "25% Hit Points (Ranged Inf)", baseCost: 5, category: "Infantry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Range (Ranged Inf)", baseCost: 6, category: "Infantry – Ranged", tags: [GamePhase.MID, GamePhase.LATE] },
    { name: "20% Speed (Ranged Inf)", baseCost: 5, category: "Infantry – Ranged", tags: [GamePhase.MID] },

    // Infantry - Sword/Spear
    { name: "20% Armor (Melee Inf)", baseCost: 2, category: "Infantry – Sword / Spear", tags: [GamePhase.MID] },
    { name: "20% Attack (Melee Inf)", baseCost: 3, category: "Infantry – Sword / Spear", tags: [GamePhase.EARLY, GamePhase.MID] },
    { name: "30% Build Time (Melee Inf)", baseCost: 2, category: "Infantry – Sword / Spear", tags: [GamePhase.EARLY] },
    { name: "20% Cost Reduction (Melee Inf)", baseCost: 7, category: "Infantry – Sword / Spear", tags: [GamePhase.EARLY] },
    { name: "25% Hit Points (Melee Inf)", baseCost: 3, category: "Infantry – Sword / Spear", tags: [GamePhase.MID] },
    { name: "20% Range (Melee Inf)", baseCost: 3, category: "Infantry – Sword / Spear", tags: [GamePhase.MID] },
    { name: "20% Speed (Melee Inf)", baseCost: 3, category: "Infantry – Sword / Spear", tags: [GamePhase.MID] },

    // Cavalry - Ranged
    { name: "20% Armor (Cav Ranged)", baseCost: 2, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Attack (Cav Ranged)", baseCost: 4, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "30% Build Time (Cav Ranged)", baseCost: 3, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Cost Reduction (Cav Ranged)", baseCost: 8, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "25% Hit Points (Cav Ranged)", baseCost: 4, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Range (Cav Ranged)", baseCost: 5, category: "Cavalry – Ranged", tags: [GamePhase.MID] },
    { name: "20% Speed (Cav Ranged)", baseCost: 4, category: "Cavalry – Ranged", tags: [GamePhase.MID] },

    // Siege
    { name: "20% Area Effect (Siege)", baseCost: 5, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "20% Armor (Siege)", baseCost: 1, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "20% Attack (Siege)", baseCost: 2, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "30% Build Time (Siege)", baseCost: 1, category: "Siege Weapons & Mobile AA", tags: [GamePhase.MID] },
    { name: "20% Cost Reduction (Siege)", baseCost: 3, category: "Siege Weapons & Mobile AA", tags: [GamePhase.MID] },
    { name: "25% Hit Points (Siege)", baseCost: 2, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "20% Range (Siege)", baseCost: 2, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "25% Rate of Fire (Siege)", baseCost: 2, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },
    { name: "20% Speed (Siege)", baseCost: 2, category: "Siege Weapons & Mobile AA", tags: [GamePhase.LATE] },

    // Tanks
    { name: "20% Armor (Tanks)", baseCost: 3, category: "Tanks", tags: [GamePhase.LATE] },
    { name: "20% Attack (Tanks)", baseCost: 5, category: "Tanks", tags: [GamePhase.LATE] },
    { name: "20% Cost Reduction (Tanks)", baseCost: 9, category: "Tanks", tags: [GamePhase.LATE] },
    { name: "25% Hit Points (Tanks)", baseCost: 5, category: "Tanks", tags: [GamePhase.LATE] },

    // Aircraft
    { name: "20% Attack (Bombers)", baseCost: 5, category: "Aircraft", tags: [GamePhase.LATE] },
    { name: "20% Attack (Fighters)", baseCost: 5, category: "Aircraft", tags: [GamePhase.LATE] },
    { name: "30% Build Time (Fighters)", baseCost: 4, category: "Aircraft", tags: [GamePhase.LATE] },
    { name: "25% Hit Points (Bombers)", baseCost: 5, category: "Aircraft", tags: [GamePhase.LATE] },

    // Ships
    { name: "20% Speed (Ships)", baseCost: 4, category: "Ships", tags: [GamePhase.MID] },
    { name: "20% Attack (Ships)", baseCost: 5, category: "Ships", tags: [GamePhase.MID] },
    { name: "20% Range (Ships)", baseCost: 6, category: "Ships", tags: [GamePhase.MID] },
    { name: "25% Hit Points (Ships)", baseCost: 5, category: "Ships", tags: [GamePhase.MID] },
    { name: "20% Cost Reduction (Ships)", baseCost: 9, category: "Ships", tags: [GamePhase.EARLY] },

    // Cyber
    { name: "20% Attack (Cyber)", baseCost: 5, category: "Cyber", tags: [GamePhase.LATE] },
    { name: "20% Hit Points (Cyber)", baseCost: 5, category: "Cyber", tags: [GamePhase.LATE] },

    // Religion
    { name: "20% Range (Priests)", baseCost: 4, category: "Religion", tags: [GamePhase.MID] },
    { name: "30% Hit Points (Priests)", baseCost: 4, category: "Religion", tags: [GamePhase.MID] },
    { name: "50% Conversion Area", baseCost: 10, category: "Religion", tags: [GamePhase.MID] },
];

export const CIV_POWERS: CivPower[] = [
    { name: "Expansionism", cost: 30, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.EARLY], description: "Grants a second starting settler and reduced colony costs." },
    { name: "Advanced Mining", cost: 25, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.EARLY, GamePhase.MID], description: "Deep-crust extraction increases all ore income by 25%." },
    { name: "Just-In-Time Manufacturing", cost: 20, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.MID], description: "Global 30% reduction in all unit training times." },
    { name: "Market", cost: 20, minEpoch: 10, maxEpoch: 15, tags: [GamePhase.LATE], description: "Enables global resource trading and 15% luxury tax income." },
    { name: "Missile Base", cost: 15, minEpoch: 13, maxEpoch: 15, tags: [GamePhase.LATE], description: "Strategic long-range strike capability with high collateral damage." },
    { name: "Adaptation", cost: 15, minEpoch: 3, maxEpoch: 15, tags: [GamePhase.MID], description: "Switches production focus instantly based on enemy unit types." },
    { name: "Slavery", cost: 10, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.EARLY], description: "Extreme labor efficiency at the cost of global stability." },
    { name: "Priest Tower", cost: 30, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.MID], description: "Radiates a conversion aura that periodically claims nearby units." },
    { name: "Pathfinding", cost: 25, minEpoch: 1, maxEpoch: 15, tags: [GamePhase.EARLY], description: "All units ignore terrain penalties and move 15% faster." },
    { name: "SAS Commando", cost: 15, minEpoch: 10, maxEpoch: 15, tags: [GamePhase.LATE], description: "Specialized elite infantry with stealth and sabotage abilities." },
];

export const SYNERGIES: SynergyRule[] = [
    {
        name: "Agrarian Empire",
        items: ["20% Farming", "Expansionism"],
        description: "Massive population boom enabled by cheap land and high food yields."
    },
    {
        name: "Iron Fortress",
        items: ["15% Iron Mining", "50% Hit Points (Buildings)"],
        description: "Indestructible structures fueled by massive iron reserves."
    },
    {
        name: "Hussar Rush",
        items: ["20% Speed (Cavalry)", "30% Build Time (Cavalry)"],
        description: "Lightning-fast raids that overwhelm opponents before they can react."
    },
    {
        name: "Siege Master",
        items: ["20% Area Effect (Siege)", "20% Range (Siege)"],
        description: "Demolish entire bases from a safe distance with devastating accuracy."
    },
    {
        name: "Naval Supremacy",
        items: ["20% Range (Ships)", "20% Attack (Ships)"],
        description: "Total control of the seas with superior firepower and reach."
    },
    {
        name: "Blitzkrieg",
        items: ["20% Attack (Tanks)", "20% Speed (Citizens)"],
        description: "Rapid industrial mobilization paired with overwhelming armored force."
    },
    {
        name: "Divine Protection",
        items: ["Priest Tower", "50% Conversion Resistance"],
        description: "A holy sanctuary that is almost impossible to subvert."
    },
    {
        name: "Resource Monopoly",
        items: ["Advanced Mining", "Slavery"],
        description: "Hyper-efficient extraction that outpaces any conventional economy."
    }
];
