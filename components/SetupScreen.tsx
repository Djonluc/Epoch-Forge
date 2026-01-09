
import React, { useState } from 'react';
import { AppConfig, PresetMode, PointUsageMode, MapType, Archetype } from '../types';
import { EPOCHS, DEFAULT_NAMES, MAP_TYPES, PRESET_MODES, POINT_MODES, ARCHETYPES, MAP_TYPES_INFO, PRESET_MODES_INFO, POINT_MODES_INFO } from '../constants';
import { User, Plus, X, Lock, Dices, ChevronDown, Anchor, Coins, Shield, Swords, Scale } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Props {
    config: AppConfig;
    onUpdate: (updates: Partial<AppConfig>) => void;
}

export const SetupScreen: React.FC<Props> = ({ config, onUpdate }) => {

    // Handlers
    const setStartEpoch = (id: number) => onUpdate({ startEpoch: id });
    const setEndEpoch = (id: number) => onUpdate({ endEpoch: id });
    const setEndEpochMin = (id: number) => onUpdate({ endEpochMin: id });
    const setEndEpochMax = (id: number) => onUpdate({ endEpochMax: id });

    const addPlayer = () => {
        if (config.numPlayers >= 10) return;
        const newCount = config.numPlayers + 1;
        const newNames = [...config.playerNames];
        const newArchetypes = [...config.playerArchetypes];

        newNames.push(DEFAULT_NAMES[newCount - 1] || `Player ${newCount}`);
        newArchetypes.push('Random'); // Default

        onUpdate({ numPlayers: newCount, playerNames: newNames, playerArchetypes: newArchetypes });
    };

    const removePlayer = (idxToRemove: number) => {
        if (config.numPlayers <= 2) return;
        const newNames = config.playerNames.filter((_, idx) => idx !== idxToRemove);
        const newArchetypes = config.playerArchetypes.filter((_, idx) => idx !== idxToRemove);
        onUpdate({ numPlayers: config.numPlayers - 1, playerNames: newNames, playerArchetypes: newArchetypes });
    };

    const updateName = (idx: number, name: string) => {
        const newNames = [...config.playerNames];
        newNames[idx] = name;
        onUpdate({ playerNames: newNames });
    };

    const updateArchetype = (idx: number, archetype: Archetype) => {
        const newArchetypes = [...config.playerArchetypes];
        newArchetypes[idx] = archetype;
        onUpdate({ playerArchetypes: newArchetypes });
    };

    // Helper: Toggle Item in Array
    const toggleInArray = <T,>(item: T, array: T[]) => {
        if (array.includes(item)) {
            // Prevent removing the last one
            if (array.length === 1) return array;
            return array.filter(x => x !== item);
        }
        return [...array, item];
    };

    // Helper: Pill styling
    const pillClass = (isActive: boolean, isRandom: boolean) => `
        px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap
        ${isActive
            ? 'bg-[#5B8CFF] text-white shadow-md shadow-blue-500/20 transform scale-105'
            : isRandom
                ? 'bg-[#1F2430] text-slate-500 border border-white/5 opacity-50 hover:opacity-100 hover:text-slate-300'
                : 'bg-[#1F2430] text-slate-400 border border-white/5 hover:bg-[#262B38] hover:text-slate-200'
        }
    `;

    const getArchetypeIcon = (arch: Archetype) => {
        switch (arch) {
            case 'Economic': return <Coins size={12} />;
            case 'Aggressive': return <Swords size={12} />;
            case 'Defensive': return <Shield size={12} />;
            case 'Naval': return <Anchor size={12} />;
            case 'Balanced': return <Scale size={12} />;
            default: return <Dices size={12} />;
        }
    };

    // Internal Component for Progressive Disclosure Sections
    const CollapsibleSection = <T extends string>({
        title,
        current,
        options,
        isRandom,
        allowedOptions,
        onSelect,
        onToggleRandom,
        onUpdateAllowed,
        infoMap
    }: {
        title: string,
        current: T,
        options: T[],
        isRandom: boolean,
        allowedOptions: T[],
        onSelect: (val: T) => void,
        onToggleRandom: () => void,
        onUpdateAllowed: (val: T) => void,
        infoMap?: Record<string, { description: string }>
    }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <div className="space-y-3 text-center">
                <div className="flex justify-center items-center gap-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{title}</div>
                    <button
                        onClick={onToggleRandom}
                        className={`p-1 rounded transition-colors ${isRandom ? "text-[#5B8CFF] bg-[#5B8CFF]/10" : "text-slate-600 hover:text-slate-400"}`}
                        title="Toggle Randomize"
                    >
                        <Dices size={12} />
                    </button>
                </div>

                {/* Active State / Collapsed View */}
                {!expanded && !isRandom && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="bg-[#1F2430] border border-white/10 rounded-full px-5 py-2 flex items-center gap-2 mx-auto hover:bg-[#262B38] transition-colors group"
                    >
                        <span className="text-sm font-semibold text-slate-200">{current}</span>
                        <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300" />
                    </button>
                )}

                {/* Expanded Grid or Random Selection */}
                {(expanded || isRandom) && (
                    <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
                        {options.map(opt => {
                            const active = isRandom
                                ? allowedOptions.includes(opt)
                                : current === opt;
                            return (
                                <Tooltip key={opt as string} content={infoMap?.[opt as string]?.description} position="bottom">
                                    <button
                                        onClick={() => {
                                            if (isRandom) onUpdateAllowed(opt);
                                            else {
                                                onSelect(opt);
                                                setExpanded(false);
                                            }
                                        }}
                                        className={pillClass(active, isRandom)}
                                    >
                                        {opt}
                                    </button>
                                </Tooltip>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Avatar colors
    const avatarColors = [
        "bg-emerald-500/20 text-emerald-400",
        "bg-rose-500/20 text-rose-400",
        "bg-indigo-500/20 text-indigo-400",
        "bg-amber-500/20 text-amber-400",
        "bg-cyan-500/20 text-cyan-400",
    ];

    return (
        <div className="space-y-12 animate-fade-in">

            {/* 1. Context / Rules Section */}
            <div className="space-y-8 bg-[#171A21]/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
                {/* Timeline Rule */}
                <div className="flex flex-col items-center gap-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-slate-800" />
                        Timeline Control
                        <div className="h-[1px] w-8 bg-slate-800" />
                        <button
                            onClick={() => onUpdate({ isEndEpochRandom: !config.isEndEpochRandom })}
                            className={`p-1.5 rounded-lg transition-all ${config.isEndEpochRandom ? "text-orange-400 bg-orange-400/10 shadow-[0_0_10px_rgba(251,146,60,0.2)]" : "text-slate-600 hover:text-slate-400 bg-white/5"}`}
                            title="Randomize End Epoch"
                        >
                            <Dices size={14} />
                        </button>
                    </div>

                    <div className="inline-flex items-center gap-3 bg-[#0F1117] p-2 px-6 rounded-2xl border border-white/10 shadow-inner">
                        <select
                            value={config.startEpoch}
                            onChange={(e) => setStartEpoch(Number(e.target.value))}
                            className="bg-transparent text-lg p-2 text-slate-200 focus:outline-none cursor-pointer font-black text-center appearance-none hover:text-orange-400 transition-colors"
                        >
                            {EPOCHS.map(e => <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>)}
                        </select>
                        <span className="text-slate-700 font-mono text-xs opacity-50 flex items-center justify-center w-8">
                            <div className="h-[1px] w-full bg-slate-800" />
                        </span>

                        {!config.isEndEpochRandom ? (
                            <select
                                value={config.endEpoch}
                                onChange={(e) => setEndEpoch(Number(e.target.value))}
                                className="bg-transparent text-lg p-2 text-slate-200 focus:outline-none cursor-pointer font-black text-center appearance-none hover:text-orange-400 transition-colors"
                            >
                                {EPOCHS.filter(e => e.id >= config.startEpoch).map(e => (
                                    <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-1">
                                <select
                                    value={config.endEpochMin}
                                    onChange={(e) => setEndEpochMin(Number(e.target.value))}
                                    className="bg-transparent text-lg p-2 px-2 text-orange-400 focus:outline-none cursor-pointer font-black text-center appearance-none"
                                >
                                    {EPOCHS.filter(e => e.id >= config.startEpoch).map(e => (
                                        <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>
                                    ))}
                                </select>
                                <span className="text-slate-700 text-[10px] font-bold mx-1">/</span>
                                <select
                                    value={config.endEpochMax}
                                    onChange={(e) => setEndEpochMax(Number(e.target.value))}
                                    className="bg-transparent text-lg p-2 px-2 text-orange-400 focus:outline-none cursor-pointer font-black text-center appearance-none"
                                >
                                    {EPOCHS.filter(e => e.id >= config.endEpochMin).map(e => (
                                        <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progressive Disclosure Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto items-start pt-4">
                    <CollapsibleSection
                        title="World Context"
                        current={config.mapType}
                        options={MAP_TYPES}
                        isRandom={config.isMapRandom}
                        allowedOptions={config.allowedMaps}
                        onSelect={(val) => onUpdate({ mapType: val })}
                        onToggleRandom={() => onUpdate({ isMapRandom: !config.isMapRandom })}
                        onUpdateAllowed={(val) => onUpdate({ allowedMaps: toggleInArray(val, config.allowedMaps) })}
                        infoMap={MAP_TYPES_INFO as any}
                    />

                    <CollapsibleSection
                        title="Ruleset Bias"
                        current={config.preset}
                        options={PRESET_MODES}
                        isRandom={config.isPresetRandom}
                        allowedOptions={config.allowedPresets}
                        onSelect={(val) => onUpdate({ preset: val })}
                        onToggleRandom={() => onUpdate({ isPresetRandom: !config.isPresetRandom })}
                        onUpdateAllowed={(val) => onUpdate({ allowedPresets: toggleInArray(val, config.allowedPresets) })}
                        infoMap={PRESET_MODES_INFO as any}
                    />

                    <CollapsibleSection
                        title="Resource Logic"
                        current={config.pointUsage}
                        options={POINT_MODES}
                        isRandom={config.isPointUsageRandom}
                        allowedOptions={config.allowedPointUsages}
                        onSelect={(val) => onUpdate({ pointUsage: val })}
                        onToggleRandom={() => onUpdate({ isPointUsageRandom: !config.isPointUsageRandom })}
                        onUpdateAllowed={(val) => onUpdate({ allowedPointUsages: toggleInArray(val, config.allowedPointUsages) })}
                        infoMap={POINT_MODES_INFO as any}
                    />
                </div>
            </div>

            {/* 2. Player Lobby Section */}
            <div className="pt-4 pb-12">
                <div className="flex items-center justify-between mb-8 px-6 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                            <User size={16} className="text-slate-400" />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Player Rosters</h2>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 font-mono tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {config.numPlayers} Seats Occupied
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
                    {config.playerNames.map((name, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-br from-[#171A21] to-[#0F1117] rounded-3xl p-6 border border-white/5 hover:border-orange-500/20 transition-all flex items-center gap-6 shadow-xl hover:shadow-orange-500/5">
                            {/* Delete Button (Hover only) */}
                            {config.numPlayers > 2 && (
                                <button
                                    onClick={() => removePlayer(idx)}
                                    className="absolute -top-2 -right-2 bg-[#171A21] text-slate-600 hover:text-red-400 border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all p-2 shadow-xl hover:scale-110 z-10"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all relative ${avatarColors[idx % avatarColors.length]} group-hover:scale-110`}>
                                <User size={28} />
                                {/* Ready Dot */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#12141C] shadow-lg animate-pulse"></div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => updateName(idx, e.target.value)}
                                    className="w-full bg-transparent text-lg font-black text-slate-200 focus:outline-none border-b border-transparent focus:border-orange-500/30 pb-1 placeholder-slate-800 transition-all"
                                    placeholder="COMMANDER NAME"
                                />

                                {/* Archetype Selector */}
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {ARCHETYPES.map(arch => (
                                            <button
                                                key={arch}
                                                onClick={() => updateArchetype(idx, arch)}
                                                className={`p-2 rounded-xl transition-all border ${config.playerArchetypes[idx] === arch || (!config.playerArchetypes[idx] && arch === 'Random')
                                                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.1)]"
                                                        : "bg-white/5 border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/10"
                                                    }`}
                                                title={arch}
                                            >
                                                {getArchetypeIcon(arch as Archetype)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="h-4 w-[1px] bg-slate-800 mx-1" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        {config.playerArchetypes[idx] || 'Random'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add Button */}
                    {config.numPlayers < 10 && (
                        <button
                            onClick={addPlayer}
                            className="bg-[#0F1117] rounded-3xl p-6 border-2 border-dashed border-slate-800 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all flex items-center justify-center gap-4 text-slate-600 hover:text-orange-400 group min-h-[110px]"
                        >
                            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus size={20} />
                            </div>
                            <span className="text-sm font-black uppercase tracking-[0.2em]">Add Commander</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
