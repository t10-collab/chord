import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  Lock,
  Unlock,
  Trash2,
  Download,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Users,
  Award,
} from 'lucide-react';
import { ScoreRecord } from '../types/music';
import { fetchAllScores, clearAllScores, seedSampleScores, isFirebaseActive } from '../services/firebase';
import { sound } from '../utils/audio';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [records, setRecords] = useState<ScoreRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadRecords();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
      setPasswordError(false);
      sound.playCorrect();
    } else {
      setPasswordError(true);
      sound.playWrong();
    }
  };

  const loadRecords = async () => {
    setIsLoading(true);
    const list = await fetchAllScores();
    setRecords(list);
    setIsLoading(false);
  };

  const handleResetScores = async () => {
    sound.playClick();
    setIsLoading(true);
    const { count } = await clearAllScores();
    await loadRecords();
    setShowResetConfirm(false);
    setActionMessage(`${count}개의 학생 기록이 성공적으로 초기화되었습니다.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleSeedScores = () => {
    sound.playClick();
    seedSampleScores();
    loadRecords();
    setActionMessage('예시 학생 데이터가 생성되었습니다.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  // CSV Export for teacher grade recording
  const handleExportCSV = () => {
    sound.playClick();
    if (records.length === 0) return;

    const headers = ['순위', '닉네임', '점수', '모드', '정답수', '총문제', '최대콤보', '제출일시'];
    const rows = records.map((r, i) => [
      i + 1,
      `"${r.nickname.replace(/"/g, '""')}"`,
      r.score,
      `"${r.stage}"`,
      r.correctCount,
      r.totalQuestions,
      r.maxCombo,
      `"${new Date(r.createdAt).toLocaleString('ko-KR')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `음표쉼표마스터_학습기록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) =>
    r.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgScore =
    records.length > 0
      ? Math.round(records.reduce((acc, curr) => acc + curr.score, 0) / records.length)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                교사 관리자 모드 🔒
              </h2>
              <p className="text-xs text-slate-400">
                수업 진행 현황 조회, 학생 점수 기록 관리 및 초기화
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

        {/* Content */}
        {!isAuthenticated ? (
          /* Password Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">교사 인증 비밀번호</h3>
            <p className="text-xs text-slate-400 mb-6">
              교사용 관리 메뉴입니다. 기본 비밀번호는 <code className="text-amber-400 font-mono font-bold">1234</code> 입니다.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={10}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="비밀번호 입력 (1234)"
                autoFocus
                className={`w-full h-12 bg-slate-950 border-2 rounded-2xl px-4 text-center text-lg font-mono tracking-widest text-white focus:outline-none transition-colors ${
                  passwordError
                    ? 'border-red-500 ring-2 ring-red-500/30'
                    : 'border-slate-700 focus:border-blue-400'
                }`}
              />
              {passwordError && (
                <p className="text-red-400 text-xs font-semibold">비밀번호가 올바르지 않습니다.</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-black text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                관리자 모드 접속
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action Banner if any */}
            {actionMessage && (
              <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Quick Stats Row */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 grid grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">참여 학생(기록수)</div>
                  <div className="text-lg font-black text-white">{records.length}명</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">평균 점수</div>
                  <div className="text-lg font-black text-amber-400">{avgScore}점</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <Shield className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">저장소 상태</div>
                  <div className="text-xs font-bold text-emerald-300">
                    {isFirebaseActive() ? 'Firestore 연동' : '로컬 모드'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Bar: Search & Management buttons */}
            <div className="p-4 bg-slate-900 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between border-b border-slate-800">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="학생 닉네임 검색..."
                  className="w-full h-10 pl-9 pr-4 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={handleExportCSV}
                  disabled={records.length === 0}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  title="엑셀/CSV로 다운로드"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>CSV 다운로드</span>
                </button>

                <button
                  onClick={handleSeedScores}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  title="테스트용 예시 학생 데이터 넣기"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>예시 데이터 채우기</span>
                </button>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>기록 전체 초기화</span>
                </button>
              </div>
            </div>

            {/* Student Records Table */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="text-center py-12 text-slate-400 text-xs">기록을 불러오는 중...</div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-bold">학생 기록이 없습니다.</p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">순위</th>
                        <th className="py-2.5 px-3">닉네임(모둠)</th>
                        <th className="py-2.5 px-3">점수</th>
                        <th className="py-2.5 px-3">도전 단계</th>
                        <th className="py-2.5 px-3">정답수</th>
                        <th className="py-2.5 px-3">최대콤보</th>
                        <th className="py-2.5 px-3">제출 시각</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredRecords.map((r, i) => (
                        <tr key={r.id || i} className="hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-bold text-amber-400">{i + 1}</td>
                          <td className="py-2.5 px-3 flex items-center gap-1.5 font-bold text-white">
                            <span>{r.avatar}</span>
                            <span>{r.nickname}</span>
                          </td>
                          <td className="py-2.5 px-3 font-black text-amber-300">
                            {r.score.toLocaleString()}P
                          </td>
                          <td className="py-2.5 px-3 text-blue-300">{r.stage}</td>
                          <td className="py-2.5 px-3">
                            {r.correctCount} / {r.totalQuestions}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-red-400">{r.maxCombo}회</td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {new Date(r.createdAt).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
            <div className="bg-slate-900 border-2 border-red-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-black text-white">랭킹 데이터를 모두 삭제할까요?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                현재 등록된 모든 학생 점수 및 리더보드 데이터가 영구적으로 삭제됩니다. 다음 반 수업을 시작할 때 유용합니다.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  취소
                </button>
                <button
                  onClick={handleResetScores}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs"
                >
                  초기화 실행
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
