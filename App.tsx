
import React, { useState, useLayoutEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
import { ROLES_DB, TAG_DESCRIPTIONS, ROLE_EXTENDED_DATA } from './constants';
import { UserAnswers, MatchResult, FitnessLevel, Role, TagPreference } from './types';
import Quiz from './components/Quiz';
import Results from './components/Results';
import RoleList from './components/RoleList';
import RoleDetails from './components/RoleDetails';

const ScrollManager = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if (pathname === '/') {
      if (navType === 'POP') {
        const savedScroll = sessionStorage.getItem('homeScroll');
        if (savedScroll) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll, 10));
          }, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
};

const RoleDetailsRoute = ({ onBack }: { onBack: () => void }) => {
  const { slug } = useParams();
  const role = ROLES_DB.find(r => r.slug === slug || r.id.toString() === slug);
  
  if (!role) return <div className="text-center py-20 text-2xl">התפקיד לא נמצא</div>;
  
  const details = ROLE_EXTENDED_DATA[role.id];
  if (!details) return <div className="text-center py-20 text-2xl">מידע מורחב חסר</div>;
  
  return <RoleDetails role={role} details={details} onBack={onBack} />;
};

const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'quiz' | 'results' | 'all-roles'>('intro');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleRoleSelect = (roleId: number) => {
    const role = ROLES_DB.find(r => r.id === roleId);
    if (ROLE_EXTENDED_DATA[roleId] && role) {
      sessionStorage.setItem('homeScroll', window.scrollY.toString());
      const slug = role.slug || role.id.toString();
      navigate(`/rolesdetails/${slug}`);
    } else {
      alert("מידע מורחב על יחידה זו יעלה בקרוב.");
    }
  };

  const calculateResults = (answers: UserAnswers) => {
    // 1. קביעת רמת כושר המשתמש
    let userFitness: FitnessLevel = FitnessLevel.LOW;
    
    const { trainingRoutine, runTime, pullUpsOrPushUps, mentalApproach } = answers;

    if (
      trainingRoutine === 4 &&
      mentalApproach === 'poison' &&
      ((runTime === 4 && pullUpsOrPushUps >= 3) || (pullUpsOrPushUps === 4 && runTime >= 3))
    ) {
      userFitness = FitnessLevel.VERY_HIGH;
    } else if (
      trainingRoutine >= 2 &&
      (mentalApproach === 'poison' || mentalApproach === 'neutral') &&
      runTime >= 3 && pullUpsOrPushUps >= 3
    ) {
      userFitness = FitnessLevel.HIGH;
    } else if (
      runTime >= 2 && pullUpsOrPushUps >= 2
    ) {
      userFitness = FitnessLevel.MEDIUM;
    } else {
      userFitness = FitnessLevel.LOW;
    }

    // שלב א': חישוב ציונים גולמיים לכל היחידות
    const isTrack1 = answers.profile >= 72 && answers.dapr >= 70 && answers.mentalApproach === 'tech';
    const isTrack2 = answers.gender === 'male' && (
      (userFitness <= 2 && answers.profile >= 82 && answers.trainingRoutine === 4) ||
      (answers.eligibleForYomSayarot && answers.runTime === 4 && answers.pullUpsOrPushUps === 4)
    );
    const isTrack3 = answers.gender === 'female' && (
      (userFitness <= 2 && answers.profile >= 82 && answers.trainingRoutine === 4) ||
      (userFitness === 1 && answers.eligibleForYomSayarot)
    );
    const isTrack4 = answers.gender === 'male' && answers.profile >= 82 && answers.dapr >= 70 && !isTrack1 && !isTrack2;
    const isTrack5 = answers.gender === 'male' && answers.profile >= 82 && answers.dapr < 70 && !isTrack1 && !isTrack2;
    const isTrack6 = answers.gender === 'male' && answers.profile === 72 && !isTrack1;
    const isTrack7 = answers.gender === 'female' && !isTrack3;

    const rawMatches: MatchResult[] = ROLES_DB.map(role => {
      // 2. סינונים קשיחים
      if (answers.gender === 'female' && !role.tags.toLowerCase().includes('f')) return null;

      let effectiveProfile = answers.profile;
      if (answers.profile === 97 && !answers.eligibleForYomSayarot) {
        effectiveProfile = 82;
      } else if (answers.profile === 82 && answers.eligibleForYomSayarot) {
        effectiveProfile = 97;
      }

      if (role.id === 1) {
        if (answers.profile < role.minProfile || answers.dapr < role.minDapr) return null;
      } else {
        if (effectiveProfile < role.minProfile || answers.dapr < role.minDapr) return null;
      }

      if (answers.tags['l'] === 'very_no' && role.tags.includes('l')) return null;

      if (isTrack1) {
        const track1RoleIds = [1, 6, 7, 12, 21, 26, 27, 56, 28, 36, 44, 29, 58, 31, 32, 33, 34, 35, 42, 46, 52, 51];
        
        if (track1RoleIds.includes(role.id)) {
          let finalPercentage = 50;
          const reasons: string[] = [];

          // DAPR Bonus
          const tierA = [1, 6, 7, 12, 31, 32, 33];
          const tierB = [21, 26, 27, 56, 28, 36, 44];
          const tierC = [29, 58, 34, 35, 42, 46, 52, 51];

          if (tierA.includes(role.id)) {
            if (answers.dapr >= 90) finalPercentage += 12;
            else if (answers.dapr >= 80) finalPercentage += 6;
          } else if (tierB.includes(role.id)) {
            if (answers.dapr >= 90) finalPercentage += 8;
            else if (answers.dapr >= 80) finalPercentage += 4;
          } else if (tierC.includes(role.id)) {
            if (answers.dapr >= 90) finalPercentage += 2;
          }

          // Fitness Bonus
          const fitnessBonusRoles = [1, 6, 7, 12, 21, 26, 27, 56, 28, 36, 44, 29, 35, 42];
          if (fitnessBonusRoles.includes(role.id)) {
            if (userFitness === FitnessLevel.VERY_HIGH) {
              finalPercentage += 8;
            } else if (userFitness === FitnessLevel.HIGH) {
              finalPercentage += 4;
            }
          }

          // Questions (Weight: 45%)
          let qScore = 0;
          let qMax = 0;

          const processStandardTag = (pref: TagPreference | undefined, hasTag: boolean, noPenaltyForMissing = false, noPenaltyForNegative = false) => {
            if (!pref) return;
            let weight = 10;
            let multiplier = 0;
            if (pref === 'very_yes') multiplier = 1;
            else if (pref === 'yes') multiplier = 0.5;
            else if (pref === 'no') multiplier = -1.5;
            else if (pref === 'very_no') multiplier = -3;

            if (!hasTag && multiplier > 0 && noPenaltyForMissing) return;
            if (hasTag && multiplier < 0 && noPenaltyForNegative) return;

            qMax += weight;

            if (pref === 'neutral') {
              qScore += weight * 0.2;
            } else if (hasTag) {
              if (multiplier > 0) qScore += weight * multiplier;
              else if (multiplier < 0 && !noPenaltyForNegative) qScore += weight * multiplier;
            } else {
              if (multiplier < 0) qScore += weight * (pref === 'very_no' ? 1 : 0.5);
              else if (multiplier > 0 && !noPenaltyForMissing) qScore -= weight * multiplier * 1.5;
            }
          };

          // 1. a
          processStandardTag(answers.tags['a'], role.tags.includes('a'));

          // 2. sea
          const isNavy = role.type.includes('חיל הים');
          processStandardTag(answers.tags['sea'], isNavy, true, false);

          // 3. air
          const isAirForce = role.type.includes('חיל האוויר');
          processStandardTag(answers.tags['air'], isAirForce, true, false);

          // 5. g
          processStandardTag(answers.tags['g'], role.tags.includes('g'));

          // 5.5 h
          processStandardTag(answers.tags['h'], role.tags.includes('h'), true, false);

          // 6. c
          processStandardTag(answers.tags['c'], role.tags.includes('c'), true, false);

          // 7. f
          const isFemale = answers.gender === 'female';
          if (!isFemale) {
            processStandardTag(answers.tags['f'], role.tags.includes('f'));
          }

          // 8. l
          processStandardTag(answers.tags['l'], role.tags.includes('l'), true, false);

          // 9. field_op
          if (answers.tags['field_op']) {
            const groupA = [1, 21, 26, 27, 56, 28, 36, 44, 35, 46, 52];
            const groupB = [6, 7, 12, 29, 58, 31, 32, 33, 34, 42, 51];
            
            let fieldOpWeight = 10;
            qMax += fieldOpWeight;
            let fieldOpMult = 0;
            if (answers.tags['field_op'] === 'very_yes') fieldOpMult = 1;
            else if (answers.tags['field_op'] === 'yes') fieldOpMult = 0.5;
            else if (answers.tags['field_op'] === 'no') fieldOpMult = -1.5;
            else if (answers.tags['field_op'] === 'very_no') fieldOpMult = -3;

            if (answers.tags['field_op'] === 'neutral') {
              qScore += fieldOpWeight * 0.2;
            } else if (groupA.includes(role.id)) {
              qScore += fieldOpWeight * fieldOpMult;
            } else if (groupB.includes(role.id)) {
              qScore -= fieldOpWeight * fieldOpMult;
            }
          }

          if (qMax > 0) {
            const questionsPercentage = ((qScore + qMax) / (2 * qMax)) * 45;
            finalPercentage += questionsPercentage;
          }

          if (tierA.includes(role.id) && answers.dapr >= 80) reasons.push('בונוס נתונים קוגניטיביים');
          else if (tierB.includes(role.id) && answers.dapr >= 80) reasons.push('בונוס נתונים קוגניטיביים');
          
          if (fitnessBonusRoles.includes(role.id) && userFitness <= FitnessLevel.HIGH) reasons.push('בונוס כושר גופני');

          // Severe penalties for specific tags
          let severePenalty = 0;
          let isDealBreaker = false;

          const applySevereCheck = (pref: TagPreference | undefined, hasFeature: boolean) => {
            if (hasFeature) {
              if (pref === 'very_no') isDealBreaker = true;
              if (pref === 'no') severePenalty += 30;
            }
          };

          applySevereCheck(answers.tags['sea'], isNavy);
          applySevereCheck(answers.tags['c'], role.tags.includes('c'));
          if (!isFemale) applySevereCheck(answers.tags['f'], role.tags.includes('f'));
          applySevereCheck(answers.tags['l'], role.tags.includes('l'));

          if (isDealBreaker) return null;
          finalPercentage -= severePenalty;

          // High Interview Fit Bonus
          if (answers.interviewScore === 'high') {
            const eliteRoles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13];
            if (eliteRoles.includes(role.id)) {
              finalPercentage += 2;
              reasons.push('בונוס התאמה גבוהה לראיון');
            }
          }

          // Partial Combat Fit Penalty
          if (answers.interviewScore === 'low') {
            const nonSelectiveRoles = [55, 54, 53, 51, 49, 48, 47, 43, 41, 40, 39, 38];
            if (!nonSelectiveRoles.includes(role.id)) {
              finalPercentage -= 10;
              reasons.push('קנס התאמה חלקית לראיון');
            }
          }

          return {
            ...role,
            matchPercentage: Math.round(Math.max(15, Math.min(99, finalPercentage))),
            reasons: reasons.slice(0, 3)
          };
        } else {
            return null;
        }
      }

      let matchScore = 0;
      let maxPossibleForThisUser = 0;
      let hasMinorDealBreaker = false;
      let hasMajorDealBreaker = false;
      const reasons: string[] = [];

      let positiveComboCount = 0; 
      let negativeAvoidanceCount = 0; 

      // 3. סינון לפי התרשמות מראיון הוסר כדי לאפשר קנס במקום סינון מוחלט

      const fUser = userFitness;
      const fRole = role.fitnessRequired;
      let isFitnessMatch = false;
      if (fUser === FitnessLevel.VERY_HIGH) isFitnessMatch = true;
      else if (fUser === FitnessLevel.HIGH) isFitnessMatch = (fRole >= 2);
      else if (fUser === FitnessLevel.MEDIUM) isFitnessMatch = (fRole >= 3);
      else if (fUser === FitnessLevel.LOW) isFitnessMatch = (fRole === 4);

      if (isTrack4) {
        // 1. סינון קשיח
        // הוספנו את 4 (שלדג) פנימה. שלדג לא יופיע במסלול 4!
        const excludedRoles = [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 14, 15, 16, 17, 22, 57];
        if (excludedRoles.includes(role.id)) return null;

        // עונשי דפ"ר קשיחים (חוסמים חובלים, צוללות וכו')
        if (answers.dapr <= 70 && [6, 12].includes(role.id)) return null; 
        const tierBRoles = [21, 26, 27, 56, 33, 58, 34, 42, 46];
        if (answers.dapr <= 60 && ([7, ...tierBRoles]).includes(role.id)) return null; 

        // 2. בדיקת כושר (נקודת פתיחה 40%)
        let finalPercentage = 40;
        const reasons: string[] = [];

        let isFitnessMatchTrack4 = false;
        if (fUser <= 2) isFitnessMatchTrack4 = true;
        else if (fUser === 3) isFitnessMatchTrack4 = (fRole >= 2);
        else if (fUser === 4) isFitnessMatchTrack4 = (fRole >= 3);

        if (!isFitnessMatchTrack4) return null;

        // עונשי כושר
        if (fUser === 4 && fRole === 3) finalPercentage -= 8;
        else if (fUser === 3 && fRole === 2) finalPercentage -= 8;
        else if (fUser === 2 && fRole === 1) finalPercentage -= 8;

        // בונוס כושר 2
        const fitness2BonusRoles = [6, 7, 12, 21, 23, 19, 20, 41, 25, 28, 31, 32, 56];
        if (fUser === 2 && fitness2BonusRoles.includes(role.id)) {
          finalPercentage += 8;
          reasons.push('בונוס כושר גופני');
        }

        // 3. בונוס דפ"ר
        const tierA = [6, 7, 12];
        if (tierA.includes(role.id)) {
          if (answers.dapr >= 90) finalPercentage += 8;
          else if (answers.dapr >= 80) finalPercentage += 5;
        } else if (tierBRoles.includes(role.id)) {
          if (answers.dapr >= 90) finalPercentage += 6;
          else if (answers.dapr >= 80) finalPercentage += 3;
        }

        // 4. ציון ראיון
        if (answers.interviewScore === 'high') {
          const highInterviewRoles = [6, 7, 12, 21, 19, 20, 41, 25, 28]; 
          if (highInterviewRoles.includes(role.id)) {
            finalPercentage += 5;
            reasons.push('בונוס התאמה לראיון');
          }
        } else if (answers.interviewScore === 'low') {
          const noInterviewRoles = [55, 54, 53, 51, 49, 48, 47, 43, 41, 40, 39, 38];
          if (!noInterviewRoles.includes(role.id)) {
            finalPercentage -= 10;
          }
        }

        // 5. חישוב שאלות (משקל 65%)
        let qScore = 0;
        let qMax = 0;

        const processStandardTag = (pref: TagPreference | undefined, hasTag: boolean, noPenaltyForMissing = false, noPenaltyForNegative = false, customWeight = 10) => {
          if (!pref) return;
          let weight = customWeight;
          let multiplier = 0;
          if (pref === 'very_yes') multiplier = 1;
          else if (pref === 'yes') multiplier = 0.5;
          else if (pref === 'no') multiplier = -1.5;
          else if (pref === 'very_no') multiplier = -3;

          if (!hasTag && multiplier > 0 && noPenaltyForMissing) return;
          if (hasTag && multiplier < 0 && noPenaltyForNegative) return;

          qMax += weight;

          if (pref === 'neutral') {
            qScore += weight * 0.2;
          } else if (hasTag) {
            if (multiplier > 0) qScore += weight * multiplier;
            else if (multiplier < 0 && !noPenaltyForNegative) qScore += weight * multiplier;
          } else {
            if (multiplier < 0) qScore += weight * (pref === 'very_no' ? 1 : 0.5);
            else if (multiplier > 0 && !noPenaltyForMissing) qScore -= weight * multiplier * 1.5;
          }
        };

        // שאלה 1 - גיבושים קשיח
        const physPref = answers.tags['physical_tests'];
        const physRoles = [6, 7, 12, 21, 19, 20, 41, 25, 28]; 
        if (physPref === 'very_no' || physPref === 'no') {
            if (physRoles.includes(role.id)) return null;
        } else if (physPref === 'very_yes' || physPref === 'yes') {
            if (physRoles.includes(role.id)) qScore += 12 * (physPref === 'very_yes' ? 1 : 0.5);
            qMax += 12; 
        }

        // === התיקון החדש לשאלה 2: עונשים רצחניים לתג לוחמה ('a') ===
        const aPref = answers.tags['a'];
        const hasA = role.tags.toLowerCase().includes('a');
        
        if (aPref === 'very_yes' && !hasA) {
             finalPercentage -= 35; // התרסקות מוחלטת ליחידות בלי שטח כמו קורל
        } else if (aPref === 'yes' && !hasA) {
             finalPercentage -= 15;
        } else if (aPref === 'very_no' && hasA) {
             return null; // מי שלא רוצה שטח לא יקבל יחידות שטח בכלל
        } else if (aPref === 'no' && hasA) {
             finalPercentage -= 25; // עונש כבד מאוד
        }
        processStandardTag(answers.tags['a'], hasA, false, false, 15);
        // ========================================================

        // שאר השאלות
        processStandardTag(answers.tags['s'], role.tags.toLowerCase().includes('s'));
        processStandardTag(answers.tags['t'], role.tags.toLowerCase().includes('t'));
        processStandardTag(answers.tags['c'], role.tags.toLowerCase().includes('c'));
        processStandardTag(answers.tags['h'], role.tags.toLowerCase().includes('h'), true, false);
        processStandardTag(answers.tags['l'], role.tags.toLowerCase().includes('l'), true, false);
        processStandardTag(answers.tags['g'], role.tags.toLowerCase().includes('g'));
        processStandardTag(answers.tags['d'], role.tags.toLowerCase().includes('d'));

        // שאלה 10 - מעורב קשיח
        const fPref = answers.tags['f'];
        if ((fPref === 'no' || fPref === 'very_no') && role.tags.toLowerCase().includes('f')) return null;
        processStandardTag(fPref, role.tags.toLowerCase().includes('f'));

        // שאלה 11 - ים קשיח
        const seaPref = answers.tags['sea'];
        if ((seaPref === 'no' || seaPref === 'very_no') && role.type.includes('חיל הים')) return null;
        processStandardTag(seaPref, role.type.includes('חיל הים'));

        // שאלה 12 - אוויר
        const airPref = answers.tags['air'];
        if (airPref) {
           let multiplier = 0;
           if (airPref === 'very_yes') multiplier = 1;
           else if (airPref === 'yes') multiplier = 0.5;
           else if (airPref === 'no') multiplier = -1.5;
           else if (airPref === 'very_no') multiplier = -3;
           
           qMax += 10;
           if (airPref === 'neutral') qScore += 2;
           else if (role.type.includes('חיל האוויר')) qScore += 10 * multiplier;
           else if (multiplier < 0) qScore += 5;
        }

        // שאלה 13 - הגנה מול התקפה קשיח
        const defPref = answers.tags['defense_vs_attack'];
        const defRoles = [31, 32, 29, 55, 54, 53, 51, 34]; // ילת"ם, סנפיר, חוד ימי, מעברים, גבולות, פלח"ץ, הגנ"א, ל"א
        if (defPref) {
            if (defPref === 'very_no' || defPref === 'no') {
                if (defRoles.includes(role.id)) return null;
            } else if (defPref === 'very_yes' || defPref === 'yes') {
                qMax += 15;
                if (defRoles.includes(role.id)) qScore += 15 * (defPref === 'very_yes' ? 1 : 0.5);
                else qScore -= 15 * (defPref === 'very_yes' ? 1 : 0.5);
            }
        }

        // חישוב המשקל הסופי של השאלות לתוך הציון
        if (qMax > 0) {
          const questionsPercentage = ((qScore + qMax) / (2 * qMax)) * 65;
          finalPercentage += questionsPercentage;
        }

        finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

        return {
          ...role,
          matchPercentage: finalPercentage,
          reasons: reasons.slice(0, 3)
        };
      }

      if (isTrack6) {
        // 1. סינון קשיח - תפקידים רלוונטיים למסלול (הוסרה יחידת הניוד 444 - מזהה 45)
        const allowedRoles = [29, 30, 58, 31, 32, 33, 34, 35, 36, 42, 46, 48, 49, 51, 53, 54, 55];
        if (!allowedRoles.includes(role.id)) return null;

        // חסימת דפ"ר קשיחה (מוודא שמי שלא עומד ברף הדפ"ר של התפקיד לא יקבל אותו, גם אם עבר פרופיל)
        if (answers.dapr < role.minDapr) return null;

        let finalPercentage = 30; // ציון בסיס התחלתי
        const reasons: string[] = [];

        // 2. עונשי כושר
        let isFitnessMatchTrack6 = false;
        if (fUser <= 2) isFitnessMatchTrack6 = true;
        else if (fUser === 3) isFitnessMatchTrack6 = (fRole >= 2);
        else if (fUser === 4) isFitnessMatchTrack6 = (fRole >= 3);

        if (!isFitnessMatchTrack6) return null;

        if (fUser === 4 && fRole === 3) finalPercentage -= 8;
        else if (fUser === 3 && fRole === 2) finalPercentage -= 8;

        // בונוס כושר (שריון, ילת"ם, סנפיר)
        const fitnessBonusRoles = [48, 29, 30];
        if (fUser === 1 && fitnessBonusRoles.includes(role.id)) {
            finalPercentage += 10;
            reasons.push('בונוס כושר גופני מצטיין');
        } else if (fUser === 2 && fitnessBonusRoles.includes(role.id)) {
            finalPercentage += 5;
            reasons.push('בונוס כושר גופני');
        }

        // 3. בונוס דפ"ר
        if (answers.dapr >= 90) {
            if ([58, 31, 32].includes(role.id)) finalPercentage += 10; // תצפיתן חמ"ן, מודא"ל, מפעיל ל"א
            else if ([33, 34, 46].includes(role.id)) finalPercentage += 8; // קמ"ט, קשר"ג, לוחם ל"א
        } else if (answers.dapr >= 80) {
            if ([58, 31, 32].includes(role.id)) finalPercentage += 7;
            else if ([33, 34, 46].includes(role.id)) finalPercentage += 5;
        }

        // 4. ציון ראיון
        if (answers.interviewScore === 'high') {
            if ([48, 33].includes(role.id)) { // שריון, קמ"ט
                finalPercentage += 5;
                reasons.push('בונוס התאמה לראיון');
            }
        } else if (answers.interviewScore === 'low') {
            if ([29, 30, 33, 34, 35, 36].includes(role.id)) { // ילת"ם, סנפיר, קמ"ט, קשר"ג, בז, מטאור
                finalPercentage -= 10;
                reasons.push('קנס התאמה חלקית לראיון');
            }
        }

        // 5. שקלול השאלות (משקל 65%)
        let qScore = 0;
        let qMax = 0;

        const processStandardTag = (pref: TagPreference | undefined, hasTag: boolean, noPenaltyForMissing = false, noPenaltyForNegative = false, customWeight = 10) => {
          if (!pref) return;
          let weight = customWeight;
          let multiplier = 0;
          if (pref === 'very_yes') multiplier = 1;
          else if (pref === 'yes') multiplier = 0.5;
          else if (pref === 'no') multiplier = -1.5;
          else if (pref === 'very_no') multiplier = -3;

          if (!hasTag && multiplier > 0 && noPenaltyForMissing) return;
          if (hasTag && multiplier < 0 && noPenaltyForNegative) return;

          qMax += weight;

          if (pref === 'neutral') {
            qScore += weight * 0.2;
          } else if (hasTag) {
            if (multiplier > 0) qScore += weight * multiplier;
            else if (multiplier < 0 && !noPenaltyForNegative) qScore += weight * multiplier;
          } else {
            if (multiplier < 0) qScore += weight * (pref === 'very_no' ? 1 : 0.5);
            else if (multiplier > 0 && !noPenaltyForMissing) qScore -= weight * multiplier * 1.5;
          }
        };

        // שאלה 1 - גיבושים קשיח (הוסרה יחידת הניוד 444)
        const physPref = answers.tags['physical_tests'];
        const gibushRoles = [42, 29, 30, 35, 36, 46]; // חוד ימי, ילת"ם, סנפיר, בז, מטאור, לוחם ל"א
        if (physPref === 'very_yes' || physPref === 'yes') {
            if (gibushRoles.includes(role.id)) {
                qScore += 15 * (physPref === 'very_yes' ? 1 : 0.5);
            }
            qMax += 15;
        } else if (physPref === 'very_no' || physPref === 'no') {
            if (gibushRoles.includes(role.id)) return null; // חוסם מי שלא מעוניין בגיבוש
        }

        // שאלה 2 - עונשי לוחמה ושטח
        const aPref = answers.tags['a'];
        const hasA = role.tags.toLowerCase().includes('a');
        
        if (aPref === 'very_yes' && !hasA) finalPercentage -= 35; // התרסקות מוחלטת
        else if (aPref === 'yes' && !hasA) finalPercentage -= 15;
        else if (aPref === 'very_no' && hasA) return null; // חוסם
        else if (aPref === 'no' && hasA) finalPercentage -= 25; // עונש כבד מאוד
        processStandardTag(answers.tags['a'], hasA, false, false, 15);

        // שאר השאלות (3 עד 9)
        processStandardTag(answers.tags['s'], role.tags.toLowerCase().includes('s'));
        processStandardTag(answers.tags['t'], role.tags.toLowerCase().includes('t'));
        processStandardTag(answers.tags['c'], role.tags.toLowerCase().includes('c'));
        processStandardTag(answers.tags['h'], role.tags.toLowerCase().includes('h'), true, false);
        processStandardTag(answers.tags['l'], role.tags.toLowerCase().includes('l'), true, false);
        processStandardTag(answers.tags['g'], role.tags.toLowerCase().includes('g'));
        processStandardTag(answers.tags['d'], role.tags.toLowerCase().includes('d'));

        // שאלה 10 - מעורב קשיח
        const fPref = answers.tags['f'];
        if ((fPref === 'no' || fPref === 'very_no') && role.tags.toLowerCase().includes('f')) return null;
        processStandardTag(fPref, role.tags.toLowerCase().includes('f'));

        // שאלה 11 - ים קשיח
        const seaPref = answers.tags['sea'];
        if ((seaPref === 'no' || seaPref === 'very_no') && role.type.includes('חיל הים')) return null;
        processStandardTag(seaPref, role.type.includes('חיל הים'));

        // שאלה 12 - אוויר
        const airPref = answers.tags['air'];
        if (airPref) {
           let multiplier = 0;
           if (airPref === 'very_yes') multiplier = 1;
           else if (airPref === 'yes') multiplier = 0.5;
           else if (airPref === 'no') multiplier = -1.5;
           else if (airPref === 'very_no') multiplier = -3;
           
           qMax += 10;
           if (airPref === 'neutral') qScore += 2;
           else if (role.type.includes('חיל האוויר')) qScore += 10 * multiplier;
           else if (multiplier < 0) qScore += 5;
        }

        // שאלה 13 - הגנה מול התקפה קשיח
        const defPref = answers.tags['defense_vs_attack'];
        const defRoles = [29, 30, 42, 55, 54, 53, 51, 46, 31, 32]; // כולל ל"א ומודא"ל
        if (defPref) {
            if (defPref === 'very_no' || defPref === 'no') {
                if (defRoles.includes(role.id)) finalPercentage -= 25; // קנס כבד
            } else if (defPref === 'very_yes' || defPref === 'yes') {
                qMax += 15;
                if (defRoles.includes(role.id)) qScore += 15 * (defPref === 'very_yes' ? 1 : 0.5);
                else qScore -= 15 * (defPref === 'very_yes' ? 1 : 0.5); // מוריד למי שאינו יחידת הגנה
            }
        }

        // חישוב המשקל הסופי 65% לשאלות
        if (qMax > 0) {
          const questionsPercentage = ((qScore + qMax) / (2 * qMax)) * 65;
          finalPercentage += questionsPercentage;
        }

        finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

        return {
          ...role,
          matchPercentage: finalPercentage,
          reasons: reasons.slice(0, 3)
        };
      }

      if (isTrack7) {
        // 1. סינון קשיח - תפקידים רלוונטיים לנשים במסלול לוחמת
        const allowedRoles = [1, 12, 21, 26, 27, 28, 29, 30, 58, 31, 32, 44, 33, 34, 36, 42, 43, 46, 52, 49, 51, 53, 54, 55];
        if (!allowedRoles.includes(role.id)) return null;

        // חסימת דפ"ר קשיחה
        if (answers.dapr < role.minDapr) return null;

        let finalPercentage = 30; // עוגן
        const reasons: string[] = [];

        // 2. עונשי כושר
        let isFitnessMatchTrack7 = false;
        if (fUser <= 2) isFitnessMatchTrack7 = true;
        else if (fUser === 3) isFitnessMatchTrack7 = (fRole >= 2);
        else if (fUser === 4) isFitnessMatchTrack7 = (fRole >= 3);

        if (!isFitnessMatchTrack7) return null;

        if (fUser === 4 && fRole === 3) finalPercentage -= 10;
        else if (fUser === 3 && fRole === 2) finalPercentage -= 12;

        // בונוס כושר
        if (fUser === 1) {
            if ([1, 12, 21, 28, 29, 30, 33, 34, 36, 42, 43, 52, 54].includes(role.id)) {
                finalPercentage += 10;
                reasons.push('בונוס כושר גופני מצטיין');
            } else if ([26, 27, 58, 31, 32, 44, 46, 49, 51, 53, 55].includes(role.id)) {
                finalPercentage += 5;
            }
        } else if (fUser === 2) {
            if ([1, 21, 28, 29, 30, 33, 34, 36, 42, 43, 52, 54].includes(role.id)) {
                finalPercentage += 6;
                reasons.push('בונוס כושר גופני');
            } else if ([26, 27, 58, 31, 32, 44, 46, 49, 51, 53, 55].includes(role.id)) {
                finalPercentage += 2;
            }
        }

        // 3. בונוס דפ"ר
        if (answers.dapr >= 90) {
            if ([1, 12, 21, 26, 27, 58, 31, 32].includes(role.id)) finalPercentage += 10;
            else if ([33, 34, 46].includes(role.id)) finalPercentage += 8;
        } else if (answers.dapr >= 80) {
            if ([1, 12, 21, 26, 27, 58, 31, 32].includes(role.id)) finalPercentage += 7;
            else if ([33, 34, 46].includes(role.id)) finalPercentage += 5;
        }

        // 4. ציון ראיון
        if (answers.interviewScore === 'high') {
            finalPercentage += 5;
            reasons.push('בונוס התאמה לראיון');
        } else if (answers.interviewScore === 'low') {
            // הוסר בז מהקנס מכיוון שאינו קיים במסלול
            if ([29, 30, 33, 34, 36].includes(role.id)) { 
                finalPercentage -= 10;
                reasons.push('קנס התאמה חלקית לראיון');
            }
        }

        // 5. שקלול השאלות (משקל 65%)
        let qScore = 0;
        let qMax = 0;

        const processStandardTag = (pref: TagPreference | undefined, hasTag: boolean, noPenaltyForMissing = false, noPenaltyForNegative = false, customWeight = 10) => {
          if (!pref) return;
          let weight = customWeight;
          let multiplier = 0;
          if (pref === 'very_yes') multiplier = 1;
          else if (pref === 'yes') multiplier = 0.5;
          else if (pref === 'no') multiplier = -1.5;
          else if (pref === 'very_no') multiplier = -3;

          if (!hasTag && multiplier > 0 && noPenaltyForMissing) return;
          if (hasTag && multiplier < 0 && noPenaltyForNegative) return;

          qMax += weight;

          if (pref === 'neutral') {
            qScore += weight * 0.2;
          } else if (hasTag) {
            if (multiplier > 0) qScore += weight * multiplier;
            else if (multiplier < 0 && !noPenaltyForNegative) qScore += weight * multiplier;
          } else {
            if (multiplier < 0) qScore += weight * (pref === 'very_no' ? 1 : 0.5);
            else if (multiplier > 0 && !noPenaltyForMissing) qScore -= weight * multiplier * 1.5;
          }
        };

        // שאלה 1 - גיבושים קשיח (נשים)
        const physPref = answers.tags['physical_tests'];
        const gibushRoles = [1, 21, 26, 27, 28, 29, 30, 36, 42]; 
        if (physPref === 'very_yes' || physPref === 'yes') {
            if (gibushRoles.includes(role.id)) {
                qScore += 15 * (physPref === 'very_yes' ? 1 : 0.5);
            }
            qMax += 15;
        } else if (physPref === 'very_no' || physPref === 'no') {
            if (gibushRoles.includes(role.id)) return null; // חוסם מי שלא מעוניינת בגיבוש
        }

        // שאלה 2 - עונשי לוחמה ושטח
        const aPref = answers.tags['a'];
        const hasA = role.tags.toLowerCase().includes('a');
        if (aPref === 'very_yes' && !hasA) finalPercentage -= 35; // התרסקות לתפקידי קרון
        else if (aPref === 'yes' && !hasA) finalPercentage -= 15;
        else if (aPref === 'very_no' && hasA) return null; // חוסם חי"ר למי שלא רוצה
        else if (aPref === 'no' && hasA) finalPercentage -= 25; 
        processStandardTag(answers.tags['a'], hasA, false, false, 15);

        // שאר השאלות (3 עד 9)
        processStandardTag(answers.tags['s'], role.tags.toLowerCase().includes('s'));
        processStandardTag(answers.tags['t'], role.tags.toLowerCase().includes('t'));
        processStandardTag(answers.tags['c'], role.tags.toLowerCase().includes('c'));
        processStandardTag(answers.tags['h'], role.tags.toLowerCase().includes('h'), true, false);
        processStandardTag(answers.tags['l'], role.tags.toLowerCase().includes('l'), true, false);
        processStandardTag(answers.tags['g'], role.tags.toLowerCase().includes('g'));
        processStandardTag(answers.tags['d'], role.tags.toLowerCase().includes('d'));

        // שאלה 10 - ים קשיח
        const seaPref = answers.tags['sea'];
        if ((seaPref === 'no' || seaPref === 'very_no') && role.type.includes('חיל הים')) return null;
        processStandardTag(seaPref, role.type.includes('חיל הים'));

        // שאלה 11 - אוויר
        const airPref = answers.tags['air'];
        if (airPref) {
           let multiplier = 0;
           if (airPref === 'very_yes') multiplier = 1;
           else if (airPref === 'yes') multiplier = 0.5;
           else if (airPref === 'no') multiplier = -1.5;
           else if (airPref === 'very_no') multiplier = -3;
           
           qMax += 10;
           if (airPref === 'neutral') qScore += 2;
           else if (role.type.includes('חיל האוויר')) qScore += 10 * multiplier;
           else if (multiplier < 0) qScore += 5;
        }

        // שאלה 12 - הגנה מול התקפה
        const defPref = answers.tags['defense_vs_attack'];
        const defRoles = [29, 30, 42, 55, 54, 53, 51, 46]; 
        if (defPref) {
            if (defPref === 'very_no' || defPref === 'no') {
                if (defRoles.includes(role.id)) finalPercentage -= 25; // קנס כבד למערך ההגנה
            } else if (defPref === 'very_yes' || defPref === 'yes') {
                qMax += 15;
                if (defRoles.includes(role.id)) qScore += 15 * (defPref === 'very_yes' ? 1 : 0.5);
                else qScore -= 15 * (defPref === 'very_yes' ? 1 : 0.5);
            }
        }

        // חישוב המשקל הסופי 65% לשאלות
        if (qMax > 0) {
          const questionsPercentage = ((qScore + qMax) / (2 * qMax)) * 65;
          finalPercentage += questionsPercentage;
        }

        finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

        return {
          ...role,
          matchPercentage: finalPercentage,
          reasons: reasons.slice(0, 3)
        };
      }

      if (isTrack5) {
        // 1. סינון קשיח ליחידות רלוונטיות בלבד
        const allowedRoles = [37, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 52, 49, 51, 53, 54, 55];
        if (!allowedRoles.includes(role.id)) return null;

        // נקודת פתיחה: 30% (משאיר מקום נכון לבונוסים ושאלות)
        let finalPercentage = 30;
        const reasons: string[] = [];

        // 2. בדיקת כושר (ציון פוסל)
        let isFitnessMatchTrack5 = false;
        if (fUser <= 2) isFitnessMatchTrack5 = true;
        else if (fUser === 3) isFitnessMatchTrack5 = (fRole >= 2);
        else if (fUser === 4) isFitnessMatchTrack5 = (fRole >= 3);

        if (!isFitnessMatchTrack5) return null;

        // 3. עונשים ובונוסים של כושר
        if (fUser === 4 && fRole === 3) finalPercentage -= 8;
        else if (fUser === 3 && fRole === 2) finalPercentage -= 8;

        const fitnessBonusPenaltyGroup = [37, 38, 39, 40, 41, 47, 48];
        if (fUser === 4 && fitnessBonusPenaltyGroup.includes(role.id)) {
             // עונש ספציפי של מסלול 5 לקבוצה הזו (בלי לכפול עונש אם כבר ירד קודם)
             if (fRole !== 3) finalPercentage -= 8; 
        }

        if (fUser === 2 && fitnessBonusPenaltyGroup.includes(role.id)) {
            finalPercentage += 8;
            reasons.push('בונוס כושר גופני');
        }

        // 4. ציון ראיון
        if (answers.interviewScore === 'high') {
          const highInterviewRoles = [37, 38, 39, 40, 41]; 
          if (highInterviewRoles.includes(role.id)) {
            finalPercentage += 5;
            reasons.push('בונוס התאמה לראיון');
          }
        } else if (answers.interviewScore === 'low') {
          const noInterviewRoles = [55, 54, 53, 51, 49, 48, 47, 43, 41, 40, 39, 38, 52];
          if (!noInterviewRoles.includes(role.id)) {
            finalPercentage -= 10;
          }
        }

        // 5. שקלול השאלות (משקל 65%)
        let qScore = 0;
        let qMax = 0;

        const processStandardTag = (pref: TagPreference | undefined, hasTag: boolean, noPenaltyForMissing = false, noPenaltyForNegative = false, customWeight = 10) => {
          if (!pref) return;
          let weight = customWeight;
          let multiplier = 0;
          if (pref === 'very_yes') multiplier = 1;
          else if (pref === 'yes') multiplier = 0.5;
          else if (pref === 'no') multiplier = -1.5;
          else if (pref === 'very_no') multiplier = -3;

          if (!hasTag && multiplier > 0 && noPenaltyForMissing) return;
          if (hasTag && multiplier < 0 && noPenaltyForNegative) return;

          qMax += weight;

          if (pref === 'neutral') {
            qScore += weight * 0.2;
          } else if (hasTag) {
            if (multiplier > 0) qScore += weight * multiplier;
            else if (multiplier < 0 && !noPenaltyForNegative) qScore += weight * multiplier;
          } else {
            if (multiplier < 0) qScore += weight * (pref === 'very_no' ? 1 : 0.5);
            else if (multiplier > 0 && !noPenaltyForMissing) qScore -= weight * multiplier * 1.5;
          }
        };

        // שאלה 1 - גיבושים קשיח (רק על צנחנים מזהה 37)
        const physPref = answers.tags['physical_tests'];
        if (physPref === 'very_no' || physPref === 'no') {
            if (role.id === 37) return null; // חוסם צנחנים
        } else if (physPref === 'very_yes' || physPref === 'yes') {
            if (role.id === 37) {
                qScore += 15 * (physPref === 'very_yes' ? 1 : 0.5);
            }
            qMax += 15; // רק אם ענה כן, זה ישפיע מתמטית על צנחנים
        }

        // שאלה 2 - עונשים רצחניים לתג לוחמה ('a')
        const aPref = answers.tags['a'];
        const hasA = role.tags.toLowerCase().includes('a');
        
        if (aPref === 'very_yes' && !hasA) {
             finalPercentage -= 35; // התרסקות לתפקידים בלי שטח
        } else if (aPref === 'yes' && !hasA) {
             finalPercentage -= 15;
        } else if (aPref === 'very_no' && hasA) {
             return null; // מי שלא רוצה שטח לא יקבל חי"ר ויחידות שדה
        } else if (aPref === 'no' && hasA) {
             finalPercentage -= 25; // עונש כבד מאוד
        }
        processStandardTag(answers.tags['a'], hasA, false, false, 15);

        // שאר השאלות (3 עד 9)
        processStandardTag(answers.tags['s'], role.tags.toLowerCase().includes('s'));
        processStandardTag(answers.tags['t'], role.tags.toLowerCase().includes('t'));
        processStandardTag(answers.tags['c'], role.tags.toLowerCase().includes('c'));
        processStandardTag(answers.tags['h'], role.tags.toLowerCase().includes('h'), true, false);
        processStandardTag(answers.tags['l'], role.tags.toLowerCase().includes('l'), true, false);
        processStandardTag(answers.tags['g'], role.tags.toLowerCase().includes('g'));
        processStandardTag(answers.tags['d'], role.tags.toLowerCase().includes('d'));

        // שאלה 10 - מעורב קשיח
        const fPref = answers.tags['f'];
        if ((fPref === 'no' || fPref === 'very_no') && role.tags.toLowerCase().includes('f')) return null;
        processStandardTag(fPref, role.tags.toLowerCase().includes('f'));

        // שאלה 11 - ים קשיח
        const seaPref = answers.tags['sea'];
        if ((seaPref === 'no' || seaPref === 'very_no') && role.type.includes('חיל הים')) return null;
        processStandardTag(seaPref, role.type.includes('חיל הים'));

        // שאלה 12 - הגנה מול התקפה
        const defPref = answers.tags['defense_vs_attack'];
        const defRoles = [42, 55, 54, 53, 51, 46]; // חוד ימי, מעברים, גבולות, פלח"ץ, הגנ"א, ל"א
        if (defPref) {
            if (defPref === 'very_no' || defPref === 'no') {
                if (defRoles.includes(role.id)) finalPercentage -= 25; // עונש כבד מאוד לתפקידי הגנה
            } else if (defPref === 'very_yes' || defPref === 'yes') {
                qMax += 15;
                if (defRoles.includes(role.id)) qScore += 15 * (defPref === 'very_yes' ? 1 : 0.5);
                else qScore -= 15 * (defPref === 'very_yes' ? 1 : 0.5); // מוריד למי שאינו יחידת הגנה
            }
        }

        // חישוב סופי של השאלות למשקל 65%
        if (qMax > 0) {
          const questionsPercentage = ((qScore + qMax) / (2 * qMax)) * 65;
          finalPercentage += questionsPercentage;
        }

        finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

        return {
          ...role,
          matchPercentage: finalPercentage,
          reasons: reasons.slice(0, 3)
        };
      }

      if (isTrack3) {
        const track3RoleIds = [1, 2, 5, 6, 11, 15, 22, 25, 28, 26, 27, 30, 29, 58, 33, 42, 46, 43];
        if (!track3RoleIds.includes(role.id)) return null;

        let finalPercentage = 50;
        const reasons: string[] = [];

        let effectiveProfile = answers.profile;
        if (answers.profile === 97 && !answers.eligibleForYomSayarot) {
          effectiveProfile = 82;
        } else if (answers.profile === 82 && answers.eligibleForYomSayarot) {
          effectiveProfile = 97;
        }

        if (role.id === 1) {
          if (answers.profile < role.minProfile || answers.dapr < role.minDapr) return null;
        } else {
          if (effectiveProfile < role.minProfile || answers.dapr < role.minDapr) return null;
        }

        // Fitness Bonus
        if (fUser === FitnessLevel.VERY_HIGH) {
          if ([2, 5, 6, 11, 15, 22].includes(role.id)) finalPercentage += 10;
          else if ([1, 25, 28, 30, 29, 42, 43].includes(role.id)) finalPercentage += 5;
          else if ([26, 27, 58, 33, 46].includes(role.id)) finalPercentage += 2;
        }

        // DAPR Bonus/Penalty
        if ([1, 6].includes(role.id)) { // Tier A
          if (answers.dapr >= 90) finalPercentage += 12;
          else if (answers.dapr >= 80) finalPercentage += 6;
          else if (answers.dapr === 70) finalPercentage -= 4;
          else if (answers.dapr <= 60) finalPercentage -= 12;
        } else if ([2, 5, 11, 26, 27, 58, 33, 46].includes(role.id)) { // Tier B
          if (answers.dapr >= 90) finalPercentage += 8;
          else if (answers.dapr >= 80) finalPercentage += 4;
        }

        // Interview Score
        if (answers.interviewScore === 'high') {
          if ([1, 2, 5, 6].includes(role.id)) {
            finalPercentage += 2;
            reasons.push('בונוס התאמה גבוהה לראיון');
          }
        } else if (answers.interviewScore === 'low') {
          if (![55, 54, 53, 51, 49, 43].includes(role.id)) {
            finalPercentage -= 10;
            reasons.push('קנס התאמה חלקית לראיון');
          }
        }

        // Questions
        const elitePref = answers.tags['elite_aspiration'];
        if (elitePref) {
           const mult = elitePref === 'very_yes' ? 1 : (elitePref === 'yes' ? 0.5 : (elitePref === 'no' ? -1 : (elitePref === 'very_no' ? -2 : 0)));
           if (mult > 0) {
             if ([1, 2, 5, 6, 15, 11, 22].includes(role.id)) finalPercentage += 10 * mult;
             else if ([26, 27, 58, 33, 42, 46, 43].includes(role.id)) finalPercentage -= 15 * mult;
           } else if (mult < 0) {
             if ([1, 2, 5, 6, 15, 11, 22].includes(role.id)) finalPercentage += 3 * mult;
           } else finalPercentage += 0.5;
        }

        const topFitnessPref = answers.tags['top_fitness'];
        if (topFitnessPref) {
           const mult = topFitnessPref === 'very_yes' ? 1 : (topFitnessPref === 'yes' ? 0.5 : (topFitnessPref === 'no' ? -1 : (topFitnessPref === 'very_no' ? -2 : 0)));
           if (mult > 0) {
             if ([2, 5].includes(role.id)) finalPercentage += 15 * mult;
             else if ([1, 6, 15, 11, 22].includes(role.id)) finalPercentage += 8 * mult;
           } else if (mult < 0) {
             if ([2, 5].includes(role.id)) finalPercentage += 20 * mult;
             else if ([1, 6, 15, 11, 22].includes(role.id)) finalPercentage += 8 * mult;
           } else finalPercentage += 0.5;
        }

        const sPref = answers.tags['s'];
        if (sPref && role.tags.toLowerCase().includes('s')) {
           const mult = sPref === 'very_yes' ? 1 : (sPref === 'yes' ? 0.5 : (sPref === 'no' ? -1 : (sPref === 'very_no' ? -2 : 0)));
           finalPercentage += 8 * mult;
        } else if (sPref === 'neutral') finalPercentage += 0.5;

        const tPref = answers.tags['t'];
        if (tPref && role.tags.toLowerCase().includes('t')) {
           const mult = tPref === 'very_yes' ? 1 : (tPref === 'yes' ? 0.5 : (tPref === 'no' ? -1 : (tPref === 'very_no' ? -2 : 0)));
           finalPercentage += 8 * mult;
        } else if (tPref === 'neutral') finalPercentage += 0.5;

        const coolPref = answers.tags['cool_headed'];
        if (coolPref) {
           const mult = coolPref === 'very_yes' ? 1 : (coolPref === 'yes' ? 0.5 : (coolPref === 'no' ? -1 : (coolPref === 'very_no' ? -2 : 0)));
           if (mult > 0) {
             if ([1, 2, 5, 6, 11, 15].includes(role.id)) finalPercentage += 8 * mult;
           } else if (mult < 0) {
             if ([1, 2, 5, 6, 11, 15].includes(role.id)) finalPercentage += 16 * mult;
           } else finalPercentage += 0.5;
        }

        const seaPref = answers.tags['sea'];
        if (seaPref && role.type.includes('חיל הים')) {
           const mult = seaPref === 'very_yes' ? 1 : (seaPref === 'yes' ? 0.5 : (seaPref === 'no' ? -1 : (seaPref === 'very_no' ? -2 : 0)));
           finalPercentage += 10 * mult;
        } else if (seaPref === 'neutral') finalPercentage += 0.5;

        const cPref = answers.tags['c'];
        if (cPref) {
           const mult = cPref === 'very_yes' ? 1 : (cPref === 'yes' ? 0.5 : (cPref === 'no' ? -1 : (cPref === 'very_no' ? -2 : 0)));
           if (role.tags.toLowerCase().includes('c')) finalPercentage += 8 * mult;
           if (role.id === 25) { // לוט"ר
             if (mult > 0) finalPercentage += 15 * mult;
             else if (mult < 0) finalPercentage += 20 * mult;
           }
           if (cPref === 'neutral') finalPercentage += 0.5;
        }

        const hPref = answers.tags['h'];
        if (hPref) {
           const mult = hPref === 'very_yes' ? 1 : (hPref === 'yes' ? 0.5 : (hPref === 'no' ? -1 : (hPref === 'very_no' ? -2 : 0)));
           if (role.tags.toLowerCase().includes('h')) {
             finalPercentage += 8 * mult;
           } else if (mult < 0) {
             // Do not penalize if they don't want it and the role doesn't have it
           }
        } else if (hPref === 'neutral') finalPercentage += 0.5;

        const lPref = answers.tags['l'];
        if (lPref) {
           const mult = lPref === 'very_yes' ? 1 : (lPref === 'yes' ? 0.5 : (lPref === 'no' ? -1 : (lPref === 'very_no' ? -2 : 0)));
           if (role.tags.toLowerCase().includes('l')) finalPercentage += 10 * mult;
           if (lPref === 'neutral') finalPercentage += 0.5;
        }

        const gPref = answers.tags['g'];
        if (gPref && role.tags.toLowerCase().includes('g')) {
           const mult = gPref === 'very_yes' ? 1 : (gPref === 'yes' ? 0.5 : (gPref === 'no' ? -1 : (gPref === 'very_no' ? -2 : 0)));
           finalPercentage += 8 * mult;
        } else if (gPref === 'neutral') finalPercentage += 0.5;

        const dPref = answers.tags['d'];
        if (dPref && role.tags.toLowerCase().includes('d')) {
           const mult = dPref === 'very_yes' ? 1 : (dPref === 'yes' ? 0.5 : (dPref === 'no' ? -1 : (dPref === 'very_no' ? -2 : 0)));
           finalPercentage += 10 * mult;
        } else if (dPref === 'neutral') finalPercentage += 0.5;

        const airPref = answers.tags['air'];
        if (airPref) {
           const mult = airPref === 'very_yes' ? 1 : (airPref === 'yes' ? 0.5 : (airPref === 'no' ? -1 : (airPref === 'very_no' ? -2 : 0)));
           if (role.type.includes('חיל האוויר')) {
             if (mult > 0) finalPercentage += 10 * mult;
             else if (mult < 0) finalPercentage += 20 * mult;
           }
           if (airPref === 'neutral') finalPercentage += 0.5;
        }

        const arabPref = answers.tags['arab_pop'];
        if (arabPref) {
           const mult = arabPref === 'very_yes' ? 1 : (arabPref === 'yes' ? 0.5 : (arabPref === 'no' ? -1 : (arabPref === 'very_no' ? -2 : 0)));
           if ([11, 43].includes(role.id)) {
             if (mult > 0) finalPercentage += 12 * mult;
             else if (mult < 0) finalPercentage += 12 * mult;
           }
           if (arabPref === 'neutral') finalPercentage += 0.5;
        }

        const explPref = answers.tags['explosives'];
        if (explPref) {
           const mult = explPref === 'very_yes' ? 1 : (explPref === 'yes' ? 0.5 : (explPref === 'no' ? -1 : (explPref === 'very_no' ? -2 : 0)));
           if (role.id === 15) {
             if (mult > 0) finalPercentage += 20 * mult;
             else if (mult < 0) return null;
           }
           if (explPref === 'neutral') finalPercentage += 0.5;
        }

        const rescuePref = answers.tags['rescue'];
        if (rescuePref) {
           const mult = rescuePref === 'very_yes' ? 1 : (rescuePref === 'yes' ? 0.5 : (rescuePref === 'no' ? -1 : (rescuePref === 'very_no' ? -2 : 0)));
           if (role.id === 5) {
             if (mult > 0) finalPercentage += 20 * mult;
             else if (mult < 0) return null;
           }
           if (rescuePref === 'neutral') finalPercentage += 0.5;
        }

        const animalsPref = answers.tags['animals'];
        if (animalsPref) {
           const mult = animalsPref === 'very_yes' ? 1 : (animalsPref === 'yes' ? 0.5 : (animalsPref === 'no' ? -1 : (animalsPref === 'very_no' ? -2 : 0)));
           if (role.id === 22) {
             if (mult > 0) finalPercentage += 20 * mult;
             else if (mult < 0) return null;
           }
           if (animalsPref === 'neutral') finalPercentage += 0.5;
        }

        const protPref = answers.tags['protection'];
        if (protPref) {
           const mult = protPref === 'very_yes' ? 1 : (protPref === 'yes' ? 0.5 : (protPref === 'no' ? -1 : (protPref === 'very_no' ? -2 : 0)));
           if ([11, 30].includes(role.id)) {
             if (mult > 0) finalPercentage += 20 * mult;
             else if (mult < 0) return null;
           }
           if (protPref === 'neutral') finalPercentage += 0.5;
        }

        finalPercentage = Math.round(Math.max(15, Math.min(99, finalPercentage)));

        return {
          ...role,
          matchPercentage: finalPercentage,
          reasons: reasons.slice(0, 3)
        };
      }

      if (isTrack2) {
        const track2RoleIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 22, 16, 17, 19, 57, 23, 25, 18, 20, 56, 28, 35, 37, 38, 39, 40, 41];
        if (!track2RoleIds.includes(role.id)) return null;
        if (fUser === FitnessLevel.HIGH && fRole === 1) {
          isFitnessMatch = true;
        }
        if (fUser === FitnessLevel.VERY_HIGH && fRole === 1) {
          matchScore += 20;
          maxPossibleForThisUser += 20;
          reasons.push('בונוס כושר גופני');
        }
      }

      if (!isFitnessMatch) return null;

      Object.entries(answers.tags).forEach(([tagKey, userPref]) => {
        if (!userPref) return;
        if (tagKey === 'x') return;

        if (tagKey === 'elite_aspiration') {
          const eliteRoles = [2, 3, 4, 5, 8, 9, 10, 14, 15, 22, 16];
          const penalizedRoles = [28, 56, 35, 40, 41, 20, 18];
          
          let weight = 24;
          maxPossibleForThisUser += weight;
          
          if (userPref === 'very_yes' || userPref === 'yes') {
            const mult = userPref === 'very_yes' ? 1.4 : 0.85;
            if (eliteRoles.includes(role.id)) {
              matchScore += weight * mult;
              reasons.push(TAG_DESCRIPTIONS[tagKey] || 'שאיפה ליחידות עלית');
              positiveComboCount++;
            } else if (penalizedRoles.includes(role.id)) {
              matchScore -= weight * (userPref === 'very_yes' ? 6.0 : 3.0);
              if (userPref === 'very_yes') hasMinorDealBreaker = true;
            } else {
              matchScore -= weight * 0.3;
            }
          } else if (userPref === 'no' || userPref === 'very_no') {
            if (eliteRoles.includes(role.id)) {
              matchScore -= weight * (userPref === 'very_no' ? 1.0 : 0.5); // מוריד משמעותית
            } else if (penalizedRoles.includes(role.id)) {
              matchScore += weight * (userPref === 'very_no' ? 0.8 : 0.4);
              negativeAvoidanceCount++;
            } else {
              matchScore += weight * 0.2;
            }
          } else {
            if (eliteRoles.includes(role.id)) matchScore += weight * 0.2;
            else matchScore += weight * 0.1;
          }
          return;
        }
        
        let hasTag = role.tags.includes(tagKey);
        let hasPowerTag = role.tags.includes(tagKey.toUpperCase());
        
        // Custom tag mappings
        if (tagKey === 'sea') hasTag = role.type.includes('חיל הים');
        if (tagKey === 'air' || tagKey === 'air_force') hasTag = role.type.includes('חיל האוויר');
        if (tagKey === 'cool_headed') {
          hasTag = role.tags.toLowerCase().includes('s') || role.tags.toLowerCase().includes('x');
          hasPowerTag = role.tags.includes('S') || role.tags.includes('X');
        }
        if (tagKey === 'arab_pop') hasTag = [9, 14, 43, 20, 41, 11].includes(role.id); // דובדבן, ימ"ס, מג"ב, סיירת חרוב, כפיר, 504
        if (tagKey === 'explosives') hasTag = [15].includes(role.id); // יהל"ם
        if (tagKey === 'rescue') hasTag = [5, 53].includes(role.id); // 669, פלח"ץ
        if (tagKey === 'tech_innovation') {
          hasTag = role.tags.toLowerCase().includes('t');
          hasPowerTag = role.tags.includes('T');
        }
        if (tagKey === 'animals') hasTag = [22].includes(role.id); // עוקץ
        if (tagKey === 'protection') hasTag = [57, 11].includes(role.id); // אישים, 504
        if (tagKey === 'infantry_affinity') hasTag = [16, 17, 18, 19, 20, 37, 38, 39, 40, 41].includes(role.id);
        if (tagKey === 'remote_vs_close') hasTag = [21, 26, 27, 28, 36, 48, 49, 51, 56, 35].includes(role.id);
        if (tagKey === 'field_op') hasTag = [1, 21, 26, 27, 56, 28, 36, 44, 35, 46, 52].includes(role.id);

        const roleHasFeature = hasTag || hasPowerTag;

        const nicheTags = ['air', 'air_force', 'sea', 'arab_pop', 'explosives', 'rescue', 'animals', 'protection'];
        if (nicheTags.includes(tagKey) && !roleHasFeature) {
          return; // Skip this tag entirely for roles that don't have it, so they aren't penalized or artificially boosted
        }

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
          } else {
            if (tagKey !== 'h') {
              matchScore -= weight * 0.3;
            }
          }
        } 
        else if (userPref === 'yes') {
          if (roleHasFeature) {
            matchScore += weight * 0.85;
            reasons.push(TAG_DESCRIPTIONS[tagKey]);
            positiveComboCount++;
          }
        }
        else if (userPref === 'no') {
          if (roleHasFeature) {
            matchScore -= weight * 3.0; // עונש מוגדל משמעותית
            hasMinorDealBreaker = true;
          } else {
            matchScore += weight * 0.4;
            negativeAvoidanceCount++;
          }
        }
        else if (userPref === 'very_no') {
          if (roleHasFeature) {
            matchScore -= weight * 8.0; // עונש קריטי
            hasMajorDealBreaker = true; 
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
      let finalPercentage = 50 + (rawRatio * 49);

      if (role.rank <= 10 && finalPercentage > 60) {
        finalPercentage += (11 - role.rank) * 1.2;
      }

      // החלת חוסמי התאמה על הציון הסופי
      if (hasMajorDealBreaker) finalPercentage *= 0.4; // הפחתה של 60% מהציון
      else if (hasMinorDealBreaker) finalPercentage *= 0.7; // הפחתה של 30% מהציון
      
      // בונוס דפ"ר ליחידות חכמות (s)
      if (role.tags.toLowerCase().includes('s')) {
        if (answers.dapr === 70) finalPercentage += 1.5;
        else if (answers.dapr === 80) finalPercentage += 3;
        else if (answers.dapr === 90) finalPercentage += 6;
      }

      if (answers.interviewScore === 'high') {
        const eliteRoles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13];
        if (eliteRoles.includes(role.id)) {
          finalPercentage += 2;
          reasons.push('בונוס התאמה גבוהה לראיון');
        }
      } else if (answers.interviewScore === 'medium') {
        if (role.rank <= 34) {
           finalPercentage -= (8 - ((role.rank - 1) * (7 / 33)));
        }
      } else if (answers.interviewScore === 'low') {
        const nonSelectiveRoles = [55, 54, 53, 51, 49, 48, 47, 43, 41, 40, 39, 38];
        if (!nonSelectiveRoles.includes(role.id)) {
          finalPercentage -= 10;
          reasons.push('קנס התאמה חלקית לראיון');
        }
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
    navigate('/');
  };

  const renderMainContent = () => {
    if (view === 'intro') {
      return (
          <div className="text-center py-20 animate-in fade-in duration-700">
            <div className="bg-emerald-500/10 text-emerald-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="22" y2="18"/>
                </svg>
            </div>
            <h2 className="text-5xl font-black mb-6 bg-gradient-to-l from-stone-800 to-stone-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">הדרך ליחידה מתחילה כאן.</h2>
            <p className="text-xl text-stone-600 dark:text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
              מערכת התאמה חכמה המנתחת את הפרופיל האישי שלך ומשלבת נתונים פיזיים עם שאיפות מקצועיות למציאת המסלול המדויק ביותר במערך הלוחמה.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={() => setView('quiz')} className="bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all transform hover:-translate-y-1 active:scale-95">התחל אבחון התאמה</button>
                <button onClick={() => setView('all-roles')} className="bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 hover:border-stone-400 dark:hover:border-slate-500 text-stone-700 dark:text-slate-300 font-bold py-5 px-12 rounded-2xl transition-all shadow-sm">סקירת כלל היחידות</button>
            </div>
            <div className="mt-24 flex justify-center">
                <span className="text-[10px] font-mono text-stone-500 dark:text-slate-600 font-bold tracking-widest uppercase opacity-70">גרסת בטא 1.0.0</span>
            </div>
          </div>
      );
    }

    if (view === 'quiz') return <Quiz onComplete={calculateResults} />;
    if (view === 'results') return <Results results={results} onRestart={() => setView('quiz')} onRoleClick={handleRoleSelect} />;
    if (view === 'all-roles') return <RoleList roles={ROLES_DB} onRoleClick={handleRoleSelect} />;

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] dark:bg-slate-950 text-stone-900 dark:text-slate-100 font-sans pb-24 overflow-x-hidden transition-colors duration-300">
      <ScrollManager />
      <header className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-stone-300 dark:border-slate-800 text-stone-900 dark:text-white p-6 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1.5 cursor-pointer" onClick={() => { navigate('/'); setView('intro'); }}>
              הכוונת
              <svg className="text-emerald-600 dark:text-emerald-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="22" y2="18"/>
              </svg>
            </h1>
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-stone-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-stone-700 dark:text-slate-300">מצב תצוגה</span>
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-emerald-500' : 'bg-stone-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? '-translate-x-6' : '-translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <nav className="flex gap-4">
            <button onClick={() => { navigate('/'); setView('intro'); }} className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">בית</button>
            <button onClick={() => { navigate('/'); setView('all-roles'); }} className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">כל התפקידים</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <Routes>
          <Route path="/" element={renderMainContent()} />
          <Route path="/rolesdetails/:slug" element={<RoleDetailsRoute onBack={() => navigate(-1)} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
