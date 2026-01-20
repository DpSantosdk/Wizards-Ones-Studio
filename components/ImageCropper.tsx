import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Upload, Download, Scissors, Image as ImageIcon, ZoomIn, Move } from 'lucide-react';

interface ImageCropperProps {
  appLanguage: Language;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ appLanguage }) => {
  const t = TRANSLATIONS[appLanguage].ui;
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Crop Box State (Percentage relative to image display size)
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 200, height: 300 }); // Initial arbitrary values
  const [zoomLevel, setZoomLevel] = useState(50); // 0 to 100

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cropStart = useRef({ x: 0, y: 0 });

  // Constants
  const ASPECT_RATIO = 2 / 3; // Card aspect ratio (roughly 400x600)
  const OUTPUT_WIDTH = 600;
  const OUTPUT_HEIGHT = 900;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        // Reset crop on new image
        setZoomLevel(50);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    
    // Initialize crop box in center
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const displayW = rect.width;
        const displayH = rect.height;
        
        // Default size: 50% of height (responsive)
        const h = displayH * 0.6;
        const w = h * ASPECT_RATIO;
        
        setCrop({
            x: (displayW - w) / 2,
            y: (displayH - h) / 2,
            width: w,
            height: h
        });
    }
  };

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    stopDrag();
  };

  // --- TOUCH HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    // e.preventDefault(); // Sometimes prevents scrolling, be careful
    if(e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling while dragging the crop box
    if (isDragging.current && e.cancelable) {
       e.preventDefault(); 
    }
    if(e.touches.length > 0) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    stopDrag();
  };

  // --- COMMON LOGIC ---
  const startDrag = (clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStart.current = { x: clientX, y: clientY };
    cropStart.current = { x: crop.x, y: crop.y };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging.current || !containerRef.current) return;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    let newX = cropStart.current.x + deltaX;
    let newY = cropStart.current.y + deltaY;

    // Boundary Checks
    const rect = containerRef.current.getBoundingClientRect();
    
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + crop.width > rect.width) newX = rect.width - crop.width;
    if (newY + crop.height > rect.height) newY = rect.height - crop.height;

    setCrop(prev => ({ ...prev, x: newX, y: newY }));
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  // Handle Zoom (Resizing the crop box)
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setZoomLevel(newVal);
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const minHeight = 50; // Smaller min height for mobile
    const maxHeight = rect.height * 0.98;
    
    // Map 0-100 to Height range
    const targetHeight = maxHeight - ((newVal / 100) * (maxHeight - minHeight));
    const targetWidth = targetHeight * ASPECT_RATIO;
    
    // Center resizing
    const centerX = crop.x + (crop.width / 2);
    const centerY = crop.y + (crop.height / 2);
    
    let newX = centerX - (targetWidth / 2);
    let newY = centerY - (targetHeight / 2);

    // Boundary checks
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + targetWidth > rect.width) newX = rect.width - targetWidth;
    if (newY + targetHeight > rect.height) newY = rect.height - targetHeight;

    setCrop({
        x: newX,
        y: newY,
        width: targetWidth,
        height: targetHeight
    });
  };

  const handleDownload = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Calculate source mapping
    const displayRect = containerRef.current.getBoundingClientRect();
    
    const img = imageRef.current;
    
    // Calculate scale
    const scale = Math.min(displayRect.width / img.naturalWidth, displayRect.height / img.naturalHeight);
    
    // Ensure we handle cases where the image is smaller than container effectively
    const renderedWidth = img.naturalWidth * scale;
    const renderedHeight = img.naturalHeight * scale;
    
    const offsetX = (displayRect.width - renderedWidth) / 2;
    const offsetY = (displayRect.height - renderedHeight) / 2;

    const cropRelX = crop.x - offsetX;
    const cropRelY = crop.y - offsetY;

    const sourceX = cropRelX / scale;
    const sourceY = cropRelY / scale;
    const sourceW = crop.width / scale;
    const sourceH = crop.height / scale;

    ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

    const link = document.createElement('a');
    link.download = 'wizards-ones-crop.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-200">
        
        {/* Header - Compact for Mobile */}
        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-black/30">
            <h2 className="text-lg md:text-xl font-serif font-bold flex items-center gap-2">
                <Scissors className="text-pink-500 w-5 h-5 md:w-6 md:h-6" /> 
                <span className="hidden md:inline">{t.cropperTitle}</span>
                <span className="md:hidden">Cropper</span>
            </h2>
             {!imageSrc && (
                <div className="relative">
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="cropper-upload" />
                <label htmlFor="cropper-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors">
                    <Upload size={16} /> {t.uploadImage}
                </label>
                </div>
            )}
            {imageSrc && (
                <div className="flex gap-2 md:gap-4">
                     <div className="relative flex items-center">
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="cropper-reupload" />
                        <label htmlFor="cropper-reupload" className="cursor-pointer text-gray-400 hover:text-white flex items-center gap-2 text-[10px] md:text-xs uppercase font-bold tracking-wider transition-colors">
                            <Upload size={14} /> <span className="hidden sm:inline">Re-Upload</span>
                        </label>
                    </div>
                    <button onClick={handleDownload} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg shadow-pink-500/20 transition-all">
                        <Download size={16} /> <span className="hidden sm:inline">{t.downloadCrop}</span>
                        <span className="sm:hidden">Salvar</span>
                    </button>
                </div>
            )}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8 bg-[#0a0a0a] touch-none">
            {!imageSrc ? (
                <div className="text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl p-8 md:p-12">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm md:text-base">Select an image to start.</p>
                </div>
            ) : (
                <div 
                    ref={containerRef}
                    className="relative w-full h-full select-none"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    // onTouchStart on container handled via dragging logic if we wanted pan, but here we drag crop box
                >
                    {/* The Image */}
                    <img 
                        ref={imageRef}
                        src={imageSrc} 
                        alt="Source" 
                        onLoad={handleImageLoad}
                        className="w-full h-full object-contain pointer-events-none opacity-50"
                        draggable={false}
                    />

                    {/* Dark Overlay Outside Crop (Simulated by opacity on base image + this trick? No, simple box shadow is best) */}
                    
                    {/* The Crop Box */}
                    <div 
                        className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] cursor-move flex items-center justify-center group touch-none"
                        style={{
                            left: crop.x,
                            top: crop.y,
                            width: crop.width,
                            height: crop.height,
                            // High contrast box shadow for dimming outside
                            boxShadow: '0 0 0 9999px rgba(0,0,0,0.85)',
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                         {/* Visual Guides */}
                         <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                            <div className="border-r border-white"></div>
                            <div className="border-r border-white"></div>
                            <div className="border-r border-white"></div> 
                            <div className="border-b border-white col-span-3 row-start-1"></div>
                            <div className="border-b border-white col-span-3 row-start-2"></div>
                         </div>
                         
                         {/* Move Icon */}
                         <Move className="text-white opacity-40 group-hover:opacity-100 drop-shadow-md transition-opacity" size={32} />
                         
                         {/* Card Ratio Indicator */}
                         <div className="absolute -top-6 left-0 text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider shadow">
                            2:3
                         </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer / Controls */}
        {imageSrc && (
            <div className="p-4 md:p-6 bg-gray-900 border-t border-gray-800 flex justify-center pb-8 md:pb-6">
                <div className="w-full max-w-md flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase text-gray-500 tracking-wider">
                        <span>Zoom Out</span>
                        <span className="text-pink-500">{t.zoom}</span>
                        <span>Zoom In</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ZoomIn size={16} className="text-gray-500" />
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={zoomLevel} 
                            onChange={handleZoomChange}
                            className="w-full h-4 md:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                         <ZoomIn size={24} className="text-gray-200" />
                    </div>
                    <p className="text-center text-[10px] text-gray-600 mt-1 hidden md:block">{t.dragToCrop}</p>
                </div>
            </div>
        )}
    </div>
  );
};