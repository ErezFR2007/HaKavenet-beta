
import { Role, RoleExtendedDetails } from './types';

export const TAG_DESCRIPTIONS: Record<string, string> = {
  'a': 'לוחמה',
  'c': 'פיקוד',
  'l': 'קבע',
  'd': 'מסוכן',
  't': 'טכנולוגי',
  's': 'חכם',
  'f': 'מעורב',
  'o': 'ימי',
  'g': 'צוות קטן',
  'h': 'פרוע',
  'x': 'מסווג',
  'n': 'ללא מיון'
};

export const ROLES_DB: Role[] = [
  { id: 1, name: 'טיס', type: 'חיל האוויר', rank: 1, minProfile: 97, minDapr: 60, tags: 'alTSfGd', fitnessRequired: 2 },
  { id: 2, name: 'סיירת מטכ"ל', type: 'חיל המודיעין', rank: 2, minProfile: 97, minDapr: 50, tags: 'Alsfgxd', fitnessRequired: 1 },
  { id: 3, name: 'שייטת 13', type: 'חיל הים', rank: 3, minProfile: 97, minDapr: 50, tags: 'Alsogxd', fitnessRequired: 1 },
  { id: 4, name: 'שלד"ג', type: 'חיל האוויר', rank: 4, minProfile: 97, minDapr: 50, tags: 'Altsgxd', fitnessRequired: 1 },
  { id: 5, name: 'לוחם 669', type: 'חיל האוויר', rank: 5, minProfile: 97, minDapr: 50, tags: 'Alfgd', fitnessRequired: 1 },
  { id: 6, name: 'חובלים', type: 'חיל הים', note: 'ייעודי לקצונה', rank: 6, minProfile: 82, minDapr: 60, tags: 'cltSfoG', fitnessRequired: 2 },
  { id: 7, name: 'שייטת 7 (צוללות)', type: 'חיל הים', rank: 7, minProfile: 82, minDapr: 60, tags: 'lTSoGx', fitnessRequired: 3 },
  { id: 8, name: 'מגלן', type: 'חיל היבשה', note: 'קומנדו', rank: 8, minProfile: 82, minDapr: 50, tags: 'Altsgd', fitnessRequired: 1 },
  { id: 9, name: 'דובדבן', type: 'חיל היבשה', note: 'קומנדו', rank: 9, minProfile: 82, minDapr: 50, tags: 'Alghxd', fitnessRequired: 1 },
  { id: 10, name: 'אגוז', type: 'חיל היבשה', note: 'קומנדו', rank: 10, minProfile: 82, minDapr: 50, tags: 'Alghxd', fitnessRequired: 1 },
  { id: 11, name: 'לוחם 504', type: 'חיל המודיעין', rank: 11, minProfile: 82, minDapr: 50, tags: 'atSGxd', fitnessRequired: 2 },
  { id: 12, name: 'לוחם קודקוד (קורל)', type: 'חיל האוויר', rank: 12, minProfile: 82, minDapr: 50, tags: 'TSGx', fitnessRequired: 2 },
  { id: 13, name: 'תוכנית ארז', type: 'חיל היבשה', note: 'ייעודי לקצונה', rank: 13, minProfile: 82, minDapr: 50, tags: 'aclGd', fitnessRequired: 2 },
  { id: 14, name: 'ימ"ס', type: 'חיל היבשה', rank: 14, minProfile: 82, minDapr: 30, tags: 'AgHxd', fitnessRequired: 1 },
  { id: 15, name: 'יהל"ם', type: 'חיל היבשה', rank: 15, minProfile: 82, minDapr: 30, tags: 'Atsfd', fitnessRequired: 2 },
  { id: 22, name: 'עוקץ', type: 'חיל היבשה', rank: 16, minProfile: 82, minDapr: 30, tags: 'AlfGd', fitnessRequired: 1 },
  { id: 16, name: 'סיירת צנחנים', type: 'חיל היבשה', rank: 17, minProfile: 82, minDapr: 40, tags: 'Ad', fitnessRequired: 1 },
  { id: 17, name: 'סיירת גולני', type: 'חיל היבשה', rank: 18, minProfile: 82, minDapr: 30, tags: 'AHd', fitnessRequired: 1 },
  { id: 19, name: 'סיירת גבעתי', type: 'חיל היבשה', rank: 19, minProfile: 82, minDapr: 30, tags: 'Ahd', fitnessRequired: 2 },
  { id: 18, name: 'סיירת נח"ל', type: 'חיל היבשה', rank: 20, minProfile: 82, minDapr: 30, tags: 'Ad', fitnessRequired: 2 },
  { id: 20, name: 'סיירת חרוב', type: 'חיל היבשה', rank: 21, minProfile: 82, minDapr: 30, tags: 'AHd', fitnessRequired: 2 },
  { id: 21, name: 'זיק - תותחנים', type: 'חיל היבשה', rank: 22, minProfile: 72, minDapr: 70, tags: 'TSfGx', fitnessRequired: 3 },
  { id: 23, name: 'רפאים', type: 'חיל היבשה', rank: 23, minProfile: 82, minDapr: 40, tags: 'atfg', fitnessRequired: 1 },
  { id: 24, name: 'יחידת הניוד 5515', type: 'חיל היבשה', rank: 24, minProfile: 82, minDapr: 30, tags: 'agxd', fitnessRequired: 2 },
  { id: 25, name: 'לוט"ר', type: 'חיל היבשה', rank: 25, minProfile: 82, minDapr: 50, tags: 'acfg', fitnessRequired: 2 },
  { id: 26, name: 'מיתר - תותחנים', type: 'חיל היבשה', rank: 26, minProfile: 72, minDapr: 50, tags: 'Tsfgx', fitnessRequired: 3 },
  { id: 27, name: 'מורן - תותחנים', type: 'חיל היבשה', rank: 27, minProfile: 72, minDapr: 50, tags: 'Tsfgx', fitnessRequired: 3 },
  { id: 56, name: 'מלא"ר - שריון', type: 'חיל היבשה', rank: 28, minProfile: 82, minDapr: 50, tags: 'aTsfg', fitnessRequired: 2 },
  { id: 28, name: 'רוכ"ש - תותחנים', type: 'חיל היבשה', rank: 29, minProfile: 82, minDapr: 50, tags: 'aTsfgd', fitnessRequired: 2 },
  { id: 29, name: 'ילת"ם', type: 'חיל הים', rank: 30, minProfile: 72, minDapr: 50, tags: 'tfoG', fitnessRequired: 2 },
  { id: 30, name: 'לוחם סנפיר', type: 'חיל הים', rank: 31, minProfile: 72, minDapr: 50, tags: 'foG', fitnessRequired: 2 },
  { id: 31, name: 'מודא"ל (מודיעין אלקטרוני)', type: 'חיל האוויר', rank: 32, minProfile: 72, minDapr: 50, tags: 'TSfGx', fitnessRequired: 3 },
  { id: 32, name: 'מפעיל ל"א', type: 'חיל האוויר', rank: 33, minProfile: 72, minDapr: 50, tags: 'TSfGx', fitnessRequired: 3 },
  { id: 33, name: 'קצין מודיעין טקטי', type: 'חיל המודיעין', note: 'ייעודי לקצונה', rank: 34, minProfile: 72, minDapr: 60, tags: 'cltSfGx', fitnessRequired: 3 },
  { id: 34, name: 'קשר"ג', type: 'חיל התקשוב', note: 'ייעודי לקצונה', rank: 35, minProfile: 72, minDapr: 60, tags: 'cltSfg', fitnessRequired: 3 },
  { id: 35, name: 'בז - שריון', type: 'חיל היבשה', note: 'ייעודי לקצונה', rank: 36, minProfile: 72, minDapr: 50, tags: 'Aclgd', fitnessRequired: 2 },
  { id: 36, name: 'מטאור - תותחנים', type: 'חיל היבשה', note: 'ייעודי לקצונה', rank: 37, minProfile: 82, minDapr: 50, tags: 'tsfgd', fitnessRequired: 2 },
  { id: 37, name: 'צנחנים', type: 'חיל היבשה', note: 'חי"ר', rank: 38, minProfile: 82, minDapr: 40, tags: 'Ad', fitnessRequired: 2 },
  { id: 38, name: 'גולני', type: 'חיל היבשה', note: 'חי"ר', rank: 39, minProfile: 82, minDapr: 30, tags: 'AHdn', fitnessRequired: 2 },
  { id: 39, name: 'גבעתי', type: 'חיל היבשה', note: 'חי"ר', rank: 40, minProfile: 82, minDapr: 30, tags: 'Ahdn', fitnessRequired: 2 },
  { id: 40, name: 'נח"ל', type: 'חיל היבשה', note: 'חי"ר', rank: 41, minProfile: 82, minDapr: 30, tags: 'Adn', fitnessRequired: 2 },
  { id: 41, name: 'כפיר', type: 'חיל היבשה', note: 'חי"ר', rank: 42, minProfile: 82, minDapr: 30, tags: 'AHdn', fitnessRequired: 2 },
  { id: 42, name: 'לוחם חוד ימי', type: 'חיל הים', rank: 43, minProfile: 72, minDapr: 30, tags: 'tfog', fitnessRequired: 3 },
  { id: 43, name: 'מג"ב', type: 'חיל היבשה', rank: 44, minProfile: 82, minDapr: 30, tags: 'afHdn', fitnessRequired: 2 },
  { id: 44, name: 'מנחית סער קדמי', type: 'חיל האוויר', rank: 45, minProfile: 82, minDapr: 50, tags: 'fg', fitnessRequired: 3 },
  { id: 45, name: 'יחידת הניוד 444', type: 'חיל היבשה', rank: 46, minProfile: 82, minDapr: 30, tags: 'gh', fitnessRequired: 3 },
  { id: 46, name: 'לוחמה אלקטרונית', type: 'חיל התקשוב', rank: 47, minProfile: 72, minDapr: 40, tags: 'tfx', fitnessRequired: 4 },
  { id: 47, name: 'הנדסה קרבית', type: 'חיל היבשה', rank: 48, minProfile: 82, minDapr: 40, tags: 'Atdn', fitnessRequired: 3 },
  { id: 48, name: 'שריון', type: 'חיל היבשה', rank: 49, minProfile: 72, minDapr: 40, tags: 'Atdn', fitnessRequired: 3 },
  { id: 49, name: 'תותחנים', type: 'חיל היבשה', rank: 50, minProfile: 72, minDapr: 40, tags: 'tfnf', fitnessRequired: 4 },
  { id: 50, name: 'מסייעת שריון', type: 'חיל היבשה', rank: 51, minProfile: 82, minDapr: 30, tags: 'Adn', fitnessRequired: 2 },
  { id: 51, name: 'הגנה אווירית', type: 'חיל היבשה', rank: 52, minProfile: 72, minDapr: 40, tags: 'Tfnf', fitnessRequired: 4 },
  { id: 52, name: 'איסוף קרבי', type: 'חיל היבשה', rank: 53, minProfile: 72, minDapr: 30, tags: 'tfnf', fitnessRequired: 4 },
  { id: 53, name: 'פלח"ץ (חילוץ והצלה)', type: 'חיל היבשה', rank: 54, minProfile: 72, minDapr: 30, tags: 'fhn', fitnessRequired: 4 },
  { id: 54, name: 'חי"ר גבולות', type: 'חיל היבשה', rank: 55, minProfile: 72, minDapr: 30, tags: 'fhn', fitnessRequired: 3 },
  { id: 55, name: 'לוחמה במעברים', type: 'חיל היבשה', rank: 56, minProfile: 72, minDapr: 30, tags: 'fhn', fitnessRequired: 4 },
];

