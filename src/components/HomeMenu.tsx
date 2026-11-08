import React, { useState } from 'react';
import { Play, Trophy, BookOpen, Volume2, VolumeX, Sparkles, AlertCircle, Music, Flame, Award, Headphones, Disc3 } from 'lucide-react';
import { GameStage } from '../types/music';
import { AVATARS } from '../data/musicData';
import { sound } from '../utils/audio';

interface HomeMenuProps {
  nickname: string;
  avatar: string;
  soundEnabled: boolean;
  onUpdateNickname: (name: string, av: string) => void;
  onStartGame: (stage: GameStage) => void;
  onOpenLeaderboard: () => void;
  onOpenTheory: () => void;
  onToggleSound: () => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({
  nickname,
  avatar,
  soundEnabled,
  onUpdateNickname,
  onStartGame,
  onOpenLeaderboard,
  onOpenTheory,
  onToggleSound,
}) => {
  const [inputName, setInputName] = useState(nickname || '');
  const [selectedAvatar, setSelectedAvatar] = useState(avatar || '🎧');
  const [selectedStage, setSelectedStage] = useState<GameStage>('adventure');
  const [showNameError, setShowNameError] = useState(false);

  // Modern studio-themed avatars for middle schoolers
  const STUDIO_AVATARS = [
    { id: 'dj', emoji: '🎧', name: '사운드마스터' },
    { id: 'piano', emoji: '🎹', name: '피아니스트' },
    { id: 'guitar', emoji: '🎸', name: '기타리스트' },
    { id: 'drum', emoji: '🥁', name: '비트메이커' },
    { id: 'sax', emoji: '🎷', name: '색소포니스트' },
    { id: 'violin', emoji: '🎻', name: '바이올리니스트' },
    { id: 'maestro', emoji: '🎼', name: '지휘자' },
    { id: 'mic', emoji: '🎙️', name: '보컬리스트' },
  ];

  const handleStart = () => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      setShowNameError(true);
      sound.playWrong();
      return;
    }
    setShowNameError(false);
    onUpdateNickname(trimmed, selectedAvatar);
    sound.playClick();
    onStartGame(selectedStage);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 flex flex-col items-center">
      {/* Sleek Studio Header */}
      <div className="relative mb-6 text-center select-none w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-amber-300 text-xs font-semibold mb-3 tracking-wide">
          <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>중학교 1~2학년 음악과 교육과정 연계</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">스마트 리듬 &amp; 계이름 챌린지</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg">
          음표 &amp; 쉼표 <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">마스터!</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-slate-300">
          오선보 위의 음표·쉼표 길이부터 높은음자리표 계이름까지 완벽 정복
        </p>
      </div>

