import React, { useCallback, useRef } from 'react';
import { RuneData, Language } from '../types';
import { RUNE_THEME, TRANSLATIONS } from '../constants';
import { Download, Zap, Infinity } from 'lucide-react';
import { toPng } from 'html-to-image';

interface RunePreviewProps {
  data: RuneData;
  language?: Language;
}

export const RunePreview: React.FC<RunePreviewProps> = ({ data, language = 'pt-BR' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language].ui;

  const handleExport = useCallback(async () => {
    if (ref.current === null) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_RUNE.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  }, [data]);

  const opacityValue = typeof data.imageOpacity === 'number' ? data.imageOpacity / 100 : 0.6;

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* RUNE CARD CONTAINER */}
      <div 
        ref={ref}
        className="relative w-[380px] h-[600px] rounded-[18px] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: '#000' }}
      >
        {/* Animated Border Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{ background: RUNE_THEME.border }} 
        />
        
        {/* Inner Content Container */}
        <div className="absolute inset-[4px] bg-black rounded-[14px] z-10 overflow-hidden flex flex-col" style={{ backgroundColor: RUNE_THEME.bg }}>
          
          {/* BACKGROUND ART */}
          <div className="absolute inset-0 z-0 bg-gray-900">
             {data.noBackground ? (
                // Abstract Background Pattern for Rune
               <div 
                  className="w-full h-full"
                  style={{
                    background: `
                      linear-gradient(180deg, ${RUNE_THEME.bg} 0%, #2e1065 50%, ${RUNE_THEME.bg} 100%),
                      radial-gradient(circle at 50% 50%, ${RUNE_THEME.accent}44 0%, transparent 60%)
                    `
                  }}
               >
                 {/* Geometric Pattern Overlay */}
                 <div className="absolute inset-0 opacity-10" style={{ 
                     backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                     backgroundSize: '20px 20px'
                 }}></div>
               </div>
             ) : (
                <img 
                src={data.imageUrl} 
                alt="Rune Art" 
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: opacityValue }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600?grayscale' }}
                />
             )}
             
             {/* Gradient Overlay */}
             <div 
              className="absolute inset-0 z-10" 
              style={{ 
                background: `linear-gradient(to bottom, transparent 0%, rgba(15, 5, 24, 0.4) 40%, ${RUNE_THEME.bg} 80%)` 
              }} 
             />
          </div>

          {/* NAME PLATE */}
          <div className="relative z-20 mt-8 px-4">
            <div className="relative py-3 px-4 border-y border-purple-500/30 bg-black/40 backdrop-blur-sm">
              <h1 className="relative text-center font-serif text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 drop-shadow-sm uppercase">
                {data.name}
              </h1>
            </div>
          </div>

          {/* EFFECTS CONTAINER */}
          <div className="relative z-20 mt-auto m-4 flex flex-col gap-4">
            
            {/* Activation Effect */}
            <div 
              className="p-4 rounded-xl border flex flex-col gap-2 relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(30, 10, 60, 0.8)', 
                borderColor: 'rgba(59, 130, 246, 0.3)',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)' 
              }}
            >
              <div className="flex items-center gap-2 text-blue-400 border-b border-blue-500/20 pb-2 mb-1">
                 <Zap size={16} />
                 <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{t.activationEffect}</span>
              </div>
              <p className="font-serif text-sm text-blue-100 leading-relaxed text-shadow-sm">
                {data.activationEffect}
              </p>
            </div>

            {/* Continuous Effect */}
            <div 
              className="p-4 rounded-xl border flex flex-col gap-2 relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(20, 5, 40, 0.8)', 
                borderColor: 'rgba(168, 85, 247, 0.3)',
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' 
              }}
            >
              <div className="flex items-center gap-2 text-purple-400 border-b border-purple-500/20 pb-2 mb-1">
                 <Infinity size={16} />
                 <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{t.continuousEffect}</span>
              </div>
              <p className="font-serif text-sm text-purple-100 leading-relaxed text-shadow-sm">
                {data.continuousEffect}
              </p>
            </div>

          </div>

          {/* Rune Shine Effect */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none opacity-10"
            style={{
              background: 'linear-gradient(125deg, transparent 30%, rgba(168, 85, 247, 0.2) 40%, transparent 50%)'
            }}
          ></div>
        </div>
      </div>

      {/* Export Action */}
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded-full shadow-lg shadow-blue-500/20 transition-all text-sm uppercase tracking-wider"
      >
        <Download size={16} />
        Salvar Runa
      </button>
    </div>
  );
};