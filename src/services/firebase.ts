import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ScoreRecord } from '../types/music';

// Firebase configuration from Vite environment variables (.env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let isConfigured = false;

// Check if valid Firebase configuration is present
if (
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    const auth = getAuth(app);
    signInAnonymously(auth).catch((err) => {
      console.warn('Anonymous auth sign-in notice (optional):', err.message);
    });
    isConfigured = true;
    console.log('Firebase Cloud Firestore successfully initialized!');
  } catch (err) {
    console.warn('Firebase init error, using LocalStorage fallback mode:', err);
    isConfigured = false;
  }
} else {
  console.info('Firebase env variables not detected; running in Local Demo Mode.');
}

export function isFirebaseActive(): boolean {
  return isConfigured && db !== null;
}

const LOCAL_STORAGE_KEY = 'music_game_local_scores_v1';

// Seed default initial demo scores for a lively middle school classroom experience
const DEFAULT_DEMO_SCORES: ScoreRecord[] = [
  {
    id: 'demo_1',
    nickname: '1모둠 음악대장',
    avatar: '🐱',
    score: 1250,
    stage: '종합 모험',
    correctCount: 10,
    totalQuestions: 10,
    maxCombo: 10,
    createdAt: Date.now() - 1000 * 60 * 30,
    isFirebase: false,
  },
  {
    id: 'demo_2',
    nickname: '리듬타는 피아노냥',
    avatar: '🐰',
    score: 1100,
    stage: '3단계 (계산)',
    correctCount: 7,
    totalQuestions: 7,
    maxCombo: 7,
    createdAt: Date.now() - 1000 * 60 * 60,
    isFirebase: false,
  },
  {
    id: 'demo_3',
    nickname: '박자마스터 민우',
    avatar: '🐻',
    score: 950,
    stage: '2단계 (박자)',
    correctCount: 7,
    totalQuestions: 7,
    maxCombo: 5,
    createdAt: Date.now() - 1000 * 60 * 120,
    isFirebase: false,
  },
  {
    id: 'demo_4',
    nickname: '3모둠 금메달',
    avatar: '🦊',
    score: 820,
    stage: '1단계 (이름)',
    correctCount: 6,
    totalQuestions: 7,
    maxCombo: 4,
    createdAt: Date.now() - 1000 * 60 * 180,
    isFirebase: false,
  },
];

function getLocalScores(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_SCORES));
      return DEFAULT_DEMO_SCORES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_SCORES;
  }
}

function saveLocalScore(record: ScoreRecord) {
  try {
    const current = getLocalScores();
    const updated = [record, ...current].sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.error('Failed saving local score', err);
  }
}

const localSubscribers: Array<(scores: ScoreRecord[]) => void> = [];

function notifyLocalSubscribers() {
  const scores = getLocalScores();
  localSubscribers.forEach((cb) => cb(scores));
}

/**
 * Real-time subscription to top leaderboard scores
 */
export function subscribeLeaderboard(callback: (scores: ScoreRecord[]) => void): () => void {
  if (isConfigured && db) {
    try {
      const q = query(
        collection(db, 'scores'),
        orderBy('score', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const scores: ScoreRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            scores.push({
              id: docSnap.id,
              nickname: data.nickname || '익명 학생',
              avatar: data.avatar || '🎵',
              score: Number(data.score) || 0,
              stage: data.stage || '종합 모험',
              correctCount: Number(data.correctCount) || 0,
              totalQuestions: Number(data.totalQuestions) || 0,
              maxCombo: Number(data.maxCombo) || 0,
              createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
              isFirebase: true,
            });
          });
          callback(scores);
        },
        (error) => {
          console.warn('Firestore onSnapshot error, falling back to local scores:', error.message);
          callback(getLocalScores());
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn('Failed setting up Firestore listener, using local:', e);
    }
  }

  // Fallback to localStorage real-time listener
  localSubscribers.push(callback);
  callback(getLocalScores());

  return () => {
    const idx = localSubscribers.indexOf(callback);
    if (idx !== -1) localSubscribers.splice(idx, 1);
  };
}

/**
 * Submit game score
 */
export async function submitScore(record: Omit<ScoreRecord, 'id' | 'createdAt'>): Promise<ScoreRecord> {
  const newRecord: ScoreRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: Date.now(),
    isFirebase: false,
  };

  // Always save locally for instant offline resiliency
  saveLocalScore(newRecord);
  notifyLocalSubscribers();

  // If Firebase Firestore is configured, save to Firestore
  if (isConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'scores'), {
        nickname: record.nickname.slice(0, 20),
        avatar: record.avatar,
        score: record.score,
        stage: record.stage,
        correctCount: record.correctCount,
        totalQuestions: record.totalQuestions,
        maxCombo: record.maxCombo,
        createdAt: serverTimestamp(),
      });
      newRecord.id = docRef.id;
      newRecord.isFirebase = true;
    } catch (err) {
      console.error('Failed writing score to Firestore:', err);
    }
  }

  return newRecord;
}

/**
 * Fetch all records for Teacher Admin panel
 */
export async function fetchAllScores(): Promise<ScoreRecord[]> {
  if (isConfigured && db) {
    try {
      const q = query(collection(db, 'scores'), orderBy('createdAt', 'desc'), limit(150));
      const snap = await getDocs(q);
      const list: ScoreRecord[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          nickname: data.nickname || '익명 학생',
          avatar: data.avatar || '🎵',
          score: Number(data.score) || 0,
          stage: data.stage || '종합 모험',
          correctCount: Number(data.correctCount) || 0,
          totalQuestions: Number(data.totalQuestions) || 0,
          maxCombo: Number(data.maxCombo) || 0,
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
          isFirebase: true,
        });
      });
      return list;
    } catch (e) {
      console.warn('Error fetching all scores from Firestore:', e);
    }
  }

  return getLocalScores();
}

/**
 * Clear/Reset all score records (Teacher Admin Mode)
 */
export async function clearAllScores(): Promise<{ count: number }> {
  let count = 0;

  // Clear local storage
  const localList = getLocalScores();
  count += localList.length;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  notifyLocalSubscribers();

  // Clear Firestore if active
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'scores'));
      const deletePromises = snap.docs.map((docSnap) => deleteDoc(doc(db!, 'scores', docSnap.id)));
      await Promise.all(deletePromises);
      count = Math.max(count, snap.size);
    } catch (e) {
      console.error('Error clearing Firestore scores:', e);
    }
  }

  return { count };
}

/**
 * Seed sample classroom scores (Teacher helper)
 */
export function seedSampleScores() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_SCORES));
  notifyLocalSubscribers();
}
