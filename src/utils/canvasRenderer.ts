import { OptionItem } from '../data/categories';

export interface PlacedSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

/**
 * Creates a rich vector art canvas fallback when internet / external AI APIs are unreachable.
 */
export function generateCanvasArtwork(
  animal: OptionItem,
  action: OptionItem,
  background: OptionItem,
  style: OptionItem
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bgId = background.id;

  // 1. Sky & Atmosphere Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 800);
  if (bgId === 'vutru') {
    skyGrad.addColorStop(0, '#0F0C20');
    skyGrad.addColorStop(0.5, '#2D114D');
    skyGrad.addColorStop(1, '#6B21A8');
  } else if (bgId === 'baibien') {
    skyGrad.addColorStop(0, '#38BDF8');
    skyGrad.addColorStop(0.5, '#FDE047');
    skyGrad.addColorStop(1, '#F97316');
  } else if (bgId === 'laudai') {
    skyGrad.addColorStop(0, '#312E81');
    skyGrad.addColorStop(0.5, '#C084FC');
    skyGrad.addColorStop(1, '#F472B6');
  } else if (bgId === 'keongot') {
    skyGrad.addColorStop(0, '#F472B6');
    skyGrad.addColorStop(0.5, '#FBCFE8');
    skyGrad.addColorStop(1, '#A7F3D0');
  } else if (bgId === 'daiduong') {
    skyGrad.addColorStop(0, '#0284C7');
    skyGrad.addColorStop(0.5, '#06B6D4');
    skyGrad.addColorStop(1, '#115E59');
  } else {
    skyGrad.addColorStop(0, '#A7F3D0');
    skyGrad.addColorStop(0.5, '#6EE7B7');
    skyGrad.addColorStop(1, '#047857');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 800, 800);

  // 2. Stars / Bubbles / Clouds in background
  if (bgId === 'vutru') {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 40; i++) {
      const rx = (i * 97) % 800;
      const ry = (i * 61) % 500;
      const r = (i % 3) + 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (bgId === 'daiduong') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 20; i++) {
      const rx = (i * 73) % 800;
      const ry = (i * 47) % 600;
      const r = (i % 12) + 6;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 3. Landscape Hills
  ctx.fillStyle = bgId === 'keongot' ? '#F472B6' : (bgId === 'baibien' ? '#FDE047' : '#059669');
  ctx.beginPath();
  ctx.arc(200, 750, 450, Math.PI, 0, false);
  ctx.fill();

  ctx.fillStyle = bgId === 'keongot' ? '#F43F5E' : (bgId === 'baibien' ? '#FACC15' : '#10B981');
  ctx.beginPath();
  ctx.arc(600, 780, 480, Math.PI, 0, false);
  ctx.fill();

  // 4. Sun or Fairytale Aura Glow
  const haloGrad = ctx.createRadialGradient(400, 360, 20, 400, 360, 280);
  haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  haloGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.4)');
  haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(400, 360, 280, 0, Math.PI * 2);
  ctx.fill();

  // 5. Hero Character Emoji
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 25;
  ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(animal.emoji, 400, 350);
  ctx.restore();

  // 6. Action Emoji Badge
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 15;
  ctx.font = '95px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(action.emoji, 530, 430);
  ctx.restore();

  // 7. Title Plaque
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowColor = 'rgba(147, 51, 234, 0.3)';
  ctx.shadowBlur = 18;
  if ((ctx as any).roundRect) {
    ctx.beginPath();
    (ctx as any).roundRect(60, 600, 680, 140, 24);
    ctx.fill();
    ctx.strokeStyle = '#E9D5FF';
    ctx.lineWidth = 3;
    (ctx as any).roundRect(60, 600, 680, 140, 24);
    ctx.stroke();
  } else {
    ctx.fillRect(60, 600, 680, 140);
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#3B0764';
  ctx.font = 'bold 34px "Comfortaa", "Nunito", "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${animal.vi.toUpperCase()} ${animal.emoji} - ${action.vi.toUpperCase()}`, 400, 655);

  ctx.fillStyle = '#6B21A8';
  ctx.font = '22px "Comfortaa", "Nunito", "Times New Roman", serif';
  ctx.fillText(`✨ Bối cảnh: ${background.vi} • Phong cách: ${style.vi}`, 400, 705);

  return canvas.toDataURL('image/png');
}

/**
 * Merges the base generated artwork with child-placed stickers into a single 800x800 canvas
 */
export function mergeImageWithStickers(
  baseImageSrc: string,
  stickers: PlacedSticker[],
  canvasWidth: number,
  canvasHeight: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Canvas context unavailable'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 800, 800);

      const scaleX = canvasWidth > 0 ? 800 / canvasWidth : 1;
      const scaleY = canvasHeight > 0 ? 800 / canvasHeight : 1;

      stickers.forEach((s) => {
        ctx.save();
        ctx.font = `${s.size * scaleX}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8 * scaleX;
        ctx.fillText(s.emoji, s.x * scaleX, s.y * scaleY);
        ctx.restore();
      });

      resolve(canvas);
    };
    img.onerror = () => {
      // Fallback: draw placeholder and stickers
      ctx.fillStyle = '#F3E8FF';
      ctx.fillRect(0, 0, 800, 800);
      resolve(canvas);
    };
    img.src = baseImageSrc;
  });
}

/**
 * Converts a colorful canvas into a printable coloring page (line art outline)
 */
export function convertToColoringBookCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const coloringCanvas = document.createElement('canvas');
  coloringCanvas.width = sourceCanvas.width;
  coloringCanvas.height = sourceCanvas.height;
  const ctx = coloringCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, coloringCanvas.width, coloringCanvas.height);
  const data = imgData.data;

  // Simple contrast edge outline filter for high-clarity black/white coloring sheet
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const val = avg > 145 ? 255 : avg < 80 ? 0 : 210;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
  ctx.putImageData(imgData, 0, 0);
  return coloringCanvas;
}