// מילון נתונים מורחב ליחידות
export const ROLE_EXTENDED_DATA: Record<number, RoleExtendedDetails> = {
  1: {
    description: `המועמדים לקורס הטיס הינם מלש"בים בעלי נתונים אישיים גבוהים. קורס טיס הוא הקורס הכי יוקרתי ונחשק בצה"ל והוא אורך כ-3 שנים. במהלך הקורס מתחלקים ל-3 תפקידים שונים – טייסי מטוסים, טייסי מסוקים, ונווטים ומכוננים. במהלך הקורס עצמו מנופים כ-85-90% מהחניכים. חשוב לדעת שעם סיום הקורס חותמים הבוגרים על 7 שנות שירות קבע.`,
    shortDescription: 'הקורס היוקרתי ביותר בצה"ל המכשיר את לוחמי החוד האוויריים.',
    importantNote: 'בנים שמתמיינים לטיס לא יכולים להתמיין ליחידות אחרות במקביל (פרט למקרים חריגים). חובה לגשת למיון בכל שלב, למעט הגיבוש שעליו ניתן לחתום ויתור.',
    stats: {
      serviceLength: '10 שנים',
      selectionCount: '5',
      teamSize: 'קטן ומובחר'
    },
    selectionPaths: [
      {
        name: 'מסלול איתור קדם צבאי',
        steps: [
          'מיון מקוון (קשב וזריזות)',
          'ירפ"א א\' (פסיכוטכני וסימולטור טיסה)',
          'ירפ"א ב\' (סימולטורים ושאלון 300)',
          'ראיון עם פסיכולוג',
          'גיבוש טיס (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      }
    ],
    trainingProcess: [
      {
        title: 'השלב המכין',
        duration: '6 חודשים',
        description: 'שלב הכולל טירונות 05, לימודי תעופה יסודיים ו-15 טיסות מיון ("צ\'קים") על מטוס ה"סנונית". בשלב זה מודחים כ-50% מהמתמודדים.'
      },
      {
        title: 'השלב הבסיסי',
        duration: '6 חודשים',
        description: 'שלב הכולל אימוני הישרדות, מילוט, ניווט וצניחה, לצד לימודים אקדמיים באוניברסיטת בן גוריון. בסוף השלב נערכים "צ\'קים" נוספים לחלוקה למגמות.'
      },
      {
        title: 'השלב הראשוני',
        duration: '6 חודשים',
        description: 'החניכים מתפצלים למגמות (קרב, מסוקים, תובלה, נווטים) ומתחילים ללמוד את יסודות ההטסה בכלי הטיס הספציפיים למגמה שלהם.'
      },
      {
        title: 'שנת ההשכלה',
        duration: '12 חודשים',
        description: 'שנת לימודים אינטנסיבית באוניברסיטת בן גוריון לתואר ראשון (מתמטיקה ומדעי המחשב, ניהול מערכות מידע, או פוליטיקה וממשל).'
      },
      {
        title: 'השלב המתקדם',
        duration: '6 חודשים',
        description: 'השלב המסכם בו רוכשים מיומנויות הטסה מתקדמות ומבצעיות. בסיומו מקבלים דרגת סגן, כנפי טיס ותואר ראשון.'
      }
    ]
  },
  2: {
    description: `סיירת מטכ"ל ("היחידה") היא יחידת העילית של אגף המודיעין ונחשבת לאחת היחידות הטובות והיוקרתיות בעולם. היחידה משמשת כזרוע האסטרטגית של צה"ל ומתמחה בביצוע משימות מודיעין מיוחדות בעומק שטח האויב, לוחמה בטרור וחילוץ בני ערובה. פעילות היחידה חשאית כמעט לחלוטין, והלוחמים בה נדרשים לשילוב נדיר של כושר גופני עילאי, אינטליגנציה גבוהה, יצירתיות, קור רוח, ויכולת אלתור במצבי קיצון. היחידה מאומנת בכל סוגי הלחימה ואף מוסמכת כיחידת השתלטות. מסלול ההכשרה נמשך כ-20 חודשים (שנה ושמונה חודשים) והוא מהתובעניים בצה"ל ברמה הפיזית. סיירת מטכ"ל זכתה לתהילה בין לאומית בזכות פעולות רבות אשר חלקן התפרסמו ורובן נשארו מאחורי הצללים.`,
    shortDescription: 'יחידת העילית של אגף המודיעין למבצעים מיוחדים בעומק האויב.',
    stats: {
      serviceLength: '5 שנים ו-8 חודשים',
      selectionCount: '2',
      teamSize: 'צוות קטן'
    },
    selectionPaths: [
      {
        name: 'דרך יום סיירות',
        steps: [
          'יום סיירות (תוצאת מטכ"ל/שלד"ג)',
          'גיבוש מטכ"ל/שלד"ג בתוצאת מטכ"ל (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      }
    ],
    trainingProcess: [
      {
        title: 'טירונות חי"ר',
        duration: '4 חודשים',
        description: 'השלב הפותח. טירונות רובאי 05 (בדרך כלל בבא"ח צנחנים או במתקן אדם, בהתאם למחזור). דגש על משמעת ברזל, קליעה, שדאות וכושר גופני בסיסי.'
      },
      {
        title: 'טירונות יחידה ואימון מתקדם',
        duration: '2.5 חודשים',
        description: 'הלוחמים עולים ליחידה ומתחילים את ההכשרה הייחודית. שלב זה כולל השלמה לרובאי 07, תחילת העבודה על דינמיקה צוותית, ואימוני חי"ר מתקדמים כבסיס להמשך.'
      },
      {
        title: 'שלב הניווטים',
        duration: '4 עד 5 חודשים',
        description: '"הלב" של המסלול. בניגוד ליחידות אחרות, כאן הדגש הוא עצום על ניווטי בדד (יחידים) למרחקים ארוכים, בכל תנאי מזג אוויר ושטח. שלב זה בונה את הביטחון העצמי, העצמאות והחוסן המנטלי של הלוחם. בהמשך מתבצעים גם ניווטים רכובים על גבי פלטפורמות שונות.'
      },
      {
        title: 'שלב ההתמחויות והקורסים',
        duration: '3 עד 4 חודשים',
        description: 'שלב מגוון מאוד שכולל רצף של קורסים מקצועיים: קורס צניחה, קורס לוט"ר (לוחמה בטרור - הכשרה כצוות השתלטות, לוחמה בשטח בנוי ופריצה), יסודות המודיעין והסיור, סדרת שבי וכישורי הישרדות, העמקה מקצועית: אימוני צליפה, לוחמת גרילה, קרב מגע וקורסי שחייה וצלילה בסיסיים.'
      },
      {
        title: 'ההכשרה הייעודית בצוות',
        duration: '4.5 חודשים',
        description: 'החלק המסכם והמסווג ביותר במסלול. התוכן בשלב זה ייעודי לכל צוות לפי המשימות האופרטיביות שלו ואסור בפרסום (ממודר בין הצוותים). כאן הצוות מתגבש לכוח מבצעי לוחם שמסוגל לבצע משימות קצה.'
      }
    ]
  },
  3: {
    description: `שייטת 13 ("השייטת") היא יחידת הקומנדו הימי של חיל הים הישראלי, והיא אחת מארבעת יחידות העילית של צה"ל. השייטת מתמחה בפשיטות ים-יבשה, חבלה באוניות ובנמלי אויב, איסוף מודיעין איכותי ולוחמה בטרור ימי. לוחמי השייטת פועלים בחשאיות מוחלטת, בים, ביבשה, ובאוויר, בדרכים שונות ומגוונות. הלוחמים נדרשים לכושר גופני וסיבולת לב-ריאה מהגבוהים בצה"ל, יכולת שהייה ארוכה במים קרים, קור רוח קיצוני, ורעל בעיניים. שייטת 13 נחשבת לאחת מיחידת הכוחות המיוחדים הטובות בעולם.`,
    shortDescription: 'יחידת הקומנדו הימי של חיל הים, המתמחה בפשיטות ולוחמה בטרור.',
    stats: {
      serviceLength: '5 שנים ו-8 חודשים',
      selectionCount: '2-3',
      teamSize: 'צוות קטן'
    },
    selectionPaths: [
      {
        name: 'דרך יום סיירות',
        steps: [
          'יום סיירות (תוצאת שייטת 13)',
          'מיון מקוון',
          'גיבוש שייטת (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      },
      {
        name: 'דרך גדנ"ע צלילה',
        steps: [
          'הרשמה לגדנ"ע צלילה (כיתה י"א)',
          'מיון מקוון',
          'מחנה גדנ"ע צלילה (5 ימים)',
          'גיבוש שייטת (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      }
    ],
    trainingProcess: [
      {
        title: 'טירונות חי"ר ואימון מתקדם',
        duration: '5 חודשים',
        description: 'הכשרת רובאי 05 ו-07 בבא"ח גולני. דגש על משמעת ברזל, קליעה וכושר גופני.'
      },
      {
        title: 'המכין (טירונות יחידה)',
        duration: 'כ-6 חודשים',
        description: 'שלב הכולל קורס צניחה, צלילה קרבית, ניווטים, לוחמה בטרור בים וביבשה, ושיט.'
      },
      {
        title: 'שלב ייעודי',
        duration: 'כ-9 חודשים',
        description: 'חלוקה למקצועות: משיט (הפעלת כלי שיט), צולל (צלילה מבצעית) ופושט (לחימה רגלית מהים). כולל סדרת שבי.'
      }
    ]
  },
  6: {
    description: `חובל הוא קצין ים שמפקד על לוחמים ואחראי לתפעול כלי השיט השונים של חיל הים. קורס חובלים הוא אחד מהקורסים היוקרתיים, הארוכים והמורכבים ביותר בצה“ל, ונחשב למסלול הכשרה מוביל לפיקוד ימי בזרוע הים. הוא נחשב ל"קורס הטיס" של חיל הים ביוקרה שלו. הקורס נמשך כשנתיים וחצי ומשלב לימודים אקדמיים הכשרה צבאית-קרבית אינטנסיבית, והכשרה מקצועית מעמיקה על מערכות הלחימה, הניווט, ההפעלה והפיקוד בכלי השיט של זרוע הים.
    במהלך הקורס מנופים כ-60-70% מהחניכים, אשר נושרים ברובם ליחידות מובחרות אחרות בצבא.`,
    shortDescription: 'מסלול העילית לפיקוד ימי - "קורס הטיס" של חיל הים.',
    stats: {
      serviceLength: '7.5 שנים',
      selectionCount: '2-3',
      teamSize: 'צוות פיקודי'
    },
    yomHameaRequirements: [
      { label: 'פיקוד', score: 4 },
      { label: 'הפעלה', score: 3 },
      { label: 'עיבוד מידע', score: 2 },
      { label: 'עבודה בצוות', score: 2 },
      { label: 'בשלות ובגרות', score: 2 },
      { label: 'השקעה והתמדה', score: 2 },
      { label: 'אינהביציה', score: 2 },
      { label: 'גמישות מחשבתית', score: 2 }
    ],
    selectionPaths: [
      {
        name: 'דרך יום סיירות',
        steps: [
          'יום סיירות (תוצאת חובלים/צוללות)',
          'מיון מקוון (תוצאת חובלים)',
          'גיבוש חובלים (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      },
      {
        name: 'איתור צדדי (חיל הים)',
        steps: [
          'איתור ע"י חיל הים',
          'מיון מקוון (תוצאת חובלים)',
          'גיבוש חובלים (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      },
      {
        name: 'דרך גדנ"ע חובלים',
        steps: [
          'הרשמה לגדנ"ע (סוף י"א)',
          'מיון מקוון',
          'מחנה גדנ"ע חובלים (5 ימים)',
          'גיבוש חובלים (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      }
    ],
    trainingProcess: [
      {
        title: 'השלב הבסיסי',
        duration: '6 חודשים',
        description: 'טירונות 05, יציאה לסדרת ימאות ופיקוד אינטנסיבית ולימודים עיוניים.'
      },
      {
        title: 'השלב המכין',
        duration: '6 חודשים',
        description: 'הכשרות לפי מגמות (שיט, מכונה, אלקטרוניקה) ואפשרות להגיע לצוללות. בסיום מקבלים סיכת קצין ימי.'
      },
      {
        title: 'השלב המתקדם',
        duration: '6 חודשים',
        description: 'לימודי תואר ראשון באוניברסיטת חיפה (מדעי המדינה, ניהול עסקי או מערכות מידע) לצד שגרת אימונים והפלגות.'
      },
      {
        title: 'השלב הייעודי',
        duration: '4 חודשים',
        description: 'המשך התואר והכשרה מקצועית ייעודית למגמה ולכלי השיט הספציפי עליו ישרתו.'
      },
      {
        title: 'שלב ייעודי שטח',
        duration: '3 חודשים',
        description: 'שהייה בשטח, לימוד מעמיק של כלי השיט המבצעי והיכרות מעמיקה עם היחידה.'
      },
      {
        title: 'בוחן חובל',
        description: 'מבחן רף פיזי ומקצועי מסכם המהווה תנאי הכרחי לסיום הקורס והסמכה לקצונה ימית.'
      }
    ]
  },
  7: {
    description: `שייטת הצוללות הינה יחידת עילית בזרוע הים. השייטת מהווה כלי אסטרטגי, חשאי, הרתעתי ובעל יכולות הנועד לבצע פעולות המחלישות את האויב ובכך שומרת על ביטחון המדינה בשקט. שייטת הצוללות היא היחידה הכי מבצעית בצה"ל, ופעילותה מסתכמת באלפי שעות ים בשנה - כאשר רובן מבצעיות חוצות גבול ויכולות לפעול בכל מקום במזרח התיכון.
    יתרונה המובהק של השייטת הוא בחשאיותה - "רואה ואינה נראית", וייחודית ביכולתה לפעול לאורך זמן במחוזות קרובים ורחוקים כאחד. הלוחמים בשייטת הצוללות נדרשים להיות בעלי חוסן, דבקות במשימה ויכולת התמודדות בתנאי לחץ ואי ודאות - לצד יכולות חשיבה גבוהות, אחריות וקפדנות הנדרשות מלוחמים שמפעילים צוללות.
    קורס צוללן, הכשרת לוחמי השייטת, הוא אחד מההכשרות הייחודיות והיוקרתיות בצה"ל, אליה מתמיינים בכל שנה מאות מלש"בים. הקורס מקצועי וערכי, מלא באתגרים פיזיים ומנטליים. במהלך הקורס מנופים כ-50% מהחניכים, אשר נושרים ברובם ליחידות מובחרות אחרות בצבא.`,
    shortDescription: 'יחידת עילית אסטרטגית חשאית בזרוע הים, "רואה ואינה נראית".',
    importantNote: 'ניתן לחתום על וויתור יום סיירות עבור קבלת המיון מבלי לבצע יום סיירות פיזית.',
    stats: {
      serviceLength: '4 שנים',
      selectionCount: '2-3',
      teamSize: 'צוות אינטימי'
    },
    selectionPaths: [
      {
        name: 'דרך יום סיירות',
        steps: [
          'יום סיירות (תוצאת חובלים/צוללות)',
          'מיון מקוון (תוצאת חובלים/צוללות)',
          'גיבוש חובלים/צוללות (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      },
      {
        name: 'איתור צדדי (חיל הים)',
        steps: [
          'איתור ע"י חיל הים (למתאימים)',
          'מיון מקוון (תוצאת חובלים/צוללות)',
          'גיבוש חובלים/צוללות (5 ימים)',
          'סיווג בטחוני ובדיקות'
        ]
      }
    ],
    trainingProcess: [
      {
        title: 'השלב הבסיסי',
        duration: '6 חודשים',
        description: 'טירונות 03, בחינות סדרת ים אינטנסיביות ולימודים עיוניים בסיסיים.'
      },
      {
        title: 'השלב הייעודי',
        duration: '6 חודשים',
        description: 'פיצול ל-6 מגמות התמחות (סונאר, נשק, אלחוט, מכונה, מהו"ב, גנ"ק). לימודים מעמיקים, תרגול בסימולטורים מתקדמים וקורס צלילה 2 כוכבים.'
      },
      {
        title: 'שלב ההסמכה',
        duration: '2 חודשים',
        description: 'החניכים מצטרפים לצוותים הלוחמים בצוללת המבצעית ומקבלים הסמכה סופית כלוחמי חוד במעמקים.'
      }
    ]
  }
};
