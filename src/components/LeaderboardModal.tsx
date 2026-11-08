import React, { useEffect, useState } from 'react';
import { Trophy, X, Flame, Sparkles, Cloud, Database, Clock, RefreshCw } from 'lucide-react';
import { ScoreRecord } from '../types/music';
import { subscribeLeaderboard, isFirebaseActive } from '../services/firebase';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentNickname,
}) => {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLive(isFirebaseActive());
    const unsubscribe = subscribeLeaderboard((updated) => {
      setScores(updated);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return (
      <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center border border-slate-700">
        {rank}
      </span>
    );
  };

  const formatDate = (epochMs: number) => {
    const d = new Date(epochMs);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${m}/${day} ${h}:${min}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">명예의 전당 🏆</h2>
                {isLive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Cloud className="w-3 h-3" /> Firestore 실시간
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    <Database className="w-3 h-3" /> 로컬 저장 모드
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                중등 음악 음표&amp;쉼표 마스터 탑 랭커 실시간 순위
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>🛡️ 학생 개인정보 보호를 위해 실명 대신 재미있는 모둠/닉네임으로 표시됩니다.</span>
        </div>

        {/* Scores List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {scores.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-sm">아직 등록된 기록이 없습니다!</p>
              <p className="text-xs text-slate-500 mt-1">
                첫 번째 주인공이 되어 모험을 시작해 보세요!
              </p>
            </div>
          ) : (
            scores.map((rec, idx) => {
              const rank = idx + 1;
              const isCurrentUser =
                currentNickname &&
                rec.nickname.trim().toLowerCase() === currentNickname.trim().toLowerCase();

              return (
                <div
                  key={rec.id || idx}
                  className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border transition-all ${
                    rank === 1
                      ? 'bg-amber-500/15 border-amber-400/50 shadow-md shadow-amber-500/10'
                      : rank === 2
                      ? 'bg-slate-800/90 border-slate-600'
                      : rank === 3
                      ? 'bg-amber-900/15 border-amber-700/40'
                      : 'bg-slate-900/60 border-slate-800'
                  } ${isCurrentUser ? 'ring-2 ring-amber-400/80 bg-amber-400/10' : ''}`}
                >
                  {/* Left: Rank & Nickname */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-8">
                      {getRankBadge(rank)}
                    </div>
                    <span className="text-2xl select-none shrink-0">{rec.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-white truncate">
                          {rec.nickname}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                            나
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-blue-300 font-semibold">{rec.stage}</span>
                        <span>•</span>
                        <span>{formatDate(rec.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score & combo */}
                  <div className="text-right shrink-0">
                    <div className="text-base sm:text-xl font-black text-amber-400">
                      {rec.score.toLocaleString()} <span className="text-xs font-bold text-slate-400">P</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">
                      <span>정답 {rec.correctCount}개</span>
                      {rec.maxCombo > 1 && (
                        <span className="text-red-400 font-bold flex items-center">
                          <Flame className="w-3 h-3 fill-red-400" />
                          {rec.maxCombo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            총 {scores.length}개의 기록이 등록되어 있습니다.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
