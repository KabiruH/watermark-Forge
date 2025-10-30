'use client';

import { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import Link from 'next/link';

interface ImageFile {
  file: File;
  url: string;
  name: string;
}

interface Logo {
  id: number;
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  positionMode: 'absolute' | 'relative';
  relativeX?: number;
  relativeY?: number;
  relativeWidth?: number;
}

interface TextWatermark {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  positionMode: 'absolute' | 'relative';
  relativeX?: number;
  relativeY?: number;
  relativeFontSize?: number;
}

interface Frame {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth: number;
  borderColor: string;
  opacity: number;
  positionMode: 'absolute' | 'relative';
  relativeX?: number;
  relativeY?: number;
  relativeWidth?: number;
  relativeHeight?: number;
  relativeBorderWidth?: number;
}

interface DraggingState {
  type: 'logo' | 'text' | 'frame' | 'frame-resize';
  id: number;
  resizeHandle?: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
}

export default function WatermarkForge() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [textWatermarks, setTextWatermarks] = useState<TextWatermark[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [presetName, setPresetName] = useState('');
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialFrameState, setInitialFrameState] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [cursorStyle, setCursorStyle] = useState('grab');

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles: ImageFile[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(imageFiles);
    if (imageFiles.length > 0 && !previewImage) {
      setPreviewImage(imageFiles[0].url);
    }
  };

  // Handle logo uploads
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setLogos(prev => [...prev, {
          id: Date.now() + Math.random(),
          image: img,
          x: 50,
          y: 50,
          width: 150,
          height: (img.height / img.width) * 150,
          opacity: 1,
          positionMode: 'relative',
          relativeX: 5,
          relativeY: 5,
          relativeWidth: 15
        }]);
      };
    });
  };

  // Add text watermark
  const addTextWatermark = () => {
    setTextWatermarks(prev => [...prev, {
      id: Date.now(),
      text: 'Sample Text',
      x: 100,
      y: 100,
      fontSize: 48,
      fontFamily: 'Arial',
      color: '#000000',
      opacity: 1,
      positionMode: 'relative',
      relativeX: 50,
      relativeY: 50,
      relativeFontSize: 5
    }]);
  };

  // Add frame
  const addFrame = () => {
    setFrames(prev => [...prev, {
      id: Date.now(),
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      borderWidth: 5,
      borderColor: '#000000',
      opacity: 1,
      positionMode: 'relative',
      relativeX: 5,
      relativeY: 5,
      relativeWidth: 90,
      relativeHeight: 90,
      relativeBorderWidth: 0.5
    }]);
  };

  // Update logo properties
  const updateLogo = (id: number, updates: Partial<Logo>) => {
    setLogos(prev => prev.map(logo => 
      logo.id === id ? { ...logo, ...updates } : logo
    ));
  };

  // Update text watermark properties
  const updateText = (id: number, updates: Partial<TextWatermark>) => {
    setTextWatermarks(prev => prev.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  // Update frame properties
  const updateFrame = (id: number, updates: Partial<Frame>) => {
    setFrames(prev => prev.map(frame => 
      frame.id === id ? { ...frame, ...updates } : frame
    ));
  };

  // Remove logo
  const removeLogo = (id: number) => {
    setLogos(prev => prev.filter(logo => logo.id !== id));
  };

  // Remove text
  const removeText = (id: number) => {
    setTextWatermarks(prev => prev.filter(text => text.id !== id));
  };

  // Remove frame
  const removeFrame = (id: number) => {
    setFrames(prev => prev.filter(frame => frame.id !== id));
  };

  // Draw preview canvas
  useEffect(() => {
    if (!previewImage || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    
    img.src = previewImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      setPreviewDimensions({ width: img.width, height: img.height });

      syncRelativeFromAbsolute(img.width, img.height);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      frames.forEach(frame => {
        ctx.globalAlpha = frame.opacity;
        ctx.strokeStyle = frame.borderColor;
        ctx.lineWidth = frame.borderWidth;
        ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ff6b35';
        const handleSize = 8;
        
        ctx.fillRect(frame.x - handleSize/2, frame.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x + frame.width - handleSize/2, frame.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x - handleSize/2, frame.y + frame.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x + frame.width - handleSize/2, frame.y + frame.height - handleSize/2, handleSize, handleSize);
        
        ctx.fillRect(frame.x + frame.width/2 - handleSize/2, frame.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x + frame.width/2 - handleSize/2, frame.y + frame.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x - handleSize/2, frame.y + frame.height/2 - handleSize/2, handleSize, handleSize);
        ctx.fillRect(frame.x + frame.width - handleSize/2, frame.y + frame.height/2 - handleSize/2, handleSize, handleSize);
      });

      logos.forEach(logo => {
        ctx.globalAlpha = logo.opacity;
        ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
      });

      textWatermarks.forEach(text => {
        ctx.globalAlpha = text.opacity;
        ctx.font = `${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.x, text.y);
      });

      ctx.globalAlpha = 1;
    };
  }, [previewImage, logos, textWatermarks, frames]);

  // Handle mouse down on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    for (let i = frames.length - 1; i >= 0; i--) {
      const frame = frames[i];
      const resizeHandle = getFrameResizeHandle(frame, x, y);
      
      if (resizeHandle) {
        setDragging({ type: 'frame-resize', id: frame.id, resizeHandle: resizeHandle as any });
        setDragOffset({ x, y });
        setInitialFrameState({ x: frame.x, y: frame.y, width: frame.width, height: frame.height });
        return;
      }
      
      if (x >= frame.x && x <= frame.x + frame.width &&
          y >= frame.y && y <= frame.y + frame.height) {
        setDragging({ type: 'frame', id: frame.id });
        setDragOffset({ x: x - frame.x, y: y - frame.y });
        return;
      }
    }

    for (let i = logos.length - 1; i >= 0; i--) {
      const logo = logos[i];
      if (x >= logo.x && x <= logo.x + logo.width &&
          y >= logo.y && y <= logo.y + logo.height) {
        setDragging({ type: 'logo', id: logo.id });
        setDragOffset({ x: x - logo.x, y: y - logo.y });
        return;
      }
    }

    for (let i = textWatermarks.length - 1; i >= 0; i--) {
      const text = textWatermarks[i];
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      const metrics = ctx.measureText(text.text);
      const textWidth = metrics.width;
      const textHeight = text.fontSize;
      
      if (x >= text.x && x <= text.x + textWidth &&
          y >= text.y - textHeight && y <= text.y) {
        setDragging({ type: 'text', id: text.id });
        setDragOffset({ x: x - text.x, y: y - text.y });
        return;
      }
    }
  };

  // Handle mouse move on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (!dragging) {
      let newCursor = 'grab';
      
      for (let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        const resizeHandle = getFrameResizeHandle(frame, x, y);
        
        if (resizeHandle) {
          const cursorMap: Record<string, string> = {
            'nw': 'nw-resize',
            'ne': 'ne-resize',
            'sw': 'sw-resize',
            'se': 'se-resize',
            'n': 'n-resize',
            's': 's-resize',
            'e': 'e-resize',
            'w': 'w-resize'
          };
          newCursor = cursorMap[resizeHandle] || 'grab';
          break;
        }
      }
      
      setCursorStyle(newCursor);
    }

    if (!dragging) return;

    if (dragging.type === 'logo') {
      updateLogo(dragging.id, {
        x: x - dragOffset.x,
        y: y - dragOffset.y
      });
    } else if (dragging.type === 'text') {
      updateText(dragging.id, {
        x: x - dragOffset.x,
        y: y - dragOffset.y
      });
    } else if (dragging.type === 'frame') {
      updateFrame(dragging.id, {
        x: x - dragOffset.x,
        y: y - dragOffset.y
      });
    } else if (dragging.type === 'frame-resize' && initialFrameState) {
      const dx = x - dragOffset.x;
      const dy = y - dragOffset.y;
      
      let newX = initialFrameState.x;
      let newY = initialFrameState.y;
      let newWidth = initialFrameState.width;
      let newHeight = initialFrameState.height;
      
      switch (dragging.resizeHandle) {
        case 'nw':
          newX = initialFrameState.x + dx;
          newY = initialFrameState.y + dy;
          newWidth = initialFrameState.width - dx;
          newHeight = initialFrameState.height - dy;
          break;
        case 'ne':
          newY = initialFrameState.y + dy;
          newWidth = initialFrameState.width + dx;
          newHeight = initialFrameState.height - dy;
          break;
        case 'sw':
          newX = initialFrameState.x + dx;
          newWidth = initialFrameState.width - dx;
          newHeight = initialFrameState.height + dy;
          break;
        case 'se':
          newWidth = initialFrameState.width + dx;
          newHeight = initialFrameState.height + dy;
          break;
        case 'n':
          newY = initialFrameState.y + dy;
          newHeight = initialFrameState.height - dy;
          break;
        case 's':
          newHeight = initialFrameState.height + dy;
          break;
        case 'w':
          newX = initialFrameState.x + dx;
          newWidth = initialFrameState.width - dx;
          break;
        case 'e':
          newWidth = initialFrameState.width + dx;
          break;
      }
      
      if (newWidth > 10 && newHeight > 10) {
        updateFrame(dragging.id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setInitialFrameState(null);
  };

  const getFrameResizeHandle = (frame: Frame, x: number, y: number): string | null => {
    const handleSize = 10;
    
    if (x >= frame.x - handleSize && x <= frame.x + handleSize && 
        y >= frame.y - handleSize && y <= frame.y + handleSize) return 'nw';
    if (x >= frame.x + frame.width - handleSize && x <= frame.x + frame.width + handleSize && 
        y >= frame.y - handleSize && y <= frame.y + handleSize) return 'ne';
    if (x >= frame.x - handleSize && x <= frame.x + handleSize && 
        y >= frame.y + frame.height - handleSize && y <= frame.y + frame.height + handleSize) return 'sw';
    if (x >= frame.x + frame.width - handleSize && x <= frame.x + frame.width + handleSize && 
        y >= frame.y + frame.height - handleSize && y <= frame.y + frame.height + handleSize) return 'se';
    
    if (x >= frame.x - handleSize && x <= frame.x + handleSize && 
        y >= frame.y && y <= frame.y + frame.height) return 'w';
    if (x >= frame.x + frame.width - handleSize && x <= frame.x + frame.width + handleSize && 
        y >= frame.y && y <= frame.y + frame.height) return 'e';
    if (y >= frame.y - handleSize && y <= frame.y + handleSize && 
        x >= frame.x && x <= frame.x + frame.width) return 'n';
    if (y >= frame.y + frame.height - handleSize && y <= frame.y + frame.height + handleSize && 
        x >= frame.x && x <= frame.x + frame.width) return 's';
    
    return null;
  };

  const syncRelativeFromAbsolute = (imgWidth: number, imgHeight: number) => {
    setLogos(prev => prev.map(logo => ({
      ...logo,
      relativeX: (logo.x / imgWidth) * 100,
      relativeY: (logo.y / imgHeight) * 100,
      relativeWidth: (logo.width / imgWidth) * 100
    })));

    setTextWatermarks(prev => prev.map(text => ({
      ...text,
      relativeX: (text.x / imgWidth) * 100,
      relativeY: (text.y / imgHeight) * 100,
      relativeFontSize: (text.fontSize / imgWidth) * 100
    })));

    setFrames(prev => prev.map(frame => ({
      ...frame,
      relativeX: (frame.x / imgWidth) * 100,
      relativeY: (frame.y / imgHeight) * 100,
      relativeWidth: (frame.width / imgWidth) * 100,
      relativeHeight: (frame.height / imgHeight) * 100,
      relativeBorderWidth: (frame.borderWidth / imgWidth) * 100
    })));
  };

  const getAbsolutePosition = (imgWidth: number, imgHeight: number) => {
    const absoluteLogos = logos.map(logo => ({
      ...logo,
      x: logo.positionMode === 'relative' && logo.relativeX !== undefined 
        ? (logo.relativeX / 100) * imgWidth 
        : logo.x,
      y: logo.positionMode === 'relative' && logo.relativeY !== undefined 
        ? (logo.relativeY / 100) * imgHeight 
        : logo.y,
      width: logo.positionMode === 'relative' && logo.relativeWidth !== undefined 
        ? (logo.relativeWidth / 100) * imgWidth 
        : logo.width,
      height: logo.positionMode === 'relative' && logo.relativeWidth !== undefined 
        ? ((logo.relativeWidth / 100) * imgWidth) * (logo.image.height / logo.image.width)
        : logo.height
    }));

    const absoluteTexts = textWatermarks.map(text => ({
      ...text,
      x: text.positionMode === 'relative' && text.relativeX !== undefined 
        ? (text.relativeX / 100) * imgWidth 
        : text.x,
      y: text.positionMode === 'relative' && text.relativeY !== undefined 
        ? (text.relativeY / 100) * imgHeight 
        : text.y,
      fontSize: text.positionMode === 'relative' && text.relativeFontSize !== undefined 
        ? (text.relativeFontSize / 100) * imgWidth 
        : text.fontSize
    }));

    const absoluteFrames = frames.map(frame => ({
      ...frame,
      x: frame.positionMode === 'relative' && frame.relativeX !== undefined 
        ? (frame.relativeX / 100) * imgWidth 
        : frame.x,
      y: frame.positionMode === 'relative' && frame.relativeY !== undefined 
        ? (frame.relativeY / 100) * imgHeight 
        : frame.y,
      width: frame.positionMode === 'relative' && frame.relativeWidth !== undefined 
        ? (frame.relativeWidth / 100) * imgWidth 
        : frame.width,
      height: frame.positionMode === 'relative' && frame.relativeHeight !== undefined 
        ? (frame.relativeHeight / 100) * imgHeight 
        : frame.height,
      borderWidth: frame.positionMode === 'relative' && frame.relativeBorderWidth !== undefined 
        ? (frame.relativeBorderWidth / 100) * imgWidth 
        : frame.borderWidth
    }));

    return { absoluteLogos, absoluteTexts, absoluteFrames };
  };

  const applyWatermark = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = imageUrl;
      img.onload = () => {
        if (!ctx) return;
        
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const { absoluteLogos, absoluteTexts, absoluteFrames } = getAbsolutePosition(img.width, img.height);

        absoluteFrames.forEach(frame => {
          ctx.globalAlpha = frame.opacity;
          ctx.strokeStyle = frame.borderColor;
          ctx.lineWidth = frame.borderWidth;
          ctx.strokeRect(frame.x, frame.y, frame.width, frame.height);
        });

        absoluteLogos.forEach(logo => {
          ctx.globalAlpha = logo.opacity;
          ctx.drawImage(logo.image, logo.x, logo.y, logo.width, logo.height);
        });

        absoluteTexts.forEach(text => {
          ctx.globalAlpha = text.opacity;
          ctx.font = `${text.fontSize}px ${text.fontFamily}`;
          ctx.fillStyle = text.color;
          ctx.fillText(text.text, text.x, text.y);
        });

        ctx.globalAlpha = 1;

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      };
    });
  };

  const processAllImages = async () => {
    if (images.length === 0) {
      alert('Please upload images first!');
      return;
    }

    if (logos.length === 0 && textWatermarks.length === 0 && frames.length === 0) {
      alert('Please add at least one logo, text watermark, or frame!');
      return;
    }

    setProcessing(true);
    setProgress(0);

    const zip = new JSZip();
    const folder = zip.folder('watermarked-images');
    if (!folder) return;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const watermarkedBlob = await applyWatermark(image.url);
      folder.file(image.name, watermarkedBlob);
      setProgress(((i + 1) / images.length) * 100);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked-images.zip';
    a.click();

    setProcessing(false);
    setProgress(0);
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name!');
      return;
    }

    const preset = {
      name: presetName,
      logos: logos.map(logo => ({
        ...logo,
        image: logo.image.src
      })),
      textWatermarks,
      frames
    };

    const presets = JSON.parse(localStorage.getItem('watermarkPresets') || '[]');
    presets.push(preset);
    localStorage.setItem('watermarkPresets', JSON.stringify(presets));
    
    alert(`Preset "${presetName}" saved successfully!`);
    setPresetName('');
  };

  const loadPreset = () => {
    const presets = JSON.parse(localStorage.getItem('watermarkPresets') || '[]');
    
    if (presets.length === 0) {
      alert('No saved presets found!');
      return;
    }

    const presetName = prompt(`Available presets:\n${presets.map((p: any, i: number) => `${i + 1}. ${p.name}`).join('\n')}\n\nEnter preset number or name:`);
    
    if (!presetName) return;

    let preset = presets.find((p: any) => p.name === presetName);
    if (!preset) {
      const index = parseInt(presetName) - 1;
      preset = presets[index];
    }

    if (!preset) {
      alert('Preset not found!');
      return;
    }

    const restoredLogos = preset.logos.map((logoData: any) => {
      const img = new Image();
      img.src = logoData.image;
      return {
        ...logoData,
        image: img
      };
    });

    setLogos(restoredLogos);
    setTextWatermarks(preset.textWatermarks);
    setFrames(preset.frames);
    
    alert(`Preset "${preset.name}" loaded successfully!`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          padding: '25px 30px',
          borderRadius: '12px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              ⚒️
            </div>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                margin: '0',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f4a261 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                WatermarkForge
              </h1>
              <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '14px' }}>
                Editor
              </p>
            </div>
          </div>
          
          <Link href="/" style={{
            padding: '10px 20px',
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            color: '#ff6b35',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 53, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
          }}>
            ← Back to Home
          </Link>
        </div>

        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '350px 1fr',
          gap: '20px',
          alignItems: 'start'
        }}>
          
          {/* Left Sidebar - Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Upload Images Section */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                color: '#ff6b35'
              }}>
                📁 Upload Images
              </h2>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  border: '2px dashed rgba(255, 107, 53, 0.5)',
                  borderRadius: '6px',
                  background: 'rgba(255, 107, 53, 0.05)',
                  cursor: 'pointer',
                  color: '#ccc',
                  fontSize: '14px'
                }}
              />
              <div style={{ 
                marginTop: '10px',
                padding: '8px 12px',
                background: 'rgba(255, 107, 53, 0.1)',
                borderRadius: '4px',
                color: '#ff6b35',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                ✓ {images.length} images selected
              </div>
            </div>

            {/* Add Elements Section */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                color: '#ff6b35'
              }}>
                ➕ Add Elements
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  color: '#ccc',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  🖼️ Logos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLogoUpload}
                  style={{ 
                    width: '100%',
                    padding: '8px',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#ccc'
                  }}
                />
                <p style={{ 
                  margin: '8px 0 0 0',
                  color: '#999',
                  fontSize: '12px'
                }}>
                  {logos.length} logo(s) added
                </p>
              </div>

              <button
                onClick={addTextWatermark}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}
              >
                ➕ Add Text Watermark
              </button>

              <button
                onClick={addFrame}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                ➕ Add Frame/Border
              </button>

              <div style={{ 
                marginTop: '15px',
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#ccc'
              }}>
                <div>📝 {textWatermarks.length} text watermark(s)</div>
                <div>🖼️ {frames.length} frame(s)</div>
              </div>
            </div>

            {/* Save/Load Presets */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                color: '#ff6b35'
              }}>
                💾 Presets
              </h2>
              <input
                type="text"
                placeholder="Preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  fontSize: '14px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff'
                }}
              />
              <button
                onClick={savePreset}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}
              >
                💾 Save Current Setup
              </button>
              <button
                onClick={loadPreset}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                📂 Load Preset
              </button>
            </div>

            {/* Process Button */}
            <button
              onClick={processAllImages}
              disabled={processing || images.length === 0}
              style={{
                width: '100%',
                padding: '18px',
                background: processing ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: processing ? 'none' : '0 4px 15px rgba(255, 107, 53, 0.4)'
              }}
            >
              {processing ? `⏳ Processing... ${Math.round(progress)}%` : '⚡ Process All & Download ZIP'}
            </button>

            {processing && (
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}
          </div>

          {/* Right Side - Preview and Element Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Preview Canvas */}
            {previewImage && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#ff6b35'
                }}>
                  👁️ Preview (Drag to Position)
                </h2>
                <div
                  style={{
                    border: '2px solid rgba(255, 107, 53, 0.5)',
                    display: 'inline-block',
                    maxWidth: '100%',
                    overflow: 'auto',
                    borderRadius: '8px',
                    background: '#000'
                  }}
                >
                  <canvas
                    ref={previewCanvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      cursor: dragging ? 'grabbing' : cursorStyle,
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Logo Controls - continuing with burnt orange theme */}
            {logos.length > 0 && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#ff6b35'
                }}>
                  🖼️ Logo Controls
                </h3>
                {logos.map((logo, index) => (
                  <div key={logo.id} style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '12px' 
                    }}>
                      <strong style={{ color: '#ff6b35' }}>Logo {index + 1}</strong>
                      <button
                        onClick={() => removeLogo(logo.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                    <div style={{ marginBottom: '12px', padding: '10px', background: logo.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)', borderRadius: '4px', border: `1px solid ${logo.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(241, 196, 15, 0.3)'}` }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Positioning Mode:
                      </label>
                      <select
                        value={logo.positionMode}
                        onChange={(e) => updateLogo(logo.id, { positionMode: e.target.value as 'absolute' | 'relative' })}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)',
                          color: '#fff'
                        }}
                      >
                        <option value="absolute">Absolute (Fixed pixels)</option>
                        <option value="relative">Relative (% - Adapts to image size)</option>
                      </select>
                      {logo.positionMode === 'relative' && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#2ecc71' }}>
                          ✓ Logo will scale and position proportionally on all images!
                        </p>
                      )}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Width: {Math.round(logo.width)}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="800"
                        value={logo.width}
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value);
                          const aspectRatio = logo.image.height / logo.image.width;
                          updateLogo(logo.id, {
                            width: newWidth,
                            height: newWidth * aspectRatio
                          });
                        }}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ marginBottom: '0' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Opacity: {Math.round(logo.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={logo.opacity}
                        onChange={(e) => updateLogo(logo.id, { opacity: parseFloat(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Text Controls - with burnt orange theme */}
            {textWatermarks.length > 0 && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#ff6b35'
                }}>
                  📝 Text Controls
                </h3>
                {textWatermarks.map((text, index) => (
                  <div key={text.id} style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '12px' 
                    }}>
                      <strong style={{ color: '#ff6b35' }}>Text {index + 1}</strong>
                      <button
                        onClick={() => removeText(text.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                    <div style={{ marginBottom: '12px', padding: '10px', background: text.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)', borderRadius: '4px', border: `1px solid ${text.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(241, 196, 15, 0.3)'}` }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Positioning Mode:
                      </label>
                      <select
                        value={text.positionMode}
                        onChange={(e) => updateText(text.id, { positionMode: e.target.value as 'absolute' | 'relative' })}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)',
                          color: '#fff'
                        }}
                      >
                        <option value="absolute">Absolute (Fixed pixels)</option>
                        <option value="relative">Relative (% - Adapts to image size)</option>
                      </select>
                      {text.positionMode === 'relative' && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#2ecc71' }}>
                          ✓ Text will scale and position proportionally on all images!
                        </p>
                      )}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>Text:</label>
                      <input
                        type="text"
                        value={text.text}
                        onChange={(e) => updateText(text.id, { text: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          fontSize: '14px',
                          background: 'rgba(0,0,0,0.3)',
                          color: '#fff'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>Font:</label>
                      <select
                        value={text.fontFamily}
                        onChange={(e) => updateText(text.id, { fontFamily: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)',
                          color: '#fff'
                        }}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Impact">Impact</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Font Size: {text.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="200"
                        value={text.fontSize}
                        onChange={(e) => updateText(text.id, { fontSize: parseInt(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>Color:</label>
                      <input
                        type="color"
                        value={text.color}
                        onChange={(e) => updateText(text.id, { color: e.target.value })}
                        style={{
                          width: '100%',
                          height: '40px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Opacity: {Math.round(text.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={text.opacity}
                        onChange={(e) => updateText(text.id, { opacity: parseFloat(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Frame Controls - with burnt orange theme */}
            {frames.length > 0 && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 107, 53, 0.2)',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '15px',
                  color: '#ff6b35'
                }}>
                  🖼️ Frame Controls
                </h3>
                {frames.map((frame, index) => (
                  <div key={frame.id} style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 107, 53, 0.2)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '12px' 
                    }}>
                      <strong style={{ color: '#ff6b35' }}>Frame {index + 1}</strong>
                      <button
                        onClick={() => removeFrame(frame.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                    <div style={{ marginBottom: '12px', padding: '10px', background: frame.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(241, 196, 15, 0.1)', borderRadius: '4px', border: `1px solid ${frame.positionMode === 'relative' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(241, 196, 15, 0.3)'}` }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Positioning Mode:
                      </label>
                      <select
                        value={frame.positionMode}
                        onChange={(e) => updateFrame(frame.id, { positionMode: e.target.value as 'absolute' | 'relative' })}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)',
                          color: '#fff'
                        }}
                      >
                        <option value="absolute">Absolute (Fixed pixels)</option>
                        <option value="relative">Relative (% - Adapts to image size)</option>
                      </select>
                      {frame.positionMode === 'relative' && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#2ecc71' }}>
                          ✓ Frame will scale and position proportionally on all images!
                        </p>
                      )}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Width: {Math.round(frame.width)}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        value={frame.width}
                        onChange={(e) => updateFrame(frame.id, { width: parseInt(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Height: {Math.round(frame.height)}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        value={frame.height}
                        onChange={(e) => updateFrame(frame.id, { height: parseInt(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Border Width: {frame.borderWidth}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={frame.borderWidth}
                        onChange={(e) => updateFrame(frame.id, { borderWidth: parseInt(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>Border Color:</label>
                      <input
                        type="color"
                        value={frame.borderColor}
                        onChange={(e) => updateFrame(frame.id, { borderColor: e.target.value })}
                        style={{
                          width: '100%',
                          height: '40px',
                          border: '1px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          background: 'rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '6px',
                        color: '#ccc',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        Opacity: {Math.round(frame.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={frame.opacity}
                        onChange={(e) => updateFrame(frame.id, { opacity: parseFloat(e.target.value) })}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}