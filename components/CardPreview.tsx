import React, { useCallback, useRef } from 'react';
import { CardData, CardType, ElementType, CastTier, CastConfig, Language } from '../types';
import { ELEMENT_THEMES, TRANSLATIONS } from '../constants';
import { 
  Sword, Shield, Sparkles, Anchor, Hexagon, Zap, 
  CircleDot, Clock, Wind, Flame, Droplets, Mountain, 
  HelpCircle, Move, Download, Moon, Ghost, Cpu, Sun, Undo2
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface CardPreviewProps {
  data: CardData;
  language?: Language;
}

// Helper to determine die face
const DieFace = ({ tier, theme }: { tier: CastTier, theme: any }) => {
  const isPerfect = tier === CastTier.PERFECT;
  
  let symbol = '';
  let offsetClass = ''; // Adjustment to center symbol optically

  switch (tier) {
    case CastTier.WEAK: 
      symbol = 'x'; 
      offsetClass = 'pb-1'; // 'x' sits on baseline, needs lifting to look centered
      break;
    case CastTier.GOOD: 
      symbol = '✧'; 
      // Stars usually center well
      break;
    case CastTier.PERFECT: 
      symbol = '✦'; 
      // Stars usually center well
      break;
  }
  
  return (
    <div 
      className={`w-6 h-6 rounded flex items-center justify-center shadow-lg border relative overflow-hidden`}
      style={{ 
        backgroundColor: '#111',
        borderColor: isPerfect ? '#facc15' : theme.accent,
        boxShadow: `0 0 10px ${isPerfect ? 'rgba(250, 204, 21, 0.3)' : 'rgba(0,0,0,0.5)'}`
      }}
    >
      <span 
        className={`text-lg leading-none ${offsetClass} ${isPerfect ? 'text-yellow-400' : 'text-white'}`} 
        style={{ color: isPerfect ? '#facc15' : theme.text }}
      >
        {symbol}
      </span>
    </div>
  );
};

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

const CastRow = ({ tier, config, theme, language = 'pt-BR' }: { tier: CastTier, config: CastConfig, theme: any, language?: Language }) => {
  const isPerfect = tier === CastTier.PERFECT;
  const t = TRANSLATIONS[language].card;

  return (
    <div className={`
      relative group mb-2 last:mb-0
      ${isPerfect ? 'bg-gradient-to-r from-yellow-900/20 to-transparent' : ''}
    `}>
      <div className="flex items-start gap-3 p-1.5">
        <div className="pt-0.5">
           <DieFace tier={tier} theme={theme} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1 border-b border-white/5 pb-1">
             <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isPerfect ? 'text-yellow-400' : 'text-gray-400'}`}>
               {t[tier]}
             </span>
             <div className="flex gap-3 font-mono text-[10px]">
                {config.damage ? <span className="flex items-center gap-1 text-red-300 font-bold"><Sword size={10} /> {config.damage}</span> : null}
                {config.duration ? <span className="flex items-center gap-1 text-blue-300"><Clock size={10} /> {config.duration}T</span> : null}
             </div>
          </div>
          
          <p className="text-[11px] leading-relaxed font-serif opacity-90" style={{ color: theme.text }}>
            {config.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {/* TARGETS - White, Generic */}
            {config.targets && config.targets.map((target, idx) => (
               <span 
                  key={`tgt-${idx}`} 
                  className="px-1.5 py-px bg-white/10 rounded text-[9px] uppercase tracking-wider border border-white/30 text-white/90"
                >
                  {t[target]}
                </span>
            ))}

            {/* EFFECTS - Colored, Specific */}
            {config.effects.map((fx, idx) => (
              <span 
                key={`fx-${idx}`} 
                className="px-1.5 py-px bg-black/50 rounded text-[9px] uppercase tracking-wider border border-white/10"
                style={{ color: theme.accent, borderColor: theme.accent }}
              >
                {fx.name} {fx.level}/{fx.chips}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardPreview: React.FC<CardPreviewProps> = ({ data, language = 'pt-BR' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = ELEMENT_THEMES[data.element];
  const t = TRANSLATIONS[language].card;

  const handleExport = useCallback(async () => {
    if (ref.current === null) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_${data.element}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  }, [data]);

  const opacityValue = typeof data.imageOpacity === 'number' ? data.imageOpacity / 100 : 0.6;
  const contentOpacityValue = typeof data.contentOpacity === 'number' ? data.contentOpacity / 100 : 0.85;

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* CARD CONTAINER */}
      <div 
        ref={ref}
        className="relative w-[380px] h-[600px] rounded-[18px] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: '#000' }}
      >
        {/* Animated Border Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{ background: theme.border }} 
        />
        
        {/* Inner Content Container - slightly smaller to show border */}
        <div className="absolute inset-[4px] bg-black rounded-[14px] z-10 overflow-hidden flex flex-col" style={{ backgroundColor: theme.bg }}>
          
          {/* BACKGROUND ART (Full Height Underlay) */}
          <div className="absolute inset-0 z-0 bg-gray-900">
             {data.noBackground ? (
               // Abstract Background Pattern
               <div 
                  className="w-full h-full"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 20%, ${theme.accent}33, transparent 70%),
                      radial-gradient(circle at 10% 90%, ${theme.secondaryText}44, transparent 60%),
                      ${theme.bg}
                    `
                  }}
               >
                 {/* Subtle noise pattern overlay */}
                 <div className="absolute inset-0 opacity-20" style={{ 
                     backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
                 }}></div>
               </div>
             ) : (
                <img 
                src={data.imageUrl} 
                alt="Card Art" 
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: opacityValue }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600' }}
                />
             )}
             
             {/* Gradient Overlay for Text Readability - improved visual */}
             <div 
              className="absolute inset-0 z-10" 
              style={{ 
                background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 40%, ${theme.bg} 85%)` 
              }} 
             />
             {/* Element Tint Overlay */}
             <div className="absolute inset-0 z-10 mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundColor: theme.bg }} />
          </div>

          {/* HEADER SECTION */}
          <div className="relative z-20 pt-4 px-4 flex justify-between items-start">
             {/* MANA GEM */}
             <div 
               className="w-12 h-12 flex items-center justify-center transform -rotate-45 border-2 shadow-[0_0_15px_rgba(0,0,0,0.8)]"
               style={{ 
                 background: theme.border, 
                 borderColor: theme.text,
                 boxShadow: `0 0 20px ${theme.glow}`
               }}
             >
               <div className="transform rotate-45 font-serif font-bold text-2xl text-white drop-shadow-md">
                 {data.manaCost}
               </div>
             </div>

             {/* ELEMENT ICON OR COUNTER BADGE */}
             <div className="flex gap-2 items-center">
                 {data.isCounter && (
                     <div className="bg-red-600 border border-red-400 rounded-full w-8 h-8 flex items-center justify-center shadow-lg shadow-red-600/50 animate-pulse">
                         <Undo2 size={16} className="text-white" strokeWidth={3} />
                     </div>
                 )}
                 <div className="opacity-80 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
                    <ElementIcon element={data.element} className="w-8 h-8 text-white" />
                 </div>
             </div>
          </div>

          {/* NAME PLATE */}
          <div className="relative z-20 mt-4 px-2">
            <div className="relative py-2 px-4">
              {/* Decorative side lines */}
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              
              <h1 className="relative text-center font-serif text-2xl font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase">
                {data.name}
              </h1>
              
              <div className="flex justify-center items-center gap-2 mt-1">
                 <div className="h-[1px] w-8 bg-white/30"></div>
                 <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-gray-300 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                   {t[data.type]}
                 </div>
                 <div className="h-[1px] w-8 bg-white/30"></div>
              </div>
            </div>
          </div>

          {/* MECHANICS CONTAINER (Bottom Half) */}
          <div className="relative z-20 mt-auto m-3 mb-3 flex flex-col gap-2">
            
            {/* Main Text Box (Glassmorphism) */}
            <div 
              className="p-4 rounded-xl border backdrop-blur-md flex flex-col gap-3"
              style={{ 
                backgroundColor: `rgba(0, 0, 0, ${contentOpacityValue})`, 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)' 
              }}
            >
              {/* Flavor Text / Base Description */}
              <div className="pb-3 border-b border-white/10">
                <p className="font-serif italic text-sm text-gray-300 leading-snug text-center">
                  "{data.baseDescription}"
                </p>
              </div>

              {/* Dice Mechanics */}
              <div className="flex flex-col">
                 <CastRow tier={CastTier.WEAK} config={data.castWeak} theme={theme} language={language as Language} />
                 <CastRow tier={CastTier.GOOD} config={data.castGood} theme={theme} language={language as Language} />
                 <CastRow tier={CastTier.PERFECT} config={data.castPerfect} theme={theme} language={language as Language} />
              </div>
            </div>

            {/* Footer Stats Bar */}
            <div className="h-8 rounded-lg bg-black/80 backdrop-blur border border-white/10 flex items-center justify-between px-4 text-[10px] font-mono text-gray-400">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                    <Clock size={12} className={data.cooldown > 3 ? "text-red-400" : "text-gray-400"} />
                    <span className="tracking-widest">{t.cooldown} {data.cooldown}</span>
                 </div>
               </div>

               <div className="w-[1px] h-4 bg-white/10"></div>

               <div className="flex items-center gap-1.5">
                  <span className="tracking-widest">{t.range} {data.range}</span>
                  <Move size={12} className="text-gray-400" />
               </div>
            </div>

          </div>

          {/* Card Shine/Reflection Effect (CSS Overlay) */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none opacity-20"
            style={{
              background: 'linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.1) 40%, transparent 50%)'
            }}
          ></div>
        </div>
      </div>

      {/* Export Action */}
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold py-2.5 px-8 rounded-full shadow-lg shadow-white/10 transition-all text-sm uppercase tracking-wider"
      >
        <Download size={16} />
        Salvar Card
      </button>
    </div>
  );
};