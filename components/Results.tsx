
import React, { useEffect, useState } from 'react';
import { MatchResult } from '../types';
import { TAG_DESCRIPTIONS, ROLE_EXTENDED_DATA } from '../constants';

interface ResultsProps {
  results: MatchResult[];
  onRestart: () => void;
  onRoleClick?: (roleId: number) => void;
}

const Results: React.FC<ResultsProps> = ({ results, onRestart, onRoleClick }) => {
  const [mounted, setMounted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Filter results that have a decent match percentage
  const qualifiedResults = results.filter(r => r.matchPercentage >= 20);
  const topMatches = qualifiedResults.slice(0, visibleCount);
  const hasMore = qualifiedResults.length > visibleCount;

  const handleWhatsAppShare = () => {
    if (!results || results.length === 0) return;
    
    const topRole = results[0];
    const siteUrl = 'https://www.hakavenet-idf.co.il/';
    const text = `היי! עשיתי את אבחון היחידות הקרביות ב"הכוונת" ויצא לי שהכי מתאים לי לשרת ב${topRole.name}! 🎯%0A%0Aמעניין איזה תפקיד לוחמה יתאים לכם? כנסו לבדוק כאן באבחון היחידות הלוחמות:%0A${siteUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const getRoleVisuals = (role: MatchResult) => {
    const eliteKeywords = ['סיירת מטכ"ל', 'שייטת 13', 'שלדג', '669'];
    const isElite = eliteKeywords.some(k => role.name.includes(k));
    const isPrestige = ['טיס', 'חובלים', 'תוכנית ארז'].some(k => role.name.includes(k));

    const specialKeywords = [
      'צוללות', '504', 'קודקוד', 'ימ"ס', 'רב-ממדית', 'יהל"ם', 'זיק', 
      'עוקץ', 'לוט"ר', 'מיתר', 'מורן', 'מלא"ר', 'רוכ"ש', 'רוכב שמיים', 
      'ילת"ם', 'מודא"ל', 'מנחית סער', 'לוחם אישים'
    ];
    const isSpecial = specialKeywords.some(k => role.name.includes(k)) && !isElite && !isPrestige;
    
    const isCommando = (role.note?.includes('קומנדו') || ['מגלן', 'דובדבן', 'אגוז'].includes(role.name)) && !isElite && !isSpecial && !isPrestige;
    
    const isInfantry = (role.note?.includes('חי"ר') || (role.name.includes('סיירת') && role.type.includes('יבשה'))) && !isCommando && !isElite && !isSpecial && !isPrestige;
    
    let bgColor = 'bg-white/60 dark:bg-slate-900/60';
    let borderColor = 'border-stone-300 dark:border-slate-800';
    let glowColor = 'bg-emerald-500/5';
    let accentColor = 'text-emerald-600 dark:text-emerald-500';
    let barGradient = 'from-emerald-400 to-emerald-600';

    if (isPrestige) {
      bgColor = 'bg-white/95 dark:bg-slate-900/95';
      borderColor = 'border-amber-300/60';
      glowColor = 'bg-amber-400/20';
      accentColor = 'text-amber-600 dark:text-amber-300';
      barGradient = 'from-amber-100 via-yellow-400 to-amber-600';
    } else if (isElite) {
      bgColor = 'bg-white/90 dark:bg-slate-900/90';
      borderColor = 'border-yellow-500/60';
      glowColor = 'bg-yellow-500/20';
      accentColor = 'text-yellow-600 dark:text-yellow-400';
      barGradient = 'from-yellow-300 via-amber-500 to-yellow-600';
    } else if (isCommando) {
      bgColor = 'bg-white/70 dark:bg-slate-900/70';
      borderColor = 'border-rose-500/40';
      glowColor = 'bg-rose-500/10';
      accentColor = 'text-rose-600 dark:text-rose-500';
      barGradient = 'from-rose-400 to-rose-700';
    } else if (isSpecial) {
      borderColor = 'border-purple-500/40';
      glowColor = 'bg-purple-500/10';
      accentColor = 'text-purple-600 dark:text-purple-400';
      barGradient = 'from-purple-400 to-purple-600';
    } else {
      if (role.type.includes('חיל האוויר')) {
        borderColor = 'border-[#DCC2A4]/30';
        glowColor = 'bg-[#DCC2A4]/5';
        accentColor = 'text-[#DCC2A4]';
      } else if (role.type.includes('חיל הים')) {
        borderColor = 'border-cyan-500/30';
        glowColor = 'bg-cyan-500/5';
        accentColor = 'text-cyan-600 dark:text-cyan-400';
      } else if (role.type.includes('חיל המודיעין') || role.type.includes('אגף המבצעים')) {
        borderColor = 'border-emerald-600/30';
        glowColor = 'bg-emerald-600/5';
        accentColor = 'text-emerald-700 dark:text-emerald-600';
      } else if (role.type.includes('חיל האיסוף')) {
        borderColor = 'border-[#FDE68A]/30';
        glowColor = 'bg-[#FDE68A]/5';
        accentColor = 'text-amber-600 dark:text-[#FDE68A]';
      } else if (role.type.includes('חיל התקשוב')) {
        borderColor = 'border-blue-600/30';
        glowColor = 'bg-blue-600/5';
        accentColor = 'text-blue-700 dark:text-blue-600';
      } else if (role.type.includes('משטרת ישראל') || role.type.includes('חיל המשטרה הצבאית')) {
        borderColor = 'border-indigo-500/30';
        glowColor = 'bg-indigo-500/5';
        accentColor = 'text-indigo-600 dark:text-indigo-400';
      } else if (role.type.includes('פיקוד העורף')) {
        borderColor = 'border-orange-500/30';
        glowColor = 'bg-orange-500/5';
        accentColor = 'text-orange-600 dark:text-orange-500';
      } else if (role.name.includes('צנחנים') || role.type.includes('חטיבת הקומנדו') || role.name.includes('לוט"ר') || role.name.includes('הרב-ממדית')) {
        borderColor = 'border-red-500/30';
        glowColor = 'bg-red-500/5';
        accentColor = 'text-red-600 dark:text-red-500';
      } else if (role.name.includes('גולני')) {
        borderColor = 'border-[#8B4513]/30';
        glowColor = 'bg-[#8B4513]/5';
        accentColor = 'text-[#8B4513]';
      } else if (role.name.includes('גבעתי')) {
        borderColor = 'border-purple-500/30';
        glowColor = 'bg-purple-500/5';
        accentColor = 'text-purple-600 dark:text-purple-500';
      } else if (role.name.includes('נח"ל')) {
        borderColor = 'border-lime-500/30';
        glowColor = 'bg-lime-500/5';
        accentColor = 'text-lime-600 dark:text-lime-400';
      } else if (role.name.includes('כפיר') || role.name.includes('חרוב')) {
        borderColor = 'border-emerald-600/30';
        glowColor = 'bg-emerald-600/5';
        accentColor = 'text-emerald-700 dark:text-emerald-600';
      } else if (role.type.includes('חיל התותחנים')) {
        borderColor = 'border-sky-300/30';
        glowColor = 'bg-sky-300/5';
        accentColor = 'text-sky-600 dark:text-sky-300';
      } else if (role.type.includes('חיל השריון')) {
        borderColor = 'border-stone-500/30 dark:border-slate-500/30';
        glowColor = 'bg-stone-500/5 dark:bg-slate-500/5';
        accentColor = 'text-stone-600 dark:text-slate-500';
      } else if (role.type.includes('חיל ההנדסה הקרבית')) {
        borderColor = 'border-stone-400/30 dark:border-slate-400/30';
        glowColor = 'bg-stone-400/5 dark:bg-slate-400/5';
        accentColor = 'text-stone-500 dark:text-slate-400';
      } else if (role.type.includes('חיל הגבולות') || role.type.includes('הגנת הגבולות')) {
        borderColor = 'border-[#D39655]/30';
        glowColor = 'bg-[#D39655]/5';
        accentColor = 'text-[#D39655]';
      } else if (role.type.includes('חיל היבשה') || role.type.includes('זרוע היבשה') || role.type.includes('חיל הרגלים')) {
        borderColor = 'border-emerald-500/30';
        glowColor = 'bg-emerald-500/5';
        accentColor = 'text-emerald-600 dark:text-emerald-400';
      }
    }

    return { bgColor, borderColor, glowColor, accentColor, barGradient, isElite, isPrestige, isCommando, isInfantry, isSpecial };
  };

  const getPrestigeBarGradient = (rank: number) => {
    if (rank <= 5) return 'from-yellow-300 via-amber-400 to-yellow-600';
    if (rank <= 26) return 'from-orange-200 via-slate-200 to-amber-300';
    if (rank <= 39) return 'from-slate-200 via-slate-300 to-slate-400';
    return 'from-slate-600 to-slate-800';
  };

  const getTagStyle = (tagKey: string, visuals: any, originalTags: string) => {
    if (tagKey === 'n') {
      return 'bg-white/10 border-white/30 text-white font-black';
    }
    
    return visuals.isElite || visuals.isPrestige
      ? 'bg-stone-200/50 dark:bg-white/5 border-stone-300/50 dark:border-white/5 text-stone-600 dark:text-slate-300/70' 
      : visuals.isCommando 
        ? 'bg-rose-100 dark:bg-white/5 border-rose-200 dark:border-white/5 text-rose-600 dark:text-rose-400/50' 
        : visuals.isSpecial
          ? 'bg-purple-100 dark:bg-white/5 border-purple-200 dark:border-white/5 text-purple-600 dark:text-purple-400/50'
          : 'bg-stone-200/50 dark:bg-white/5 border-stone-300/50 dark:border-white/5 text-stone-600 dark:text-slate-500';
  };

  if (results.length === 0) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-700 text-center py-20 px-6">
        <div className="bg-rose-500/10 text-rose-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-6">לא נמצאו יחידות מתאימות</h2>
        <p className="text-stone-600 dark:text-slate-400 text-xl font-medium max-w-xl mx-auto mb-12 leading-relaxed">
          על פי הנתונים שהזנת (פרופיל, דפ"ר או העדפות), לא נמצאו יחידות קרביות העומדות בדרישות הסף או בהעדפותיך. 
          אנו ממליצים לבצע את האבחון מחדש ולבדוק את נתוני הסף.
        </p>
        <button 
          onClick={onRestart}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-16 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1"
        >
          אבחון חוזר
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-black text-stone-900 dark:text-white tracking-tighter">דירוג ההתאמה שלך</h2>
        <p className="text-stone-500 dark:text-slate-500 text-xl font-medium max-w-2xl mx-auto">
          מצאנו <span className="text-emerald-600 dark:text-emerald-400 font-black">{qualifiedResults.length}</span> תפקידים רלוונטיים עבורך. להלן היחידות המובילות:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {topMatches.map((role) => {
          const visuals = getRoleVisuals(role);
          const barWidth = Math.max(5, 100 - (role.rank * 1.5));
          const uniqueTagKeys: string[] = Array.from(new Set(role.tags.toLowerCase().split('')));
          const hasDetails = ROLE_EXTENDED_DATA[role.id] !== undefined;
          
          return (
            <div 
              key={role.id} 
              onClick={() => onRoleClick && onRoleClick(role.id)}
              className={`group ${visuals.bgColor} rounded-[2rem] p-7 border-2 ${visuals.borderColor} hover:scale-[1.02] transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col ${hasDetails ? 'cursor-pointer hover:shadow-emerald-900/20' : ''}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-stone-200 dark:bg-black/40 rounded-full overflow-hidden flex ring-1 ring-stone-300 dark:ring-white/5">
                  <div 
                    className={`h-full bg-gradient-to-r ${getPrestigeBarGradient(role.rank)} transition-all duration-[2500ms] ease-out delay-500`}
                    style={{ width: mounted ? `${barWidth}%` : '0%' }}
                  />
                </div>
                <div className="text-[10px] font-black uppercase text-stone-500 dark:text-slate-500 tracking-widest">
                  דרג {role.rank}
                </div>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${visuals.borderColor} bg-stone-200/50 dark:bg-black/30 text-stone-600 dark:text-slate-400`}>
                          {role.type}
                      </span>
                      {visuals.isPrestige && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-amber-300/50 bg-amber-400/20 text-amber-700 dark:text-amber-200 shadow-[0_0_10px_rgba(252,211,77,0.4)]">מסלול יוקרה</span>}
                      {visuals.isElite && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-yellow-500/50 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">עילית</span>}
                      {visuals.isSpecial && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-purple-500/50 bg-purple-500/20 text-purple-700 dark:text-purple-400">מיוחדת</span>}
                      {visuals.isCommando && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400">קומנדו</span>}
                      {visuals.isInfantry && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">חי"ר</span>}
                  </div>
                  <h4 className={`text-2xl font-black leading-tight ${visuals.isPrestige ? 'text-amber-800 dark:text-amber-50 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]' : visuals.isElite ? 'text-yellow-800 dark:text-yellow-50 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]' : visuals.isCommando ? 'text-rose-800 dark:text-rose-50' : visuals.isSpecial ? 'text-purple-800 dark:text-purple-50' : 'text-stone-900 dark:text-white'} underline decoration-transparent group-hover:decoration-current underline-offset-4 transition-all`}>
                    {role.name}
                  </h4>
                  {role.note && <p className="text-[11px] text-stone-500 dark:text-slate-500 mt-1 font-bold italic">{role.note}</p>}
                </div>
                <div className="flex flex-col items-center mr-3">
                  <div className={`text-3xl font-black ${visuals.accentColor} tabular-nums`}>
                    {role.matchPercentage}%
                  </div>
                  <div className="text-[8px] text-stone-500 dark:text-slate-600 font-black uppercase tracking-widest">התאמה</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-stone-200/50 dark:bg-black/20 p-2 rounded-xl border border-stone-300 dark:border-white/5 flex flex-col items-center">
                      <span className="text-stone-500 dark:text-slate-600 text-[8px] uppercase font-black">פרופיל</span>
                      <span className="text-stone-700 dark:text-slate-300 font-black text-sm">{role.minProfile}{role.minProfile === 97 ? '' : '+'}</span>
                  </div>
                  <div className="bg-stone-200/50 dark:bg-black/20 p-2 rounded-xl border border-stone-300 dark:border-white/5 flex flex-col items-center">
                      <span className="text-stone-500 dark:text-slate-600 text-[8px] uppercase font-black">דפ"ר</span>
                      <span className="text-stone-700 dark:text-slate-300 font-black text-sm">{role.minDapr}+</span>
                  </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                  <p className="text-[9px] text-stone-500 dark:text-slate-600 font-black uppercase tracking-[0.2em]">מאפיינים מרכזיים:</p>
                  <div className="flex flex-wrap gap-1.5">
                      {uniqueTagKeys.filter(t => t !== 'h').map((tagKey, i) => {
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
                <div className="w-full bg-stone-200 dark:bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-[1800ms] cubic-bezier(0.22, 1, 0.36, 1) bg-gradient-to-l ${visuals.barGradient}`} 
                    style={{ width: mounted ? `${role.matchPercentage}%` : '0%' }}
                  />
                </div>
                {hasDetails && (
                    <div className="absolute right-0 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-bold text-stone-600 dark:text-slate-300 flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-full border border-stone-300 dark:border-slate-700">
                            למידע נוסף
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </span>
                    </div>
                )}
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
                className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 hover:border-emerald-500/50 text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl flex items-center gap-3"
            >
                הצג תפקידים נוספים
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
        )}
      </div>

      <div className="bg-white/60 dark:bg-slate-900/40 rounded-[3rem] p-10 md:p-16 text-center border border-stone-300 dark:border-slate-800 shadow-3xl relative overflow-hidden group">
        <div className="relative z-10">
            <h3 className="text-4xl font-black mb-6 text-stone-900 dark:text-white">איך יצא לך? שתף את התוצאה!</h3>
            <p className="mb-12 text-stone-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                הזמן את החברים שלך לבדוק איזו יחידה הכי מתאימה להם במערך הלוחמה.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                  onClick={handleWhatsAppShare}
                  className="bg-[#25D366] text-white font-black py-5 px-10 rounded-2xl hover:bg-[#128C7E] transition-all shadow-xl shadow-green-900/20 transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-3"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.589.941 3.208 1.441 4.905 1.442 5.347 0 9.697-4.349 9.699-9.698.001-2.592-1.008-5.028-2.844-6.864-1.836-1.837-4.272-2.847-6.864-2.847-5.348 0-9.697 4.349-9.699 9.698-.001 1.832.518 3.619 1.501 5.176l-1.001 3.652 3.737-.981zm11.332-6.852c-.301-.15-1.781-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.651.075-.3-.15-1.265-.467-2.41-1.488-.891-.795-1.492-1.776-1.667-2.076-.175-.3-.019-.462.13-.611.134-.134.3-.349.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.588-.491-.508-.675-.518-.175-.01-.375-.011-.575-.011-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.125 4.527.715.308 1.273.492 1.707.63.718.228 1.372.196 1.889.119.577-.087 1.781-.729 2.031-1.429.25-.7.25-1.3.175-1.429-.075-.125-.275-.2-.575-.35z"/></svg>
                  שתף בוואטסאפ
              </button>
              <button 
                  onClick={onRestart}
                  className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 hover:border-stone-400 dark:hover:border-slate-500 text-stone-900 dark:text-white font-black py-5 px-16 rounded-2xl transition-all shadow-xl transform hover:scale-105 active:scale-95 text-lg"
              >
                  אבחון חוזר
              </button>
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* הערת אזהרה/הסתייגות */}
      <div className="mt-8 mb-4 text-center px-4">
        <p className="text-[11px] text-stone-400 dark:text-slate-500 font-medium leading-relaxed opacity-70">
          * שימו לב: תוצאות ההתאמה מוצגות כהמלצה ולהכוונה כללית בלבד, ומבוססות על אלגוריתם עצמאי. 
          <br className="hidden sm:block" />
          המערכת אינה חפה מטעויות, ואינה מהווה קביעה מוחלטת, הבטחה לשיבוץ או תחליף להליכי המיון הרשמיים של צה״ל.
        </p>
      </div>
    </div>
  );
};

export default Results;
