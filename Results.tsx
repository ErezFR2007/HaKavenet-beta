
import React, { useEffect, useState } from 'react';
import { MatchResult } from '../types';
import { TAG_DESCRIPTIONS } from '../constants';

interface ResultsProps {
  results: MatchResult[];
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, onRestart }) => {
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter results that have a decent match percentage
  const qualifiedResults = results.filter(r => r.matchPercentage >= 30);
  const topMatches = qualifiedResults.slice(0, visibleCount);
  const hasMore = qualifiedResults.length > visibleCount;

  const getRoleVisuals = (role: MatchResult) => {
    // Elite logic: Specifically requested units
    const eliteKeywords = ['טיס', 'מטכ"ל', 'שייטת 13', 'שלד"ג'];
    const isElite = eliteKeywords.some(k => role.name.includes(k));

    // Special units keywords logic
    const specialKeywords = [
      'חובלים', 'צוללות', '504', 'קודקוד', 'ימ"ס', 'רפאים', 'יהל"ם', 'זיק', 
      'עוקץ', '5515', 'לוט"ר', 'מיתר', 'מורן', 'מלא"ר', 'רוכ"ש', 'רוכב שמיים', 
      'ילת"ם', 'ל"א', 'מודא"ל', 'מנחית סער', '444', '669'
    ];
    const isSpecial = specialKeywords.some(k => role.name.includes(k)) && !isElite;
    
    // Commando logic
    const isCommando = (role.note?.includes('קומנדו') || ['מגלן', 'דובדבן', 'אגוז'].includes(role.name)) && !isElite && !isSpecial;
    
    // Exclusive logic
    const isInfantry = (role.note?.includes('חי"ר') || (role.name.includes('סיירת') && role.type.includes('יבשה'))) && !isCommando && !isElite && !isSpecial;
    
    let bgColor = 'bg-slate-900/60';
    let borderColor = 'border-slate-800';
    let glowColor = 'bg-emerald-500/5';
    let accentColor = 'text-emerald-500';
    let barGradient = 'from-emerald-400 to-emerald-600';

    if (isElite) {
      bgColor = 'bg-slate-900/90';
      borderColor = 'border-yellow-500/60';
      glowColor = 'bg-yellow-500/20';
      accentColor = 'text-yellow-400';
      barGradient = 'from-yellow-300 via-amber-500 to-yellow-600';
    } else if (isCommando) {
      bgColor = 'bg-slate-900/70';
      borderColor = 'border-rose-500/40';
      glowColor = 'bg-rose-500/10';
      accentColor = 'text-rose-500';
      barGradient = 'from-rose-400 to-rose-700';
    } else if (isSpecial) {
      borderColor = 'border-purple-500/40';
      glowColor = 'bg-purple-500/10';
      accentColor = 'text-purple-400';
      barGradient = 'from-purple-400 to-purple-600';
    } else {
      if (role.type.includes('חיל האוויר')) {
        borderColor = 'border-sky-500/30';
        glowColor = 'bg-sky-500/5';
        accentColor = 'text-sky-400';
      } else if (role.type.includes('חיל הים')) {
        borderColor = 'border-cyan-500/30';
        glowColor = 'bg-cyan-500/5';
        accentColor = 'text-cyan-400';
      }
    }

    return { bgColor, borderColor, glowColor, accentColor, barGradient, isElite, isCommando, isInfantry, isSpecial };
  };

  const getPrestigeBarGradient = (rank: number) => {
    if (rank <= 4) return 'from-yellow-300 via-amber-400 to-yellow-600';
    if (rank <= 24) return 'from-orange-200 via-slate-200 to-amber-300';
    if (rank <= 36) return 'from-slate-200 via-slate-300 to-slate-400';
    return 'from-slate-600 to-slate-800';
  };

  const getTagStyle = (tagKey: string, visuals: any, originalTags: string) => {
    const isPowerTag = originalTags.includes(tagKey.toUpperCase()) && tagKey.toUpperCase() !== tagKey.toLowerCase();
    
    if (tagKey === 'n') {
      return 'bg-white/10 border-white/30 text-white font-black';
    }

    if (isPowerTag) {
        if (visuals.isElite) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-100 font-bold';
        if (visuals.isCommando) return 'bg-rose-500/10 border-rose-500/30 text-rose-100 font-bold';
        if (visuals.isSpecial) return 'bg-purple-500/10 border-purple-500/30 text-purple-100 font-bold';
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 font-bold';
    }
    
    return visuals.isElite 
      ? 'bg-white/5 border-white/5 text-yellow-500/50' 
      : visuals.isCommando 
        ? 'bg-white/5 border-white/5 text-rose-400/50' 
        : visuals.isSpecial
          ? 'bg-white/5 border-white/5 text-purple-400/50'
          : 'bg-white/5 border-white/5 text-slate-500';
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black text-white tracking-tighter">דירוג ההתאמה שלך</h2>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
          מצאנו <span className="text-emerald-400 font-black">{qualifiedResults.length}</span> תפקידים רלוונטיים עבורך. להלן היחידות המובילות:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {topMatches.map((role) => {
          const visuals = getRoleVisuals(role);
          const barWidth = Math.max(5, 100 - (role.rank * 1.5));
          // Use explicit type to avoid 'unknown' type inference from Set/Array.from
          const uniqueTagKeys: string[] = Array.from(new Set(role.tags.toLowerCase().split('')));
          
          return (
            <div 
              key={role.id} 
              className={`group ${visuals.bgColor} rounded-[2rem] p-7 border-2 ${visuals.borderColor} hover:scale-[1.02] transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden flex ring-1 ring-white/5">
                  <div 
                    className={`h-full bg-gradient-to-r ${getPrestigeBarGradient(role.rank)} transition-all duration-[2500ms] ease-out delay-500`}
                    style={{ width: mounted ? `${barWidth}%` : '0%' }}
                  />
                </div>
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  דרג {role.rank}
                </div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${visuals.borderColor} bg-black/30 text-slate-400`}>
                          {role.type}
                      </span>
                      {visuals.isElite && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-yellow-500/50 bg-yellow-500/20 text-yellow-400">עילית</span>}
                      {visuals.isSpecial && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-purple-500/50 bg-purple-500/20 text-purple-400">מיוחדת</span>}
                      {visuals.isCommando && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-400">קומנדו</span>}
                      {visuals.isInfantry && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">חי"ר</span>}
                  </div>
                  <h4 className={`text-2xl font-black leading-tight ${visuals.isElite ? 'text-yellow-50 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]' : visuals.isCommando ? 'text-rose-50' : visuals.isSpecial ? 'text-purple-50' : 'text-white'}`}>
                    {role.name}
                  </h4>
                  {role.note && <p className="text-[11px] text-slate-500 mt-1 font-bold italic">{role.note}</p>}
                </div>
                <div className="flex flex-col items-center mr-3">
                  <div className={`text-3xl font-black ${visuals.accentColor} tabular-nums`}>
                    {role.matchPercentage}%
                  </div>
                  <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">התאמה</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-black/20 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-slate-600 text-[8px] uppercase font-black">פרופיל</span>
                      <span className="text-slate-300 font-black text-sm">{role.minProfile}{role.minProfile === 97 ? '' : '+'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-xl border border-white/5 flex flex-col items-center">
                      <span className="text-slate-600 text-[8px] uppercase font-black">דפ"ר</span>
                      <span className="text-slate-300 font-black text-sm">{role.minDapr}+</span>
                  </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">מאפיינים מרכזיים:</p>
                  <div className="flex flex-wrap gap-1.5">
                      {uniqueTagKeys.map((tagKey, i) => {
                          // Fixed: Ensure tagKey is treated as a string for indexing TAG_DESCRIPTIONS
                          const tagDesc = TAG_DESCRIPTIONS[tagKey];
                          if (!tagDesc) return null;
                          return (
                            <span key={i} className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${getTagStyle(tagKey, visuals, role.tags)}`}>
                                {tagDesc}
                            </span>
                          );
                      })}
                  </div>
              </div>

              <div className="relative mt-auto pt-4">
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-[1800ms] cubic-bezier(0.22, 1, 0.36, 1) bg-gradient-to-l ${visuals.barGradient}`} 
                    style={{ width: mounted ? `${role.matchPercentage}%` : '0%' }}
                  />
                </div>
              </div>
              
              <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-opacity duration-700 opacity-40 group-hover:opacity-100 ${visuals.glowColor}`} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mb-20">
        {hasMore && (
            <button 
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl flex items-center gap-3"
            >
                הצג תפקידים נוספים
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
        )}
      </div>

      <div className="bg-slate-900/40 rounded-[3rem] p-10 md:p-16 text-center border border-slate-800 shadow-3xl relative overflow-hidden group">
        <div className="relative z-10">
            <h3 className="text-4xl font-black mb-6 text-white">לא מצאת את מה שחיפשת?</h3>
            <p className="mb-12 text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                האלגוריתם שלנו משתכלל כל הזמן. ניתן לבצע את המבחן שוב עם דגש על העדפות שונות או לעבור על רשימת היחידות המלאה.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                  onClick={onRestart}
                  className="bg-emerald-600 text-white font-black py-5 px-16 rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 transform hover:scale-105 active:scale-95 text-lg"
              >
                  אבחון חוזר
              </button>
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default Results;
