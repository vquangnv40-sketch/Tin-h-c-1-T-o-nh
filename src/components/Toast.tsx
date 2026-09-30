import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let bgClass = 'bg-purple-700';
        let Icon = Sparkles;
        if (toast.type === 'success') {
          bgClass = 'bg-emerald-600';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bgClass = 'bg-red-600';
          Icon = AlertCircle;
        } else if (toast.type === 'info') {
          bgClass = 'bg-purple-700';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`${bgClass} text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl transition-all duration-300 pointer-events-auto flex items-center gap-2 border border-white/20`}
          >
            <Icon className="w-4 h-4 shrink-0 text-amber-300" />
            <span>{toast.text}</span>
          </div>
        );
      })}
    </div>
  );
};
