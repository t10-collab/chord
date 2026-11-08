import React from 'react';
import { Volume2, VolumeX, Shield, Music, Trophy, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  nickname: string;
  avatar: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTeacher: () => void;
  onOpenLeaderboard: () => void;
  onOpenTheory: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  nickname,
  avatar,
  soundEnabled,
  onToggleSound,
  onOpenTeacher,
  onOpenLeaderboard,
  onOpenTheory,
  onHomeClick,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:rotate-6 transition-transform">
            <Music className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg md:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                음표 &amp; 쉼표 마스터!
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                중등 음악
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              신나는 음악 기호 모험
            </p>
          </div>
        </button>

        {/* Right Navigation & Control buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theory Quick Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTheory();
            }}
            title="이론 도감 열기"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">도감</span>
          </button>

          {/* Ranking Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            title="실시간 랭킹 보기"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">기록</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? '효과음 켜짐 (클릭시 음소거)' : '효과음 꺼짐 (클릭시 켜기)'}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors ${
              soundEnabled
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Teacher Mode Button (Discreet) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacher();
            }}
            title="교사 관리자 모드 (비밀번호: 1234)"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 text-slate-400 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-[11px]">선생님</span>
          </button>

          {/* Current Nickname Pill */}
          {nickname && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-xl text-xs">
              <span className="text-base select-none">{avatar}</span>
              <span className="font-bold text-slate-200 max-w-[85px] sm:max-w-[120px] truncate">
                {nickname}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
