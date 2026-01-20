import React, { useState } from 'react';
import { CardData, CardType, ElementType, CastTier, CastConfig, StatusEffect, Language, TargetType } from '../types';
import { Plus, Trash2, Wand2, Upload, Image as ImageIcon, Languages, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface CardEditorProps {
  card: CardData;
  onChange: (card: CardData) => void;
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
      className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-yellow-500 focus:outline-none text-white font-mono"
    />
  </div>
);

const NumberInput = ({ label, value, onChange, className = '' }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={e => onChange(Number(e.target.value))}
      className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-yellow-500 focus:outline-none text-white font-mono"
    />
  </div>
);

const SelectInput = ({ label, value, options, onChange, className = '', labelMap }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{label}</label>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-yellow-500 focus:outline-none text-white font-mono"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{labelMap ? labelMap[opt] : opt}</option>)}
    </select>
  </div>
);

const CastConfigEditor = ({ tier, config, onChange, t, cardLang }: { tier: CastTier, config: CastConfig, onChange: (c: CastConfig) => void, t: any, cardLang: Language }) => {
  
  // Effects Logic
  const addEffect = () => {
    const newEffect: StatusEffect = { id: Date.now().toString(), name: 'Burn', level: 1, chips: 1 };
    onChange({ ...config, effects: [...config.effects, newEffect] });
  };

  const updateEffect = (idx: number, field: keyof StatusEffect, val: any) => {
    const newEffects = [...config.effects];
    newEffects[idx] = { ...newEffects[idx], [field]: val };
    onChange({ ...config, effects: newEffects });
  };

  const removeEffect = (idx: number) => {
    const newEffects = config.effects.filter((_, i) => i !== idx);
    onChange({ ...config, effects: newEffects });
  };

  // Targets Logic
  const addTarget = () => {
    onChange({ ...config, targets: [...config.targets, TargetType.OPPONENT] });
  };
  
  const updateTarget = (idx: number, val: TargetType) => {
    const newTargets = [...config.targets];
    newTargets[idx] = val;
    onChange({ ...config, targets: newTargets });
  };

  const removeTarget = (idx: number) => {
    const newTargets = config.targets.filter((_, i) => i !== idx);
    onChange({ ...config, targets: newTargets });
  };

  return (
    <div className="p-4 bg-gray-800/50 rounded border border-gray-700 space-y-4">
      <h4 className="font-bold text-yellow-500 uppercase tracking-widest text-sm border-b border-gray-700 pb-2 mb-2">
        {t.ui.castConfig}: {t.ui[tier === CastTier.WEAK ? 'weak' : tier === CastTier.GOOD ? 'good' : 'perfect']}
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput label={t.ui.damage} value={config.damage || 0} onChange={(v: number) => onChange({...config, damage: v})} />
        <NumberInput label={t.ui.duration} value={config.duration || 0} onChange={(v: number) => onChange({...config, duration: v})} />
      </div>

      <TextInput label={t.ui.descEffect} value={config.description} onChange={(v: string) => onChange({...config, description: v})} />

      {/* Targets List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.ui.targets}</label>
          <button onClick={addTarget} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1">
            <Plus size={12} /> {t.ui.add}
          </button>
        </div>
        {config.targets.map((tgt, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-gray-900 p-2 rounded border border-gray-700">
             <select 
               className="flex-1 bg-transparent border-b border-gray-600 text-xs py-1 text-white font-mono focus:outline-none"
               value={tgt}
               onChange={(e) => updateTarget(idx, e.target.value as TargetType)}
             >
                {Object.values(TargetType).map(type => (
                  <option key={type} value={type}>{TRANSLATIONS[cardLang].card[type]}</option>
                ))}
             </select>
             <button onClick={() => removeTarget(idx)} className="text-red-400 hover:text-red-300">
               <Trash2 size={14} />
             </button>
          </div>
        ))}
      </div>

      {/* Effects List */}
      <div className="space-y-2 pt-2 border-t border-gray-700/50">
        <div className="flex justify-between items-center">
          <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.ui.statusEffects}</label>
          <button onClick={addEffect} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1">
            <Plus size={12} /> {t.ui.add}
          </button>
        </div>
        
        {config.effects.map((fx, idx) => (
          <div key={fx.id} className="flex gap-2 items-end bg-gray-900 p-2 rounded border border-gray-700">
             <div className="flex-1">
               <label className="text-[10px] text-gray-500">{t.ui.name}</label>
               <input className="w-full bg-transparent border-b border-gray-600 text-xs py-1" value={fx.name} onChange={e => updateEffect(idx, 'name', e.target.value)} />
             </div>
             <div className="w-16">
               <label className="text-[10px] text-gray-500">{t.ui.level}</label>
               <input type="number" className="w-full bg-transparent border-b border-gray-600 text-xs py-1" value={fx.level} onChange={e => updateEffect(idx, 'level', Number(e.target.value))} />
             </div>
             <div className="w-16">
               <label className="text-[10px] text-gray-500">{t.ui.chips}</label>
               <input type="number" className="w-full bg-transparent border-b border-gray-600 text-xs py-1" value={fx.chips} onChange={e => updateEffect(idx, 'chips', Number(e.target.value))} />
             </div>
             <button onClick={() => removeEffect(idx)} className="text-red-400 hover:text-red-300 pb-1">
               <Trash2 size={14} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardEditor: React.FC<CardEditorProps> = ({ 
  card, onChange, appLanguage, setAppLanguage, cardLanguage, setCardLanguage 
}) => {
  const [activeTab, setActiveTab] = useState<CastTier>(CastTier.GOOD);
  const t = TRANSLATIONS[appLanguage];

  const updateField = (field: keyof CardData, value: any) => {
    onChange({ ...card, [field]: value });
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

  const updateCastConfig = (tier: CastTier, config: CastConfig) => {
    if (tier === CastTier.WEAK) updateField('castWeak', config);
    else if (tier === CastTier.GOOD) updateField('castGood', config);
    else if (tier === CastTier.PERFECT) updateField('castPerfect', config);
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
              <button onClick={() => setAppLanguage('pt-BR')} className={`${appLanguage === 'pt-BR' ? 'text-yellow-500 font-bold' : 'text-gray-400'}`}>PT-BR</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setAppLanguage('en-US')} className={`${appLanguage === 'en-US' ? 'text-yellow-500 font-bold' : 'text-gray-400'}`}>EN-US</button>
            </div>
          </div>
        </div>
        <div className="w-[1px] h-8 bg-gray-700 mx-2"></div>
        <div className="flex items-center gap-2">
          <Globe className="text-gray-500" size={16} />
           <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Card Language</span>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setCardLanguage('pt-BR')} className={`${cardLanguage === 'pt-BR' ? 'text-yellow-500 font-bold' : 'text-gray-400'}`}>PT-BR</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setCardLanguage('en-US')} className={`${cardLanguage === 'en-US' ? 'text-yellow-500 font-bold' : 'text-gray-400'}`}>EN-US</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
          <Wand2 className="text-yellow-500" /> {t.ui.editorTitle}
        </h2>
        <p className="text-gray-400 text-sm">{t.ui.editorSubtitle}</p>
      </div>

      <div className="space-y-4 border-b border-gray-700 pb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest bg-gray-800 p-2 rounded">{t.ui.general}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <TextInput label={t.ui.cardName} value={card.name} onChange={(v: string) => updateField('name', v)} className="col-span-2" />
          <SelectInput 
            label={t.ui.type} 
            value={card.type} 
            options={Object.values(CardType)} 
            onChange={(v: CardType) => updateField('type', v)}
            labelMap={TRANSLATIONS[cardLanguage].card} 
          />
          <SelectInput 
            label={t.ui.element} 
            value={card.element} 
            options={Object.values(ElementType)} 
            onChange={(v: ElementType) => updateField('element', v)}
            labelMap={TRANSLATIONS[cardLanguage].card}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <NumberInput label={t.ui.manaCost} value={card.manaCost} onChange={(v: number) => updateField('manaCost', v)} />
          <NumberInput label={t.ui.cooldown} value={card.cooldown} onChange={(v: number) => updateField('cooldown', v)} />
          <NumberInput label={t.ui.range} value={card.range} onChange={(v: number) => updateField('range', v)} />
        </div>

        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-baseline">
             <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.ui.art}</label>
             <span className="text-[10px] text-gray-500">Recomendado: 400x600px (2:3)</span>
           </div>
           
           <div className="flex gap-2">
             <div className="relative flex-1">
               <ImageIcon className="absolute left-2 top-2.5 text-gray-500 w-4 h-4" />
               <input 
                type="text" 
                placeholder="https://..."
                value={card.imageUrl} 
                onChange={e => updateField('imageUrl', e.target.value)}
                disabled={card.noBackground}
                className={`w-full bg-gray-800 border border-gray-700 rounded p-2 pl-8 text-sm focus:border-yellow-500 focus:outline-none text-white font-mono ${card.noBackground ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={card.noBackground}
                    />
                    <label 
                    htmlFor="image-upload" 
                    className={`flex items-center justify-center gap-2 w-full p-2 bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-600 rounded cursor-pointer transition-colors text-xs text-gray-300 ${card.noBackground ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    >
                    <Upload size={14} /> {t.ui.upload}
                    </label>
                </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-750 transition-colors">
                    <input 
                        type="checkbox"
                        id="no-bg-toggle"
                        checked={card.noBackground}
                        onChange={(e) => updateField('noBackground', e.target.checked)}
                        className="w-4 h-4 accent-yellow-500 cursor-pointer"
                    />
                    <label htmlFor="no-bg-toggle" className="text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer whitespace-nowrap">
                        {t.ui.noBackground}
                    </label>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-750 transition-colors flex-1">
                    <input 
                        type="checkbox"
                        id="is-counter-toggle"
                        checked={card.isCounter}
                        onChange={(e) => updateField('isCounter', e.target.checked)}
                        className="w-4 h-4 accent-red-500 cursor-pointer"
                    />
                    <label htmlFor="is-counter-toggle" className="text-xs font-bold text-red-400 uppercase tracking-wider cursor-pointer whitespace-nowrap">
                        {t.ui.isCounter}
                    </label>
                </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-500">
                    <label className="uppercase font-bold tracking-wider">{t.ui.fade}</label>
                    <span>{card.imageOpacity || 60}%</span>
                </div>
                <input 
                type="range" 
                min="0" 
                max="100" 
                value={card.imageOpacity || 60} 
                onChange={e => updateField('imageOpacity', Number(e.target.value))}
                disabled={card.noBackground}
                className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 ${card.noBackground ? 'opacity-50' : ''}`}
                />
             </div>
             
             <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-500">
                    <label className="uppercase font-bold tracking-wider">{t.ui.contentFade}</label>
                    <span>{card.contentOpacity || 85}%</span>
                </div>
                <input 
                type="range" 
                min="0" 
                max="100" 
                value={card.contentOpacity || 85} 
                onChange={e => updateField('contentOpacity', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
             </div>
           </div>
        </div>

        <div className="flex flex-col gap-1">
           <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">{t.ui.descBase}</label>
           <textarea 
             className="bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-yellow-500 focus:outline-none text-white font-mono h-20"
             value={card.baseDescription}
             onChange={e => updateField('baseDescription', e.target.value)}
           />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest bg-gray-800 p-2 rounded w-full">{t.ui.castConfig}</h3>
        </div>
        
        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
          {Object.values(CastTier).map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTab(tier)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                activeTab === tier 
                  ? 'bg-yellow-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-800'
              }`}
            >
              {tier === CastTier.WEAK ? t.ui.weak : tier === CastTier.GOOD ? t.ui.good : t.ui.perfect}
            </button>
          ))}
        </div>

        {activeTab === CastTier.WEAK && (
          <CastConfigEditor 
            tier={CastTier.WEAK} 
            config={card.castWeak} 
            onChange={c => updateCastConfig(CastTier.WEAK, c)} 
            t={t}
            cardLang={cardLanguage}
          />
        )}
        {activeTab === CastTier.GOOD && (
          <CastConfigEditor 
            tier={CastTier.GOOD} 
            config={card.castGood} 
            onChange={c => updateCastConfig(CastTier.GOOD, c)}
            t={t}
            cardLang={cardLanguage}
          />
        )}
        {activeTab === CastTier.PERFECT && (
          <CastConfigEditor 
            tier={CastTier.PERFECT} 
            config={card.castPerfect} 
            onChange={c => updateCastConfig(CastTier.PERFECT, c)}
            t={t}
            cardLang={cardLanguage}
          />
        )}
      </div>
    </div>
  );
};