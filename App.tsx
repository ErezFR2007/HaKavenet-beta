
import React, { useState } from 'react';
import { ROLES_DB, TAG_DESCRIPTIONS } from './constants';
import { UserAnswers, MatchResult, FitnessLevel } from './types';
import Quiz from './components/Quiz';
import Results from './components/Results';
import RoleList from './components/RoleList';

const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'quiz' | 'results' | 'all-roles'>('intro');
  const [results, setResults] = useState<MatchResult[]>([]);

  const calculateResults = (answers: UserAnswers) => {
    // 1. קביעת רמת כושר המשתמש
    let fitnessBase = (answers.runTime + answers.pullUpsOrPushUps) / 2;
    
    if (answers.mentalApproach === 'poison') {
      fitnessBase = Math.max(fitnessBase, 2.5);
    }
    
    let userFitness: FitnessLevel = FitnessLevel.LOW;
    if (fitnessBase >= 3.5) userFitness = FitnessLevel.VERY_HIGH; 
    else if (fitnessBase >= 2.5) userFitness = FitnessLevel.HIGH; 
    else if (fitnessBase >= 1.5) userFitness = FitnessLevel.MEDIUM;
    else userFitness = FitnessLevel.LOW;

    // שלב א': חישוב ציונים גולמיים לכל היחידות
    const rawMatches: MatchResult[] = ROLES_DB.map(role => {
      let matchScore = 0;
      let maxPossibleForThisUser = 0;
      let hasDealBreaker = false;
      const reasons: string[] = [];

      let positiveComboCount = 0; 
      let negativeAvoidanceCount = 0; 

      // 2. סינונים קשיחים
      if (answers.gender === 'female' && !role.tags.toLowerCase().includes('f')) return null;
      if (answers.profile < role.minProfile || answers.dapr < role.minDapr) return null; 
      if (answers.tags['l'] === 'very_no' && role.tags.includes('l')) return null;

      // 3. סינון לפי התרשמות מראיון
      if (answers.interviewScore === 'low') {
        const allowedIdsForLowScore = [42, 49, 51, 52, 53, 55, 46, 54];
        if (!allowedIdsForLowScore.includes(role.id)) return null;
      }

      const fUser = userFitness;
      const fRole = role.fitnessRequired;
      let isFitnessMatch = false;
      if (fUser === FitnessLevel.VERY_HIGH) isFitnessMatch = true;
      else if (fUser === FitnessLevel.HIGH) isFitnessMatch = (fRole >= 2);
      else if (fUser === FitnessLevel.MEDIUM) isFitnessMatch = (fRole >= 3);
      else if (fUser === FitnessLevel.LOW) isFitnessMatch = (fRole === 4);

      if (!isFitnessMatch) return null;

      Object.entries(answers.tags).forEach(([tagKey, userPref]) => {
        const hasTag = role.tags.includes(tagKey);
        const hasPowerTag = role.tags.includes(tagKey.toUpperCase());
        const roleHasFeature = hasTag || hasPowerTag;

        let weight = 12;
        if (['a', 'g', 'o', 't', 'd', 'h'].includes(tagKey)) weight = 24;
        maxPossibleForThisUser += weight;

        if (userPref === 'very_yes') {
          if (roleHasFeature) {
            const treatAsPower = hasPowerTag || (tagKey === 'd');
            matchScore += weight * (treatAsPower ? 1.4 : 1.0);
            if (tagKey === 'h' && hasPowerTag) matchScore += 15;
            reasons.push(TAG_DESCRIPTIONS[tagKey]);
            positiveComboCount++;
          } else matchScore -= weight * 0.3; 
        } 
        else if (userPref === 'yes') {
          if (roleHasFeature) {
            matchScore += weight * 0.85;
            reasons.push(TAG_DESCRIPTIONS[tagKey]);
            positiveComboCount++;
          }
        }
        else if (userPref === 'no') {
          if (roleHasFeature) matchScore -= weight * 2.0; 
          else {
            matchScore += weight * 0.4;
            negativeAvoidanceCount++;
          }
        }
        else if (userPref === 'very_no') {
          if (roleHasFeature) {
            matchScore -= weight * 4.5; 
            hasDealBreaker = true; 
          } else {
            matchScore += weight * 0.8;
            negativeAvoidanceCount++;
          }
        }
        else {
          if (roleHasFeature) matchScore += weight * 0.2;
          else matchScore += weight * 0.1;
        }
      });

      if (positiveComboCount >= 2) {
        matchScore += Math.pow(positiveComboCount, 1.5) * 3;
      }

      if (negativeAvoidanceCount >= 2) {
        matchScore += Math.pow(negativeAvoidanceCount, 1.5) * 2.5;
      }

      const approachWeight = 40;
      maxPossibleForThisUser += approachWeight;
      if (answers.mentalApproach === 'poison' && role.fitnessRequired <= 2) matchScore += approachWeight;
      else if (answers.mentalApproach === 'tech' && (role.tags.includes('t') || role.tags.includes('T'))) matchScore += approachWeight;
      else matchScore += approachWeight * 0.4;

      let rawRatio = matchScore / maxPossibleForThisUser;
      let finalPercentage = 30 + (rawRatio * 67);

      if (role.rank <= 10 && finalPercentage > 60) {
        finalPercentage += (11 - role.rank) * 1.2;
      }

      if (hasDealBreaker) finalPercentage *= 0.6; 
      
      if (answers.interviewScore === 'medium') {
        if (role.rank <= 33) {
           finalPercentage -= (8 - ((role.rank - 1) * (7 / 32)));
        }
      } else if (answers.interviewScore === 'low') {
        if ([42, 46, 54].includes(role.id)) finalPercentage -= 10;
      }

      finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

      return {
        ...role,
        matchPercentage: finalPercentage,
        reasons: Array.from(new Set(reasons)).slice(0, 3)
      };
    })
    .filter((m): m is MatchResult => m !== null && m.matchPercentage >= 20);

    const matchesByScore = new Map<number, MatchResult[]>();
    rawMatches.forEach(m => {
      if (!matchesByScore.has(m.matchPercentage)) matchesByScore.set(m.matchPercentage, []);
      matchesByScore.get(m.matchPercentage)!.push(m);
    });

    const finalMatches: MatchResult[] = [];
    const scores = Array.from(matchesByScore.keys()).sort((a, b) => b - a);
    
    scores.forEach(score => {
      const group = matchesByScore.get(score)!;
      group.sort((a, b) => a.rank - b.rank);
      group.forEach((match, index) => {
        match.matchPercentage = Math.max(0, match.matchPercentage - index);
        finalMatches.push(match);
      });
    });

    finalMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setResults(finalMatches);
    setView('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 overflow-x-hidden">
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1.5 cursor-pointer" onClick={() => setView('intro')}>
              הכוונת
              <svg className="text-emerald-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="22" y2="18"/>
              </svg>
            </h1>
          </div>
          <nav className="flex gap-4">
            <button onClick={() => setView('intro')} className="text-sm font-medium hover:text-emerald-400 transition-colors">בית</button>
            <button onClick={() => setView('all-roles')} className="text-sm font-medium hover:text-emerald-400 transition-colors">כל התפקידים</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {view === 'intro' && (
          <div className="text-center py-20">
            <div className="bg-emerald-500/10 text-emerald-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="22" y2="18"/>
                </svg>
            </div>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">הדרך ליחידה מתחילה כאן.</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
              מערכת התאמה חכמה המנתחת את הפרופיל האישי שלך ומשלבת נתונים פיזיים עם שאיפות מקצועיות למציאת המסלול המדויק ביותר במערך הלוחמה.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={() => setView('quiz')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all transform hover:-translate-y-1 active:scale-95">התחל אבחון התאמה</button>
                <button onClick={() => setView('all-roles')} className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold py-5 px-12 rounded-2xl transition-all">סקירת כלל היחידות</button>
            </div>
            <div className="mt-24 flex justify-center">
                <span className="text-[10px] font-mono text-slate-600 font-bold tracking-widest uppercase opacity-70">גרסת בטא 1.0.0</span>
            </div>
          </div>
        )}

        {view === 'quiz' && <Quiz onComplete={calculateResults} />}
        {view === 'results' && <Results results={results} onRestart={() => setView('quiz')} />}
        {view === 'all-roles' && <RoleList roles={ROLES_DB} />}
      </main>
    </div>
  );
};

export default App;
