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
  hasGrandmother: 'HAS_GRANDMOTHER',
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
    case CONDITIONS.hasGrandmother:
      return (heirs.FR_grandmother && heirs.FR_grandmother.title !== undefined) || 
             (heirs.MR_grandmother && heirs.MR_grandmother.title !== undefined);
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
  for (const [type, value] of Object.entries(heirs)) {
    let heirType = type?.replace(/_[^_]+$/, '');
    counts[heirType] = (counts[heirType] || 0) + 1;
  }
  return counts;
}
