import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, GameStage } from '../types/music';
import { MusicalSymbol } from './MusicalSymbol';
import { StaffPitchSymbol } from './StaffPitchSymbol';
import { sound } from '../utils/audio';
import { Flame, Clock, ArrowRight, X, AlertTriangle, CheckCircle2, XCircle, Award, Volume2 } from 'lucide-react';

interface GameScreenProps {
  stage: GameStage;
  questions: QuizQuestion[];
  nickname: string;
  avatar: string;
  onFinish: (result: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    stageName: string;
  }) => void;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  stage,
  questions,
  nickname,
  avatar,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 15 seconds per question
  const QUESTION_TIME = 15;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const stageTitles: Record<string, string> = {
    '1': '1단계: 기호 이름 맞추기',
    '2': '2단계: 박자(길이) 맞추기',
    '3': '3단계: 음표 계산 마스터',
    '4': '4단계: 높은음자리표 계이름 맞추기',
    adventure: '⭐ 신나는 종합 모험',
  };
  const currentStageTitle = stageTitles[String(stage)] || '음악 기호 퀴즈';

  // Timer countdown
  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(QUESTION_TIME);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered]);

  // Keyboard shortcut listener (1, 2, 3, 4, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (isAnswered) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQ && currentQ.options[idx]) {
          e.preventDefault();
          handleSelectOption(currentQ.options[idx].id, currentQ.options[idx].isCorrect);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionId('TIMEOUT');
    sound.playWrong();
    setCombo(0);
  };

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOptionId(optId);

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setCorrectCount((prev) => prev + 1);

      // Score calculation: Base (100) + Time bonus (timeLeft * 8) + Combo bonus (combo * 25)
      const basePoints = 100;
      const timeBonus = timeLeft * 8;
      const comboBonus = (nextCombo - 1) * 25;
      const addedScore = basePoints + timeBonus + comboBonus;

      setScore((prev) => prev + addedScore);
      sound.playCorrect(nextCombo);

      // 🎆 학생이 맞출 때마다 폭죽 팡팡 터뜨리기!
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e', '#a855f7'],
      });

      // 3콤보 이상일 때는 좌우 듀얼 폭죽 추가 발사!
      if (nextCombo >= 3) {
        setTimeout(() => {
          confetti({
            particleCount: 30,
            angle: 60,
            spread: 50,
            origin: { x: 0.15, y: 0.65 },
            colors: ['#fbbf24', '#f43f5e', '#60a5fa'],
          });
          confetti({
            particleCount: 30,
            angle: 120,
            spread: 50,
            origin: { x: 0.85, y: 0.65 },
            colors: ['#34d399', '#a78bfa', '#fbbf24'],
          });
        }, 120);
      }
    } else {
      setCombo(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOptionId(null);
    } else {
      // Completed!
      onFinish({
        score,
        correctCount,
        totalQuestions: questions.length,
        maxCombo,
        stageName: currentStageTitle,
      });
    }
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-5 flex flex-col items-center">
      {/* Top Status Bar: Progress, Stage, Score, Combo, Exit */}
      <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 backdrop-blur-md mb-4 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Stage name & current index */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {currentStageTitle}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Q{currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Right: Score, Combo & Exit */}
          <div className="flex items-center gap-3">
            {/* Combo flame */}
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-black shadow-md animate-bounce">
                <Flame className="w-3.5 h-3.5 fill-amber-200" />
                <span>{combo} COMBO!</span>
              </div>
            )}

            {/* Score */}
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
              <Award className="w-4 h-4" />
              <span>{score.toLocaleString()}P</span>
            </div>

            {/* Exit button */}
            <button
              onClick={() => setShowExitConfirm(true)}
              title="게임 중단하고 나가기"
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="w-full bg-slate-800/90 border-2 border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl relative">
        {/* Timer Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span>{avatar}</span>
            <span>{nickname} 학생</span>
          </div>

          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-colors ${
              timeLeft <= 5
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : 'bg-slate-900 text-amber-300 border border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>남은 시간: {timeLeft}초</span>
          </div>
        </div>

        {/* Question Title */}
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {currentQ.questionText}
          </h2>
          {currentQ.questionSubtext && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              {currentQ.questionSubtext}
            </p>
          )}
        </div>

        {/* Visual Symbol Area */}
        <div className="w-full py-4 px-2 bg-slate-950/70 border border-slate-700/80 rounded-2xl flex items-center justify-center min-h-[140px] mb-6 shadow-inner">
          {/* Stage 1/2 single symbol */}
          {currentQ.symbolItem && (
            <div className="flex flex-col items-center">
              <MusicalSymbol
                id={currentQ.symbolItem.id}
                size="lg"
                color="#fcd34d"
                className="transform hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Stage 3 Music Math equation: e.g. [Quarter Note] + [Eighth Note] = ? */}
          {currentQ.equationItems && (
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {currentQ.equationItems.map((eq, i) => (
                <React.Fragment key={i}>
                  {eq.operator && (
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 px-1">
                      {eq.operator}
                    </span>
                  )}
                  <div className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-xl p-2 sm:p-3">
                    <MusicalSymbol id={eq.item.id} size="md" color="#60a5fa" />
                    <span className="text-xs font-bold text-slate-300 mt-1">{eq.item.name}</span>
                  </div>
                </React.Fragment>
              ))}
              <span className="text-3xl sm:text-4xl font-black text-amber-400 px-1">=</span>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-amber-400/80 bg-amber-400/10 flex items-center justify-center text-amber-300 text-2xl font-black">
                ?
              </div>
            </div>
          )}

          {/* Stage 4 / Pitch Question: Staff Pitch Symbol */}
          {currentQ.pitchItem && (
            <div className="flex flex-col items-center">
              <StaffPitchSymbol pitch={currentQ.pitchItem} size="lg" color="#38bdf8" />
              <button
                type="button"
                onClick={() => sound.playPitchTone(currentQ.pitchItem!.frequency, 0.7)}
                className="mt-3 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>이 음정 소리 다시 듣기 🎧</span>
              </button>
            </div>
          )}
        </div>

        {/* Keyboard shortcut hint for fast immersion */}
        <div className="hidden sm:flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
          <span>키보드 숫자키 [1, 2, 3, 4] 로도 빠르게 정답을 고를 수 있어요!</span>
          <span>스페이스바: 다음 문제</span>
        </div>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-700/80 hover:border-slate-500 hover:shadow-md';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-600/40 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
              } else if (isSelected) {
                btnStyle = 'bg-red-600/40 border-red-400 text-red-200 ring-2 ring-red-400/50';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between gap-2 cursor-pointer relative overflow-hidden group ${btnStyle} ${
                  !isAnswered ? 'active:scale-98' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Key Number Badge */}
                  <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-amber-300 group-hover:border-amber-400/50 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {optIdx + 1}
                  </span>

                  {opt.symbolItem && (
                    <div className="shrink-0">
                      <MusicalSymbol id={opt.symbolItem.id} size="sm" color="currentColor" />
                    </div>
                  )}

                  <div>
                    <span className="text-sm sm:text-base font-extrabold">{opt.text}</span>
                    {opt.subtext && (
                      <p className="text-xs text-slate-400 font-normal mt-0.5">{opt.subtext}</p>
                    )}
                  </div>
                </div>

                {/* Status icon after answering */}
                {isAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Explanation Banner (shown after answering) */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-2.5">
              {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-300">💡 학습 쏙쏙 해설</p>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Question CTA Button (shown after answering) */}
        {isAnswered && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? '다음 문제로 🚀' : '결과 확인하기 🏆'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-black text-white">모험을 그만둘까요?</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              지금 나가시면 현재까지 푼 점수가 저장되지 않습니다.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                계속 풀기
              </button>
              <button
                onClick={onExit}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
