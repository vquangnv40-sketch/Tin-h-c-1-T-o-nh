import React, { useRef } from 'react';
import {
  Download,
  Heart,
  Printer,
  Sparkles,
  Star,
  BookOpen,
  Volume2,
  Trash2,
  Stamp,
  RotateCw,
} from 'lucide-react';
import { PlacedSticker } from '../utils/canvasRenderer';
import { STICKERS } from '../data/categories';
import { SparkleOverlay, SparkleOverlayHandle } from './SparkleOverlay';

interface ArtCanvasProps {
  imageUrl: string | null;
  isGenerating: boolean;
  loadingStepText: string;
  loadingProgress: number;
  stickers: PlacedSticker[];
  activeSticker: string;
  onSelectActiveSticker: (emoji: string) => void;
  onAddSticker: (x: number, y: number) => void;
  onClearStickers: () => void;
  onDownload: () => void;
  onSaveToGallery: () => void;
  onPrintColoringSheet: () => void;
  onTellStory: () => void;
  story: string | null;
  isLoadingStory: boolean;
  onPlayStoryAudio: () => void;
  sparkleRef: React.RefObject<SparkleOverlayHandle | null>;
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export const ArtCanvas: React.FC<ArtCanvasProps> = ({
  imageUrl,
  isGenerating,
  loadingStepText,
  loadingProgress,
  stickers,
  activeSticker,
  onSelectActiveSticker,
  onAddSticker,
  onClearStickers,
  onDownload,
  onSaveToGallery,
  onPrintColoringSheet,
  onTellStory,
  story,
  isLoadingStory,
  onPlayStoryAudio,
  sparkleRef,
  canvasWrapperRef,
}) => {
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageUrl || isGenerating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onAddSticker(x, y);
    if (sparkleRef.current) {
      sparkleRef.current.burst(x, y);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base text-purple-950 font-bold flex items-center gap-2">
          <span className="text-pink-500">🎨</span> Bức Tranh Của Bé
        </h3>
        {imageUrl && !isGenerating && (
          <div className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            Tuyệt Tác Của Bé!
          </div>
        )}
      </div>

      {/* Canvas Area Container */}
      <div
        ref={canvasWrapperRef}
        onClick={handleCanvasClick}
        className={`relative w-full aspect-square bg-slate-900 rounded-2xl border-2 border-purple-200 overflow-hidden flex flex-col items-center justify-center shadow-inner select-none ${
          imageUrl && !isGenerating ? 'cursor-crosshair' : ''
        }`}
      >
        {/* Sparkle Particle Overlay */}
        <SparkleOverlay ref={sparkleRef} />

        {/* 1. Placeholder State */}
        {!imageUrl && !isGenerating && (
          <div className="text-center p-6 space-y-3 bg-gradient-to-b from-purple-900/40 to-pink-900/40 w-full h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-purple-100/90 text-purple-600 rounded-3xl flex items-center justify-center text-4xl shadow-lg animate-float">
              🖼️
            </div>
            <p className="text-white text-base font-bold">
              Bức tranh kỳ diệu đang chờ bé!
            </p>
            <p className="text-xs text-purple-200 max-w-[240px] mx-auto leading-relaxed">
              Chọn con vật, hành động, bối cảnh rồi bấm nút{' '}
              <b className="text-amber-300">&ldquo;Tạo Bức Tranh Cực Đẹp&rdquo;</b> nhé!
            </p>
          </div>
        )}

        {/* 2. Loading State */}
        {isGenerating && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-purple-500/30 border-t-amber-400 rounded-full animate-spin" />
              <div
                className="absolute inset-0 border-4 border-pink-500/20 border-b-pink-400 rounded-full animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '2s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                🪄
              </div>
            </div>
            <div>
              <p className="text-amber-300 text-lg font-bold">AI Cọ Thần đang vẽ tranh...</p>
              <p className="text-xs text-purple-200 font-semibold mt-1">
                {loadingStepText}
              </p>
              <div className="w-52 bg-purple-950/60 h-2.5 rounded-full mt-3 overflow-hidden border border-purple-500/40 mx-auto">
                <div
                  className="bg-gradient-to-r from-amber-400 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Generated Image */}
        {imageUrl && (
          <img
            ref={imageElementRef}
            src={imageUrl}
            alt="Bức tranh của bé"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
          />
        )}

        {/* 4. Stickers Overlay Layer */}
        {imageUrl && !isGenerating && stickers.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {stickers.map((s) => (
              <span
                key={s.id}
                style={{
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  fontSize: `${s.size}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute select-none drop-shadow-md transition-transform hover:scale-125"
              >
                {s.emoji}
              </span>
            ))}
          </div>
        )}

        {/* 5. Floating Sticker Selector Toolbar */}
        {imageUrl && !isGenerating && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-purple-200 z-30 flex items-center justify-between gap-1 text-xs"
          >
            <span className="font-bold text-purple-900 px-1 shrink-0 flex items-center gap-1">
              <Stamp className="w-3.5 h-3.5 text-pink-500" />
              <span>Dán hình:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {STICKERS.map((stk) => {
                const isSelected = activeSticker === stk;
                return (
                  <button
                    key={stk}
                    onClick={() => onSelectActiveSticker(stk)}
                    className={`text-lg p-1 rounded-lg transition-transform cursor-pointer ${
                      isSelected
                        ? 'scale-125 bg-purple-100 ring-2 ring-purple-400'
                        : 'hover:scale-125'
                    }`}
                  >
                    {stk}
                  </button>
                );
              })}
            </div>
            {stickers.length > 0 && (
              <button
                onClick={onClearStickers}
                className="text-red-500 hover:text-red-700 text-[11px] px-2 py-1 rounded-xl bg-red-50 font-bold shrink-0 cursor-pointer flex items-center gap-1"
                title="Xóa các hình dán"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa dán</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Storyteller Player Banner */}
      {story && (
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-2xl flex flex-col gap-1.5 text-xs text-purple-950 animate-fadeIn">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5 text-purple-900">
              <BookOpen className="w-4 h-4 text-pink-500" />
              <span>Câu Chuyện Tranh Của Bé</span>
            </span>
            <button
              onClick={onPlayStoryAudio}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer font-bold active:scale-95 shadow-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Đọc giọng nói</span>
            </button>
          </div>
          <p className="text-slate-700 italic leading-relaxed">
            &ldquo;{story}&rdquo;
          </p>
        </div>
      )}

      {/* Action Buttons for Artwork */}
      {imageUrl && !isGenerating && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <button
            onClick={onDownload}
            className="bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-bold py-2.5 px-2 rounded-xl border border-purple-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Tải về
          </button>
          <button
            onClick={onSaveToGallery}
            className="bg-pink-50 hover:bg-pink-100 text-pink-950 text-xs font-bold py-2.5 px-2 rounded-xl border border-pink-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
          >
            <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-500" /> Lưu ảnh
          </button>
          <button
            onClick={onPrintColoringSheet}
            className="bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold py-2.5 px-2 rounded-xl border border-amber-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" /> In tô màu
          </button>
          <button
            onClick={onTellStory}
            disabled={isLoadingStory}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold py-2.5 px-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
          >
            {isLoadingStory ? (
              <>
                <RotateCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Đang nghĩ...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Kể chuyện
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
