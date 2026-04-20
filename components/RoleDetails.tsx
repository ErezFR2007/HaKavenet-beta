import React, { useEffect } from 'react';
import { Role, RoleExtendedDetails } from '../types';

interface RoleDetailsProps {
  role: Role;
  details: RoleExtendedDetails;
  onBack: () => void;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ role, details, onBack }) => {

  useEffect(() => {
    // משנה את הכותרת של הדפדפן (וה-SEO של גוגל)
    document.title = `הכוונת - ${role.name}`;
    
    // כשיוצאים מהדף, זה מחזיר לכותרת הרגילה
    return () => {
      document.title = 'הכוונת - הדרך שלך ללוחמה';
    };
  }, [role.name]);
  
  const getRoleStatus = (role: Role) => {
    const eliteKeywords = ['סיירת מטכ"ל', 'שייטת 13', 'שלדג', '669'];
    const specialKeywords = [
      'צוללות', '504', 'קודקוד', 'ימ"ס', 'רב-ממדית', 'יהל"ם', 'זיק', 
      'עוקץ', 'לוט"ר', 'מיתר', 'מורן', 'מלא"ר', 'רוכ"ש', 'ילת"ם', 'מודא"ל', 'מנחית סער', 'לוחם אישים', 'תצפיתן חמ"ן', 'מפעיל ל"א', 'לוחם ל"א'
    ];
    
    if (['טיס', 'חובלים', 'תוכנית ארז'].some(k => role.name.includes(k))) return 'prestige';
    if (eliteKeywords.some(k => role.name.includes(k))) return 'elite';
    if (role.note?.includes('קומנדו') || ['מגלן', 'דובדבן', 'אגוז'].includes(role.name)) return 'commando';
    if (specialKeywords.some(k => role.name.includes(k))) return 'special';
    if (role.note?.includes('חי"ר') || (role.name.includes('סיירת') && role.type.includes('יבשה'))) return 'infantry';
    return null;
  };

  const status = getRoleStatus(role);

  const getInfantryColors = (name: string) => {
    if (name.includes('צנחנים')) return 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (name.includes('גולני')) return 'bg-[#8B4513]/10 border-[#8B4513]/30 text-[#8B4513] shadow-[0_0_15px_rgba(139,69,19,0.2)]';
    if (name.includes('גבעתי')) return 'bg-purple-500/10 border-purple-500/20 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
    if (name.includes('נח"ל')) return 'bg-lime-500/10 border-lime-500/20 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.2)]';
    if (name.includes('כפיר') || name.includes('חרוב')) return 'bg-emerald-600/10 border-emerald-600/20 text-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.2)]';
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  };

  const getBranchColor = (role: Role) => {
    const type = role.type;
    const name = role.name;
    if (type.includes('חיל האוויר')) return 'text-[#DCC2A4] border-[#DCC2A4]/30 bg-[#DCC2A4]/10';
    if (type.includes('חיל הים')) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (type.includes('חיל המודיעין') || type.includes('אגף המבצעים')) return 'text-emerald-600 border-emerald-600/30 bg-emerald-600/10';
    if (type.includes('חיל האיסוף')) return 'text-[#FDE68A] border-[#FDE68A]/30 bg-[#FDE68A]/10';
    if (type.includes('חיל התקשוב')) return 'text-blue-600 border-blue-600/30 bg-blue-600/10';
    if (type.includes('משטרת ישראל') || type.includes('חיל המשטרה הצבאית')) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (type.includes('פיקוד העורף')) return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    
    if (name.includes('צנחנים') || type.includes('חטיבת הקומנדו') || name.includes('לוט"ר') || name.includes('הרב-ממדית')) return 'text-red-500 border-red-500/30 bg-red-500/10';
    if (name.includes('גולני')) return 'text-[#8B4513] border-[#8B4513]/30 bg-[#8B4513]/10';
    if (name.includes('גבעתי')) return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
    if (name.includes('נח"ל')) return 'text-lime-400 border-lime-500/30 bg-lime-500/10';
    if (name.includes('כפיר') || name.includes('חרוב')) return 'text-emerald-600 border-emerald-600/30 bg-emerald-600/10';

    if (type.includes('חיל התותחנים')) return 'text-sky-300 border-sky-300/30 bg-sky-300/10';
    if (type.includes('חיל השריון')) return 'text-stone-500 dark:text-slate-500 border-stone-500/30 dark:border-slate-500/30 bg-stone-500/10 dark:bg-slate-500/10';
    if (type.includes('חיל ההנדסה הקרבית')) return 'text-stone-400 dark:text-slate-400 border-stone-400/30 dark:border-slate-400/30 bg-stone-400/10 dark:bg-slate-400/10';

    if (type.includes('חיל הגבולות') || type.includes('הגנת הגבולות')) return 'text-[#D39655] border-[#D39655]/30 bg-[#D39655]/10';
    if (type.includes('חיל היבשה') || type.includes('זרוע היבשה') || type.includes('חיל הרגלים')) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    return 'text-stone-600 dark:text-slate-300 border-stone-300 dark:border-slate-600 bg-stone-100 dark:bg-slate-950/50';
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      {/* כפתור חזרה */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white transition-colors font-bold group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          חזרה לרשימה
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* כותרת ופרטים עליונים */}
        <header className="mb-8 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-stone-100 via-white to-stone-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-stone-200 dark:border-slate-700 p-8 md:p-12 shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
           
           <div className="relative z-10">
             <div className="flex flex-wrap gap-3 mb-4">
               
               {/* התיקון: הסתרת ה-Type אם הוא חטיבת הקומנדו */}
               {role.type !== 'חטיבת הקומנדו' && (
                 <span className={`${getBranchColor(role)} px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm border`}>
                   {role.type}
                 </span>
               )}

               {status === 'prestige' && (
                 <span className="bg-amber-400/10 border border-amber-300/40 text-amber-600 dark:text-amber-200 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-1 ring-amber-300/20">
                   מסלול יוקרה
                 </span>
               )}
               
               {status === 'elite' && (
                 <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                   יחידת עילית
                 </span>
               )}
               
               {status === 'special' && (
                 <span className="bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                   יחידה מיוחדת
                 </span>
               )}

               {status === 'commando' && (
                 <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                   חטיבת הקומנדו
                 </span>
               )}

               {status === 'infantry' && (
                 <span className={`${getInfantryColors(role.name)} px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm`}>
                   חטיבת חי"ר
                 </span>
               )}
             </div>
             
             <h1 className="text-5xl md:text-7xl font-black text-stone-900 dark:text-white mb-6 tracking-tight leading-none">
               {role.name}
             </h1>
             
             <p className="text-lg md:text-xl text-stone-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
               {details.description}
             </p>

             {/* סטטיסטיקות ונתוני קבלה בעיצוב חדש */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 border-t border-stone-200 dark:border-slate-700/50 pt-8">
                {/* קוביות מידע - זמן שירות ושלבים (ירוק מודגש) */}
                 {details.stats?.serviceLength && (
                   <div className="bg-emerald-500/10 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-500/20">
                     <div className="text-emerald-600 dark:text-emerald-400/70 text-[10px] font-black uppercase tracking-widest mb-1">זמן שירות חובה</div>
                     <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 leading-none">{details.stats.serviceLength}</div>
                   </div>
                 )}
                 {details.stats?.selectionCount && (
                   <div className="bg-emerald-500/10 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-500/20">
                     <div className="text-emerald-600 dark:text-emerald-400/70 text-[10px] font-black uppercase tracking-widest mb-1">שלבי מיון</div>
                     <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 leading-none">{details.stats.selectionCount}</div>
                   </div>
                 )}
                 
                 {/* קוביות דרישות קבלה - פרופיל ודפ"ר (רגיל/אפור) */}
                 <div className="bg-stone-200/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-stone-300/50 dark:border-slate-700/50">
                    <div className="text-stone-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        פרופיל מינימלי
                    </div>
                    <div className="text-2xl font-black text-stone-900 dark:text-white leading-none">{role.minProfile}</div>
                 </div>
                 
                 <div className="bg-stone-200/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-stone-300/50 dark:border-slate-700/50">
                    <div className="text-stone-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        דפ"ר מינימלי
                    </div>
                    <div className="text-2xl font-black text-stone-900 dark:text-white leading-none">{role.minDapr}</div>
                 </div>
             </div>
             
             {/* דרישות יום המא"ה - אם קיים */}
             {details.yomHameaRequirements && (
                <div className="mt-8 border-t border-stone-200 dark:border-slate-700/50 pt-8">
                    <div className="text-stone-500 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-4">דרישות יום המא"ה (מינימום)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {details.yomHameaRequirements.map((req, idx) => (
                            <div key={idx} className="bg-stone-200/30 dark:bg-slate-800/30 rounded-xl p-3 border border-stone-300/30 dark:border-slate-700/30 flex items-center justify-between">
                                <span className="text-stone-700 dark:text-slate-300 text-sm font-bold">{req.label}</span>
                                <div className="flex gap-0.5">
                                    {[1,2,3,4,5].map(star => (
                                        <div 
                                            key={star} 
                                            className={`w-1.5 h-3 rounded-full ${star <= req.score ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-slate-700'}`} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}
           </div>
        </header>

        {/* הודעת "חשוב לדעת" - מוצגת רק אם קיימת הערה */}
        {details.importantNote && (
            <div className="mb-16 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4 shadow-lg">
                <div className="bg-amber-500/10 p-2 rounded-xl shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </div>
                <div>
                    <h4 className="text-amber-600 dark:text-amber-400 font-bold mb-1 text-lg">חשוב לדעת!</h4>
                    <p className="text-stone-600 dark:text-slate-300 leading-relaxed text-sm">
                        {details.importantNote}
                    </p>
                </div>
            </div>
        )}

        <div className="space-y-20">
          
          {/* חלק 1: איך מגיעים */}
          <section>
            <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-10 flex items-center gap-4">
              <span className="bg-emerald-500 w-2 h-10 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"/>
              איך מגיעים?
            </h2>
            
            <div className="grid gap-10">
              {details.selectionPaths.map((path, pIndex) => (
                <div key={pIndex} className="bg-white/60 dark:bg-slate-900/40 border border-stone-300/60 dark:border-slate-800/60 rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                   {/* רקע דקורטיבי */}
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-50"></div>

                   <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-10 flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      </div>
                      {path.name}
                   </h3>
                   
                   <div className="relative">
                      {/* קו מחבר - אנכי במובייל, אופקי בדסקטופ */}
                      <div className="absolute top-4 bottom-4 right-[15px] w-0.5 bg-stone-300 dark:bg-slate-800 md:hidden" />
                      <div className="hidden md:block absolute top-[19px] left-6 right-6 h-0.5 bg-stone-300 dark:bg-slate-800" />

                      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 relative">
                          {path.steps.map((step, sIndex) => (
                              <div key={sIndex} className="flex md:flex-col items-center gap-5 md:gap-6 relative group flex-1">
                                  {/* בועית מספר/אייקון */}
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-stone-100 dark:bg-slate-900 border-2 border-stone-400 dark:border-slate-600 group-hover:border-emerald-500 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all z-10 flex items-center justify-center shrink-0 shadow-lg">
                                      <span className="text-xs md:text-sm font-black text-stone-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{sIndex + 1}</span>
                                  </div>
                                  
                                  {/* טקסט */}
                                  <div className="text-right md:text-center md:px-2">
                                      <span className="text-stone-800 dark:text-slate-200 font-bold text-lg md:text-base leading-tight group-hover:text-stone-900 dark:group-hover:text-white transition-colors block">
                                          {step}
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* חלק 2: מסלול ההכשרה */}
          <section>
            <h2 className="text-3xl font-black text-stone-900 dark:text-white mb-10 flex items-center gap-4">
              <span className="bg-emerald-500 w-2 h-10 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"/>
              מסלול ההכשרה
            </h2>
            
            <div className="relative border-r-2 border-stone-300 dark:border-slate-800 mr-4 space-y-12 pb-4">
              {details.trainingProcess.map((stage, index) => (
                <div key={index} className="relative mr-10 group">
                  {/* נקודת ציון */}
                  <div className="absolute -right-[45px] top-0 w-5 h-5 rounded-full border-4 border-stone-100 dark:border-slate-900 bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)] group-hover:scale-125 transition-transform z-10" />
                  
                  <div className="bg-white/60 dark:bg-slate-900/50 border border-stone-300 dark:border-slate-800 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-colors shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{stage.title}</h3>
                      {stage.duration && (
                        <span className="self-start sm:self-auto text-xs font-black bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700">
                          {stage.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-slate-400 text-lg leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* סיום מסלול */}
              <div className="relative mr-10">
                  <div className="absolute -right-[48px] top-0 w-6 h-6 rounded-full border-4 border-stone-100 dark:border-slate-900 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse z-10" />
                  <div className="bg-gradient-to-l from-stone-200 via-stone-200/80 to-stone-100/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-800/30 border border-stone-300/50 dark:border-slate-700/50 p-8 rounded-[2rem]">
                      <h3 className="text-lg font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest mb-1">סיום מסלול</h3>
                      <p className="text-stone-600 dark:text-slate-300 text-lg font-medium">הענקת דרגות, סיכות וסיום הכשרה</p>
                  </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RoleDetails;
