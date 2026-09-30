import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PromptSelector } from './components/PromptSelector';
import { ArtCanvas } from './components/ArtCanvas';
import { GallerySection } from './components/GallerySection';
import { Toast, ToastMessage } from './components/Toast';
import { SparkleOverlayHandle } from './components/SparkleOverlay';
import {
  ANIMALS,
  ACTIONS,
  BACKGROUNDS,
  STYLES,
  OptionItem,
} from './data/categories';
import { playSound } from './utils/audio';
import {
  PlacedSticker,
  generateCanvasArtwork,
  mergeImageWithStickers,
  convertToColoringBookCanvas,
} from './utils/canvasRenderer';
import { GalleryItem } from './types/gallery';

export default function App() {
  const [animal, setAnimal] = useState<OptionItem>(ANIMALS[0]);
  const [action, setAction] = useState<OptionItem>(ACTIONS[0]);
  const [background, setBackground] = useState<OptionItem>(BACKGROUNDS[0]);
  const [style, setStyle] = useState<OptionItem>(STYLES[0]);
  const [extraPrompt, setExtraPrompt] = useState<string>('');

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>(
    'Gửi ý tưởng kỳ diệu tới Cọ Thần AI...'
  );
  const [loadingProgress, setLoadingProgress] = useState<number>(20);

  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [activeSticker, setActiveSticker] = useState<string>('⭐');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [story, setStory] = useState<string | null>(null);
  const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const sparkleRef = useRef<SparkleOverlayHandle | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  // Load gallery from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kid_art_gallery');
      if (stored) {
        setGallery(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load gallery from localStorage', e);
    }
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = { id, text, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    playSound('click', nextState);
    showToast(nextState ? 'Đã bật âm thanh vui nhộn!' : 'Đã tắt âm thanh', 'info');
  };

  const handleRandomPreset = () => {
    playSound('click', soundEnabled);
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];

    setAnimal(randomAnimal);
    setAction(randomAction);
    setBackground(randomBg);
    setStyle(randomStyle);

    showToast('Đã chọn ngẫu nhiên ý tưởng thú vị cho bé!', 'info');
  };

  const handleReset = () => {
    playSound('reset', soundEnabled);
    setAnimal(ANIMALS[0]);
    setAction(ACTIONS[0]);
    setBackground(BACKGROUNDS[0]);
    setStyle(STYLES[0]);
    setExtraPrompt('');
    setStickers([]);
    setStory(null);
    showToast('Đã làm lại các lựa chọn từ đầu!', 'info');
  };

  const handleGenerateArt = async () => {
    playSound('click', soundEnabled);
    if (sparkleRef.current) {
      sparkleRef.current.burst();
    }

    setIsGenerating(true);
    setLoadingProgress(25);
    setLoadingStepText('Gửi ý tưởng kỳ diệu tới Cọ Thần AI...');
    setStory(null);

    const stepTimer1 = setTimeout(() => {
      setLoadingProgress(55);
      setLoadingStepText('Đang phác thảo đường nét nhân vật...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingProgress(85);
      setLoadingStepText('Tô màu rực rỡ & thêm ánh sáng thần tiên...');
    }, 3000);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animal,
          action,
          background,
          style,
          extraPrompt,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      let finalImageUrl: string | null = null;

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          finalImageUrl = data.imageUrl;
        } else if (data.useCanvasFallback) {
          finalImageUrl = generateCanvasArtwork(animal, action, background, style);
        }
      }

      if (!finalImageUrl) {
        // Fallback to rich vector canvas illustration
        finalImageUrl = generateCanvasArtwork(animal, action, background, style);
      }

      setLoadingProgress(100);
      setImageUrl(finalImageUrl);
      setStickers([]);

      setTimeout(() => {
        setIsGenerating(false);
        playSound('success', soundEnabled);
        if (sparkleRef.current) {
          sparkleRef.current.burst();
        }
        showToast('Bức tranh của bé đã tạo xong cực đẹp!', 'success');
      }, 400);
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.warn('Network error, rendering instant fallback canvas...', err);

      const canvasArt = generateCanvasArtwork(animal, action, background, style);
      setImageUrl(canvasArt);
      setIsGenerating(false);
      playSound('success', soundEnabled);
      showToast('Đã tạo bức tranh minh họa cực xinh cho bé!', 'success');
    }
  };

  const handleAddSticker = (x: number, y: number) => {
    playSound('sticker', soundEnabled);
    const newSticker: PlacedSticker = {
      id: Date.now().toString() + Math.random().toString(),
      emoji: activeSticker,
      x,
      y,
      size: 40,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleClearStickers = () => {
    playSound('click', soundEnabled);
    setStickers([]);
    showToast('Đã xóa tất cả hình dán!', 'info');
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    playSound('click', soundEnabled);

    try {
      const wrapper = canvasWrapperRef.current;
      const w = wrapper ? wrapper.clientWidth : 400;
      const h = wrapper ? wrapper.clientHeight : 400;

      const mergedCanvas = await mergeImageWithStickers(imageUrl, stickers, w, h);
      const link = document.createElement('a');
      link.download = `Tranh_Be_Ve_${Date.now()}.png`;
      link.href = mergedCanvas.toDataURL('image/png');
      link.click();
      showToast('Đã tải bức tranh về máy thành công! 📄', 'success');
    } catch (e) {
      showToast('Không thể tải ảnh về, vui lòng thử lại', 'error');
    }
  };

  const handleSaveToGallery = async () => {
    if (!imageUrl) return;
    playSound('click', soundEnabled);

    try {
      const wrapper = canvasWrapperRef.current;
      const w = wrapper ? wrapper.clientWidth : 400;
      const h = wrapper ? wrapper.clientHeight : 400;

      const mergedCanvas = await mergeImageWithStickers(imageUrl, stickers, w, h);
      const dataUrl = mergedCanvas.toDataURL('image/png');

      const newItem: GalleryItem = {
        id: Date.now().toString(),
        title: `${animal.vi} ${animal.emoji} - ${action.vi}`,
        date: new Date().toLocaleDateString('vi-VN'),
        imageUrl: dataUrl,
        animal: animal.vi,
        action: action.vi,
        background: background.vi,
        style: style.vi,
        story: story || undefined,
      };

      const updated = [newItem, ...gallery];
      setGallery(updated);
      localStorage.setItem('kid_art_gallery', JSON.stringify(updated));

      playSound('success', soundEnabled);
      showToast('Đã lưu bức tranh vào Bộ sưu tập của bé! ❤️', 'success');
    } catch (e) {
      showToast('Không thể lưu ảnh, bộ nhớ đầy!', 'error');
    }
  };

  const handlePrintColoringSheet = async () => {
    if (!imageUrl) return;
    playSound('click', soundEnabled);

    try {
      const wrapper = canvasWrapperRef.current;
      const w = wrapper ? wrapper.clientWidth : 400;
      const h = wrapper ? wrapper.clientHeight : 400;

      const mergedCanvas = await mergeImageWithStickers(imageUrl, stickers, w, h);
      const coloringCanvas = convertToColoringBookCanvas(mergedCanvas);
      const printDataUrl = coloringCanvas.toDataURL('image/png');

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Tranh Tô Màu Cho Bé - ${animal.vi}</title>
            <style>
              body { font-family: 'Times New Roman', serif; text-align: center; padding: 24px; color: #1e1b4b; }
              h1 { font-size: 26px; margin-bottom: 6px; }
              p { color: #64748b; font-size: 14px; margin-bottom: 20px; }
              .box { display: inline-block; border: 3px solid #000; border-radius: 18px; overflow: hidden; max-width: 550px; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              img { width: 100%; display: block; }
              .footer { margin-top: 15px; font-size: 13px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <h1>TRANH TÔ MÀU SÁNG TẠO: ${animal.vi.toUpperCase()}</h1>
            <p>Bé hãy dùng bút sáp tô màu cho bạn ấy nhé! • ${action.vi} tại ${background.vi}</p>
            <div class="box">
              <img src="${printDataUrl}" />
            </div>
            <div class="footer">✨ Tác phẩm sáng tạo của bé cùng AI Cọ Thần</div>
            <script>
              window.onload = function() { window.print(); }
            <\/script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        // Direct print fallback
        showToast('Vui lòng cho phép mở cửa sổ để in tranh!', 'info');
      }
    } catch (e) {
      showToast('Có lỗi xảy ra khi tạo tranh tô màu', 'error');
    }
  };

  const handleTellStory = async () => {
    playSound('click', soundEnabled);
    setIsLoadingStory(true);
    showToast('AI đang sáng tác truyện cổ tích cho bé...', 'info');

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animal, action, background, style }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.story) {
          setStory(data.story);
          playSound('success', soundEnabled);
          speakText(data.story);
          setIsLoadingStory(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Story error', e);
    }

    const fallbackStory = `Ngày xửa ngày xưa, tại ${background.vi.toLowerCase()}, bạn ${animal.vi} vui mừng khôn xiết khi đang ${action.vi.toLowerCase()}. Bạn ấy mỉm cười gửi lời chào thân thương và chúc các bạn nhỏ một ngày tràn ngập tiếng cười!`;
    setStory(fallbackStory);
    playSound('success', soundEnabled);
    speakText(fallbackStory);
    setIsLoadingStory(false);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      // Select Vietnamese voice if available
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang.includes('vi') || v.lang.includes('VN'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayStoryAudio = () => {
    if (!story) return;
    playSound('click', soundEnabled);
    speakText(story);
  };

  const handleDeleteGalleryItem = (id: string) => {
    playSound('click', soundEnabled);
    const updated = gallery.filter((item) => item.id !== id);
    setGallery(updated);
    localStorage.setItem('kid_art_gallery', JSON.stringify(updated));
    showToast('Đã xóa tác phẩm khỏi bộ sưu tập!', 'info');
  };

  const handleClearAllGallery = () => {
    if (!window.confirm('Bé có chắc muốn xóa tất cả các bức tranh trong bộ sưu tập không?')) {
      return;
    }
    playSound('click', soundEnabled);
    setGallery([]);
    localStorage.removeItem('kid_art_gallery');
    showToast('Đã xóa tất cả bộ sưu tập!', 'info');
  };

  return (
    <div className="min-h-screen text-slate-800 pb-16 select-none font-sans">
      <Toast toasts={toasts} />

      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onRandomPreset={handleRandomPreset}
      />

      <main className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: STEPS & SELECTION (7 Cols) */}
          <div className="lg:col-span-7">
            <PromptSelector
              animal={animal}
              action={action}
              background={background}
              style={style}
              extraPrompt={extraPrompt}
              isGenerating={isGenerating}
              onSelectAnimal={(it) => {
                playSound('click', soundEnabled);
                setAnimal(it);
              }}
              onSelectAction={(it) => {
                playSound('click', soundEnabled);
                setAction(it);
              }}
              onSelectBackground={(it) => {
                playSound('click', soundEnabled);
                setBackground(it);
              }}
              onSelectStyle={(it) => {
                playSound('click', soundEnabled);
                setStyle(it);
              }}
              onChangeExtraPrompt={setExtraPrompt}
              onGenerateArt={handleGenerateArt}
              onReset={handleReset}
            />
          </div>

          {/* RIGHT COLUMN: ARTWORK DISPLAY CANVAS & TOOLS (5 Cols) */}
          <div className="lg:col-span-5">
            <ArtCanvas
              imageUrl={imageUrl}
              isGenerating={isGenerating}
              loadingStepText={loadingStepText}
              loadingProgress={loadingProgress}
              stickers={stickers}
              activeSticker={activeSticker}
              onSelectActiveSticker={(stk) => {
                playSound('click', soundEnabled);
                setActiveSticker(stk);
                showToast(`Đã chọn hình dán ${stk}. Chạm vào tranh để dán nhé!`, 'info');
              }}
              onAddSticker={handleAddSticker}
              onClearStickers={handleClearStickers}
              onDownload={handleDownload}
              onSaveToGallery={handleSaveToGallery}
              onPrintColoringSheet={handlePrintColoringSheet}
              onTellStory={handleTellStory}
              story={story}
              isLoadingStory={isLoadingStory}
              onPlayStoryAudio={handlePlayStoryAudio}
              sparkleRef={sparkleRef}
              canvasWrapperRef={canvasWrapperRef}
            />
          </div>
        </div>

        {/* GALLERY SECTION */}
        <GallerySection
          gallery={gallery}
          onDelete={handleDeleteGalleryItem}
          onClearAll={handleClearAllGallery}
        />
      </main>
    </div>
  );
}
