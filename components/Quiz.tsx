import React, { useState } from 'react';
import { UserAnswers, TagPreference, InterviewScore } from '../types';
import { TAG_DESCRIPTIONS } from '../constants';

interface QuizProps {
  onComplete: (answers: UserAnswers) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState<UserAnswers>({
    gender: 'male',
    profile: 97,
    eligibleForYomSayarot: true,
    dapr: 50,
    interviewScore: 'high',
    trainingRoutine: 1,
    runTime: 1,
    pullUpsOrPushUps: 1,
    mentalApproach: 'neutral',
    tags: {
      a: 'neutral', x: 'neutral', g: 'neutral', t: 'neutral',
      h: 'neutral', s: 'neutral', l: 'neutral', c: 'neutral', f: 'neutral',
      d: 'neutral', sea: 'neutral', air: 'neutral', field_op: 'neutral',
      elite_aspiration: 'neutral', cool_headed: 'neutral',
      arab_pop: 'neutral', explosives: 'neutral', rescue: 'neutral',
      tech_innovation: 'neutral', animals: 'neutral', protection: 'neutral',
      infantry_affinity: 'neutral', remote_vs_close: 'neutral',
      top_fitness: 'neutral', physical_tests: 'neutral', defense_vs_attack: 'neutral'
    }
  });

// --- חישוב בזמן אמת של מסלולים ---
  const getCurrentTrackInfo = () => {
    let userFitness = 4; // LOW
    const { trainingRoutine, runTime, pullUpsOrPushUps, mentalApproach, profile, dapr, gender, eligibleForYomSayarot } = answers;

    if (
      trainingRoutine === 4 &&
      mentalApproach === 'poison' &&
      ((runTime === 4 && pullUpsOrPushUps >= 3) || (pullUpsOrPushUps === 4 && runTime >= 3))
    ) {
      userFitness = 1; // VERY_HIGH
    } else if (
      trainingRoutine >= 2 &&
      (mentalApproach === 'poison' || mentalApproach === 'neutral') &&
      runTime >= 3 && pullUpsOrPushUps >= 3
    ) {
      userFitness = 2; // HIGH
    } else if (
      runTime >= 2 && pullUpsOrPushUps >= 2
    ) {
      userFitness = 3; // MEDIUM
    } else {
      userFitness = 4; // LOW
    }

    const isTrack1 = profile >= 72 && dapr >= 70 && mentalApproach === 'tech';
    
    const isTrack2 = gender === 'male' && (
      (userFitness <= 2 && profile >= 82 && trainingRoutine === 4) ||
      (eligibleForYomSayarot && runTime === 4 && pullUpsOrPushUps === 4)
    );

    const isTrack3 = gender === 'female' && (
      (userFitness <= 2 && profile >= 82 && trainingRoutine === 4) ||
      (userFitness === 1 && eligibleForYomSayarot)
    );

    const isTrack4 = gender === 'male' && profile >= 82 && dapr >= 70 && !isTrack1 && !isTrack2;
    const isTrack5 = gender === 'male' && profile >= 82 && dapr < 70 && !isTrack1 && !isTrack2;
    const isTrack6 = gender === 'male' && profile === 72 && !isTrack1;
    
    // מסלול 7: לוחמת (אישה שלא נכנסה למסלול 3)
    const isTrack7 = gender === 'female' && !isTrack3;

    return { isTrack1, isTrack2, isTrack3, isTrack4, isTrack5, isTrack6, isTrack7 };
  };

  const { isTrack1, isTrack2, isTrack3, isTrack4, isTrack5, isTrack6, isTrack7 } = getCurrentTrackInfo();
  
  // הגדרה דינמית: כמעט כל המסלולים מקבלים 6 מסכים
  const totalSteps = (isTrack2 || isTrack3 || isTrack4 || isTrack5 || isTrack6 || isTrack7) ? 6 : 5;
  