      {/* Main Studio Container */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle grid and acoustic ambient lighting */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Profile / Nickname Setup */}
        <div className="mb-6 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
            <label className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xs border border-amber-400/30">
                1
              </span>
              참여자 닉네임 / 모둠명
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              개인정보 보호를 위해 실명/연락처 대신 멋진 음악 닉네임을 사용하세요.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Avatar quick picker */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {STUDIO_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(av.emoji);
                    sound.playClick();
                  }}
                  title={av.name}
                  className={`w-11 h-11 shrink-0 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === av.emoji
                      ? 'bg-amber-400 border border-amber-300 shadow-md shadow-amber-400/30 ring-2 ring-amber-400/50 scale-105'
                      : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div className="flex-1 relative">
              <input
                type="text"
                maxLength={15}
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  if (showNameError) setShowNameError(false);
                }}
                placeholder="예: 2반 3모둠, 비트메이커 지수, 박자천재"
                className={`w-full h-11 bg-slate-900 border rounded-xl px-4 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  showNameError
                    ? 'border-red-500 focus:border-red-400 ring-2 ring-red-500/30'
                    : 'border-slate-700 focus:border-amber-400'
                }`}
              />
              {showNameError && (
                <p className="text-red-400 text-xs mt-1.5 font-semibold flex items-center gap-1">
                  닉네임이나 모둠명을 입력해 주세요!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. Stage Selection */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xs border border-amber-400/30">
                2
              </span>
              도전 챌린지 선택
            </label>
            <span className="text-[11px] text-slate-400">원하는 단계를 골라 집중 학습하세요</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {/* Stage 1 */}
            <button
              type="button"
              onClick={() => {
                setSelectedStage(1);
                sound.playClick();
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group cursor-pointer ${
                selectedStage === 1
                  ? 'bg-blue-600/25 border-blue-400 ring-2 ring-blue-400/30 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-blue-300 px-2 py-0.5 rounded-md bg-blue-500/20">
                  1단계
                </span>
                <span className="text-base">🎼</span>
              </div>
              <h3 className="font-bold text-white text-sm">기호 이름 맞추기</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                음표와 쉼표 14종의 정확한 모양과 명칭
              </p>
            </button>

            {/* Stage 2 */}
            <button
              type="button"
              onClick={() => {
                setSelectedStage(2);
                sound.playClick();
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group cursor-pointer ${
                selectedStage === 2
                  ? 'bg-emerald-600/25 border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/20">
                  2단계
                </span>
                <span className="text-base">⏱️</span>
              </div>
              <h3 className="font-bold text-white text-sm">박자(길이) 맞추기</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                온음표 4박부터 16분음표까지 길이와 말리듬
              </p>
            </button>

            {/* Stage 3 */}
            <button
              type="button"
              onClick={() => {
                setSelectedStage(3);
                sound.playClick();
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group cursor-pointer ${
                selectedStage === 3
                  ? 'bg-purple-600/25 border-purple-400 ring-2 ring-purple-400/30 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-purple-300 px-2 py-0.5 rounded-md bg-purple-500/20">
                  3단계
                </span>
                <span className="text-base">🧮</span>
              </div>
              <h3 className="font-bold text-white text-sm">음표 계산 마스터</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                ♩+♪ 수식 계산 &amp; 마디 박자 채우기
              </p>
            </button>

            {/* Stage 4: NEW Treble Clef Pitch */}
            <button
              type="button"
              onClick={() => {
                setSelectedStage(4);
                sound.playClick();
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group cursor-pointer ${
                selectedStage === 4
                  ? 'bg-cyan-600/25 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/20">
                  4단계
                </span>
                <span className="text-base">🎹</span>
              </div>
              <h3 className="font-bold text-white text-sm">높은음자리표 계이름</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                오선보 줄음(미솔시레파) &amp; 칸음(파라도미)
              </p>
            </button>

            {/* Adventure Mode (Recommended) */}
            <button
              type="button"
              onClick={() => {
                setSelectedStage('adventure');
                sound.playClick();
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group cursor-pointer sm:col-span-2 lg:col-span-1 ${
                selectedStage === 'adventure'
                  ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold text-amber-300 px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400 fill-red-400" /> 종합
                </span>
                <span className="text-base">⭐</span>
              </div>
              <h3 className="font-bold text-amber-300 text-sm">올인원 챔피언십</h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                1~4단계 통합 12문제! 랭킹 1위 도전
              </p>
            </button>
          </div>
        </div>

        {/* 3. Main CTA Button */}
        <div className="flex flex-col items-center justify-center pt-2">
          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-slate-950 font-black text-xl tracking-tight shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Play className="w-6 h-6 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>챌린지 시작하기</span>
          </button>
          <p className="text-xs text-slate-400 mt-2.5 font-medium flex items-center gap-1.5">
            <span>스피드 타이머와 연속 콤보로 점수를 극대화하세요!</span>
            <span className="text-amber-400 font-bold">폭죽 효과 지원 🎆</span>
          </p>
        </div>

        {/* 4. Bottom Auxiliary Action Buttons */}
        <div className="mt-7 pt-5 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="flex items-center justify-center gap-2 p-2.5 sm:py-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>실시간 랭킹</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenTheory();
            }}
            className="flex items-center justify-center gap-2 p-2.5 sm:py-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>이론 &amp; 건반 도감</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className={`flex items-center justify-center gap-2 p-2.5 sm:py-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-slate-950/70 hover:bg-slate-800 border-slate-800 text-slate-200'
                : 'bg-red-950/30 border-red-900/50 text-red-400'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span>오디오 ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>오디오 OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
