import React, { useState } from 'react';
import { AppConfig, PresetMode, PointUsageMode, MapType, Archetype } from '../types';
import { EPOCHS, DEFAULT_NAMES, MAP_TYPES, PRESET_MODES, POINT_MODES, ARCHETYPES, MAP_TYPES_INFO, PRESET_MODES_INFO, POINT_MODES_INFO } from '../constants';
import { User, Plus, X, Lock, Dices, ChevronDown, Anchor, Coins, Shield, Swords, Scale, ChevronRight, Activity, ArrowRight, CornerDownRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

type TacticalStage = 'PLAYERS' | 'ROSTER' | 'TIMELINE' | 'STRATEGY';

interface Props {
    config: AppConfig;
    onUpdate: (updates: Partial<AppConfig>) => void;
    onComplete: (isReady: boolean) => void;
}

export const SetupScreen: React.FC<Props> = ({ config, onUpdate, onComplete }) => {
    const [currentStage, setCurrentStage] = useState<TacticalStage>('PLAYERS');

    // Handlers
    const setStartEpoch = (id: number) => onUpdate({ startEpoch: id });
    const setEndEpoch = (id: number) => onUpdate({ endEpoch: id });
    const setEndEpochMin = (id: number) => onUpdate({ endEpochMin: id });
    const setEndEpochMax = (id: number) => onUpdate({ endEpochMax: id });

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

    const addPlayer = () => {
        if (config.numPlayers >= 10) return;
        const newCount = config.numPlayers + 1;
        const newNames = [...config.playerNames];
        const newArchetypes = [...config.playerArchetypes];
        newNames.push(DEFAULT_NAMES[newCount - 1] || `Commander ${newCount}`);
        newArchetypes.push('Random');
        onUpdate({ numPlayers: newCount, playerNames: newNames, playerArchetypes: newArchetypes });
    };

    const removePlayer = (idxToRemove: number) => {
        if (config.numPlayers <= 2) return;
        const newNames = config.playerNames.filter((_, idx) => idx !== idxToRemove);
        const newArchetypes = config.playerArchetypes.filter((_, idx) => idx !== idxToRemove);
        onUpdate({ numPlayers: config.numPlayers - 1, playerNames: newNames, playerArchetypes: newArchetypes });
    };

    const toggleInArray = <T,>(item: T, array: T[]) => {
        if (array.includes(item)) {
            if (array.length === 1) return array;
            return array.filter(x => x !== item);
        }
        return [...array, item];
    };

    const pillClass = (isActive: boolean, isRandom: boolean) => `
        px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap font-mono
        ${isActive
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
            : isRandom
                ? 'bg-[#1F2430] text-slate-500 border border-white/5 opacity-50 hover:opacity-100'
                : 'bg-[#1F2430] text-slate-400 border border-white/5 hover:bg-[#262B38] hover:text-slate-300'
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

    const nextStage = (stage: TacticalStage) => {
        setCurrentStage(stage);
        onComplete(false);
    };

    const CollapsibleSection = <T extends string>({
        title, current, options, isRandom, allowedOptions, onSelect, onToggleRandom, onUpdateAllowed, infoMap
    }: any) => {
        const [expanded, setExpanded] = useState(false);
        return (
            <div className="space-y-4 text-center w-full">
                <div className="flex justify-between items-center px-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 font-mono italic">{title}</div>
                    <button onClick={onToggleRandom} className={`p-1.5 rounded-lg transition-all ${isRandom ? "text-orange-400 bg-orange-400/10 border border-orange-500/30" : "text-slate-600 hover:text-slate-500 border border-transparent"}`}>
                        <Dices size={12} />
                    </button>
                </div>
                {!expanded && !isRandom && (
                    <button onClick={() => setExpanded(true)} className="w-full bg-[#171A21] border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-orange-500/30 transition-all group shadow-xl">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">{current}</span>
                        <ChevronDown size={14} className="text-slate-600 group-hover:text-orange-500 group-hover:translate-y-0.5 transition-all" />
                    </button>
                )}
                {(expanded || isRandom) && (
                    <div className="grid grid-cols-2 gap-2 animate-fade-in bg-[#171A21] p-2 rounded-2xl border border-white/5">
                        {options.map((opt: any) => {
                            const active = isRandom ? allowedOptions.includes(opt) : current === opt;
                            return (
                                <Tooltip key={opt} content={infoMap?.[opt]?.description} position="bottom">
                                    <button onClick={() => { if (isRandom) onUpdateAllowed(opt); else { onSelect(opt); setExpanded(false); } }} className={pillClass(active, isRandom)}>
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

    const avatarColors = [
        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        "bg-rose-500/20 text-rose-400 border-rose-500/30",
        "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
        "bg-amber-500/20 text-amber-400 border-amber-500/30",
        "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            {/* Stage Indicator */}
            <div className="flex justify-center gap-3 mb-16 px-4">
                {['PLAYERS', 'ROSTER', 'TIMELINE', 'STRATEGY'].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-3 flex-1 max-w-[120px]">
                        <div className={`h-1 w-full rounded-full transition-all duration-700 ${(['PLAYERS', 'ROSTER', 'TIMELINE', 'STRATEGY'].indexOf(currentStage) >= i)
                                ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'
                                : 'bg-white/5'
                            }`} />
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] font-mono ${currentStage === s ? 'text-orange-500' : 'text-slate-700'
                            }`}>{s}</span>
                    </div>
                ))}
            </div>

            {currentStage === 'PLAYERS' && (
                <div className="flex flex-col items-center animate-fade-in-up">
                    <h2 className="text-6xl md:text-7xl font-black text-slate-100 italic tracking-tighter mb-4 text-center">Operational Scale</h2>
                    <p className="text-slate-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-16 italic opacity-70">Directive 01: Establish Active Connection Hubs</p>

                    <div className="flex flex-col items-center gap-12 w-full max-w-sm">
                        <div className="w-64 h-64 bg-[#12141C] rounded-[3rem] border-4 border-white/5 shadow-2xl flex flex-col items-center justify-center gap-4 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-4">Active Seats</div>
                            <div className="text-9xl font-black italic text-orange-500 tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all group-hover:scale-110">
                                {config.numPlayers}
                            </div>
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => removePlayer(0)}
                                    className="w-12 h-12 rounded-xl bg-[#171A21] border-2 border-white/5 flex items-center justify-center text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition-all active:scale-90"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={addPlayer}
                                    className="w-12 h-12 rounded-xl bg-[#171A21] border-2 border-white/5 flex items-center justify-center text-slate-500 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40 transition-all active:scale-90"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => nextStage('ROSTER')}
                            className="group px-16 py-5 bg-[#171A21] hover:bg-orange-600 rounded-2xl flex items-center gap-6 transition-all duration-500 shadow-2xl border-2 border-white/10 hover:border-orange-500/50 hover:scale-[1.05]"
                        >
                            <span className="text-sm font-black text-slate-100 uppercase tracking-[0.4em] font-mono">Establish Command</span>
                            <ChevronRight size={20} className="text-orange-500 group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </button>
                    </div>
                </div>
            )}

            {currentStage === 'ROSTER' && (
                <div className="flex flex-col items-center animate-fade-in-up">
                    <h2 className="text-6xl md:text-7xl font-black text-slate-100 italic tracking-tighter mb-4 text-center">Identity Briefing</h2>
                    <p className="text-slate-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-16 italic opacity-70">Directive 02: Assign Commanders and Archetypes</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {config.playerNames.map((name, idx) => (
                            <div key={idx} className="bg-[#12141C] border-2 border-white/5 rounded-[2.5rem] p-8 flex items-center gap-8 group hover:border-orange-500/20 transition-all shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity size={64} className="text-white" />
                                </div>
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border-2 ${avatarColors[idx % avatarColors.length]} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`}>
                                    <User size={36} />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] font-mono">Designation</div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => updateName(idx, e.target.value)}
                                            className="w-full bg-transparent text-xl font-black text-slate-200 focus:outline-none border-b-2 border-white/5 focus:border-orange-500/50 pb-1 transition-all tracking-tight"
                                            placeholder="COMMANDER ID"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] font-mono">Archetype</div>
                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                            {ARCHETYPES.map(arch => (
                                                <button
                                                    key={arch}
                                                    onClick={() => updateArchetype(idx, arch)}
                                                    className={`p-2.5 rounded-xl transition-all border-2 ${config.playerArchetypes[idx] === arch ? "bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : "bg-white/5 border-transparent text-slate-700 hover:text-slate-400"}`}
                                                    title={arch}
                                                >
                                                    {getArchetypeIcon(arch as Archetype)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-8 mt-16 font-mono">
                        <button onClick={() => setCurrentStage('PLAYERS')} className="text-[10px] font-bold text-slate-600 hover:text-orange-500 uppercase tracking-[0.3em] transition-all hover:scale-105">Back to Scale</button>
                        <button
                            onClick={() => nextStage('TIMELINE')}
                            className="group px-16 py-5 bg-[#171A21] hover:bg-orange-600 rounded-2xl flex items-center gap-6 transition-all duration-500 shadow-2xl border-2 border-white/10 hover:border-orange-500/50 hover:scale-[1.05]"
                        >
                            <span className="text-sm font-black text-slate-100 uppercase tracking-[0.4em] font-mono">Lock Identities</span>
                            <ChevronRight size={20} className="text-orange-500 group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </button>
                    </div>
                </div>
            )}

            {currentStage === 'TIMELINE' && (
                <div className="flex flex-col items-center animate-fade-in-up">
                    <h2 className="text-6xl md:text-7xl font-black text-slate-100 italic tracking-tighter mb-4 text-center">Temporal Scan</h2>
                    <p className="text-slate-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-16 italic opacity-70">Directive 03: Initialize Chronological Anchors</p>

                    <div className="relative w-full max-w-xl mb-12 bg-[#12141C] p-12 rounded-[3rem] border-2 border-white/5 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-pulse" />

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-3/4 bg-gradient-to-b from-orange-500/60 via-orange-500/10 to-transparent">
                            <div className="absolute inset-0 bg-orange-500/40 blur-xl animate-pulse" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-24">
                            <div className="group relative flex flex-col items-center w-full">
                                <div className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase mb-6 font-mono border-b border-white/5 pb-2">Origin Point</div>
                                <div className="relative w-full max-w-xs group/select">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/40 pointer-events-none font-mono text-[10px]">A0</div>
                                    <select
                                        value={config.startEpoch}
                                        onChange={(e) => setStartEpoch(Number(e.target.value))}
                                        className="w-full bg-[#171A21] text-4xl p-6 px-14 text-slate-200 focus:outline-none cursor-pointer font-black text-center appearance-none border-2 border-white/5 hover:border-orange-500/40 hover:text-orange-400 transition-all rounded-2xl shadow-xl tracking-tight"
                                    >
                                        {EPOCHS.map(e => <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>)}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-hover/select:text-orange-500 transition-colors">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="group relative flex flex-col items-center w-full">
                                <div className="text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase mb-6 font-mono border-b border-white/5 pb-2">Target Destination</div>
                                <div className="relative w-full max-w-xs group/select">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/40 pointer-events-none font-mono text-[10px]">Z9</div>
                                    {!config.isEndEpochRandom ? (
                                        <>
                                            <select
                                                value={config.endEpoch}
                                                onChange={(e) => setEndEpoch(Number(e.target.value))}
                                                className="w-full bg-[#171A21] text-4xl p-6 px-14 text-slate-200 focus:outline-none cursor-pointer font-black text-center appearance-none border-2 border-white/5 hover:border-orange-500/40 hover:text-orange-400 transition-all rounded-2xl shadow-xl tracking-tight"
                                            >
                                                {EPOCHS.filter(e => e.id >= config.startEpoch).map(e => (
                                                    <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-hover/select:text-orange-500 transition-colors">
                                                <ChevronDown size={20} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-4 bg-[#171A21] border-2 border-orange-500/30 p-4 rounded-2xl shadow-2xl">
                                            <select value={config.endEpochMin} onChange={(e) => setEndEpochMin(Number(e.target.value))} className="bg-transparent text-3xl text-orange-400 font-black appearance-none focus:outline-none text-center flex-1">
                                                {EPOCHS.filter(e => e.id >= config.startEpoch).map(e => <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>)}
                                            </select>
                                            <div className="h-8 w-px bg-orange-500/20" />
                                            <select value={config.endEpochMax} onChange={(e) => setEndEpochMax(Number(e.target.value))} className="bg-transparent text-3xl text-orange-400 font-black appearance-none focus:outline-none text-center flex-1">
                                                {EPOCHS.filter(e => e.id >= config.endEpochMin).map(e => <option key={e.id} value={e.id} className="bg-[#171A21]">{e.name}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => onUpdate({ isEndEpochRandom: !config.isEndEpochRandom })} className={`mt-8 flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition-all font-mono border-2 ${config.isEndEpochRandom ? "text-orange-400 bg-orange-400/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-pulse" : "text-slate-600 bg-white/5 border-transparent hover:text-slate-400 hover:border-white/10"}`}>
                                    <Dices size={14} /> {config.isEndEpochRandom ? "Timeline Drift Active" : "Fixed Chronology"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 mt-8 font-mono">
                        <button onClick={() => setCurrentStage('ROSTER')} className="text-[10px] font-bold text-slate-600 hover:text-orange-500 uppercase tracking-[0.3em] transition-all hover:scale-105">Back to Roster</button>
                        <button
                            onClick={() => nextStage('STRATEGY')}
                            className="group px-16 py-5 bg-[#171A21] hover:bg-orange-600 rounded-2xl flex items-center gap-6 transition-all duration-500 shadow-2xl border-2 border-white/10 hover:border-orange-500/50 hover:scale-[1.05]"
                        >
                            <span className="text-sm font-black text-slate-100 uppercase tracking-[0.4em] font-mono">Lock Timeline</span>
                            <ChevronRight size={20} className="text-orange-500 group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </button>
                    </div>
                </div>
            )}

            {currentStage === 'STRATEGY' && (
                <div className="flex flex-col items-center animate-fade-in-up">
                    <h2 className="text-6xl md:text-7xl font-black text-slate-100 italic tracking-tighter mb-4 text-center">Operational Logic</h2>
                    <p className="text-slate-500 font-mono tracking-[0.4em] uppercase text-[10px] mb-16 italic opacity-70">Directive 04: Global Constraints and Allocation Laws</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {[
                            { title: "Map Sector", current: config.mapType, options: MAP_TYPES, isRandom: config.isMapRandom, allowed: config.allowedMaps, toggleRand: () => onUpdate({ isMapRandom: !config.isMapRandom }), updateAllowed: (v: any) => onUpdate({ allowedMaps: toggleInArray(v, config.allowedMaps) }), info: MAP_TYPES_INFO, icon: <Anchor size={20} />, onSelect: (v: any) => onUpdate({ mapType: v }) },
                            { title: "Ruleset Bias", current: config.preset, options: PRESET_MODES, isRandom: config.isPresetRandom, allowed: config.allowedPresets, toggleRand: () => onUpdate({ isPresetRandom: !config.isPresetRandom }), updateAllowed: (v: any) => onUpdate({ allowedPresets: toggleInArray(v, config.allowedPresets) }), info: PRESET_MODES_INFO, icon: <Swords size={20} />, onSelect: (v: any) => onUpdate({ preset: v }) },
                            { title: "Point Allocation", current: config.pointUsage, options: POINT_MODES, isRandom: config.isPointUsageRandom, allowed: config.allowedPointUsages, toggleRand: () => onUpdate({ isPointUsageRandom: !config.isPointUsageRandom }), updateAllowed: (v: any) => onUpdate({ allowedPointUsages: toggleInArray(v, config.allowedPointUsages) }), info: POINT_MODES_INFO, icon: <Coins size={20} />, onSelect: (v: any) => onUpdate({ pointUsage: v }) }
                        ].map((section, idx) => (
                            <div key={idx} className="bg-[#12141C] border-2 border-white/5 rounded-[3rem] p-10 flex flex-col items-center group hover:border-orange-500/20 transition-all shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-4 rounded-3xl bg-[#171A21] border-2 border-white/5 mb-8 text-slate-600 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-all shadow-inner">
                                    {section.icon}
                                </div>
                                <CollapsibleSection {...section} allowedOptions={section.allowed} infoMap={section.info} />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-8 mt-16 font-mono">
                        <button onClick={() => { setCurrentStage('TIMELINE'); onComplete(false); }} className="text-[10px] font-bold text-slate-600 hover:text-orange-500 uppercase tracking-[0.3em] transition-all hover:scale-105">Back to Timeline</button>
                        <button
                            onClick={() => onComplete(true)}
                            className="group px-20 py-6 bg-orange-600 hover:bg-orange-500 rounded-[2rem] flex items-center gap-8 transition-all duration-500 shadow-[0_0_50px_rgba(249,115,22,0.3)] border-2 border-white/10 hover:scale-[1.08] active:scale-95"
                        >
                            <span className="text-sm font-black text-white uppercase tracking-[0.5em] font-mono">Finalize Strategy</span>
                            <ArrowRight size={28} className="text-white group-hover:translate-x-3 transition-all animate-pulse" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
