import React, { useState, useEffect } from 'react';
import { GameStage, QuizQuestion } from './types/music';
import {
  generateStage1Questions,
  generateStage2Questions,
  generateStage3Questions,
  generateStage4Questions,
  generateAdventureQuestions,
} from './data/musicData';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { HomeMenu } from './components/HomeMenu';
import { GameScreen } from './components/GameScreen';
import { ResultModal } from './components/ResultModal';
import { TheoryModal } from './components/TheoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherModal } from './components/TeacherModal';

export default function App() {
  // User state
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem('music_game_nickname') || '';
  });
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('music_game_avatar') || '🎧';
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());

  // Screen state
  const [screen, setScreen] = useState<'menu' | 'playing' | 'result'>('menu');
  const [currentStage, setCurrentStage] = useState<GameStage>('adventure');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Modals
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);

  // Results
  const [lastResult, setLastResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    stageName: string;
  } | null>(null);

  const handleToggleSound = () => {
    const nextState = sound.toggle();
    setSoundEnabled(nextState);
  };

  const handleUpdateNickname = (name: string, av: string) => {
    setNickname(name);
    setAvatar(av);
    localStorage.setItem('music_game_nickname', name);
    localStorage.setItem('music_game_avatar', av);
  };

  const handleStartGame = (stage: GameStage) => {
    setCurrentStage(stage);
    let qList: QuizQuestion[] = [];
    if (stage === 1) {
      qList = generateStage1Questions(7);
    } else if (stage === 2) {
      qList = generateStage2Questions(7);
    } else if (stage === 3) {
      qList = generateStage3Questions(7);
    } else if (stage === 4) {
      qList = generateStage4Questions(7);
    } else {
      qList = generateAdventureQuestions();
    }

    setQuestions(qList);
    setScreen('playing');
  };

  const handleGameFinish = (result: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    stageName: string;
  }) => {
    setLastResult(result);
    setScreen('result');
  };

  const handleRetry = () => {
    handleStartGame(currentStage);
  };

  return (
    <div className="min-h-screen bg-[#0B2545] bg-gradient-to-b from-[#0B2545] via-slate-900 to-slate-950 text-white flex flex-col font-sans relative selection:bg-amber-400 selection:text-slate-950">
      {/* Background Decorative Musical Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-5 flex items-center justify-center select-none overflow-hidden">
        <span className="text-[28rem] font-serif leading-none">𝄞</span>
      </div>

      {/* Persistent Navigation Header */}
      <Header
        nickname={nickname}
        avatar={avatar}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenTeacher={() => setIsTeacherOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onHomeClick={() => setScreen('menu')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        {screen === 'menu' && (
          <HomeMenu
            nickname={nickname}
            avatar={avatar}
            soundEnabled={soundEnabled}
            onUpdateNickname={handleUpdateNickname}
            onStartGame={handleStartGame}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenTheory={() => setIsTheoryOpen(true)}
            onToggleSound={handleToggleSound}
          />
        )}

        {screen === 'playing' && (
          <GameScreen
            stage={currentStage}
            questions={questions}
            nickname={nickname || '모험가'}
            avatar={avatar}
            onFinish={handleGameFinish}
            onExit={() => setScreen('menu')}
          />
        )}
      </main>

      {/* Footer copyright & student notice */}
      <footer className="w-full py-4 px-4 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-400">
        <p className="font-medium">
          🎵 중학교 1~2학년 음악 교육용 웹앱 • 음표 &amp; 쉼표 마스터!
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          학생들의 개인정보를 수집하지 않으며, 수업 시간에 닉네임 또는 모둠명으로 참여할 수 있습니다.
        </p>
      </footer>

      {/* Result Modal */}
      {screen === 'result' && lastResult && (
        <ResultModal
          score={lastResult.score}
          correctCount={lastResult.correctCount}
          totalQuestions={lastResult.totalQuestions}
          maxCombo={lastResult.maxCombo}
          stageName={lastResult.stageName}
          nickname={nickname || '모험가'}
          avatar={avatar}
          onRetry={handleRetry}
          onGoHome={() => setScreen('menu')}
          onViewLeaderboard={() => {
            setScreen('menu');
            setIsLeaderboardOpen(true);
          }}
        />
      )}

      {/* Theory Guide Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentNickname={nickname}
      />

      {/* Teacher Admin Modal */}
      <TeacherModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
      />
    </div>
  );
}
