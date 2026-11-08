import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, Award, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { submitScore } from '../services/firebase';

interface ResultModalProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxCombo: number;
  stageName: string;
  nickname: string;
  avatar: string;
  onRetry: () => void;
  onGoHome: () => void;
  onViewLeaderboard: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  score,
  correctCount,
  totalQuestions,
  maxCombo,
  stageName,
  nickname,
  avatar,
  onRetry,
  onGoHome,
  onViewLeaderboard,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isFirebaseRecord, setIsFirebaseRecord] = useState(false);

  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  // Determine educational praise tier
  const getTier = () => {
    if (accuracy === 100) {
      return {
        title: '👑 퍼펙트 마에스트로!',
        desc: '모든 문제를 완벽하게 맞혔어요! 음악 기호의 최고봉!',
        color: 'from-amber-400 to-yellow-500 text-slate-950',
      };
    } else if (accuracy >= 80) {
      return {
        title: '🎓 리듬 박사 등급!',
        desc: '음표와 쉼표의 원리를 거의 완벽히 꿰뚫고 있어요!',
        color: 'from-blue-400 to-indigo-500 text-white',
      };
    } else if (accuracy >= 60) {
      return {
        title: '🌟 음악 모험가 등급!',
        desc: '훌륭해요! 조금만 더 연습하면 마에스트로가 될 수 있어요!',
        color: 'from-emerald-400 to-teal-500 text-white',
      };
    } else {
      return {
        title: '🌱 씩씩한 음악 꿈나무!',
        desc: '도감에서 쉼표 꿀팁을 확인하고 다시 도전해 보세요!',
        color: 'from-purple-400 to-pink-500 text-white',
      };
    }
  };

  const tier = getTier();

  useEffect(() => {
    // Play celebratory sound and throw confetti
    sound.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Auto-save score to Firestore and localStorage
    submitScore({
      nickname,
      avatar,
      score,
      stage: stageName,
      correctCount,
      totalQuestions,
      maxCombo,
    }).then((saved) => {
      setIsSaved(true);
      setIsFirebaseRecord(!!saved.isFirebase);
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Tier Medal Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 mb-3">
          <span>{avatar}</span>
          <span className="font-extrabold text-amber-300">{nickname}</span>
          <span>학생의 모험 결과</span>
        </div>

        {/* Main Title Badge */}
        <div
          className={`py-3 px-5 rounded-2xl bg-gradient-to-r ${tier.color} shadow-lg mb-4`}
        >
          <h2 className="text-2xl sm:text-3xl font-black">{tier.title}</h2>
          <p className="text-xs font-medium opacity-90 mt-0.5">{tier.desc}</p>
        </div>

        {/* Score Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-5 shadow-inner">
          <div className="text-xs font-bold text-slate-400 mb-1">최종 획득 점수</div>
          <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
            {score.toLocaleString()} <span className="text-xl sm:text-2xl">점</span>
          </div>

          {/* Stats breakdown */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
            <div>
              <div className="text-[11px] text-slate-400">정답률</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                {correctCount} / {totalQuestions} ({accuracy}%)
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">최대 콤보</div>
              <div className="text-base sm:text-lg font-black text-red-400 flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4 fill-red-400" />
                <span>{maxCombo}회</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">도전 모드</div>
              <div className="text-xs sm:text-sm font-bold text-blue-300 truncate">
                {stageName.replace(/^[0-9]단계:\s*/, '')}
              </div>
            </div>
          </div>
        </div>

        {/* Save Status Badge */}
        <div className="mb-6 flex items-center justify-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-xl">
          <CheckCircle className="w-4 h-4" />
          <span>
            {isSaved
              ? isFirebaseRecord
                ? 'Cloud Firestore 실시간 랭킹에 등록 완료!'
                : '기록이 저장되었습니다 (로컬/오프라인)'
              : '기록을 저장하는 중...'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 도전하기</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onViewLeaderboard();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>실시간 랭킹 보기</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
            title="메인 화면으로"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
