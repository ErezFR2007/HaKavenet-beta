import React, { useState } from 'react';
import { Role } from '../types';
import { TAG_DESCRIPTIONS, ROLE_EXTENDED_DATA } from '../constants';

interface RoleListProps {
  roles: Role[];
  onRoleClick?: (roleId: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onRoleClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProfile, setFilterProfile] = useState<number>(0);
  const [filterDapr, setFilterDapr] = useState<number>(0);
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const getRankStyle = (rank: number) => {
    if (rank <= 5) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]';
    if (rank <= 26) return 'bg-gradient-to-br from-orange-50 via-slate-100 to-amber-200 border-orange-100 text-amber-900 font-black';
    if (rank <= 39) return 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-slate-100 text-slate-900 shadow-[0_0_10px_rgba(203,213,225,0.2)]';
    return 'bg-stone-200 dark:bg-slate-800 border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400';
  };

  const getBranchColor = (role: Role) => {
    const type = role.type;
    const name = role.name;
    if (type.includes('חיל האוויר')) return 'text-[#DCC2A4]';
    if (type.includes('חיל הים')) return 'text-cyan-400';
    if (type.includes('חיל המודיעין') || type.includes('אגף המבצעים')) return 'text-emerald-600';
    if (type.includes('חיל האיסוף')) return 'text-[#FDE68A]';
    if (type.includes('חיל התקשוב')) return 'text-blue-600';
    if (type.includes('משטרת ישראל') || type.includes('חיל המשטרה הצבאית')) return 'text-indigo-400';
    if (type.includes('פיקוד העורף')) return 'text-orange-500';
    
    if (name.includes('צנחנים') || type.includes('חטיבת הקומנדו') || name.includes('לוט"ר') || name.includes('הרב-ממדית')) return 'text-red-500';
    if (name.includes('גולני')) return 'text-[#8B4513]';
    if (name.includes('גבעתי')) return 'text-purple-500';
    if (name.includes('נח"ל')) return 'text-lime-400';
    if (name.includes('כפיר') || name.includes('חרוב')) return 'text-emerald-600';

    if (type.includes('חיל התותחנים')) return 'text-sky-300';
    if (type.includes('חיל השריון')) return 'text-slate-500';
    if (type.includes('חיל ההנדסה הקרבית')) return 'text-slate-400';

    if (type.includes('חיל הגבולות') || type.includes('הגנת הגבולות')) return 'text-[#D39655]';
    if (type.includes('חיל היבשה') || type.includes('זרוע היבשה') || type.includes('חיל הרגלים')) return 'text-emerald-400';
    return 'text-slate-500';
  };

  const getBranchBorder = (role: Role) => {
    const type = role.type;
    const name = role.name;
    if (type.includes('חיל האוויר')) return 'hover:border-[#DCC2A4]/30';
    if (type.includes('חיל הים')) return 'hover:border-cyan-500/30';
    if (type.includes('חיל המודיעין') || type.includes('אגף המבצעים')) return 'hover:border-emerald-600/30';
    if (type.includes('חיל האיסוף')) return 'hover:border-[#FDE68A]/30';
    if (type.includes('חיל התקשוב')) return 'hover:border-blue-600/30';
    if (type.includes('משטרת ישראל') || type.includes('חיל המשטרה הצבאית')) return 'hover:border-indigo-500/30';
    if (type.includes('פיקוד העורף')) return 'hover:border-orange-500/30';
    
    if (name.includes('צנחנים') || type.includes('חטיבת הקומנדו') || name.includes('לוט"ר') || name.includes('הרב-ממדית')) return 'hover:border-red-500/30';
    if (name.includes('גולני')) return 'hover:border-[#8B4513]/30';
    if (name.includes('גבעתי')) return 'hover:border-purple-500/30';
    if (name.includes('נח"ל')) return 'hover:border-lime-500/30';
    if (name.includes('כפיר') || name.includes('חרוב')) return 'hover:border-emerald-600/30';

    if (type.includes('חיל התותחנים')) return 'hover:border-sky-300/30';
    if (type.includes('חיל השריון')) return 'hover:border-slate-500/30';
    if (type.includes('חיל ההנדסה הקרבית')) return 'hover:border-slate-400/30';

    if (type.includes('חיל הגבולות') || type.includes('הגנת הגבולות')) return 'hover:border-[#D39655]/30';
    if (type.includes('חיל היבשה') || type.includes('זרוע היבשה') || type.includes('חיל הרגלים')) return 'hover:border-emerald-500/30';
    return 'hover:border-slate-500/30';
  };

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

  const filteredRoles = roles.filter(role => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = role.name.toLowerCase().includes(query) || 
      (role.note && role.note.toLowerCase().includes(query)) ||
      role.type.toLowerCase().includes(query);

    const matchesProfile = filterProfile === 0 || role.minProfile <= filterProfile;
    const matchesDapr = filterDapr === 0 || role.minDapr <= filterDapr;
    
    let matchesBranch = true;
    if (filterBranch === 'ground') {
      matchesBranch = !role.type.includes('חיל האוויר') && !role.type.includes('חיל הים');
    } else if (filterBranch === 'air') {
      matchesBranch = role.type.includes('חיל האוויר');
    } else if (filterBranch === 'sea') {
      matchesBranch = role.type.includes('חיל הים');
    }

    let matchesGender = true;
    if (filterGender === 'female_open') {
      matchesGender = role.tags.toLowerCase().includes('f');
    }

    return matchesSearch && matchesProfile && matchesDapr && matchesBranch && matchesGender;
  });

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col mb-10 gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-stone-900 dark:text-white">מאגר יחידות הלחימה</h2>
            <p className="text-[10px] text-stone-500 dark:text-slate-500 font-bold mt-1 italic">
              * הדירוג נקבע על פי יוקרה מערכתית שנקבעה על ידי בינה מלאכותית
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors flex items-center gap-2 ${showFilters ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/80 dark:bg-slate-900/50 border-stone-300 dark:border-slate-700 text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span className="text-sm font-bold hidden sm:inline">סינון</span>
            </button>
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש תפקיד..."
                className="bg-white/80 dark:bg-slate-900/50 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-10 p-2.5 placeholder-stone-500 dark:placeholder-slate-500 transition-colors"
                dir="rtl"
              />
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl uppercase tracking-widest whitespace-nowrap hidden sm:inline-block">
                {filteredRoles.length} יחידות
            </span>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white/90 dark:bg-slate-900/60 border border-stone-300 dark:border-slate-700 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 mb-2">פרופיל רפואי (עד)</label>
              <select 
                value={filterProfile} 
                onChange={(e) => setFilterProfile(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>הכל</option>
                <option value={97}>97</option>
                <option value={82}>82</option>
                <option value={72}>72</option>
                <option value={64}>64</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 mb-2">דפ"ר (עד)</label>
              <select 
                value={filterDapr} 
                onChange={(e) => setFilterDapr(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>הכל</option>
                <option value={90}>90</option>
                <option value={80}>80</option>
                <option value={70}>70</option>
                <option value={60}>60</option>
                <option value={50}>50</option>
                <option value={40}>40</option>
                <option value={30}>30</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 mb-2">זרוע</label>
              <select 
                value={filterBranch} 
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">הכל</option>
                <option value="ground">זרוע היבשה</option>
                <option value="air">חיל האוויר</option>
                <option value="sea">חיל הים</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-slate-400 mb-2">מגדר</label>
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-sm rounded-lg p-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">הכל</option>
                <option value="female_open">פתוח לנשים</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden bg-white/60 dark:bg-slate-900/40 border border-stone-300 dark:border-slate-800 rounded-[2rem] shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-stone-100 dark:bg-slate-900 text-stone-500 dark:text-slate-500 text-[11px] uppercase tracking-widest border-b border-stone-300 dark:border-slate-800">
              <tr>
                <th className="p-6 font-black w-24">דירוג</th>
                <th className="p-6 font-black">יחידה / תפקיד</th>
                <th className="p-6 font-black hidden md:table-cell text-center text-xs">פרופיל סף</th>
                <th className="p-6 font-black hidden md:table-cell text-center text-xs">דפ"ר סף</th>
                <th className="p-6 font-black hidden sm:table-cell">חיל</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-slate-800/50">
              {filteredRoles.sort((a,b) => a.rank - b.rank).map((role) => {
                const uniqueTags: string[] = Array.from(new Set(role.tags.toLowerCase().split('')));
                const branchColorClass = getBranchColor(role);
                const status = getRoleStatus(role);
                const hasDetails = ROLE_EXTENDED_DATA[role.id] !== undefined;
                
                // הסתרת הכפילות - אם מדובר בחטיבת הקומנדו, התג לא יציג את ה-note גם
                let displayNote = role.note;
                if (status === 'commando' && displayNote) {
                    displayNote = displayNote.replace('קומנדו', '').trim();
                }
                if (status === 'infantry' && displayNote) {
                    displayNote = displayNote.replace('חי"ר', '').trim();
                }
                
                return (
                  <tr 
                    key={role.id} 
                    onClick={() => onRoleClick && onRoleClick(role.id)}
                    className={`transition-all group border-r-4 border-transparent hover:bg-stone-200/50 dark:hover:bg-slate-800/30 ${getBranchBorder(role).replace('hover:border', 'hover:border-r')} ${hasDetails ? 'cursor-pointer' : ''}`}
                  >
                    <td className="p-6">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl border font-black text-sm transition-transform group-hover:scale-110 ${getRankStyle(role.rank)}`}>
                            {role.rank}
                        </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black text-lg transition-colors group-hover:${branchColorClass} text-stone-900 dark:text-slate-100 underline decoration-transparent group-hover:decoration-current underline-offset-4`}>
                                {role.name}
                            </span>
                            {status === 'prestige' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-amber-300/50 bg-amber-400/20 text-amber-600 dark:text-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.4)]">מסלול יוקרה</span>}
                            {status === 'elite' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-yellow-500/50 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">עילית</span>}
                            {status === 'commando' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-rose-500/50 bg-rose-500/20 text-rose-600 dark:text-rose-400">קומנדו</span>}
                            {status === 'special' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-purple-500/50 bg-purple-500/20 text-purple-600 dark:text-purple-400">מיוחדת</span>}
                            {status === 'infantry' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">חי"ר</span>}
                        </div>
                        
                        {displayNote && (
                          <div className="text-[11px] font-bold text-stone-500 dark:text-slate-400 mt-0.5">
                            {displayNote}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {uniqueTags.filter(t => t !== 'h').map((tagKey, i) => {
                            const tagDesc = TAG_DESCRIPTIONS[tagKey];
                            if (!tagDesc) return null;
                            
                            return (
                              <span key={i} className={`text-[9px] px-2 py-0.5 rounded-md border whitespace-nowrap transition-colors 
                                ${tagKey === 'n' ? 'bg-stone-300/50 dark:bg-white/10 border-stone-400/50 dark:border-white/20 text-stone-700 dark:text-white' : 'bg-stone-200/50 dark:bg-slate-800/50 border-stone-300/50 dark:border-slate-700/50 text-stone-600 dark:text-slate-500'}`}>
                                {tagDesc}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center hidden md:table-cell">
                      <span className="text-stone-500 dark:text-slate-400 font-bold text-lg">{role.minProfile}{role.minProfile === 97 ? '' : '+'}</span>
                    </td>
                    <td className="p-6 text-center hidden md:table-cell">
                      <span className="text-stone-500 dark:text-slate-400 font-bold text-lg">{role.minDapr}+</span>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                        <div className={`text-sm font-bold ${branchColorClass}`}>{role.type}</div>
                        {hasDetails && (
                           <div className="text-[9px] text-stone-400 dark:text-slate-500 mt-1 flex items-center gap-1 group-hover:text-stone-600 dark:group-hover:text-slate-300 transition-colors">
                             לפרטים
                             <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                           </div>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoleList;