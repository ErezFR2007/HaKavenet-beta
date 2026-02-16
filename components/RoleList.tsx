
import React from 'react';
import { Role } from '../types';
import { TAG_DESCRIPTIONS, ROLE_EXTENDED_DATA } from '../constants';

interface RoleListProps {
  roles: Role[];
  onRoleClick?: (roleId: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onRoleClick }) => {
  const getRankStyle = (rank: number) => {
    if (rank <= 4) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-white shadow-[0_0_15px_rgba(234,179,8,0.3)]';
    if (rank <= 24) return 'bg-gradient-to-br from-orange-50 via-slate-100 to-amber-200 border-orange-100 text-amber-900 font-black';
    if (rank <= 37) return 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-slate-100 text-slate-900 shadow-[0_0_10px_rgba(203,213,225,0.2)]';
    return 'bg-slate-800 border-slate-700 text-slate-400';
  };

  const getBranchColor = (type: string) => {
    if (type.includes('חיל האוויר')) return 'text-sky-400';
    if (type.includes('חיל הים')) return 'text-cyan-400';
    if (type.includes('חיל המודיעין')) return 'text-purple-400';
    if (type.includes('חיל התקשוב')) return 'text-indigo-400';
    if (type.includes('חיל היבשה')) return 'text-emerald-400';
    return 'text-slate-500';
  };

  const getBranchBorder = (type: string) => {
    if (type.includes('חיל האוויר')) return 'hover:border-sky-500/30';
    if (type.includes('חיל הים')) return 'hover:border-cyan-500/30';
    if (type.includes('חיל המודיעין')) return 'hover:border-purple-500/30';
    if (type.includes('חיל התקשוב')) return 'hover:border-indigo-500/30';
    if (type.includes('חיל היבשה')) return 'hover:border-emerald-500/30';
    return 'hover:border-slate-500/30';
  };

  const getRoleStatus = (role: Role) => {
    const eliteKeywords = ['טיס', 'מטכ"ל', 'שייטת 13', 'שלדג'];
    const specialKeywords = [
      'חובלים', 'צוללות', '504', 'קודקוד', 'ימ"ס', 'רפאים', 'יהל"ם', 'זיק', 
      'עוקץ', '5515', 'לוט"ר', 'מיתר', 'מורן', 'מלא"ר', 'רוכ"ש', 'ילת"ם', 'ל"א', 'מודא"ל', 'מנחית סער', '669'
    ];
    
    if (eliteKeywords.some(k => role.name.includes(k))) return 'elite';
    if (role.note?.includes('קומנדו') || ['מגלן', 'דובדבן', 'אגוז'].includes(role.name)) return 'commando';
    if (specialKeywords.some(k => role.name.includes(k))) return 'special';
    if (role.note?.includes('חי"ר') || (role.name.includes('סיירת') && role.type.includes('יבשה'))) return 'infantry';
    return null;
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-white">מאגר יחידות הלחימה</h2>
          <p className="text-[10px] text-slate-500 font-bold mt-1 italic">
            * הדירוג נקבע על פי יוקרה מערכתית שנקבעה על ידי בינה מלאכותית
          </p>
        </div>
        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl uppercase tracking-widest">
            {roles.length} יחידות מאובחנות
        </span>
      </div>

      <div className="overflow-hidden bg-slate-900/40 border border-slate-800 rounded-[2rem] shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-900 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-800">
              <tr>
                <th className="p-6 font-black w-24">דירוג</th>
                <th className="p-6 font-black">יחידה / תפקיד</th>
                <th className="p-6 font-black hidden md:table-cell text-center text-xs">פרופיל סף</th>
                <th className="p-6 font-black hidden md:table-cell text-center text-xs">דפ"ר סף</th>
                <th className="p-6 font-black hidden sm:table-cell">חיל</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {roles.sort((a,b) => a.rank - b.rank).map((role) => {
                const uniqueTags: string[] = Array.from(new Set(role.tags.toLowerCase().split('')));
                const branchColorClass = getBranchColor(role.type);
                const status = getRoleStatus(role);
                const hasDetails = ROLE_EXTENDED_DATA[role.id] !== undefined;
                
                // Logic to hide note if it is redundant with the badge
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
                    className={`transition-all group border-r-4 border-transparent hover:bg-slate-800/30 ${getBranchBorder(role.type).replace('hover:border', 'hover:border-r')} ${hasDetails ? 'cursor-pointer' : ''}`}
                  >
                    <td className="p-6">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl border font-black text-sm transition-transform group-hover:scale-110 ${getRankStyle(role.rank)}`}>
                            {role.rank}
                        </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black text-lg transition-colors group-hover:${branchColorClass} text-slate-100 underline decoration-transparent group-hover:decoration-current underline-offset-4`}>
                                {role.name}
                            </span>
                            {status === 'elite' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-yellow-500/50 bg-yellow-500/20 text-yellow-400">עילית</span>}
                            {status === 'commando' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-rose-500/50 bg-rose-500/20 text-rose-400">קומנדו</span>}
                            {status === 'special' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-purple-500/50 bg-purple-500/20 text-purple-400">מיוחדת</span>}
                            {status === 'infantry' && <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/20 text-emerald-400">חי"ר</span>}
                        </div>
                        
                        {displayNote && (
                          <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                            {displayNote}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {uniqueTags.map((tagKey, i) => {
                            const tagDesc = TAG_DESCRIPTIONS[tagKey];
                            if (!tagDesc) return null;
                            
                            return (
                              <span key={i} className={`text-[9px] px-2 py-0.5 rounded-md border whitespace-nowrap transition-colors 
                                ${tagKey === 'n' ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-500'}`}>
                                {tagDesc}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center hidden md:table-cell">
                      <span className="text-slate-400 font-bold text-lg">{role.minProfile}{role.minProfile === 97 ? '' : '+'}</span>
                    </td>
                    <td className="p-6 text-center hidden md:table-cell">
                      <span className="text-slate-400 font-bold text-lg">{role.minDapr}+</span>
                    </td>
                    <td className="p-6 hidden sm:table-cell">
                        <div className={`text-sm font-bold ${branchColorClass}`}>{role.type}</div>
                        {hasDetails && (
                           <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-300 transition-colors">
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
