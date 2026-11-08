import React from 'react';
import { PitchItem } from '../types/music';

interface StaffPitchSymbolProps {
  pitch: PitchItem;
  size?: 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export const StaffPitchSymbol: React.FC<StaffPitchSymbolProps> = ({
  pitch,
  size = 'lg',
  showLabel = false,
  color = '#38bdf8',
}) => {
  // Dimensions
  const width = size === 'lg' ? 240 : 180;
  const height = size === 'lg' ? 140 : 100;

  // 5 staff lines configuration
  // Line 5 (top) = y: 30
  // Line 4 = y: 44
  // Line 3 = y: 58
  // Line 2 = y: 72 (Treble clef curl wraps around this line!)
  // Line 1 (bottom) = y: 86
  // Line spacing = 14px, step (line to space) = 7px
  //
  // Step mapping (step 0 = C4 Middle C, step 1 = D4, step 2 = E4 Line 1, ...):
  // step 0 (C4): y = 86 + 14 = 100 (아래 덧줄 y=100)
  // step 1 (D4): y = 86 + 7 = 93 (아래 첫째 칸)
  // step 2 (E4): y = 86 (첫째 줄)
  // step 3 (F4): y = 79 (첫째 칸)
  // step 4 (G4): y = 72 (둘째 줄)
  // step 5 (A4): y = 65 (둘째 칸)
  // step 6 (B4): y = 58 (셋째 줄)
  // step 7 (C5): y = 51 (셋째 칸)
  // step 8 (D5): y = 44 (넷째 줄)
  // step 9 (E5): y = 37 (넷째 칸)
  // step 10 (F5): y = 30 (다섯째 줄)
  // step 11 (G5): y = 23 (위 첫째 칸)

  const line1Y = 86;
  const stepHeight = 7;
  const noteY = line1Y - (pitch.step - 2) * stepHeight;
  const noteX = 145; // placed nicely to the right of treble clef

  // If note is on/above middle line (B4 step 6), stem points down on the left, else up on the right
  const stemUp = pitch.step < 6;
  const stemX = stemUp ? noteX + 7.5 : noteX - 7.5;
  const stemY2 = stemUp ? noteY - 32 : noteY + 32;

  // Needs ledger line (아래 덧줄)? Middle C (step 0)
  const hasBottomLedger = pitch.step === 0;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg
        viewBox="0 0 220 120"
        style={{ width: `${width}px`, height: `${height}px` }}
        className="drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background rounded container glow */}
        <rect x="5" y="10" width="210" height="100" rx="16" fill="rgba(15, 23, 42, 0.6)" />

        {/* 5 Staff Lines */}
        <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="20" y1="30" x2="200" y2="30" />
          <line x1="20" y1="44" x2="200" y2="44" />
          <line x1="20" y1="58" x2="200" y2="58" />
          <line x1="20" y1="72" x2="200" y2="72" />
          <line x1="20" y1="86" x2="200" y2="86" />
        </g>

        {/* Staff line labels on the left edge (subtle educational guide) */}
        <g fill="rgba(255, 255, 255, 0.25)" fontSize="7" textAnchor="end" fontWeight="bold">
          <text x="18" y="32">5줄</text>
          <text x="18" y="46">4줄</text>
          <text x="18" y="60">3줄</text>
          <text x="18" y="74">2줄</text>
          <text x="18" y="88">1줄</text>
        </g>

        {/* Treble Clef (높은음자리표) Vector Path */}
        <g transform="translate(38, 16) scale(0.72)" fill="#f59e0b">
          <path d="M 28 82 C 26 84 23 85 20 85 C 13 85 8 80 8 73 C 8 64 16 57 24 57 C 26 57 28 58 30 59 L 30 25 C 30 21 28 17 26 14 C 23 11 19 9 15 9 C 13 9 11 10 9 11 C 7 12 6 15 7 17 C 8 20 11 20 13 20 C 17 20 19 17 19 14 C 19 12 18 10 16 9 C 20 5 27 6 32 10 C 37 14 39 21 38 28 L 38 58 C 45 61 50 67 50 75 C 50 86 41 94 30 94 C 28 94 25 94 23 93 L 23 103 C 23 110 20 115 15 115 C 10 115 7 111 7 106 C 7 102 10 99 14 99 C 17 99 19 101 19 104 C 19 107 17 109 14 109 C 16 111 18 111 19 108 C 20 106 20 104 20 101 L 20 89 C 23 91 26 92 30 92 C 38 92 45 85 45 76 C 45 69 41 64 35 62 L 35 77 C 35 83 32 87 27 87 C 21 87 17 82 17 76 C 17 68 23 63 29 63 C 32 63 34 64 35 66 L 35 62 C 33 60 30 59 27 59 C 18 59 11 65 11 74 C 11 81 16 86 23 86 C 26 86 28 85 30 83 Z" />
        </g>

        {/* Ledger Line for Middle C (가온 도 덧줄) */}
        {hasBottomLedger && (
          <line
            x1={noteX - 16}
            y1={100}
            x2={noteX + 16}
            y2={100}
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}

        {/* Note Head (음표 머리) */}
        <g transform={`translate(${noteX}, ${noteY})`}>
          <ellipse
            cx="0"
            cy="0"
            rx="9.5"
            ry="6.8"
            transform="rotate(-25)"
            fill={color}
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Subtle inner highlight */}
          <ellipse
            cx="-1.5"
            cy="-1.5"
            rx="5"
            ry="2.2"
            transform="rotate(-25)"
            fill="rgba(255, 255, 255, 0.4)"
          />
        </g>

        {/* Note Stem (음표 기둥) */}
        <line
          x1={stemX}
          y1={noteY}
          x2={stemX}
          y2={stemY2}
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Position Badge at bottom */}
        {showLabel && (
          <text
            x="110"
            y="114"
            textAnchor="middle"
            fill="#fcd34d"
            fontSize="10"
            fontWeight="bold"
          >
            {pitch.staffPosition} ({pitch.solfege})
          </text>
        )}
      </svg>
    </div>
  );
};
