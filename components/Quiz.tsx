
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
    dapr: 50,
    interviewScore: 'high',
    runTime: 1,
    pullUpsOrPushUps: 1,
    mentalApproach: 'neutral',
    tags: {
      a: 'neutral', x: 'neutral', g: 'neutral', t: 'neutral',
      o: 'neutral', h: 'neutral', s: 'neutral', l: 'neutral', c: 'neutral', f: 'neutral',
      d: 'neutral'
    }
  });

  const totalSteps = 5; 
  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const updateTag = (key: string, value: TagPreference) => {
    setAnswers(prev => ({
      ...prev,
      tags: { ...prev.tags, [key]: value }
    }));
  };

  const getPreferenceOptions = () => [
    { label: 'בכלל לא', val: 'very_no', color: 'rose-800', activeBg: 'bg-rose-800' },
    { label: 'לא', val: 'no', color: 'rose-600', activeBg: 'bg-rose-600' },
    { label: 'ניטרלי', val: 'neutral', color: 'slate-600', activeBg: 'bg-slate-700' },
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
              <h3 className="text-3xl font-black text-white mb-4">בחר מגדר</h3>
              <p className="text-slate-500">הנתונים יותאמו לפי מסלולי הגיוס הרלוונטיים</p>
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
                  className={`py-10 rounded-2xl border-2 transition-all font-black text-xl ${answers.gender === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-900/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
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
            <h3 className="text-2xl font-bold text-emerald-400 border-r-4 border-emerald-500 pr-4">נתונים אישיים</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-4 text-slate-300">1. פרופיל רפואי</label>
                <div className="grid grid-cols-3 gap-4">
                  {[97, 82, 72].map(v => (
                    <button
                      key={v}
                      onClick={() => setAnswers({ ...answers, profile: v })}
                      className={`py-5 rounded-xl border-2 transition-all font-black text-xl ${answers.profile === v ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-bold mb-6 text-slate-300">2. ציון דפ"ר: <span className="text-emerald-400 font-black ml-1">{answers.dapr}</span></label>
                <div className="px-6 py-8 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <input
                    type="range"
                    min="30"
                    max="90"
                    step="10"
                    value={answers.dapr}
                    onChange={(e) => setAnswers({ ...answers, dapr: parseInt(e.target.value) })}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between mt-4">
                    {[30, 40, 50, 60, 70, 80, 90].map(val => (
                      <span key={val} className={`text-xs font-bold ${answers.dapr === val ? 'text-emerald-400' : 'text-slate-600'}`}>{val}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-4 text-slate-300">3. התרשמות מראיון אישי</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'התאמה גבוהה למערך הלחימה', val: 'high' },
                    { label: 'התאמה למערך הלחימה', val: 'medium' },
                    { label: 'התאמה חלקית למערך הלחימה', val: 'low' },
                  ].map((v) => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, interviewScore: v.val as InterviewScore })}
                      className={`p-4 rounded-xl border-2 text-right transition-all font-bold ${answers.interviewScore === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
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
        const runOptions = !isFemale ? [
          { label: 'מתחת ל-8:00 דקות', val: 4 },
          { label: '8:00 - 8:45', val: 3 },
          { label: '8:45 - 9:30', val: 2 },
          { label: '9:30 ומעלה', val: 1 },
        ] : [
          { label: 'מתחת ל-8:30 דקות', val: 4 },
          { label: '8:30 - 9:15', val: 3 },
          { label: '9:15 - 10:00', val: 2 },
          { label: '10:00 ומעלה', val: 1 },
        ];

        const strengthOptions = !isFemale ? [
          { label: '15+ חזרות מתח', val: 4 },
          { label: '10-14 חזרות', val: 3 },
          { label: '5-9 חזרות', val: 2 },
          { label: '0-4 חזרות', val: 1 },
        ] : [
          { label: '35+ שכיבות סמיכה', val: 4 },
          { label: '25-35 חזרות', val: 3 },
          { label: '15-25 חזרות', val: 2 },
          { label: 'מתחת ל-15', val: 1 },
        ];

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-emerald-400 border-r-4 border-emerald-500 pr-4">כושר וגישה</h3>
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold mb-4 text-slate-300">4. זמן ריצת 2,000 מטר</label>
                <div className="grid grid-cols-2 gap-3">
                  {runOptions.map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, runTime: v.val })}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${answers.runTime === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-4 text-slate-300">5. כוח פלג גוף עליון ({!isFemale ? 'מתח' : 'שכיבות סמיכה'})</label>
                <div className="grid grid-cols-2 gap-3">
                  {strengthOptions.map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, pullUpsOrPushUps: v.val })}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${answers.pullUpsOrPushUps === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-lg font-bold mb-4 text-slate-300">6. גישה מנטלית</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: `"רעל בעיניים" – ${isFemale ? 'מחפשת' : 'מחפש'} את הקושי והשטח`, val: 'poison' },
                    { label: 'ניטרלי – מה שצריך לעשות אעשה על הצד הטוב ביותר', val: 'neutral' },
                    { label: `טכנולוגי – ${isFemale ? 'מעדיפה' : 'מעדיף'} אתגר של חשיבה ותפעול מערכות`, val: 'tech' },
                  ].map(v => (
                    <button
                      key={v.val}
                      onClick={() => setAnswers({ ...answers, mentalApproach: v.val as any })}
                      className={`p-4 rounded-xl border-2 text-right transition-all font-bold ${answers.mentalApproach === v.val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
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
        const currentBatch = step === 3 ? [
            { key: 'a', q: `${isFemale ? 'מחפשת' : 'מחפש'} שירות קרבי עם הרבה שטח, ניווטים, מבצעים ומטווחים?` },
            { key: 'x', q: 'חשוב לך לשרת ביחידה עם סיווג גבוה וחשאיות?' },
            { key: 'g', q: `${isFemale ? 'מעדיפה' : 'מעדיף'} עבודה בצוות קטן מגובש ואקסלוסיבי?` },
            { key: 't', q: 'תפעול מערכות טכנולוגיות תוך כדי לחימה מעניין אותך?' },
            { key: 'd', q: `${isFemale ? 'האם את מעדיפה' : 'האם אתה מעדיף'} לשרת בתפקיד מסוכן בעומק שטח האויב?` },
            { key: 'o', q: `${isFemale ? 'מתחברת' : 'מתחבר'} לעבודה בסביבה ימית?` }
        ] : [
            { key: 'h', q: `${isFemale ? 'מחפשת' : 'מחפש'} שירות עם אווירה, בלאגן, שמח וסיגריות?` },
            { key: 's', q: `${isFemale ? 'מחפשת' : 'מחפש'} תפקיד שדורש למידה עיונית והפעלת ראש (חכם)?` },
            { key: 'l', q: `${isFemale ? 'מוכנה' : 'מוכן'} להתחייב למסלול הכשרה ארוך ושירות קבע?` },
            { key: 'c', q: `${isFemale ? 'מעוניינת' : 'מעוניין'} במסלול פיקוד והדרכה?` },
            ...(!isFemale ? [{ key: 'f', q: 'מעדיף לשרת ביחידה מעורבת של בנים ובנות?' }] : [{ key: 'f', q: 'מעדיפה לשרת ביחידה מעורבת של בנים ובנות?' }])
        ];

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-emerald-400 border-r-4 border-emerald-500 pr-4">העדפות שירות</h3>
            <div className="space-y-4">
              {currentBatch.map(item => (
                <div key={item.key} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="text-slate-200 font-bold mb-1">{item.q}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{TAG_DESCRIPTIONS[item.key]}</div>
                  </div>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {getPreferenceOptions().map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => updateTag(item.key, opt.val as TagPreference)}
                        className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 transition-all 
                          ${answers.tags[item.key] === opt.val 
                              ? `${opt.activeBg} border-white/20 text-white shadow-lg` 
                              : `bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700`}`}
                      >
                        <span className="text-[10px] sm:text-xs font-black text-center leading-tight">
                            {opt.label}
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
    <div className="bg-slate-900/40 rounded-3xl shadow-2xl p-6 md:p-12 border border-slate-800 backdrop-blur-xl">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">שלב {step + 1} / {totalSteps}</span>
          <span className="text-xs font-bold text-slate-600">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }} 
          />
        </div>
      </div>

      <div className="min-h-[440px]">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-16 pt-8 border-t border-slate-800/50">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className={`px-8 py-3 font-bold rounded-xl transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
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
