import React from 'react';
import { Volume2, VolumeX, Dices, Sparkles } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRandomPreset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onRandomPreset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-purple-100 px-4 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md animate-float">
            🎨
          </div>
          <div>
            <h1 className="font-bold text-xl sm:text-2xl text-purple-950 leading-tight flex items-center gap-2">
              TẬP VẼ TRANH CÙNG AI
              <span className="text-[10px] sm:text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> DÀNH CHO BÉ
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Bé ghép ý tưởng • AI Cọ Thần vẽ nên muôn màu thế giới!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRandomPreset}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition flex items-center gap-1.5 font-bold text-xs border border-amber-200 cursor-pointer shadow-xs active:scale-95"
            title="Tạo gợi ý ngẫu nhiên"
          >
            <Dices className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Gợi ý</span> ngẫu nhiên
          </button>
          <button
            onClick={onToggleSound}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-bold text-xs border cursor-pointer active:scale-95 ${
              soundEnabled
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>Âm thanh</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>Tắt tiếng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
