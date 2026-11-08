import React from 'react';

interface MusicalSymbolProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStaff?: boolean;
  className?: string;
  color?: string;
}

export const MusicalSymbol: React.FC<MusicalSymbolProps> = ({
  id,
  size = 'md',
  showStaff = true,
  className = '',
  color = 'currentColor',
}) => {
  const sizeMap = {
    sm: { w: 60, h: 60 },
    md: { w: 100, h: 100 },
    lg: { w: 140, h: 140 },
    xl: { w: 190, h: 190 },
  };

  const { w, h } = sizeMap[size];

  // 5 lines for music staff (horizontal lines)
  const staffLines = (
    <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.8" strokeLinecap="round">
      <line x1="8" y1="28" x2="92" y2="28" />
      <line x1="8" y1="39" x2="92" y2="39" />
      <line x1="8" y1="50" x2="92" y2="50" />
      <line x1="8" y1="61" x2="92" y2="61" />
      <line x1="8" y1="72" x2="92" y2="72" />
    </g>
  );

  const renderShape = () => {
    switch (id) {
      // ===== 음표 (NOTES) =====
      case 'whole_note':
        // 온음표: 둥글고 납작한 빈 타원, 속이 뚫려있음
        return (
          <g transform="translate(50, 50)">
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="10"
              transform="rotate(-25)"
              fill="none"
              stroke={color}
              strokeWidth="5"
            />
            {/* 안쪽 타원 하이라이트 디테일 */}
            <ellipse
              cx="0"
              cy="0"
              rx="9"
              ry="4.5"
              transform="rotate(-35)"
              fill="none"
              stroke={color}
              strokeWidth="2.5"
            />
          </g>
        );

      case 'half_note':
        // 2분음표: 속 빈 타원 머리 + 기둥
        return (
          <g transform="translate(42, 58)">
            {/* 속 빈 타원 머리 */}
            <ellipse
              cx="0"
              cy="0"
              rx="11"
              ry="7.5"
              transform="rotate(-25)"
              fill="none"
              stroke={color}
              strokeWidth="4"
            />
            {/* 기둥 */}
            <line x1="9" y1="-2" x2="9" y2="-42" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );

      case 'dotted_half_note':
        // 점2분음표: 2분음표 + 점
        return (
          <g transform="translate(38, 58)">
            <ellipse
              cx="0"
              cy="0"
              rx="11"
              ry="7.5"
              transform="rotate(-25)"
              fill="none"
              stroke={color}
              strokeWidth="4"
            />
            <line x1="9" y1="-2" x2="9" y2="-42" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            {/* 점 */}
            <circle cx="21" cy="-2" r="3.2" fill={color} />
          </g>
        );

      case 'quarter_note':
        // 4분음표: 까맣게 찬 머리 + 기둥
        return (
          <g transform="translate(45, 60)">
            <ellipse
              cx="0"
              cy="0"
              rx="11"
              ry="8"
              transform="rotate(-25)"
              fill={color}
            />
            <line x1="9" y1="-2" x2="9" y2="-42" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );

      case 'dotted_quarter_note':
        // 점4분음표: 4분음표 + 점
        return (
          <g transform="translate(40, 60)">
            <ellipse
              cx="0"
              cy="0"
              rx="11"
              ry="8"
              transform="rotate(-25)"
              fill={color}
            />
            <line x1="9" y1="-2" x2="9" y2="-42" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="21" cy="-2" r="3.2" fill={color} />
          </g>
        );

      case 'eighth_note':
        // 8분음표: 찬 머리 + 기둥 + 꼬리 1개
        return (
          <g transform="translate(42, 62)">
            <ellipse
              cx="0"
              cy="0"
              rx="11"
              ry="8"
              transform="rotate(-25)"
              fill={color}
            />
            <line x1="9" y1="-2" x2="9" y2="-44" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            {/* 꼬리 1개 */}
            <path
              d="M 9 -44 C 18 -41, 25 -32, 23 -18 C 21 -25, 14 -32, 9 -34"
              fill={color}
            />
          </g>
        );

      case 'sixteenth_note':
        // 16분음표: 찬 머리 + 기둥 + 꼬리 2개
        return (
          <g transform="translate(40, 63)">
            <ellipse
              cx="0"
              cy="0"
              rx="10.5"
              ry="7.5"
              transform="rotate(-25)"
              fill={color}
            />
            <line x1="9" y1="-2" x2="9" y2="-45" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            {/* 꼬리 1 */}
            <path
              d="M 9 -45 C 18 -42, 25 -34, 23 -22 C 21 -28, 14 -34, 9 -36"
              fill={color}
            />
            {/* 꼬리 2 */}
            <path
              d="M 9 -35 C 18 -32, 25 -24, 23 -12 C 21 -18, 14 -24, 9 -26"
              fill={color}
            />
          </g>
        );

      // ===== 쉼표 (RESTS) =====
      case 'whole_rest':
        // 온쉼표: 넷째 줄(y=39) 아래에 매달린 직사각형
        return (
          <g>
            {/* 강조 오선 가이드 */}
            <rect x="36" y="39" width="28" height="10" fill={color} rx="1" />
            <text x="50" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontWeight="600">
              넷째줄 아래 매달림!
            </text>
          </g>
        );

      case 'dotted_half_rest':
        // 점2분쉼표: 셋째 줄(y=50) 위에 놓인 직사각형 + 점
        return (
          <g>
            <rect x="34" y="40" width="26" height="10" fill={color} rx="1" />
            <circle cx="68" cy="45" r="3.2" fill={color} />
            <text x="50" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontWeight="600">
              셋째줄 위 + 점
            </text>
          </g>
        );

      case 'half_rest':
        // 2분쉼표: 셋째 줄(y=50) 위에 얹혀진 직사각형 (신사 모자 모양)
        return (
          <g>
            <rect x="36" y="40" width="28" height="10" fill={color} rx="1" />
            <text x="50" y="70" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8.5" fontWeight="600">
              셋째줄 위에 얹힘!
            </text>
          </g>
        );

      case 'dotted_quarter_rest':
        // 점4분쉼표: 4분쉼표 모양 + 점
        return (
          <g transform="translate(42, 22)">
            <path
              d="M 6 0 L 15 12 L 3 24 L 14 36 C 14 43, 6 49, -2 46 C -1 42, 3 39, 4 36 C -1 37, -2 33, 1 29 L 10 22 L 0 11 Z"
              fill={color}
            />
            <circle cx="24" cy="24" r="3.2" fill={color} />
          </g>
        );

      case 'quarter_rest':
        // 4분쉼표: 번개/지그재그 모양의 표준 4분쉼표
        return (
          <g transform="translate(45, 23)">
            <path
              d="M 6 0 L 16 13 L 4 25 L 15 37 C 15 45, 6 51, -2 48 C -1 44, 4 41, 5 37 C -1 38, -2 34, 1 30 L 10 23 L 0 11 Z"
              fill={color}
            />
          </g>
        );

      case 'eighth_rest':
        // 8분쉼표: 숫자 7 닮은 모양 (동그란 머리 + 꼬리 1개 + 대각선 막대)
        return (
          <g transform="translate(50, 32)">
            {/* 둥근 머리 */}
            <circle cx="-5" cy="8" r="4.5" fill={color} />
            {/* 꼬리 및 대각선 */}
            <path
              d="M -3 5 C 4 3, 11 9, 8 18 L -6 44 L -1 44 L 13 16 C 15 10, 6 1, -3 3 Z"
              fill={color}
            />
          </g>
        );

      case 'sixteenth_rest':
        // 16분쉼표: 꼬리 2개 달린 7 모양
        return (
          <g transform="translate(50, 24)">
            {/* 첫 번째 머리와 꼬리 */}
            <circle cx="-5" cy="10" r="4" fill={color} />
            <path
              d="M -3 7 C 4 5, 11 11, 8 18 L 1 30"
              stroke={color}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* 두 번째 머리와 꼬리 */}
            <circle cx="-5" cy="24" r="4" fill={color} />
            <path
              d="M -3 21 C 4 19, 11 25, 8 32 L -6 54 L -1 54 L 14 22 C 16 14, 7 4, -3 6 Z"
              fill={color}
            />
          </g>
        );

      default:
        return (
          <text x="50" y="55" textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">
            🎵
          </text>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${w}px`, height: `${h}px` }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {showStaff && staffLines}
        {renderShape()}
      </svg>
    </div>
  );
};
