import React, { useState } from 'react';
import { GalleryItem } from '../types/gallery';
import { Images, Trash2, Download, Eye, X, BookOpen } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  onDelete,
  onClearAll,
}) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleDownloadItem = (item: GalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `Tranh_Be_${item.id}.png`;
    link.href = item.imageUrl;
    link.click();
  };

  return (
    <section className="mt-8 bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg text-purple-950 font-bold flex items-center gap-2">
            <Images className="w-5 h-5 text-pink-500" />
            Bộ Sưu Tập Bức Tranh Của Bé
          </h2>
          <p className="text-xs text-slate-500">
            Nơi lưu giữ các tác phẩm nghệ thuật kỳ diệu bé tự tay tạo ra! ({gallery.length} bức tranh)
          </p>
        </div>
        {gallery.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-red-500 underline font-semibold cursor-pointer transition"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {gallery.length === 0 ? (
        <div className="text-xs text-center text-slate-400 py-10 space-y-2">
          <div className="text-3xl">🎨</div>
          <p>
            Chưa có bức tranh nào được lưu. Tạo xong tranh, bé nhớ bấm{' '}
            <b className="text-pink-600 font-bold">&ldquo;Lưu ảnh&rdquo;</b> nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-purple-50/70 p-2 rounded-2xl border border-purple-100 flex flex-col group relative overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer hover:-translate-y-1"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 bg-white/90 rounded-full shadow-md text-purple-900">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between px-0.5">
                <div className="truncate flex-1">
                  <span className="text-[11px] font-bold text-purple-950 truncate block">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400">{item.date}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    onClick={(e) => handleDownloadItem(item, e)}
                    className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition"
                    title="Tải về"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl relative border-2 border-purple-200 animate-fadeIn"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-purple-950 mb-3 flex items-center gap-2">
              <span>🌟</span> {selectedItem.title}
            </h3>

            <div className="rounded-2xl overflow-hidden aspect-square border-2 border-purple-100 shadow-inner bg-slate-50 mb-3">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {selectedItem.story && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-slate-700 italic mb-3 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <p>&ldquo;{selectedItem.story}&rdquo;</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">Ngày tạo: {selectedItem.date}</span>
              <button
                onClick={(e) => handleDownloadItem(selectedItem, e)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Tải ảnh về máy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
