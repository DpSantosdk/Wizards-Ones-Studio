import React from 'react';
import { RuneData, Language } from '../types';
import { Upload, Image as ImageIcon, Hexagon, Languages, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface RuneEditorProps {
  rune: RuneData;
  onChange: (rune: RuneData) => void;
  appLanguage: Language;
  setAppLanguage: (lang: Language) => void;
  cardLanguage: Language;
  setCardLanguage: (lang: Language) => void;
}

const TextInput = ({ label, value, onChange, className = '' }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-blue-500 focus:outline-none text-white font-mono"
    />
  </div>
);

export const RuneEditor: React.FC<RuneEditorProps> = ({ 
  rune, onChange, appLanguage, setAppLanguage, cardLanguage, setCardLanguage 
}) => {
  const t = TRANSLATIONS[appLanguage];

  const updateField = (field: keyof RuneData, value: any) => {
    onChange({ ...rune, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Language Toggles */}
      <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <Languages className="text-gray-500" size={16} />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">App Language</span>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setAppLanguage('pt-BR')} className={`${appLanguage === 'pt-BR' ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>PT-BR</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setAppLanguage('en-US')} className={`${appLanguage === 'en-US' ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>EN-US</button>
            </div>
          </div>
        </div>
        <div className="w-[1px] h-8 bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-2">
          <Globe className="text-gray-500" size={16} />
           <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Card Language</span>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setCardLanguage('pt-BR')} className={`${cardLanguage === 'pt-BR' ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>PT-BR</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setCardLanguage('en-US')} className={`${cardLanguage === 'en-US' ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>EN-US</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <Hexagon className="text-blue-500" /> {t.ui.editorTitle}
        </h2>
        <p className="text-gray-400 text-sm">{t.ui.editorSubtitle}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest bg-gray-800 p-2 rounded">{t.ui.general}</h3>
        
        <TextInput label={t.ui.cardName} value={rune.name} onChange={(v: string) => updateField('name', v)} />

        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-baseline">
             <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.ui.art}</label>
             <span className="text-[10px] text-gray-500">Recomendado: 400x600px</span>
           </div>
           
           <div className="flex gap-2">
             <div className="relative flex-1">
               <ImageIcon className="absolute left-2 top-2.5 text-gray-500 w-4 h-4" />
               <input 
                type="text" 
                placeholder="https://..."
                value={rune.imageUrl} 
                onChange={e => updateField('imageUrl', e.target.value)}
                disabled={rune.noBackground}
                className={`w-full bg-gray-800 border border-gray-700 rounded p-2 pl-8 text-sm focus:border-blue-500 focus:outline-none text-white font-mono ${rune.noBackground ? 'opacity-50 cursor-not-allowed' : ''}`}
               />
             </div>
           </div>

           <div className="flex gap-4">
               <div className="relative flex-1">
                    <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="image-upload"
                    disabled={rune.noBackground}
                    />
                    <label 
                    htmlFor="image-upload" 
                    className={`flex items-center justify-center gap-2 w-full p-2 bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-600 rounded cursor-pointer transition-colors text-xs text-gray-300 ${rune.noBackground ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    >
                    <Upload size={14} /> {t.ui.upload}
                    </label>
               </div>
               
               <div className="flex items-center gap-2 px-2 bg-gray-800 border border-gray-700 rounded">
                    <input 
                        type="checkbox"
                        id="no-bg-toggle"
                        checked={rune.noBackground}
                        onChange={(e) => updateField('noBackground', e.target.checked)}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="no-bg-toggle" className="text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer whitespace-nowrap">
                        {t.ui.noBackground}
                    </label>
                </div>
           </div>
           
           <div className="flex flex-col gap-1 mt-2">
             <div className="flex justify-between text-xs text-gray-500">
                <label className="uppercase font-bold tracking-wider">{t.ui.fade}</label>
                <span>{rune.imageOpacity}%</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={rune.imageOpacity} 
               onChange={e => updateField('imageOpacity', Number(e.target.value))}
               disabled={rune.noBackground}
               className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 ${rune.noBackground ? 'opacity-50' : ''}`}
             />
           </div>
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-xs uppercase font-bold text-gray-500 tracking-wider text-blue-300">{t.ui.activationEffect}</label>
           <textarea 
             className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-blue-500 focus:outline-none text-white font-mono h-24"
             value={rune.activationEffect}
             onChange={e => updateField('activationEffect', e.target.value)}
           />
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-xs uppercase font-bold text-gray-500 tracking-wider text-purple-300">{t.ui.continuousEffect}</label>
           <textarea 
             className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-purple-500 focus:outline-none text-white font-mono h-24"
             value={rune.continuousEffect}
             onChange={e => updateField('continuousEffect', e.target.value)}
           />
        </div>
      </div>
    </div>
  );
};