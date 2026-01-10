import React, { useState, useEffect } from 'react';
import { AppConfig, ResolvedAppConfig, PlayerCiv, PresetMode, PointUsageMode, MapType, Archetype, MapSize, Resources, GameSpeed } from './types';
import { generateCivForPlayer, SeededRNG, resolveMatchConfig } from './services/generator';
import { encodeConfig, decodeConfig } from './services/share';
import { SetupScreen } from './components/SetupScreen';
import { CivCard } from './components/CivCard';
import { audioService } from './services/audio';
import { DEFAULT_NAMES, MAP_TYPES, PRESET_MODES, POINT_MODES, EPOCHS, MAP_SIZES, RESOURCES, GAME_SPEEDS } from './constants';
import { Download, RefreshCw, Globe, Scale, Hourglass, LayoutGrid, Columns, Trophy, Link as LinkIcon, Check, Lock } from 'lucide-react';
import { DjonStNixLogo } from './components/DjonStNixLogo';

const App: React.FC = () => {
    // Default Config State
    const [config, setConfig] = useState<AppConfig>({
        numPlayers: 2,
        playerNames: DEFAULT_NAMES.slice(0, 2),
        playerArchetypes: ['Random', 'Random'], // Default init for 2 players
        startEpoch: 1,
        endEpoch: 15,
        seed: `EF-${Math.floor(Math.random() * 10000)}`,

        // Active
        preset: { mode: 'fixed', value: 'Casual', allowed: [...PRESET_MODES] },
        pointUsage: { mode: 'fixed', value: 'Efficient', allowed: [...POINT_MODES] },
        mapType: { mode: 'fixed', value: 'Continental', allowed: [...MAP_TYPES] },
        mapSize: { mode: 'fixed', value: 'Large', allowed: [...MAP_SIZES] },
        resources: { mode: 'fixed', value: 'Standard', allowed: [...RESOURCES] },
        gameSpeed: { mode: 'fixed', value: 'Standard', allowed: [...GAME_SPEEDS] },

        // Randomization Defaults (Legacy removed)

        isEndEpochRandom: false,
        endEpochMin: 1,
        endEpochMax: 15
    });

    const [civs, setCivs] = useState<PlayerCiv[]>([]);
    const [isForging, setIsForging] = useState(false);
    const [isForged, setIsForged] = useState(false);
    const [resolvedConfig, setResolvedConfig] = useState<ResolvedAppConfig | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
    const [linkCopied, setLinkCopied] = useState(false);
    const [seedCopied, setSeedCopied] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    const updateConfig = (updates: Partial<AppConfig>) => {
        audioService.playInteraction();
        setConfig(prev => ({ ...prev, ...updates }));
    };

    const epochName = (id: number) => EPOCHS.find(e => e.id === id)?.name || id;

    const getHeaderText = () => {
        if (!isForged) return "Setting up a match...";
        if (resolvedConfig) {
            const epochText = `${epochName(resolvedConfig.startEpoch)} → ${epochName(resolvedConfig.endEpoch)}`;
            return `${resolvedConfig.mapType} World · ${resolvedConfig.preset} · ${epochText}`;
        }
        // Fallback (shouldn't happen if isForged is true)
        return "Tactical Report Generated";
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shareCode = params.get('m');
        if (shareCode) {
            const sharedConfig = decodeConfig(shareCode);
            if (sharedConfig) {
                setConfig(sharedConfig);
                handleForge(sharedConfig);
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, []);

    useEffect(() => {
        const handleInitialClick = () => {
            audioService.playIntroGrunt();
            document.removeEventListener('click', handleInitialClick);
        };
        document.addEventListener('click', handleInitialClick);
        return () => document.removeEventListener('click', handleInitialClick);
    }, []);

    const handleForge = async (cfgOverride?: AppConfig) => {
        setIsForging(true);
        setIsForged(false);
        audioService.playForgeClang();
        audioService.playIntroGrunt();
        audioService.startFireCrackle();

        const soundInterval = setInterval(() => {
            if (Math.random() > 0.5) audioService.playRandomUnitSound();
        }, 800);

        // 1. Resolve to Strict Config immediately (Conceptually)
        const initConfig = cfgOverride ? { ...cfgOverride } : { ...config };

        // This is THE MOMENT "Random" becomes "Rivers" (or whatever)
        const resolved = resolveMatchConfig(initConfig);

        // 9. Absolute Sanity Rule (Requested Validaiton)
        const values = Object.values(resolved);
        if (values.includes('Random')) {
            console.error("CRITICAL ERROR: 'Random' found in resolved config!", resolved);
            alert("System Error: Random resolution failed. Please refresh.");
            return;
        }

        console.log(`🔒 Resolved Config:`, resolved);

        // 2. Generate Civs using the PRECISE resolved config
        const generated = resolved.playerNames.map((name, idx) =>
            generateCivForPlayer(resolved, name, idx, undefined, true)
        );

        setTimeout(() => {
            setResolvedConfig(resolved); // Store the strict object
            setCivs(generated);
            setIsForged(true);
            setIsForging(false);
            audioService.stopFireCrackle();
            clearInterval(soundInterval);
            setTimeout(() => {
                document.getElementById('results-feed')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }, 800);
    };

    const handleReroll = (index: number) => {
        if (!resolvedConfig) return;
        if (resolvedConfig.preset === 'Tournament') return;
        const player = civs[index];
        if (player.rerollUsed) return;
        const newSeed = `${resolvedConfig.seed}-${player.playerName}-${index}-REROLL`;
        const newCiv = generateCivForPlayer(resolvedConfig, player.playerName, index, newSeed);
        newCiv.rerollUsed = true;
        newCiv.reasoning += " (Rerolled)";
        const newCivs = [...civs];
        newCivs[index] = newCiv;
        setCivs(newCivs);
    };

    const handleReforgeAll = () => {
        audioService.playInteraction();
        const newSeed = `EF-${Math.floor(Math.random() * 10000)}`;
        const newConfig = { ...config, seed: newSeed };
        // Deep merge not needed for seed, but robust for structure
        setConfig(newConfig);
        handleForge(newConfig);
    };

    const exportData = () => {
        if (!civs.length) return;
        const data = JSON.stringify({ config: resolvedConfig, civs }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `epoch-forge-${config.seed}.json`;
        a.click();
    };

    const handleShareLink = () => {
        if (!resolvedConfig) return;
        audioService.playInteraction();
        const encoded = encodeConfig(config);
        const url = `${window.location.origin}${window.location.pathname}?m=${encoded}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const resetApp = () => {
        audioService.playInteraction();
        setIsForged(false);
        setIsForging(false);
        setIsSetupComplete(false);
        setResolvedConfig(null);
        setCivs([]);
        window.history.replaceState({}, '', window.location.pathname);
    };

    return (
        <div className="min-h-screen bg-[#0F1117] text-slate-200 pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-4 pt-10 md:pt-16 space-y-12">
                <div className="text-center mb-10 relative">
                    <div className="relative inline-block">
                        <button onClick={resetApp} className="relative px-8 py-2 block group hover:scale-[1.02] transition-transform">
                            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 bg-clip-text text-transparent filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)] select-none py-2">
                                Epoch Forge
                            </h1>
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent blur-3xl opacity-80 -z-10 group-hover:opacity-100 transition-opacity animate-pulse" />
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="absolute bottom-0 w-1 h-1 bg-gradient-to-t from-orange-400 to-amber-200 rounded-full animate-flame-spark"
                                        style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${1.5 + Math.random() * 2.5}s`, opacity: 0.6 + Math.random() * 0.4 }} />
                                ))}
                            </div>
                        </button>
                    </div>

                    {!isForged && (
                        <div className="animate-fade-in mt-12 mb-8 group relative max-w-4xl mx-auto px-4">
                            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)] group-hover:border-orange-500/30 transition-all duration-700">
                                <img
                                    src="hero_banner.png"
                                    alt="Evolution of Civilization"
                                    className="w-full h-auto opacity-90 group-hover:opacity-100 transition-all duration-700 scale-[1.01] group-hover:scale-100"
                                />
                                {/* Atmospheric Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent opacity-60 pointer-events-none" />
                                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center mt-12 mb-8 group relative max-w-4xl mx-auto px-4 font-mono">
                        <div className="text-[10px] font-bold text-slate-600 tracking-[0.2em] uppercase mb-4 animate-pulse italic">
                            {isForged ? "Tactical Report Generated" : "System Ready for Calculation"}
                        </div>
                        <p className={`font-bold text-xs tracking-[0.2em] uppercase transition-colors duration-700 p-3 px-6 rounded-2xl border-2 ${isForged ? 'text-orange-500 border-orange-500/20 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'text-slate-600 border-white/5 bg-[#12141C]'}`}>
                            {getHeaderText()}
                        </p>
                    </div>

                    {/* Fixed DjonStNix Branding */}
                    <div className="fixed bottom-6 right-8 z-50 pointer-events-none">
                        <div className="pointer-events-auto">
                            <DjonStNixLogo className="scale-[0.6] md:scale-75 animate-electric-pulse" />
                        </div>
                    </div>
                </div>

                {!isForged && (
                    <div className={`transition-all duration-1000 ${isForging ? 'opacity-10 blur-[4px] grayscale pointer-events-none' : ''}`}>
                        <SetupScreen
                            config={config}
                            onUpdate={updateConfig}
                            onComplete={setIsSetupComplete}
                            onForge={() => handleForge()}
                        />
                    </div>
                )}

                {isForged && resolvedConfig && (
                    <div id="results-feed" className="space-y-12 pt-4">
                        <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                            <div className="text-center py-6 relative">
                                <div className="mb-4">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(resolvedConfig.seed); setSeedCopied(true); setTimeout(() => setSeedCopied(false), 2000); }}
                                        className="inline-block bg-[#171A21] px-3 py-1 rounded-full border border-white/5 text-[10px] font-mono text-slate-500 tracking-widest uppercase hover:text-white hover:border-[#5B8CFF]/50 transition-all"
                                    >
                                        {seedCopied ? <span className="text-emerald-400 font-bold">Seed Copied</span> : <span>Match Seed: <span className="text-[#5B8CFF] font-bold">{resolvedConfig.seed}</span></span>}
                                    </button>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 text-slate-200 font-bold text-lg md:text-xl tracking-tight">
                                    <span className="flex items-center gap-2">
                                        <Globe size={20} className="text-emerald-400" />
                                        {config.isMapRandom && <span className="text-emerald-400/60 text-sm mr-1">[Random]</span>}
                                        {resolvedConfig.mapType} World
                                    </span>
                                    <span className="hidden md:block text-slate-600">·</span>
                                    <span className="flex items-center gap-2"><Scale size={20} className="text-amber-400" />{resolvedConfig.preset}</span>
                                    <span className="hidden md:block text-slate-600">·</span>
                                    <span className="flex items-center gap-2 text-slate-500 text-sm">
                                        {resolvedConfig.mapSize} · {resolvedConfig.resources} Res · {resolvedConfig.gameSpeed} Spd
                                    </span>
                                    <span className="hidden md:block text-slate-600">·</span>
                                    <span className="flex items-center gap-2"><Hourglass size={20} className="text-rose-400" />{epochName(resolvedConfig.startEpoch)} → {epochName(resolvedConfig.endEpoch)}</span>
                                </div>
                                <div className="mt-2 text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
                                    <span>Point Logic: <span className="text-slate-400">{resolvedConfig.pointUsage}</span></span>
                                    {resolvedConfig.preset === 'Tournament' && (
                                        <span className="ml-2 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Trophy size={10} /> Tournament Lock Active</span>
                                    )}
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex gap-2">
                                    <button onClick={handleShareLink} className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
                                        {linkCopied ? <Check size={20} className="text-emerald-400" /> : <LinkIcon size={20} />}
                                    </button>
                                    <button onClick={() => setViewMode(prev => prev === 'grid' ? 'compare' : 'grid')} className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        {viewMode === 'grid' ? <Columns size={20} /> : <LayoutGrid size={20} />}
                                    </button>
                                    <button onClick={exportData} className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Download size={20} /></button>
                                </div>
                                <div className="lg:hidden mt-4 flex justify-center gap-4">
                                    <button onClick={handleShareLink} className="text-xs font-bold uppercase tracking-widest text-[#5B8CFF] flex items-center gap-2">
                                        {linkCopied ? <Check size={16} /> : <LinkIcon size={16} />}{linkCopied ? "Link Copied" : "Share Link"}
                                    </button>
                                    <button onClick={() => setViewMode(prev => prev === 'grid' ? 'compare' : 'grid')} className="text-xs font-bold uppercase tracking-widest text-[#5B8CFF] flex items-center gap-2">
                                        {viewMode === 'grid' ? <Columns size={16} /> : <LayoutGrid size={16} />}{viewMode === 'grid' ? "Compare View" : "Card View"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`grid gap-8 md:gap-10 transition-all duration-500 ${viewMode === 'compare' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {(() => {
                                const maxPower = civs.length ? Math.max(...civs.map(c => c.powerScore)) : 0;
                                return civs.map((civ, idx) => (
                                    <div key={civ.id} className="animate-fade-in-up" style={{ animationDelay: `${150 + (idx * 150)}ms` }}>
                                        <CivCard civ={civ} onReroll={() => handleReroll(idx)} index={idx} isCompact={viewMode === 'compare'} isTournament={resolvedConfig.preset === 'Tournament'} isTopScore={civ.powerScore === maxPower} config={resolvedConfig} />
                                    </div>
                                ));
                            })()}
                        </div>

                        <div className="text-center pt-12 pb-8 flex justify-center gap-8">
                            <button onClick={handleReforgeAll} className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-orange-400 transition-colors py-4 px-8 border border-transparent hover:border-orange-500/20 rounded-xl">
                                Re-Forge All
                            </button>
                            <button onClick={() => { setIsForged(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#5B8CFF] transition-colors py-4 px-8 border border-transparent hover:border-[#5B8CFF]/20 rounded-xl">
                                Start New Match
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;