  const nextStep = () => {
    setStep(s => Math.min(s + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = () => {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateTag = (key: string, value: TagPreference) => {
    setAnswers(prev => ({
      ...prev,
      tags: { ...prev.tags, [key]: value }
    }));
  };

  const getPreferenceOptions = () => [
    { label: 'בכלל לא', val: 'very_no', color: 'rose-800', activeBg: 'bg-rose-800' },
    { label: 'לא', val: 'no', color: 'rose-600', activeBg: 'bg-rose-600' },
    { label: 'ניטרלי', val: 'neutral', color: 'stone-500 dark:slate-600', activeBg: 'bg-stone-400 dark:bg-slate-700' },
    { label: 'כן', val: 'yes', color: 'emerald-600', activeBg: 'bg-emerald-600' },
    { label: 'כן מאוד', val: 'very_yes', color: 'emerald-500', activeBg: 'bg-emerald-500' },
  ];

  const renderStep = () => {
    const isFemale = answers.gender === 'female';

    switch (step) {
      case 0:
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h3 className="text-3xl font-black text-stone-900 dark:text-white mb-4">בחר מגדר</h3>
              <p className="text-stone-600 dark:text-slate-500">הנתונים יותאמו לפי מסלולי הגיוס הרלוונטיים</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {[
                { label: 'גבר', val: 'male' },
                { label: 'אישה', val: 'female' },
              ].map(v => (
                <button
                  key={v.val}
                  onClick={() => {
                    setAnswers({ ...answers, gender: v.val as 'male' | 'female' });
                    setTimeout(() => nextStep(), 200);
                  }}
                  className={`py-10 rounded-2xl border-2 transition-all font-black text-xl ${answers.gender === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-900/30' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-400 hover:border-stone-400 dark:hover:border-slate-700'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 border-r-4 border-emerald-600 dark:border-emerald-500 pr-4">נתונים אישיים</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">1. פרופיל רפואי</label>
                <div className="grid grid-cols-3 gap-4">
                  {[97, 82, 72].map(v => (
                    <button
                      key={v}
                      onClick={() => setAnswers({ 
                        ...answers, 
                        profile: v,
                        eligibleForYomSayarot: v === 97 ? true : (v === 72 ? false : answers.eligibleForYomSayarot)
                      })}
                      className={`py-5 rounded-xl border-2 transition-all font-black text-xl ${answers.profile === v ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {answers.profile !== 72 && (
                  <div className="mt-4 flex items-center gap-3 bg-stone-100 dark:bg-slate-900/50 p-4 rounded-xl border border-stone-300 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id="yomSayarot"
                      checked={answers.eligibleForYomSayarot}
                      onChange={(e) => setAnswers({ ...answers, eligibleForYomSayarot: e.target.checked })}
                      className="w-6 h-6 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <label htmlFor="yomSayarot" className="text-lg font-bold text-stone-800 dark:text-slate-300 cursor-pointer select-none">
                      זכאי ליום סיירות
                    </label>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-lg font-bold mb-6 text-stone-800 dark:text-slate-300">2. ציון דפ"ר: <span className="text-emerald-600 dark:text-emerald-400 font-black ml-1">{answers.dapr}</span></label>
                <div className="px-6 py-8 bg-stone-100 dark:bg-slate-900/50 rounded-2xl border border-stone-300 dark:border-slate-800">
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="10"
                    value={answers.dapr}
                    onChange={(e) => setAnswers({ ...answers, dapr: parseInt(e.target.value) })}
                    className="w-full h-3 bg-stone-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
                  />
                  <div className="flex justify-between mt-4">
                    {[30, 40, 50, 60, 70, 80, 90].map(val => (
                      <span key={val} className={`text-xs font-bold ${answers.dapr === val ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500 dark:text-slate-600'}`}>{val}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">3. התרשמות מראיון אישי</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'התאמה גבוהה למערך הלחימה', val: 'high' },
                    { label: 'התאמה למערך הלחימה', val: 'medium' },
                    { label: 'התאמה חלקית למערך הלחימה', val: 'low' },
                  ].map((v) => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, interviewScore: v.val as InterviewScore })}
                      className={`p-4 rounded-xl border-2 text-right transition-all font-bold ${answers.interviewScore === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );
      case 2:
        const trainingOptions = !isFemale ? [
          { label: 'מתאמן בקבוצת כושר קרבי', val: 4 },
          { label: 'מתאמן באופן קבוע ועקבי', val: 3 },
          { label: 'מתאמן מדי פעם', val: 2 },
          { label: 'כמעט ולא מתאמן', val: 1 },
        ] : [
          { label: 'מתאמנת בקבוצת כושר קרבי', val: 4 },
          { label: 'מתאמנת באופן קבוע ועקבי', val: 3 },
          { label: 'מתאמנת מדי פעם', val: 2 },
          { label: 'כמעט ולא מתאמנת', val: 1 },
        ];

        const runOptions = !isFemale ? [
          { label: 'יורד מ-13 דקות', val: 4 },
          { label: 'יורד מ-14.5 דקות', val: 3 },
          { label: 'יורד מ-16 דקות', val: 2 },
          { label: 'מעל 16 דקות', val: 1 },
        ] : [
          { label: 'יורדת מ-14 דקות', val: 4 },
          { label: 'יורדת מ-15.5 דקות', val: 3 },
          { label: 'יורדת מ-17 דקות', val: 2 },
          { label: 'מעל 17 דקות', val: 1 },
        ];

        const strengthOptions = !isFemale ? [
          { label: 'יותר מ-70', val: 4 },
          { label: 'יותר מ-55', val: 3 },
          { label: 'יותר מ-40', val: 2 },
          { label: 'פחות מ-40', val: 1 },
        ] : [
          { label: 'יותר מ-55', val: 4 },
          { label: 'יותר מ-40', val: 3 },
          { label: 'יותר מ-25', val: 2 },
          { label: 'פחות מ-25', val: 1 },
        ];

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 border-r-4 border-emerald-600 dark:border-emerald-500 pr-4">כושר וגישה</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">4. איך נראית שגרת האימונים שלך?</label>
                <div className="grid grid-cols-2 gap-3">
                  {trainingOptions.map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, trainingRoutine: v.val })}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${answers.trainingRoutine === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">5. זמן ריצת 3,000 מטר</label>
                <div className="grid grid-cols-2 gap-3">
                  {runOptions.map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, runTime: v.val })}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${answers.runTime === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">6. שכיבות סמיכה</label>
                <div className="grid grid-cols-2 gap-3">
                  {strengthOptions.map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, pullUpsOrPushUps: v.val })}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${answers.pullUpsOrPushUps === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-4 text-stone-800 dark:text-slate-300">7. גישה</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: `${isFemale ? 'שואפת' : 'שואף'} הכי גבוה שאפשר`, val: 'poison' },
                    { label: 'מה שצריך אני אעשה', val: 'neutral' },
                    { label: `${isFemale ? 'מעדיפה' : 'מעדיף'} אתגר של חשיבה וטכנולוגיה`, val: 'tech' },
                  ].map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, mentalApproach: v.val as any })}
                      className={`p-4 rounded-xl border-2 text-right transition-all font-bold ${answers.mentalApproach === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
      case 4:
      case 5:
        let currentBatch: {key: string, q: string, yesNoOnly?: boolean}[] = [];

        // שאלות למסלול 1: המוח שבשטח
        if (isTrack1) {
          if (step === 3) {
            currentBatch = [
              { key: 'a', q: 'האם אתה מחפש תפקיד המשלב בתוכו בעיקר שטח, ניווטים, וכושר קרבי?' },
              { key: 'c', q: 'מעוניין בתפקידים או מסלולים שדורשים פיקוד והדרכה?' },
              { key: 'g', q: 'מעדיף עבודה בצוות קטן על פני גדודים גדולים?' },
              { key: 'h', q: '6.	האם אתה מסוגל להסתדר עם מגוון רב של אנשים?' },
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'l', q: 'מוכן להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' },
              { key: 'sea', q: 'האם אתה מתחבר לעבודה בסביבה ימית?' },
              { key: 'air', q: 'תפקידים בחיל האוויר מעניינים אותך?' },
              { key: 'field_op', q: 'האם תעדיף תפקיד שמשלב הפעלת מערכות טכנולוגיות מורכבות תוך כדי פעילות מבצעית בשטח?' },
            ];
          }
        } 
        // שאלות למסלולים 2 ו-3: סיירות וכושר קרבי
        else if (isTrack2 || isTrack3) {
          if (step === 3) {
            currentBatch = [
              { key: 'elite_aspiration', q: 'האם אתה שואף לשרת בהכרח ביחידות המובחרות ביותר של צה"ל?' },
              { key: 'top_fitness', q: `לדעתך, הכושר הקרבי שלך הוא מהטובים ביותר בארץ ביחס ל${isFemale ? 'נשים' : 'גברים'}?` },
              { key: 's', q: 'האם אתה מחפש תפקיד שדורש חשיבה ותחכום?' },
              { key: 't', q: 'האם אתה מחפש שילוב של טכנולוגיה מתקדמת בתפקיד שלך?' },
              { key: 'cool_headed', q: 'האם אתה אדם שמתאפיין בקור רוח ומתפקד טוב במצבי לחץ?' }
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'c', q: 'מעוניין בתפקידים או מסלולים שדורשים פיקוד והדרכה?' },
              { key: 'h', q: 'מחפש שירות עם אווירה, בלאגן, שמח וסיגריות?' },
              { key: 'l', q: 'מוכן להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'g', q: 'מעדיף עבודה בצוות קטן מגובש ואקסקלוסיבי?' },
              { key: 'd', q: 'האם אתה מעדיף לשרת בתפקיד מסוכן בעומק שטח האויב?' },
              { key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' }
            ];
          } else if (step === 5) {
            currentBatch = [
              { key: 'sea', q: 'האם אתה מתחבר לעבודה בסביבה ימית?' },
              { key: 'air', q: 'תפקידים בחיל האוויר מעניינים אותך?' },
              { key: 'arab_pop', q: 'מחפש תפקיד שנמצא בלב אוכלוסייה ערבית עוינת?' },
              { key: 'explosives', q: 'האם אתה מתעניין בעולם החבלה, סילוק פצצות, פירוק מטענים ולוחמה תת-קרקעית?' },
              { key: 'rescue', q: 'מעדיף תפקיד של חילוץ והצלת חיים וטיפול רפואי תחת אש, על פני נטרול האויב?' },
              { key: 'animals', q: 'האם היית רוצה לשרת בשיתוף פעולה עם בעל חיים?' },
              { key: 'protection', q: 'לדעתך יתאים לך תפקיד בעל אופי הגנתי ואבטחתי שדורש דיסקרטיות מוחלטת?' }
            ];
          }
        } 
        // שאלות למסלול 4: הליבה המשכילה
        else if (isTrack4) {
          if (step === 3) {
            currentBatch = [
              { key: 'physical_tests', q: 'האם בכוונתך לגשת לגיבושים ומבדקים פיזיים?', yesNoOnly: true },
              { key: 'a', q: 'האם אתה מחפש תפקיד המשלב בתוכו בעיקר שטח, ניווטים, וכושר קרבי?' },
              { key: 's', q: 'האם אתה מחפש תפקיד שדורש חשיבה ותחכום?' },
              { key: 't', q: 'האם אתה מחפש שילוב של טכנולוגיה מתקדמת בתפקיד שלך?' },
              { key: 'c', q: 'מעוניין בתפקידים או מסלולים שדורשים פיקוד והדרכה?' }
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'h', q: 'האם אתה מסוגל להסתדר עם מגוון רב של אנשים?' },
              { key: 'l', q: 'מוכן להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'g', q: 'מעדיף עבודה בצוות קטן על פני גדודים גדולים?' },
              { key: 'd', q: 'האם אתה מעדיף לשרת בתפקיד מסוכן בעומק שטח האויב?' }
            ];
          } else if (step === 5) {
            currentBatch = [
              { key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' },
              { key: 'sea', q: 'האם אתה מתחבר לעבודה בסביבה ימית?' },
              { key: 'air', q: 'תפקידים בחיל האוויר מעניינים אותך?' },
              { key: 'defense_vs_attack', q: 'לדעתך יתאים לך יותר תפקיד שעיקרו הוא הגנה ושמירה על הביטחון, על פני פתיחה באש והתקפה?' }
            ];
          }
        } 
        // שאלות למסלול 5: הליבה המזרחית
        else if (isTrack5) {
          if (step === 3) {
            currentBatch = [
              { key: 'physical_tests', q: 'האם בכוונתך לגשת לגיבושים ומבדקים פיזיים?', yesNoOnly: true },
              { key: 'a', q: 'האם אתה מחפש תפקיד המשלב בתוכו בעיקר שטח, ניווטים, וכושר קרבי?' },
              { key: 's', q: 'האם אתה מחפש תפקיד שדורש חשיבה ותחכום?' },
              { key: 't', q: 'האם אתה מחפש שילוב של טכנולוגיה מתקדמת בתפקיד שלך?' },
              { key: 'c', q: 'מעוניין בתפקידים או מסלולים שדורשים פיקוד והדרכה?' }
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'h', q: 'האם אתה מסוגל להסתדר עם מגוון רב של אנשים?' },
              { key: 'l', q: 'מוכן להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'g', q: 'מעדיף עבודה בצוות קטן על פני גדודים גדולים?' },
              { key: 'd', q: 'האם אתה מעדיף לשרת בתפקיד מסוכן בעומק שטח האויב?' }
            ];
          } else if (step === 5) {
            currentBatch = [
              { key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' },
              { key: 'sea', q: 'האם אתה מתחבר לעבודה בסביבה ימית?' },
              { key: 'defense_vs_attack', q: 'לדעתך יתאים לך יותר תפקיד שעיקרו הוא הגנה ושמירה על הביטחון, על פני פתיחה באש והתקפה?' }
            ];
          }
        }

        // שאלות למסלול 6: הפרופילניקים
        else if (isTrack6) {
          if (step === 3) {
            currentBatch = [
              { key: 'physical_tests', q: 'האם בכוונתך לגשת לגיבושים ומבדקים פיזיים?', yesNoOnly: true },
              { key: 'a', q: 'האם אתה מחפש תפקיד המשלב בתוכו בעיקר שטח, ניווטים, וכושר קרבי?' },
              { key: 's', q: 'האם אתה מחפש תפקיד שדורש חשיבה ותחכום?' },
              { key: 't', q: 'האם אתה מחפש שילוב של טכנולוגיה מתקדמת בתפקיד שלך?' },
              { key: 'c', q: 'מעוניין בתפקידים או מסלולים שדורשים פיקוד והדרכה?' }
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'h', q: 'האם אתה מסוגל להסתדר עם מגוון רב של אנשים?' },
              { key: 'l', q: 'מוכן להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'g', q: 'מעדיף עבודה בצוות קטן על פני גדודים גדולים?' },
              { key: 'd', q: 'האם אתה מעדיף לשרת בתפקיד מסוכן בעומק שטח האויב?' }
            ];
          } else if (step === 5) {
            currentBatch = [
              { key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' },
              { key: 'sea', q: 'האם אתה מתחבר לעבודה בסביבה ימית?' },
              { key: 'air', q: 'תפקידים בחיל האוויר מעניינים אותך?' },
              { key: 'defense_vs_attack', q: 'לדעתך יתאים לך יותר תפקיד שעיקרו הוא הגנה ושמירה על הביטחון, על פני פתיחה באש והתקפה?' }
            ];
          }
        }

        // שאלות למסלול 7: לוחמת
        else if (isTrack7) {
          if (step === 3) {
            currentBatch = [
              { key: 'physical_tests', q: 'האם בכוונתך לגשת לגיבושים ומבדקים פיזיים?', yesNoOnly: true },
              { key: 'a', q: 'האם את מחפשת תפקיד המשלב בתוכו בעיקר שטח, ניווטים, וכושר קרבי?' },
              { key: 's', q: 'האם את מחפשת תפקיד שדורש חשיבה ותחכום?' },
              { key: 't', q: 'האם את מחפשת שילוב של טכנולוגיה מתקדמת בתפקיד שלך?' },
              { key: 'c', q: 'מעוניינת בתפקידים או מסלולים שדורשים פיקוד והדרכה?' }
            ];
          } else if (step === 4) {
            currentBatch = [
              { key: 'h', q: 'האם את מסוגלת להסתדר עם מגוון רב של אנשים?' },
              { key: 'l', q: 'מוכנה להתחייב לחתום קבע מעבר לשירות החובה עבור תפקיד שיכול להתאים לך?' },
              { key: 'g', q: 'מעדיפה עבודה בצוות קטן על פני גדודים גדולים?' },
              { key: 'd', q: 'האם את מעדיפה לשרת בתפקיד מסוכן בעומק שטח האויב?' }
            ];
          } else if (step === 5) {
            currentBatch = [
              { key: 'sea', q: 'האם את מתחברת לעבודה בסביבה ימית?' },
              { key: 'air', q: 'תפקידים בחיל האוויר מעניינים אותך?' },
              { key: 'defense_vs_attack', q: 'לדעתך יתאים לך יותר תפקיד שעיקרו הוא הגנה ושמירה על הביטחון, על פני פתיחה באש והתקפה?' }
            ];
          }
        }

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 border-r-4 border-emerald-600 dark:border-emerald-500 pr-4">העדפות שירות</h3>
            <div className="space-y-4">
              {currentBatch.map(item => (
                <div key={item.key} className="bg-stone-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-stone-300 dark:border-slate-800 flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="text-stone-800 dark:text-slate-200 font-bold mb-1">{item.q}</div>
                    <div className="text-[10px] text-stone-500 dark:text-slate-500 uppercase font-black tracking-widest">{TAG_DESCRIPTIONS[item.key]}</div>
                  </div>
                  <div className={`grid gap-1 sm:gap-2 ${item.yesNoOnly ? 'grid-cols-2' : 'grid-cols-5'}`}>
                    {getPreferenceOptions().filter(opt => item.yesNoOnly ? (opt.val === 'very_yes' || opt.val === 'very_no') : true).map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => updateTag(item.key, opt.val as TagPreference)}
                        className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 transition-all 
                          ${answers.tags[item.key] === opt.val 
                              ? `${opt.activeBg} border-white/20 text-white shadow-lg` 
                              : `bg-white dark:bg-slate-900/40 border-stone-300 dark:border-slate-800 text-stone-600 dark:text-slate-500 hover:border-stone-400 dark:hover:border-slate-700`}`}
                      >
                        <span className="text-[10px] sm:text-xs font-black text-center leading-tight">
                            {item.yesNoOnly ? (opt.val === 'very_yes' ? 'כן' : 'לא') : opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/40 rounded-3xl shadow-2xl p-6 md:p-12 border border-stone-300 dark:border-slate-800 backdrop-blur-xl">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">שלב {step + 1} / {totalSteps}</span>
          <span className="text-xs font-bold text-stone-600 dark:text-slate-600">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-700 ease-out" 
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }} 
          />
        </div>
      </div>

      <div className="min-h-[440px]">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-16 pt-8 border-t border-stone-300 dark:border-slate-800/50">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`px-8 py-3 font-bold rounded-xl transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-800'}`}
        >
          חזור
        </button>
        {step < totalSteps - 1 ? (
          <button
            onClick={nextStep}
            className={`bg-emerald-600 text-white px-12 py-3 font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-all ${step === 0 ? 'hidden' : ''}`}
          >
            המשך
          </button>
        ) : (
          <button
            onClick={() => onComplete(answers)}
            className="bg-emerald-600 text-white px-12 py-3 font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-all"
          >
            בצע התאמה
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;