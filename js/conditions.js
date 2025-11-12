export const SHARES = {
  quarter: 'quarter',
  eighth: 'eighth',
  half: 'half',
  third: 'third',
  sixth: 'sixth',
  twoThirds: 'twoThirds'
}

export const DECEASED_TYPE = {
  FATHER: 'father',
  MOTHER: 'mother'
}

export const HEIR_TYPES = {
  SON: 'son',
  DAUGHTER: 'daughter',
  FATHER: 'father',
  MOTHER: 'mother',
  GRANDMOTHER: 'grandmother',
  HUSBAND: 'husband',
  WIFE: 'wife',
  SISTER: 'sister'
}

export const CONDITIONS = {
  hasSon: 'HAS_SON',
  hasDaughter: 'HAS_DAUGHTER',
  hasMultipleDaughters: 'HAS_MULTIPLE_DAUGHTERS',
  hasFather: 'HAS_FATHER',
  hasMother: 'HAS_MOTHER',
  hasFRGrandmother: 'HAS_FR_GRANDMOTHER', // جدة لاب
  hasMRGrandmother: 'HAS_MR_GRANDMOTHER', // جدة لأم
  hasHusband: 'HAS_HUSBAND',
  hasWife: 'HAS_WIFE',
  hasSister: 'HAS_SISTER'
}

export function checkHeirs(heirs, condition) {
  switch (condition) {
    case CONDITIONS.hasSon:
      return Object.keys(heirs).some(key => key.startsWith('son_'));
    case CONDITIONS.hasDaughter:
      return Object.keys(heirs).some(key => key.startsWith('daughter_'));
    case CONDITIONS.hasMultipleDaughters:
      const daughterCount = Object.keys(heirs).filter(key => key.startsWith('daughter_')).length;
      return daughterCount >= 2;
    case CONDITIONS.hasFather:
      return heirs.father && heirs.father.title !== undefined;
    case CONDITIONS.hasMother:
      return heirs.mother && heirs.mother.title !== undefined;
    case CONDITIONS.hasFRGrandmother:
      return heirs.FR_grandmother && heirs.FR_grandmother.title !== undefined;
    case CONDITIONS.hasMRGrandmother:
      return heirs.MR_grandmother && heirs.MR_grandmother.title !== undefined;
    case CONDITIONS.hasHusband:
      return heirs.husband && heirs.husband.title !== undefined;
    case CONDITIONS.hasWife:
      return Object.keys(heirs).some(key => key.startsWith('wife_'));
    case CONDITIONS.hasSister:
      return Object.keys(heirs).some(key => key.startsWith('sister_'));
    default:
      return false;
  }
}

export function getDeceasedType() {
  const maleRadio = document.getElementById('male');
  const femaleRadio = document.getElementById('female');
  
  if (maleRadio?.checked) return DECEASED_TYPE.FATHER;
  if (femaleRadio?.checked) return DECEASED_TYPE.MOTHER;
  
  return DECEASED_TYPE.FATHER; // قيمة افتراضية
}

// دالة مساعدة للحصول على عدد كل نوع من الورثة
export function getHeirCounts(heirs) {
  const counts = {};
  for (const key of Object.keys(heirs)) {
    if (key.startsWith('son_')) {
      counts[HEIR_TYPES.SON] = (counts[HEIR_TYPES.SON] || 0) + 1;
    } else if (key.startsWith('daughter_')) {
      counts[HEIR_TYPES.DAUGHTER] = (counts[HEIR_TYPES.DAUGHTER] || 0) + 1;
    } else if (key.startsWith('wife_')) {
      counts[HEIR_TYPES.WIFE] = (counts[HEIR_TYPES.WIFE] || 0) + 1;
    } else if (key.startsWith('sister_')) {
      counts[HEIR_TYPES.SISTER] = (counts[HEIR_TYPES.SISTER] || 0) + 1;
    } else if (Object.values(HEIR_TYPES).includes(key)) {
      counts[key] = 1;
    }
  }
  return counts;
}
