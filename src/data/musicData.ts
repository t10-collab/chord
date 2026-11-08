import { MusicalItem, QuizQuestion, PitchItem } from '../types/music';

export const MUSICAL_ITEMS: MusicalItem[] = [
  // --- 음표 ---
  {
    id: 'whole_note',
    name: '온음표',
    englishName: 'Whole Note (Semibreve)',
    type: 'note',
    beats: 4,
    beatsDisplay: '4박',
    description: '기둥이 없고 속이 하얗게 빈 둥근 모양의 음표예요. 4박 동안 소리를 길게 유지해요.',
    memoryTip: '도넛처럼 둥글고 속이 뻥 뚫려 있어요! 가장 기본이 되는 온전한(온) 4박자 음표!',
    syllables: '타 - 아 - 아 - 아 (4박)'
  },
  {
    id: 'dotted_half_note',
    name: '점2분음표',
    englishName: 'Dotted Half Note',
    type: 'note',
    beats: 3,
    beatsDisplay: '3박',
    description: '2분음표(2박) 머리 오른쪽에 점이 붙어 원래 길이의 반(1박)이 더해져 총 3박이 돼요.',
    memoryTip: '2박자 + 점(1박) = 3박자! 3/4박자 곡의 한 마디를 꽉 채우기도 해요.',
    syllables: '타 - 아 - 아 (3박)'
  },
  {
    id: 'half_note',
    name: '2분음표',
    englishName: 'Half Note (Minim)',
    type: 'note',
    beats: 2,
    beatsDisplay: '2박',
    description: '온음표를 반으로 나눈 음표예요. 속이 빈 머리에 기둥이 곧게 서 있어요.',
    memoryTip: '속이 빈 흰 머리에 긴 기둥이 달렸어요! 2박 동안 연주해요.',
    syllables: '타 - 아 (2박)'
  },
  {
    id: 'dotted_quarter_note',
    name: '점4분음표',
    englishName: 'Dotted Quarter Note',
    type: 'note',
    beats: 1.5,
    beatsDisplay: '1박 반 (1.5박)',
    description: '4분음표(1박)에 점(0.5박)이 붙어 1박 반이 돼요. 보통 뒤에 8분음표(반 박)와 짝을 이뤄요.',
    memoryTip: '1박 + 반 박 = 1박 반! 통통 튀는 붓점 리듬의 단골 주인공!',
    syllables: '타 - 안 (1.5박)'
  },
  {
    id: 'quarter_note',
    name: '4분음표',
    englishName: 'Quarter Note (Crotchet)',
    type: 'note',
    beats: 1,
    beatsDisplay: '1박',
    description: '머리가 까맣게 칠해져 있고 기둥이 달린 가장 대표적인 1박 음표예요.',
    memoryTip: '검은 머리에 기둥 하나! 심장 박동이나 뚜벅뚜벅 걸음걸이처럼 정확히 1박!',
    syllables: '타 (1박)'
  },
  {
    id: 'eighth_note',
    name: '8분음표',
    englishName: 'Eighth Note (Quaver)',
    type: 'note',
    beats: 0.5,
    beatsDisplay: '반 박 (0.5박)',
    description: '검은 머리와 기둥 끝에 깃발 모양 꼬리가 1개 달려 있어요. 4분음표의 반(반 박)이에요.',
    memoryTip: '꼬리가 1개 달린 달리기 주자! 두 개가 모이면 1박(♪+♪=♩)이 돼요!',
    syllables: '티 (0.5박)'
  },
  {
    id: 'sixteenth_note',
    name: '16분음표',
    englishName: 'Sixteenth Note (Semiquaver)',
    type: 'note',
    beats: 0.25,
    beatsDisplay: '반의 반 박 (0.25박)',
    description: '기둥 끝에 꼬리가 2개 달려 있어요. 8분음표의 반, 4분음표의 1/4 길이예요.',
    memoryTip: '꼬리가 2개 달린 초고속 음표! 4개가 모여야 겨우 1박이 된답니다.',
    syllables: '티리 (0.25박)'
  },

  // --- 쉼표 ---
  {
    id: 'whole_rest',
    name: '온쉼표',
    englishName: 'Whole Rest (Semibreve Rest)',
    type: 'rest',
    beats: 4,
    beatsDisplay: '4박',
    description: '오선보의 넷째 줄 아래에 대롱대롱 매달려 있는 네모난 상자 모양 쉼표예요. 4박 동안 쉬어요.',
    memoryTip: '💡 꿀팁: 물이 가득 담긴 세숫대야처럼 무거워서 선 아래로 축 처져 매달려 있어요!',
    syllables: '쉬 - 이 - 이 - 익 (4박)'
  },
  {
    id: 'dotted_half_rest',
    name: '점2분쉼표',
    englishName: 'Dotted Half Rest',
    type: 'rest',
    beats: 3,
    beatsDisplay: '3박',
    description: '2분쉼표(2박) 옆에 점(1박)이 붙어 총 3박 동안 쉬는 쉼표예요.',
    memoryTip: '모자 옆에 점 하나 콕! 2박 쉬고 1박 더 쉬어서 3박!',
    syllables: '쉬 - 이 - 익 (3박)'
  },
  {
    id: 'half_rest',
    name: '2분쉼표',
    englishName: 'Half Rest (Minim Rest)',
    type: 'rest',
    beats: 2,
    beatsDisplay: '2박',
    description: '오선보의 셋째 줄 위에 반듯하게 올려져 있는 네모난 모자 모양 쉼표예요. 2박 동안 쉬어요.',
    memoryTip: '💡 꿀팁: 신사 모자(중절모)처럼 선 위에 예쁘게 얹혀 있어요! (2박 = 이분모자)',
    syllables: '쉬 - 익 (2박)'
  },
  {
    id: 'dotted_quarter_rest',
    name: '점4분쉼표',
    englishName: 'Dotted Quarter Rest',
    type: 'rest',
    beats: 1.5,
    beatsDisplay: '1박 반 (1.5박)',
    description: '4분쉼표(1박) 옆에 점(0.5박)이 붙어 1박 반 동안 쉬어요.',
    memoryTip: '번개 모양 쉼표 옆에 점이 콕! 1.5박자 동안 조용히 숨을 고릅니다.',
    syllables: '쉬 - 인 (1.5박)'
  },
  {
    id: 'quarter_rest',
    name: '4분쉼표',
    englishName: 'Quarter Rest (Crotchet Rest)',
    type: 'rest',
    beats: 1,
    beatsDisplay: '1박',
    description: '지그재그 번개 모양 또는 숫자 3을 닮은 대표적인 1박 쉼표예요.',
    memoryTip: '지그재그 찌릿찌릿 번개 모양! 딱 1박자 동안 쉿!',
    syllables: '쉿 (1박)'
  },
  {
    id: 'eighth_rest',
    name: '8분쉼표',
    englishName: 'Eighth Rest (Quaver Rest)',
    type: 'rest',
    beats: 0.5,
    beatsDisplay: '반 박 (0.5박)',
    description: '숫자 7처럼 생겼고 머리에 둥근 점 하나와 꼬리가 1개 달려 있어요. 반 박 쉬어요.',
    memoryTip: '행운의 숫자 7 모양에 꼬리 1개! 아주 잠깐 반 박 동안 숨죽여요.',
    syllables: '읍 (0.5박)'
  },
  {
    id: 'sixteenth_rest',
    name: '16분쉼표',
    englishName: 'Sixteenth Rest (Semiquaver Rest)',
    type: 'rest',
    beats: 0.25,
    beatsDisplay: '반의 반 박 (0.25박)',
    description: '숫자 7 모양에 꼬리가 위아래로 2개 달려 있어요. 반의 반 박 동안 쉬어요.',
    memoryTip: '꼬리가 위아래로 2개 달린 쉼표! 찰나의 순간(반의 반 박)만 쉬고 지나가요.',
    syllables: '흡 (0.25박)'
  }
];

