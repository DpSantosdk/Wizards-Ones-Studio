import React, { useCallback, useRef } from 'react';
import { ArtefactData, Language } from '../types';
import { ARTEFACT_THEME, TRANSLATIONS } from '../constants';
import { Download, Clock } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ArtefactPreviewProps {
  data: ArtefactData;
  language?: Language;
}

export const ArtefactPreview: React.FC<ArtefactPreviewProps> = ({ data, language = 'pt-BR' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language].card;

  const handleExport = useCallback(async () => {
    if (ref.current === null) return;
    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_ARTEFACT.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  }, [data]);

  const opacityValue = typeof data.imageOpacity === 'number' ? data.imageOpacity / 100 : 0.6;

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* ARTEFACT CARD CONTAINER */}
      <div 
        ref={ref}
        className="relative w-[380px] h-[600px] rounded-[18px] overflow-hidden flex flex-col shadow-2xl"
        style={{ backgroundColor: '#000' }}
      >
        {/* Animated Border Gradient */}
        <div 
          className="absolute inset-0 z-0 opacity-100"
          style={{ background: ARTEFACT_THEME.border }} 
        />
        
        {/* Inner Content Container */}
        <div className="absolute inset-[4px] bg-black rounded-[14px] z-10 overflow-hidden flex flex-col" style={{ backgroundColor: ARTEFACT_THEME.bg }}>
          
          {/* BACKGROUND ART */}
          <div className="absolute inset-0 z-0 bg-gray-900">
             {data.noBackground ? (
               // Abstract Background Pattern for Artefact
               <div 
                  className="w-full h-full"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 30%, ${ARTEFACT_THEME.accent}33 0%, transparent 70%),
                      linear-gradient(45deg, #1c1004 0%, #451a03 100%)
                    `
                  }}
               >
                  <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23f59e0b\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                  }}></div>
               </div>
             ) : (
                <img 
                src={data.imageUrl} 
                alt="Artefact Art" 
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: opacityValue }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600?blur' }}
                />
             )}
             
             {/* Gradient Overlay */}
             <div 
              className="absolute inset-0 z-10" 
              style={{ 
                background: `linear-gradient(to bottom, transparent 0%, rgba(28, 16, 4, 0.4) 40%, ${ARTEFACT_THEME.bg} 80%)` 
              }} 
             />
          </div>

          {/* NAME PLATE */}
          <div className="relative z-20 mt-6 px-3">
             {/* Top decorative bar */}
             <div className="h-1 w-2/3 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-2 opacity-70"></div>
             
             <div className="relative py-4 px-2 bg-black/60 backdrop-blur-md border border-amber-900/50 rounded-lg shadow-xl">
              <h1 className="relative text-center font-serif text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-600 drop-shadow-sm uppercase">
                {data.name}
              </h1>
            </div>
          </div>

          {/* DESCRIPTION CONTAINER */}
          <div className="relative z-20 mt-auto m-4 flex flex-col gap-4">
            <div 
              className="p-6 rounded-xl border flex flex-col gap-2 relative overflow-hidden"
              style={{ 
                backgroundColor: 'rgba(28, 16, 4, 0.85)', 
                borderColor: 'rgba(217, 119, 6, 0.3)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)' 
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              
              <p className="font-serif text-lg text-amber-100 leading-relaxed text-center italic">
                "{data.effect}"
              </p>
            </div>

            {/* Footer Stats Bar */}
            <div className="h-10 rounded-lg bg-black/80 backdrop-blur border border-amber-900/50 flex items-center justify-center px-4 text-xs font-mono text-amber-500/80 shadow-lg">
               <div className="flex items-center gap-2">
                  <Clock size={14} className={data.cooldown > 2 ? "text-red-500" : "text-amber-500"} />
                  <span className="tracking-[0.2em] font-bold">{t.cooldown} {data.cooldown}</span>
               </div>
            </div>

          </div>

          {/* Metallic Shine Effect */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none opacity-10"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(251, 191, 36, 0.3) 50%, transparent 60%)'
            }}
          ></div>
        </div>
      </div>

      {/* Export Action */}
      <button 
        onClick={handleExport}
        className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-full shadow-lg shadow-amber-600/20 transition-all text-sm uppercase tracking-wider border border-amber-500/20"
      >
        <Download size={16} />
        Salvar Artefato
      </button>
    </div>
  );
};