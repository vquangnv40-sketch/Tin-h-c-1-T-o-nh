import React from 'react';
import {
  ANIMALS,
  ACTIONS,
  BACKGROUNDS,
  STYLES,
  OptionItem,
} from '../data/categories';
import { Wand2, RotateCcw, Paintbrush, Sparkles } from 'lucide-react';

interface PromptSelectorProps {
  animal: OptionItem;
  action: OptionItem;
  background: OptionItem;
  style: OptionItem;
  extraPrompt: string;
  isGenerating: boolean;
  onSelectAnimal: (item: OptionItem) => void;
  onSelectAction: (item: OptionItem) => void;
  onSelectBackground: (item: OptionItem) => void;
  onSelectStyle: (item: OptionItem) => void;
  onChangeExtraPrompt: (val: string) => void;
  onGenerateArt: () => void;
  onReset: () => void;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  animal,
  action,
  background,
  style,
  extraPrompt,
  isGenerating,
  onSelectAnimal,
  onSelectAction,
  onSelectBackground,
  onSelectStyle,
  onChangeExtraPrompt,
  onGenerateArt,
  onReset,
}) => {
  return (
    <div className="space-y-5">
      {/* BƯỚC 1: CHỌN ĐỘNG VẬT */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base text-purple-950 flex items-center gap-2 font-bold">
            <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-black">
              1
            </span>
            Bước 1: Bé chọn Con Vật 🐶
          </h2>
          <span className="text-[11px] text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full font-bold">
            Nhân vật chính
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ANIMALS.map((item) => {
            const isSelected = animal.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAnimal(item)}
                className={`custom-card p-2 rounded-2xl border flex flex-col items-center justify-center bg-white cursor-pointer transition ${
                  isSelected
                    ? 'selected border-purple-600 bg-purple-50'
                    : 'border-slate-100 hover:border-purple-200'
                }`}
              >
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span className="text-[11px] font-bold text-slate-800 truncate w-full text-center">
                  {item.vi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BƯỚC 2: CHỌN HÀNH ĐỘNG */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base text-purple-950 flex items-center gap-2 font-bold">
            <span className="w-6 h-6 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-xs font-black">
              2
            </span>
            Bước 2: Bạn ấy đang làm gì? 🏃
          </h2>
          <span className="text-[11px] text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full font-bold">
            Hành động dễ thương
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ACTIONS.map((item) => {
            const isSelected = action.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAction(item)}
                className={`custom-card p-2 rounded-2xl border flex flex-col items-center justify-center bg-white cursor-pointer transition ${
                  isSelected
                    ? 'selected border-pink-500 bg-pink-50'
                    : 'border-slate-100 hover:border-pink-200'
                }`}
              >
                <span className="text-2xl mb-1">{item.emoji}</span>
                <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">
                  {item.vi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BƯỚC 3 & 4: BỐI CẢNH & PHONG CÁCH */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-4">
        {/* Bối Cảnh */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-purple-950 flex items-center gap-2 font-bold">
              <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-black">
                3
              </span>
              Bước 3: Ở đâu nhỉ? (Bối Cảnh) 🏰
            </h2>
            <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
              Khung cảnh
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BACKGROUNDS.map((item) => {
              const isSelected = background.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectBackground(item)}
                  className={`custom-card p-1.5 rounded-2xl border flex flex-col items-center justify-center bg-white cursor-pointer transition ${
                    isSelected
                      ? 'selected border-blue-500 bg-blue-50'
                      : 'border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <span className="text-xl mb-0.5">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">
                    {item.vi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phong Cách */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm text-purple-950 flex items-center gap-2 font-bold">
              <span className="w-5 h-5 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-xs font-black">
                4
              </span>
              Bước 4: Phong cách bức tranh 🎨
            </h2>
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              Nghệ thuật
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STYLES.map((item) => {
              const isSelected = style.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStyle(item)}
                  className={`custom-card p-1.5 rounded-2xl border flex flex-col items-center justify-center bg-white cursor-pointer transition ${
                    isSelected
                      ? 'selected border-amber-500 bg-amber-50'
                      : 'border-slate-100 hover:border-amber-200'
                  }`}
                >
                  <span className="text-xl mb-0.5">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">
                    {item.vi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CÂU LỆNH VẼ TRANH & NÚT TẠO */}
      <div className="bg-gradient-to-r from-purple-800 via-pink-600 to-purple-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-100 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-amber-300" /> CÂU LỆNH VẼ TRANH CỦA BÉ:
          </span>
          <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Cọ Thần AI Thông Minh
          </span>
        </div>

        {/* Formula Box matching user sample */}
        <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-3.5 mb-3 text-base sm:text-lg font-bold text-amber-200 text-center leading-relaxed shadow-inner relative z-10">
          &ldquo;Hãy vẽ{' '}
          <span className="underline decoration-amber-300 underline-offset-4 text-white">
            {animal.vi} {animal.emoji}
          </span>{' '}
          đang{' '}
          <span className="underline decoration-pink-300 underline-offset-4 text-white">
            {action.vi} {action.emoji}
          </span>{' '}
          ở{' '}
          <span className="underline decoration-blue-300 underline-offset-4 text-white">
            {background.vi} {background.emoji}
          </span>{' '}
          theo phong cách{' '}
          <span className="underline decoration-green-300 underline-offset-4 text-white">
            {style.vi} {style.emoji}
          </span>
          &rdquo;
        </div>

        <div className="mb-4 relative z-10">
          <label className="block text-xs font-semibold mb-1 text-purple-100">
            Bé muốn thêm chi tiết gì đặc biệt không? (Không bắt buộc)
          </label>
          <input
            type="text"
            value={extraPrompt}
            onChange={(e) => onChangeExtraPrompt(e.target.value)}
            placeholder="Ví dụ: Đeo vương miện lấp lánh, khoác áo choàng siêu nhân, bầu trời có cầu vồng..."
            className="w-full bg-white/20 text-white placeholder-purple-200 text-xs rounded-xl px-3.5 py-2.5 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 relative z-10">
          <button
            onClick={onGenerateArt}
            disabled={isGenerating}
            className={`flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-900 text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 font-bold cursor-pointer ${
              isGenerating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Paintbrush className="w-5 h-5 text-purple-950" />
            {isGenerating ? 'AI ĐANG VẼ TRANH...' : 'TẠO BỨC TRANH CỰC ĐẸP ✨'}
          </button>
          <button
            onClick={onReset}
            disabled={isGenerating}
            className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Chọn lại
          </button>
        </div>
      </div>
    </div>
  );
};
