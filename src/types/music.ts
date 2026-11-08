export type SymbolType = 'note' | 'rest';

export interface MusicalItem {
  id: string;
  name: string;
  englishName: string;
  type: SymbolType;
  beats: number; // e.g. 4, 3, 2, 1.5, 1, 0.5, 0.25
  beatsDisplay: string; // "4박", "3박", "2박", "1박 반", "1박", "반 박 (1/2박)", "반의 반 박 (1/4박)"
  description: string;
  memoryTip: string;
  syllables?: string; // 말리듬 (예: "타-아-아-아", "타-아", "타", "티", "티리")
}

export interface PitchItem {
  id: string;
  solfege: string; // '도', '레', '미', '파', '솔', '라', '시', '높은 도', '높은 레', '높은 미'
  simpleSolfege: string; // '도', '레', '미', '파', '솔', '라', '시', '도', '레', '미'
  pitchNameKorean: string; // '다', '라', '마', '바', '사', '가', '나', '다'
  pitchNameEnglish: string; // 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'
  staffPosition: string; // '아래 첫째 줄 (덧줄)', '첫째 줄', '둘째 칸' 등
  frequency: number; // Hz for Web Audio tone
  step: number; // 0 = 가온 도 (C4), 1 = 레, 2 = 미 ... 7 = 높은 도 (C5)
  memoryTip: string;
}

export type GameStage = 1 | 2 | 3 | 4 | 'adventure';

export interface QuizQuestion {
  id: string;
  stage: 1 | 2 | 3 | 4;
  questionText: string;
  questionSubtext?: string;
  symbolItem?: MusicalItem;
  pitchItem?: PitchItem;
  // For stage 3 equation
  equationItems?: {
    item: MusicalItem;
    operator?: '+' | '-';
  }[];
  equationDisplay?: string;
  options: {
    id: string;
    text: string;
    subtext?: string;
    isCorrect: boolean;
    symbolItem?: MusicalItem;
    pitchItem?: PitchItem;
  }[];
  explanation: string;
}

export interface ScoreRecord {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  stage: string;
  correctCount: number;
  totalQuestions: number;
  maxCombo: number;
  createdAt: number; // epoch ms
  isFirebase?: boolean;
}
