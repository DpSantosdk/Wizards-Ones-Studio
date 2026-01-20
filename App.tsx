import React, { useState } from 'react';
import { CardEditor } from './components/CardEditor';
import { CardPreview } from './components/CardPreview';
import { RuneEditor } from './components/RuneEditor';
import { RunePreview } from './components/RunePreview';
import { ArtefactEditor } from './components/ArtefactEditor';
import { ArtefactPreview } from './components/ArtefactPreview';
import { AltarEditor } from './components/AltarEditor'; // Keeping filename but using Structure logic
import { AltarPreview } from './components/AltarPreview'; // Keeping filename but using Structure logic
import { ImageCropper } from './components/ImageCropper';
import { INITIAL_CARD, INITIAL_RUNE, INITIAL_ARTEFACT, INITIAL_STRUCTURE, TRANSLATIONS } from './constants';
import { CardData, RuneData, ArtefactData, StructureData, Language, AppMode } from './types';
import { Scroll, Hexagon, Hammer, ArrowLeft, Landmark, Castle, Scissors, Eye, Edit3 } from 'lucide-react';

const App = () => {
  const [activeCard, setActiveCard] = useState<CardData>(INITIAL_CARD);
  const [activeRune, setActiveRune] = useState<RuneData>(INITIAL_RUNE);
  const [activeArtefact, setActiveArtefact] = useState<ArtefactData>(INITIAL_ARTEFACT);
  const [activeStructure, setActiveStructure] = useState<StructureData>(INITIAL_STRUCTURE);
  
  const [appLanguage, setAppLanguage] = useState<Language>('pt-BR');
  const [cardLanguage, setCardLanguage] = useState<Language>('pt-BR');
  const [appMode, setAppMode] = useState<AppMode>(AppMode.MENU);

  const t = TRANSLATIONS[appLanguage].menu;
  const tUi = TRANSLATIONS[appLanguage].ui;

  const renderMenu = () => (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center relative overflow-hidden p-6">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }} 
        />

      <div className="z-10 text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 via-yellow-200 to-yellow-600 mb-2 drop-shadow-lg">
          {t.title}
        </h1>
        <p className="text-gray-400 font-mono tracking-widest uppercase text-xs md:text-sm">{t.subtitle}</p>
        
        {/* Language Toggles in Menu */}
        <div className="flex justify-center gap-4 mt-6">
             <button 
                onClick={() => setAppLanguage('pt-BR')} 
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border ${appLanguage === 'pt-BR' ? 'border-yellow-500 text-yellow-500 bg-yellow-900/20' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
             >
               PT-BR
             </button>
             <button 
                onClick={() => setAppLanguage('en-US')} 
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border ${appLanguage === 'en-US' ? 'border-yellow-500 text-yellow-500 bg-yellow-900/20' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
             >
               EN-US
             </button>
        </div>
      </div>

      <div className="z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl px-4 pb-12">
        {/* Power Card Button */}
        <button 
          onClick={() => setAppMode(AppMode.POWER_CARD)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-yellow-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:-translate-y-1 text-left flex flex-col gap-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Scroll size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-yellow-900/30 rounded-lg flex items-center justify-center border border-yellow-500/30 group-hover:bg-yellow-500 group-hover:text-black transition-colors text-yellow-500">
            <Scroll size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white mb-2">{t.powerCard}</h2>
            <p className="text-gray-400 text-xs leading-relaxed">{t.powerCardDesc}</p>
          </div>
        </button>

        {/* Rune Button */}
        <button 
          onClick={() => setAppMode(AppMode.RUNE)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-1 text-left flex flex-col gap-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hexagon size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500 group-hover:text-black transition-colors text-blue-500">
            <Hexagon size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white mb-2">{t.rune}</h2>
            <p className="text-gray-400 text-xs leading-relaxed">{t.runeDesc}</p>
          </div>
        </button>

        {/* Structure Button (Was Altar) */}
        <button 
          onClick={() => setAppMode(AppMode.STRUCTURE)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-teal-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] hover:-translate-y-1 text-left flex flex-col gap-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Landmark size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-teal-900/30 rounded-lg flex items-center justify-center border border-teal-500/30 group-hover:bg-teal-500 group-hover:text-black transition-colors text-teal-500">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white mb-2">{t.structure}</h2>
            <p className="text-gray-400 text-xs leading-relaxed">{t.structureDesc}</p>
          </div>
        </button>

        {/* Artefact Button */}
        <button 
          onClick={() => setAppMode(AppMode.ARTEFACT)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:-translate-y-1 text-left flex flex-col gap-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-amber-900/30 rounded-lg flex items-center justify-center border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition-colors text-amber-500">
            <Hammer size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white mb-2">{t.artefact}</h2>
            <p className="text-gray-400 text-xs leading-relaxed">{t.artefactDesc}</p>
          </div>
        </button>

         {/* Image Cropper Button */}
        <button 
          onClick={() => setAppMode(AppMode.IMAGE_CROPPER)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-pink-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:-translate-y-1 text-left flex flex-col gap-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Scissors size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-pink-900/30 rounded-lg flex items-center justify-center border border-pink-500/30 group-hover:bg-pink-500 group-hover:text-black transition-colors text-pink-500">
            <Scissors size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-bold text-white mb-2">{t.imageCropper}</h2>
            <p className="text-gray-400 text-xs leading-relaxed">{t.imageCropperDesc}</p>
          </div>
        </button>

        {/* Sanctuary Button (Placeholder) */}
        <button 
          onClick={() => setAppMode(AppMode.SANCTUARY)}
          className="group relative bg-[#1a1a1a] border border-gray-700 hover:border-gray-500 rounded-xl p-6 transition-all duration-300 text-left flex flex-col gap-4 overflow-hidden opacity-70"
        >
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Castle size={80} className="md:w-[100px] md:h-[100px]" />
          </div>
          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600 group-hover:bg-gray-700 group-hover:text-white transition-colors text-gray-500">
            <Castle size={20} />
          </div>
          <div>
             <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg md:text-xl font-serif font-bold text-gray-300">{t.sanctuary}</h2>
                <span className="text-[8px] md:text-[10px] bg-gray-800 border border-gray-600 px-2 py-0.5 rounded text-gray-400 uppercase tracking-widest">{t.underConstruction}</span>
             </div>
            <p className="text-gray-500 text-xs leading-relaxed">{t.sanctuaryDesc}</p>
          </div>
        </button>
      </div>
    </div>
  );

  // Shared Wrapper for Editor/Preview Layout
  const SharedEditorLayout = ({ 
    title, 
    colorClass, 
    bgPatternColor,
    editorComponent, 
    previewComponent 
  }: { 
    title: string, 
    colorClass: string,
    bgPatternColor: string, 
    editorComponent: React.ReactNode, 
    previewComponent: React.ReactNode 
  }) => {
    const [mobileTab, setMobileTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');

    return (
      <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col md:flex-row overflow-hidden font-sans">
        
        {/* Editor Sidebar (Mobile: Toggled, Desktop: Always visible) */}
        <div className={`
          w-full md:w-[450px] lg:w-[500px] border-r border-gray-800 bg-[#1a1a1a] flex-col h-[calc(100vh-60px)] md:h-screen z-10 shadow-2xl
          ${mobileTab === 'EDITOR' ? 'flex' : 'hidden md:flex'}
        `}>
          <div className="p-4 border-b border-gray-800 bg-black/20">
            <button 
              onClick={() => setAppMode(AppMode.MENU)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> {t.back}
            </button>
          </div>
          {editorComponent}
        </div>

        {/* Preview Area (Mobile: Toggled, Desktop: Always visible) */}
        <div className={`
          flex-1 bg-[#121212] relative flex-col
          ${mobileTab === 'PREVIEW' ? 'flex' : 'hidden md:flex'}
        `}>
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
            style={{ backgroundImage: `radial-gradient(${bgPatternColor} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
          />
          <header className="p-6 border-b border-gray-800 bg-[#1a1a1a]/50 backdrop-blur-sm flex justify-between items-center z-20">
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-100 tracking-wider">Wizards Ones</h1>
              <p className={`text-xs ${colorClass} uppercase tracking-widest`}>{title}</p>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-8 overflow-auto pb-24 md:pb-8">
            {/* Scale Wrapper for Mobile */}
            <div className="transform scale-75 sm:scale-90 md:scale-100 origin-top md:origin-center transition-transform duration-300">
               {previewComponent}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#111] border-t border-gray-800 z-50 flex items-center justify-around">
            <button 
              onClick={() => setMobileTab('EDITOR')}
              className={`flex flex-col items-center gap-1 p-2 w-full ${mobileTab === 'EDITOR' ? colorClass : 'text-gray-500'}`}
            >
              <Edit3 size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tUi.edit}</span>
            </button>
            <div className="w-[1px] h-8 bg-gray-800"></div>
            <button 
              onClick={() => setMobileTab('PREVIEW')}
              className={`flex flex-col items-center gap-1 p-2 w-full ${mobileTab === 'PREVIEW' ? colorClass : 'text-gray-500'}`}
            >
              <Eye size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tUi.view}</span>
            </button>
        </div>
      </div>
    );
  };

  const renderPowerCardEditor = () => (
    <SharedEditorLayout 
      title={`${t.powerCard} Studio`}
      colorClass="text-gray-500"
      bgPatternColor="#444"
      editorComponent={
        <CardEditor 
          card={activeCard} 
          onChange={setActiveCard} 
          appLanguage={appLanguage}
          setAppLanguage={setAppLanguage}
          cardLanguage={cardLanguage}
          setCardLanguage={setCardLanguage}
        />
      }
      previewComponent={
        <CardPreview data={activeCard} language={cardLanguage} />
      }
    />
  );

  const renderRuneEditor = () => (
    <SharedEditorLayout 
      title={`${t.rune} Forge`}
      colorClass="text-blue-500"
      bgPatternColor="#3b82f6"
      editorComponent={
        <RuneEditor 
          rune={activeRune} 
          onChange={setActiveRune} 
          appLanguage={appLanguage}
          setAppLanguage={setAppLanguage}
          cardLanguage={cardLanguage}
          setCardLanguage={setCardLanguage}
        />
      }
      previewComponent={
        <RunePreview data={activeRune} language={cardLanguage} />
      }
    />
  );

  const renderArtefactEditor = () => (
    <SharedEditorLayout 
      title={`${t.artefact} Workshop`}
      colorClass="text-amber-500"
      bgPatternColor="#f59e0b"
      editorComponent={
        <ArtefactEditor 
          artefact={activeArtefact} 
          onChange={setActiveArtefact} 
          appLanguage={appLanguage}
          setAppLanguage={setAppLanguage}
          cardLanguage={cardLanguage}
          setCardLanguage={setCardLanguage}
        />
      }
      previewComponent={
        <ArtefactPreview data={activeArtefact} language={cardLanguage} />
      }
    />
  );

  const renderStructureEditor = () => (
    <SharedEditorLayout 
      title={`${t.structure} Construction`}
      colorClass="text-teal-500"
      bgPatternColor="#14b8a6"
      editorComponent={
        <AltarEditor 
          altar={activeStructure} 
          onChange={setActiveStructure} 
          appLanguage={appLanguage}
          setAppLanguage={setAppLanguage}
          cardLanguage={cardLanguage}
          setCardLanguage={setCardLanguage}
        />
      }
      previewComponent={
        <AltarPreview data={activeStructure} language={cardLanguage} />
      }
    />
  );

  const renderImageCropper = () => (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col overflow-hidden font-sans">
      <div className="p-4 border-b border-gray-800 bg-[#1a1a1a] flex items-center gap-4 z-20 shadow-lg">
          <button 
            onClick={() => setAppMode(AppMode.MENU)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> {t.back}
          </button>
          <div className="h-4 w-[1px] bg-gray-700"></div>
          <span className="text-xs text-gray-500 uppercase tracking-widest">{t.imageCropper}</span>
      </div>
      
      <div className="flex-1 relative">
         <ImageCropper appLanguage={appLanguage} />
      </div>
    </div>
  );

  const renderSanctuaryPlaceholder = () => (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-center p-6 relative">
       <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }} 
        />
       
       <Castle size={64} className="text-gray-500 mb-6 opacity-50 animate-pulse" />
       <h2 className="text-3xl font-serif font-bold text-white mb-4">{t.sanctuary}</h2>
       <p className="text-gray-400 max-w-md mb-8">
         {t.underConstruction}
       </p>
       <button 
          onClick={() => setAppMode(AppMode.MENU)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-colors border border-gray-700"
        >
          <ArrowLeft size={16} /> {t.back}
        </button>
    </div>
  );

  switch (appMode) {
    case AppMode.MENU: return renderMenu();
    case AppMode.POWER_CARD: return renderPowerCardEditor();
    case AppMode.RUNE: return renderRuneEditor();
    case AppMode.ARTEFACT: return renderArtefactEditor();
    case AppMode.STRUCTURE: return renderStructureEditor();
    case AppMode.IMAGE_CROPPER: return renderImageCropper();
    case AppMode.SANCTUARY: return renderSanctuaryPlaceholder();
    default: return renderMenu();
  }
};

export default App;