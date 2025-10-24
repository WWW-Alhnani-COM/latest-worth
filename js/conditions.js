export const SHARES = {
  quarter: 'quarter',
  eighth: 'eighth',
  half: 'half',
  third: 'third',
  sixth: 'sixth',
  twoThirds: 'twoThirds',
}

export const DECEASED_TYPE = {
  FATHER: 'father',
  MOTHER: 'mother'
}

export const CONDITIONS = {
  hasSon: 'HAS_SON',
  hasDaughter: 'HAS_DAUGHTER',
  hasDad: 'HAS_DAD',
  hasMom: 'HAS_MOM',
  hasSister: 'HAS_SISTER',
  hasWife: 'HAS_WIFE',
  hasHusband: 'HAS_HUSBAND',
  hasGrandmother: 'HAS_GRANDMOTHER',
  hasGrandfather: 'HAS_GRANDFATHER',
  hasMultipleDaughters: 'HAS_MULTIPLE_DAUGHTERS'
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
    case CONDITIONS.hasDad:
      return heirs.father;
    case CONDITIONS.hasMom:
      return heirs.mother;
    case CONDITIONS.hasSister:
      return Object.keys(heirs).some(key => key.startsWith('sister_'));
    case CONDITIONS.hasWife:
      return Object.keys(heirs).some(key => key.startsWith('wife_'));
    case CONDITIONS.hasHusband:
      return heirs.husband;
    case CONDITIONS.hasGrandmother:
      return heirs.FR_grandmother || heirs.MR_grandmother;
    case CONDITIONS.hasGrandfather:
      return heirs.FR_grandfather || heirs.MR_grandfather;
    default:
      return false;
  }
}

export function getDeceasedType() {
  const maleRadio = document.getElementById('male');
  return maleRadio?.checked ? DECEASED_TYPE.FATHER : DECEASED_TYPE.MOTHER;
}
