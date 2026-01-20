import React, { useCallback, useRef } from 'react';
import { StructureData, StructureType, Language, ElementType } from '../types';
import { STRUCTURE_THEME, ELEMENT_THEMES, TRANSLATIONS } from '../constants';
import { Download, Shield, Gem, Box, Undo2, Hand, Flame, Droplets, Mountain, Wind, Moon, Ghost, Cpu, Sun, HelpCircle } from 'lucide-react';
import { toPng } from 'html-to-image';

interface AltarPreviewProps {
  data: StructureData;
  language?: Language;
}

const ElementIcon = ({ element, className }: { element: ElementType, className?: string }) => {
  switch (element) {
    case ElementType.FIRE: return <Flame className={className} />;
    case ElementType.WATER: return <Droplets className={className} />;
    case ElementType.EARTH: return <Mountain className={className} />;
    case ElementType.WIND: return <Wind className={className} />;
    case ElementType.DARK: return <Moon className={className} />;
    case ElementType.ANCESTRAL: return <Ghost className={className} />;
    case ElementType.TECNO: return <Cpu className={className} />;
    case ElementType.DIVINE: return <Sun className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

export const AltarPreview: React.FC<AltarPreviewProps> = ({ data, language = 'pt-BR' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language].card;
  const tUi = TRANSLATIONS[language].ui;
  
  const baseTheme = data.element ? ELEMENT_THEMES[data.element] : STRUCTURE_THEME;
  const resistanceTheme = data.resistanceElement ? ELEMENT_THEMES[data.resistanceElement] : ELEMENT_THEMES.EARTH;
  const runicTheme = data.runicElement ? ELEMENT_THEMES[data.runicElement] : ELEMENT_THEMES.FIRE;
  const touchTheme = data.touchEffectElement ? ELEMENT_THEMES[data.touchEffectElement] : ELEMENT_THEMES.FIRE;

  const isBarrier = data.type === StructureType.BARRIER;

  const handleExport = useCallback(async () => {
    if (ref.current === null) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_STRUCTURE.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  }, [data]);

  const opacityValue = typeof data.imageOpacity === 'number' ? data.imageOpacity / 100 : 0.6;

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* ALTAR/STRUCTURE CARD CONTAINER */}
      <div 
        ref={ref}
        className="relative w-[380px] h-[600px] rounded-[18px] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: '#000' }}
      >
        {/* Animated Border Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{ background: isBarrier ? baseTheme.border : baseTheme.border }} 
        />
        
        {/* Inner Content Container */}
        <div 
            className={`absolute inset-[${isBarrier ? '6px' : '4px'}] bg-black rounded-[${isBarrier ? '12px' : '14px'}] z-10 overflow-hidden flex flex-col`} 
            style={{ backgroundColor: baseTheme.bg }}
        >
          
          {/* BACKGROUND ART */}
          <div className="absolute inset-0 z-0 bg-gray-900">
             {data.noBackground ? (
               <div 
                  className="w-full h-full"
                  style={{
                    background: isBarrier 
                        ? `repeating-linear-gradient(45deg, ${baseTheme.bg}, ${baseTheme.bg} 10px, ${baseTheme.secondaryText}22 10px, ${baseTheme.secondaryText}22 20px)`
                        : `linear-gradient(135deg, ${baseTheme.bg} 0%, #0f172a 100%), radial-gradient(circle at 100% 0%, ${baseTheme.accent}33 0%, transparent 60%)`
                  }}
               >
                 <div className="absolute inset-0 opacity-10" style={{ 
                     backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 17l5-5 5 5H10zm10-7l5-5 5 5h-5zM30 0h10v10H30V0zm10 20h-5l5-5v5zm-5 15l-5 5h-5l5-5h5zM0 20h20v20H0V20zm20 10l-5 5-5-5h5z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                 }}></div>
               </div>
             ) : (
                <img 
                src={data.imageUrl} 
                alt="Structure Art" 
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: opacityValue }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600?grayscale' }}
                />
             )}

             <div 
              className="absolute inset-0 z-10" 
              style={{ 
                background: `linear-gradient(to bottom, transparent 0%, rgba(12, 18, 16, 0.6) 50%, ${baseTheme.bg} 90%)` 
              }} 
             />
          </div>

          {/* NAME PLATE (Top) */}
          <div className="relative z-20 mt-4 px-3">
             <div className={`relative py-3 px-2 backdrop-blur-md border rounded-lg shadow-xl ${isBarrier ? 'bg-black/80 border-gray-600' : 'bg-black/60 border-teal-900/50'}`}>
              <h1 className="relative text-center font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-sm uppercase" style={{ color: baseTheme.text }}>
                {data.name}
              </h1>
              {/* Type Subtitle */}
              <div className="flex justify-center items-center mt-1">
                 <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                    {t[data.type]} • {t[data.element]}
                 </span>
              </div>
            </div>
          </div>

          {/* HEADER SECTION (Mana Cost + Icons) */}
          <div className="relative z-20 pt-2 px-4 flex justify-between items-center">
             {/* MANA GEM */}
             <div 
               className="w-12 h-12 flex items-center justify-center transform border-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
               style={{ 
                 background: baseTheme.border, 
                 borderColor: baseTheme.text,
                 boxShadow: `0 0 20px ${baseTheme.glow}`,
                 borderRadius: isBarrier ? '4px' : '50%'
               }}
             >
               <div className="font-serif font-bold text-2xl text-white drop-shadow-md">
                 {data.manaCost || 0}
               </div>
             </div>

             <div className="flex gap-2 items-center">
                {/* ELEMENT ICON (Visible for Barrier) */}
                {isBarrier && (
                    <div className="bg-black/50 p-1.5 rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
                        <ElementIcon element={data.element} className="w-6 h-6 text-white" />
                    </div>
                )}

                {/* COUNTER BADGE (Conditional) */}
                {data.isCounter && (
                    <div className="bg-red-600 border-2 border-red-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg shadow-red-600/50 animate-pulse">
                        <Undo2 size={20} className="text-white" strokeWidth={3} />
                    </div>
                )}
             </div>
          </div>

          {/* MECHANICS CONTAINER */}
          <div className="relative z-20 mt-auto m-4 flex flex-col gap-3">
            
            {/* DESCRIPTION - Moved here (Above Stats) */}
            <div className="px-2 mb-1">
              <p className="font-serif italic text-xs text-gray-300 leading-snug text-center drop-shadow-md" style={{ color: baseTheme.text }}>
                  "{data.description}"
              </p>
            </div>

            {/* STATS ROW */}
            <div className="flex gap-2">
                {/* Durability */}
                <div className="flex-1 bg-black/60 border border-gray-700 rounded p-2 flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">HP</span>
                    <span className="text-xl font-bold text-white flex items-center gap-1">
                        <Box size={16} /> {data.durability}
                    </span>
                </div>

                {/* Resistance */}
                <div className="flex-1 bg-black/60 border border-gray-700 rounded p-2 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ background: resistanceTheme.bg }}></div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 mb-1">RES: {t[data.resistanceElement]}</span>
                    <span className="text-xl font-bold flex items-center gap-1" style={{ color: resistanceTheme.accent }}>
                        <Shield size={16} /> {data.resistanceLevel}
                    </span>
                </div>
            </div>

            {/* TOUCH EFFECT BOX (Only if Barrier and value > 0) */}
            {isBarrier && data.touchEffectValue && data.touchEffectValue > 0 && (
                <div 
                    className="p-2 rounded border relative overflow-hidden flex items-center justify-between group"
                    style={{ 
                        backgroundColor: 'rgba(20,0,0,0.8)',
                        borderColor: touchTheme.accent,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Hand size={14} style={{ color: touchTheme.accent }} />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">{tUi.touchEffect}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 mr-1">{t[data.touchEffectElement || ElementType.FIRE]}</span>
                        <span className="font-bold text-sm" style={{ color: touchTheme.accent }}>{data.touchEffectValue}</span>
                    </div>
                </div>
            )}

            {/* RUNIC ELEMENT (If Altar) */}
            {!isBarrier && (
                <div 
                    className="p-2 rounded border relative overflow-hidden flex items-center justify-between group"
                    style={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        borderColor: runicTheme.accent,
                    }}
                >
                    <span className="relative z-10 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-300">Elemento Rúnico</span>
                    <div className="relative z-10 px-3 py-1 rounded font-bold text-sm uppercase tracking-wider" style={{ backgroundColor: runicTheme.accent, color: '#000' }}>
                        {t[data.runicElement || ElementType.FIRE]}
                    </div>
                </div>
            )}

            {/* Continuous Effect */}
            <div 
              className="p-4 rounded-xl border flex flex-col gap-2 relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                borderColor: baseTheme.border ? 'rgba(255,255,255,0.2)' : 'gray',
              }}
            >
              <div className="flex items-center gap-2 border-b border-gray-500/20 pb-2 mb-1" style={{ color: baseTheme.accent }}>
                 <Gem size={16} />
                 <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Efeito Contínuo</span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-shadow-sm" style={{ color: baseTheme.text }}>
                {data.continuousEffect}
              </p>
            </div>

          </div>

          {/* Barrier visual overlay */}
          {isBarrier && (
               <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                   backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 19px, #fff 20px)'
               }}></div>
          )}
        </div>
      </div>

      {/* Export Action */}
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-8 rounded-full shadow-lg transition-all text-sm uppercase tracking-wider border border-gray-600"
      >
        <Download size={16} />
        Salvar {t[data.type]}
      </button>
    </div>
  );
};