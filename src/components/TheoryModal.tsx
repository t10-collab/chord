import React, { useState } from 'react';
import { X, Play, Volume2, Sparkles, Lightbulb, Music, Clock, Disc3 } from 'lucide-react';
import { MUSICAL_ITEMS, PITCH_ITEMS } from '../data/musicData';
import { PitchItem } from '../types/music';
import { MusicalSymbol } from './MusicalSymbol';
import { StaffPitchSymbol } from './StaffPitchSymbol';
import { sound } from '../utils/audio';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'note' | 'rest' | 'pitch' | 'tips'>('pitch');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<PitchItem>(PITCH_ITEMS[0]); // default C4 가온 도

  if (!isOpen) return null;

  const handlePlayBeat = (item: (typeof MUSICAL_ITEMS)[0]) => {
    setPlayingId(item.id);
    sound.playBeatDuration(item.beats, item.type === 'rest');
    const durationMs = Math.max(250, item.beats * 600);
    setTimeout(() => {
      setPlayingId((curr) => (curr === item.id ? null : curr));
    }, durationMs);
  };

  const handleSelectPitch = (pitch: PitchItem) => {
    setSelectedPitch(pitch);
    sound.playPitchTone(pitch.frequency, 0.6);
    setPlayingId(pitch.id);
    setTimeout(() => {
      setPlayingId((curr) => (curr === pitch.id ? null : curr));
    }, 600);
  };

  const filteredItems = MUSICAL_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'note') return item.type === 'note';
    if (filter === 'rest') return item.type === 'rest';
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                음악 이론 &amp; 오선보 마스터 도감 📖
              </h2>
              <p className="text-xs text-slate-400">
                중학교 1~2학년 음악과 필수: 음표·쉼표 길이부터 높은음자리표 계이름까지
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setFilter('pitch');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
              filter === 'pitch'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🎼 높은음자리표 계이름 &amp; 건반
          </button>
          <button
            onClick={() => {
              setFilter('all');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            전체 음표&amp;쉼표 (14종)
          </button>
          <button
            onClick={() => {
              setFilter('note');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
              filter === 'note'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🎵 음표
          </button>
          <button
            onClick={() => {
              setFilter('rest');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
              filter === 'rest'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛑 쉼표
          </button>
          <button
            onClick={() => {
              setFilter('tips');
              sound.playClick();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer ${
              filter === 'tips'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            💡 시험 단골 꿀팁
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filter === 'pitch' ? (
            /* NEW: Interactive Treble Clef & Solfege Piano Keyboard Explorer */
            <div className="space-y-4">
              {/* Interactive Stave & Note Display */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-cyan-400" /> 높은음자리표 오선보 실시간 시각화
                  </span>
                  <span>건반이나 음을 클릭하면 소리가 납니다!</span>
                </div>

                <div className="w-full flex flex-col items-center justify-center py-2">
                  <StaffPitchSymbol pitch={selectedPitch} size="lg" color="#38bdf8" />
                </div>

                {/* Selected Note Info Badge */}
                <div className="mt-2 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">계이름: </span>
                    <span className="font-black text-amber-300 text-base">{selectedPitch.solfege}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">한국 음이름: </span>
                    <span className="font-bold text-white text-sm">{selectedPitch.pitchNameKorean}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">영미 음이름: </span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">{selectedPitch.pitchNameEnglish}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">위치: </span>
                    <span className="font-bold text-emerald-300">{selectedPitch.staffPosition}</span>
                  </div>
                </div>

                <p className="text-xs text-amber-200/90 mt-2 text-center bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                  💡 {selectedPitch.memoryTip}
                </p>
              </div>

              {/* Virtual Solfege Piano Keys (C4 to G5) */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>🎹 계이름 피아노 건반 (클릭하여 연주)</span>
                  <span className="text-[11px] text-slate-400">가온 도(C4) ~ 높은 솔(G5)</span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
                  {PITCH_ITEMS.map((p) => {
                    const isSelected = selectedPitch.id === p.id;
                    const isPlaying = playingId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPitch(p)}
                        className={`min-w-[50px] sm:min-w-[58px] py-3.5 px-2 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 -translate-y-1 shadow-lg'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-500'
                        } ${isPlaying ? 'scale-95' : ''}`}
                      >
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          {p.pitchNameEnglish}
                        </span>
                        <span className="font-black text-sm sm:text-base my-0.5">
                          {p.simpleSolfege}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                            isSelected ? 'bg-slate-900/30 text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {p.pitchNameKorean}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High-Yield Middle School Memory Rules: 줄음 & 칸음 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 줄음 공식 */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm mb-2">
                    <span className="w-5 h-5 rounded-md bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xs">
                      줄
                    </span>
                    오선보 줄에 걸린 음 (줄음 공식)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-black text-amber-300 text-lg tracking-wider mb-2">
                    미 - 솔 - 시 - 레 - 파
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1줄(맨 아래)부터 순서대로 <strong>미</strong>, 2줄은 <strong>솔</strong>, 3줄(가운데)은 <strong>시</strong>, 4줄은 <strong>레</strong>, 5줄(맨 위)은 <strong>파</strong>!
                  </p>
                </div>

                {/* 칸음 공식 */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm mb-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-xs">
                      칸
                    </span>
                    오선보 칸에 들어간 음 (칸음 공식)
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-black text-emerald-300 text-lg tracking-wider mb-2">
                    파 - 라 - 도 - 미 (F-A-C-E)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1칸(맨 아래 칸)부터 <strong>파</strong>, 2칸은 <strong>라</strong>, 3칸은 <strong>도</strong>, 4칸(맨 위 칸)은 <strong>미</strong>! 영어 단어 FACE(얼굴)로 외우면 쉬워요!
                  </p>
                </div>
              </div>
            </div>
          ) : filter === 'tips' ? (
            /* Special Tips Comparison View */
            <div className="space-y-4">
              <div className="bg-slate-800/80 border-2 border-amber-400/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-lg mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  시험 단골 1위! 2분쉼표 vs 온쉼표 완벽 구별법
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  오선보에서 가장 헷갈리는 두 기호! 이것만 외우면 절대 틀리지 않아요:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
                      2박 동안 쉼
                    </span>
                    <h4 className="font-extrabold text-lg text-white mb-2">2분쉼표 (Half Rest)</h4>
                    <div className="flex justify-center my-2">
                      <MusicalSymbol id="half_rest" size="lg" color="#60a5fa" />
                    </div>
                    <div className="mt-2 text-xs font-semibold text-amber-300 bg-amber-400/10 py-1.5 px-3 rounded-lg">
                      🎩 신사 모자 모양! 셋째 줄 &apos;위&apos;에 반듯하게 놓여 있어요! (2분모자)
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                      4박 동안 쉼
                    </span>
                    <h4 className="font-extrabold text-lg text-white mb-2">온쉼표 (Whole Rest)</h4>
                    <div className="flex justify-center my-2">
                      <MusicalSymbol id="whole_rest" size="lg" color="#34d399" />
                    </div>
                    <div className="mt-2 text-xs font-semibold text-emerald-300 bg-emerald-400/10 py-1.5 px-3 rounded-lg">
                      🧺 물 가득 찬 세숫대야처럼 무거워서 넷째 줄 &apos;아래&apos;에 대롱대롱 매달려 있어요!
                    </div>
                  </div>
                </div>
              </div>

              {/* Dotted note rules */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-purple-300 font-extrabold text-lg mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  점이 붙은 음표(점음표)의 법칙
                </div>
                <div className="text-xs sm:text-sm text-slate-300 space-y-2">
                  <p>
                    음표 머리 오른쪽에 붙은 작은 점(.)은 <strong className="text-amber-300">원래 음표 길이의 딱 반(1/2)</strong>을 더해준다는 뜻이에요!
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs sm:text-sm pl-2">
                    <li>
                      <strong>점2분음표</strong>: 2분음표(2박) + 점(1박) = <span className="text-amber-300 font-bold">3박자</span>
                    </li>
                    <li>
                      <strong>점4분음표</strong>: 4분음표(1박) + 점(0.5박) = <span className="text-amber-300 font-bold">1박 반 (1.5박자)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredItems.map((item) => {
                const isPlaying = playingId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-slate-800/90 border rounded-2xl p-4 transition-all hover:border-slate-500 relative flex flex-col justify-between ${
                      item.type === 'note' ? 'border-blue-900/40' : 'border-emerald-900/40'
                    }`}
                  >
                    <div>
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-lg text-white">{item.name}</h3>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                item.type === 'note'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {item.type === 'note' ? '음표' : '쉼표'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{item.englishName}</p>
                        </div>

                        {/* Beats Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-sm shrink-0 shadow-sm">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.beatsDisplay}</span>
                        </div>
                      </div>

                      {/* Visual Symbol & Description */}
                      <div className="flex items-center gap-3 my-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                        <MusicalSymbol
                          id={item.id}
                          size="md"
                          color={item.type === 'note' ? '#60a5fa' : '#34d399'}
                        />
                        <div className="flex-1 text-xs text-slate-300 leading-relaxed">
                          <p>{item.description}</p>
                          {item.syllables && (
                            <p className="mt-1 text-amber-300 font-bold">
                              말리듬: {item.syllables}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Memory tip */}
                      <p className="text-xs text-amber-200/90 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                        {item.memoryTip}
                      </p>
                    </div>

                    {/* Bottom audio audition button */}
                    <button
                      type="button"
                      onClick={() => handlePlayBeat(item)}
                      className={`mt-3 w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>
                        {isPlaying
                          ? `${item.beatsDisplay} 소리 재생 중... 🎵`
                          : `소리로 길이 들어보기 (${item.beatsDisplay})`}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            도감에서 음표의 길이와 계이름의 위치를 확인했다면 챌린지를 시작해 보세요!
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