export const AVATARS = [
  { id: 'cat', emoji: '🐱', name: '피아노냥' },
  { id: 'bear', emoji: '🐻', name: '드럼곰' },
  { id: 'fox', emoji: '🦊', name: '나팔여우' },
  { id: 'rabbit', emoji: '🐰', name: '바이올린토끼' },
  { id: 'dog', emoji: '🐶', name: '기타댕댕이' },
  { id: 'owl', emoji: '🦉', name: '지휘자부엉이' },
  { id: 'lion', emoji: '🦁', name: '호른사자' },
  { id: 'penguin', emoji: '🐧', name: '플루트펭귄' },
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 1단계 문제 생성: 기호 이름 맞추기 (음표/쉼표)
 */
export function generateStage1Questions(count = 7): QuizQuestion[] {
  const pool = shuffle([...MUSICAL_ITEMS]);
  const selected = pool.slice(0, count);

  return selected.map((target, idx) => {
    // 3 wrong options of same category if possible, or mixed
    const sameTypePool = MUSICAL_ITEMS.filter((item) => item.id !== target.id);
    const wrongOptions = shuffle(sameTypePool).slice(0, 3);
    const allOptions = shuffle([target, ...wrongOptions]);

    const isAskForSymbol = idx % 2 === 1; // 기호를 보고 이름 맞추기 vs 이름을 보고 기호 고르기

    if (isAskForSymbol) {
      return {
        id: `s1_${idx}_${target.id}`,
        stage: 1,
        questionText: `다음 중 '${target.name}'은 어느 것일까요?`,
        questionSubtext: `${target.type === 'note' ? '음표' : '쉼표'}의 알맞은 모양을 골라보세요.`,
        options: allOptions.map((opt) => ({
          id: opt.id,
          text: opt.name,
          symbolItem: opt,
          isCorrect: opt.id === target.id,
        })),
        explanation: `${target.name}은(는) ${target.description} ${target.memoryTip}`,
      };
    } else {
      return {
        id: `s1_${idx}_${target.id}`,
        stage: 1,
        questionText: `아래 제시된 ${target.type === 'note' ? '음표' : '쉼표'}의 올바른 이름은 무엇일까요?`,
        questionSubtext: `모양을 유심히 살펴보고 정확한 이름을 찾아보세요!`,
        symbolItem: target,
        options: allOptions.map((opt) => ({
          id: opt.id,
          text: opt.name,
          subtext: opt.englishName,
          isCorrect: opt.id === target.id,
        })),
        explanation: `정답은 '${target.name}'입니다! ${target.memoryTip}`,
      };
    }
  });
}

/**
 * 2단계 문제 생성: 음표/쉼표 박자(길이) 맞추기
 */
export function generateStage2Questions(count = 7): QuizQuestion[] {
  const pool = shuffle([...MUSICAL_ITEMS]);
  const selected = pool.slice(0, count);

  return selected.map((target, idx) => {
    // Choose distractor beat lengths
    const beatOptionsSet = new Set<string>();
    beatOptionsSet.add(target.beatsDisplay);

    const candidates = ['4박', '3박', '2박', '1박 반', '1박', '반 박 (0.5박)', '반의 반 박 (0.25박)'];
    const shuffledCandidates = shuffle(candidates.filter((c) => c !== target.beatsDisplay));

    shuffledCandidates.slice(0, 3).forEach((c) => beatOptionsSet.add(c));
    const allOptions = shuffle(Array.from(beatOptionsSet));

    return {
      id: `s2_${idx}_${target.id}`,
      stage: 2,
      questionText: `'${target.name}'은 몇 박자 동안 연주하거나 쉴까요?`,
      questionSubtext: `음악에서 이 기호가 가진 길이를 선택하세요.`,
      symbolItem: target,
      options: allOptions.map((beatStr) => ({
        id: beatStr,
        text: beatStr,
        isCorrect: beatStr === target.beatsDisplay,
      })),
      explanation: `'${target.name}'의 길이는 '${target.beatsDisplay}'입니다. (${target.syllables ? `말리듬: ${target.syllables}` : ''})`,
    };
  });
}

/**
 * 3단계 문제 생성: 음표/쉼표 덧셈 & 계산 마스터!
 */
export function generateStage3Questions(count = 7): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Handcrafted diverse interesting music math questions
  const mathPool = [
    {
      items: ['quarter_note', 'quarter_note'], // 1 + 1 = 2
      op: '+',
      targetSum: 2,
      correctText: '2박 (2분음표 길이)',
      wrongAnswers: ['1박', '3박', '4박'],
      desc: '4분음표(1박) + 4분음표(1박) = 2박'
    },
    {
      items: ['half_note', 'quarter_note'], // 2 + 1 = 3
      op: '+',
      targetSum: 3,
      correctText: '3박 (점2분음표 길이)',
      wrongAnswers: ['2박', '4박', '1박 반'],
      desc: '2분음표(2박) + 4분음표(1박) = 3박'
    },
    {
      items: ['eighth_note', 'eighth_note'], // 0.5 + 0.5 = 1
      op: '+',
      targetSum: 1,
      correctText: '1박 (4분음표 길이)',
      wrongAnswers: ['2박', '반 박', '4박'],
      desc: '8분음표(0.5박) + 8분음표(0.5박) = 1박'
    },
    {
      items: ['quarter_note', 'eighth_note'], // 1 + 0.5 = 1.5
      op: '+',
      targetSum: 1.5,
      correctText: '1박 반 (1.5박 / 점4분음표 길이)',
      wrongAnswers: ['1박', '2박', '반 박'],
      desc: '4분음표(1박) + 8분음표(반 박) = 1박 반'
    },
    {
      items: ['whole_note', 'half_note'], // 4 + 2 = 6
      op: '+',
      targetSum: 6,
      correctText: '6박',
      wrongAnswers: ['4박', '5박', '8박'],
      desc: '온음표(4박) + 2분음표(2박) = 6박'
    },
    {
      items: ['half_rest', 'quarter_rest'], // 2 + 1 = 3
      op: '+',
      targetSum: 3,
      correctText: '3박 동안 쉬기',
      wrongAnswers: ['2박', '4박', '1박'],
      desc: '2분쉼표(2박) + 4분쉼표(1박) = 3박'
    },
    {
      items: ['whole_rest', 'half_rest'], // 4 - 2 = 2
      op: '-',
      targetSum: 2,
      correctText: '2박',
      wrongAnswers: ['1박', '3박', '6박'],
      desc: '온쉼표(4박) - 2분쉼표(2박) = 2박'
    },
    {
      items: ['dotted_half_note', 'quarter_note'], // 3 + 1 = 4
      op: '+',
      targetSum: 4,
      correctText: '4박 (온음표 길이)',
      wrongAnswers: ['3박', '5박', '2박'],
      desc: '점2분음표(3박) + 4분음표(1박) = 4박'
    },
    {
      items: ['sixteenth_note', 'sixteenth_note'], // 0.25 + 0.25 = 0.5
      op: '+',
      targetSum: 0.5,
      correctText: '반 박 (0.5박 / 8분음표 길이)',
      wrongAnswers: ['1박', '반의 반 박', '2박'],
      desc: '16분음표(0.25박) + 16분음표(0.25박) = 반 박 (8분음표 1개)'
    },
    {
      items: ['whole_note', 'quarter_note'], // 4 - 1 = 3
      op: '-',
      targetSum: 3,
      correctText: '3박',
      wrongAnswers: ['2박', '4박', '1박 반'],
      desc: '온음표(4박) - 4분음표(1박) = 3박'
    }
  ];

  const shuffledMath = shuffle(mathPool).slice(0, count);

  shuffledMath.forEach((math, idx) => {
    const item1 = MUSICAL_ITEMS.find((m) => m.id === math.items[0])!;
    const item2 = MUSICAL_ITEMS.find((m) => m.id === math.items[1])!;

    const allOptions = shuffle([
      { id: 'correct', text: math.correctText, isCorrect: true },
      ...math.wrongAnswers.map((w, wIdx) => ({
        id: `wrong_${wIdx}`,
        text: w,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `s3_${idx}`,
      stage: 3,
      questionText: `다음 음악 계산식의 결과는 총 몇 박자일까요?`,
      questionSubtext: `${item1.name} ${math.op} ${item2.name}의 길이를 합산/계산해 보세요!`,
      equationItems: [
        { item: item1, operator: undefined },
        { item: item2, operator: math.op as '+' | '-' },
      ],
      options: allOptions,
      explanation: `계산 과정: ${math.desc} = ${math.correctText}!`,
    });
  });

  return questions;
}

export const PITCH_ITEMS: PitchItem[] = [
  {
    id: 'c4',
    solfege: '가온 도',
    simpleSolfege: '도',
    pitchNameKorean: '다',
    pitchNameEnglish: 'C',
    staffPosition: '아래 첫째 줄 (덧줄)',
    frequency: 261.63,
    step: 0,
    memoryTip: '아래 덧줄에 베개처럼 쏙 걸려 있는 가장 기준이 되는 가온 도!',
  },
  {
    id: 'd4',
    solfege: '레',
    simpleSolfege: '레',
    pitchNameKorean: '라',
    pitchNameEnglish: 'D',
    staffPosition: '아래 첫째 칸',
    frequency: 293.66,
    step: 1,
    memoryTip: '첫째 줄 바로 밑에 대롱대롱 매달려 있는 레!',
  },
  {
    id: 'e4',
    solfege: '미',
    simpleSolfege: '미',
    pitchNameKorean: '마',
    pitchNameEnglish: 'E',
    staffPosition: '첫째 줄',
    frequency: 329.63,
    step: 2,
    memoryTip: '오선보의 가장 아래 첫째 줄에 꼬치처럼 꿰어진 미! (줄음: 미-솔-시-레-파)',
  },
  {
    id: 'f4',
    solfege: '파',
    simpleSolfege: '파',
    pitchNameKorean: '바',
    pitchNameEnglish: 'F',
    staffPosition: '첫째 칸',
    frequency: 349.23,
    step: 3,
    memoryTip: '첫째 줄과 둘째 줄 사이 첫째 칸에 쏙 들어간 파! (칸음: 파-라-도-미)',
  },
  {
    id: 'g4',
    solfege: '솔',
    simpleSolfege: '솔',
    pitchNameKorean: '사',
    pitchNameEnglish: 'G',
    staffPosition: '둘째 줄',
    frequency: 392.0,
    step: 4,
    memoryTip: '높은음자리표(G Clef)의 달팽이 중심이 감싸고 도는 둘째 줄 솔!',
  },
  {
    id: 'a4',
    solfege: '라',
    simpleSolfege: '라',
    pitchNameKorean: '가',
    pitchNameEnglish: 'A',
    staffPosition: '둘째 칸',
    frequency: 440.0,
    step: 5,
    memoryTip: '둘째 칸에 들어간 맑은 소리 라! 오케스트라 튜닝의 기준음(440Hz)!',
  },
  {
    id: 'b4',
    solfege: '시',
    simpleSolfege: '시',
    pitchNameKorean: '나',
    pitchNameEnglish: 'B',
    staffPosition: '셋째 줄',
    frequency: 493.88,
    step: 6,
    memoryTip: '오선보 5개 줄 중 딱 가운데 정중앙 셋째 줄에 걸린 시!',
  },
  {
    id: 'c5',
    solfege: '높은 도',
    simpleSolfege: '도',
    pitchNameKorean: '다',
    pitchNameEnglish: 'C',
    staffPosition: '셋째 칸',
    frequency: 523.25,
    step: 7,
    memoryTip: '셋째 줄과 넷째 줄 사이 셋째 칸에 위치한 높은 도!',
  },
  {
    id: 'd5',
    solfege: '높은 레',
    simpleSolfege: '레',
    pitchNameKorean: '라',
    pitchNameEnglish: 'D',
    staffPosition: '넷째 줄',
    frequency: 587.33,
    step: 8,
    memoryTip: '위에서 둘째(넷째 줄)에 걸린 높은 레!',
  },
  {
    id: 'e5',
    solfege: '높은 미',
    simpleSolfege: '미',
    pitchNameKorean: '마',
    pitchNameEnglish: 'E',
    staffPosition: '넷째 칸',
    frequency: 659.25,
    step: 9,
    memoryTip: '넷째 칸에 자리잡은 높은 미!',
  },
  {
    id: 'f5',
    solfege: '높은 파',
    simpleSolfege: '파',
    pitchNameKorean: '바',
    pitchNameEnglish: 'F',
    staffPosition: '다섯째 줄',
    frequency: 698.46,
    step: 10,
    memoryTip: '오선보 맨 꼭대기 다섯째 줄에 걸린 높은 파!',
  },
  {
    id: 'g5',
    solfege: '높은 솔',
    simpleSolfege: '솔',
    pitchNameKorean: '사',
    pitchNameEnglish: 'G',
    staffPosition: '위 첫째 칸',
    frequency: 783.99,
    step: 11,
    memoryTip: '다섯째 줄 지붕 위에 올라앉은 높은 솔!',
  },
];

/**
 * 4단계 문제 생성: 높은음자리표 오선보 계이름 맞추기
 */
export function generateStage4Questions(count = 7): QuizQuestion[] {
  const pool = shuffle([...PITCH_ITEMS]);
  const selected = pool.slice(0, count);

  return selected.map((target, idx) => {
    // Other pitches as distractors
    const otherPitches = shuffle(PITCH_ITEMS.filter((p) => p.id !== target.id));
    const wrongOptions = otherPitches.slice(0, 3);
    const allOptions = shuffle([target, ...wrongOptions]);

    const isQuestionPos = idx % 2 === 1;

    if (isQuestionPos) {
      return {
        id: `s4_${idx}_${target.id}`,
        stage: 4,
        questionText: `오선보의 '${target.staffPosition}'에 위치한 음의 계이름은?`,
        questionSubtext: `높은음자리표 오선보 줄과 칸의 위치를 떠올려 보세요!`,
        pitchItem: target,
        options: allOptions.map((opt) => ({
          id: opt.id,
          text: opt.solfege,
          subtext: `음이름: ${opt.pitchNameKorean} (${opt.pitchNameEnglish})`,
          isCorrect: opt.id === target.id,
          pitchItem: opt,
        })),
        explanation: `정답은 '${target.solfege}'입니다! ${target.memoryTip}`,
      };
    } else {
      return {
        id: `s4_${idx}_${target.id}`,
        stage: 4,
        questionText: `아래 오선보에 그려진 음의 계이름은 무엇일까요?`,
        questionSubtext: `줄에 걸려 있는지, 칸에 들어가 있는지 확인해 보세요!`,
        pitchItem: target,
        options: allOptions.map((opt) => ({
          id: opt.id,
          text: opt.solfege,
          subtext: `음이름: ${opt.pitchNameKorean} (${opt.pitchNameEnglish})`,
          isCorrect: opt.id === target.id,
          pitchItem: opt,
        })),
        explanation: `오선보의 [${target.staffPosition}] 위치는 '${target.solfege}'(음이름: ${target.pitchNameKorean}/${target.pitchNameEnglish})입니다! ${target.memoryTip}`,
      };
    }
  });
}

/**
 * 신나는 종합 모험 모드 (1단계 3문제 + 2단계 3문제 + 3단계 3문제 + 4단계 계이름 3문제 = 총 12문제)
 */
export function generateAdventureQuestions(): QuizQuestion[] {
  const s1 = generateStage1Questions(3);
  const s2 = generateStage2Questions(3);
  const s3 = generateStage3Questions(3);
  const s4 = generateStage4Questions(3);
  return [...s1, ...s2, ...s3, ...s4];
}

