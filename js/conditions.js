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

// دالة مساعدة للتحقق من وجود ابن
function hasSonKey(key) {
  return key === 'son' || key.startsWith('son_');
}

// دالة مساعدة للتحقق من وجود بنت
function hasDaughterKey(key) {
  return key === 'daughter' || key.startsWith('daughter_');
}

// دالة مساعدة للتحقق من وجود أخت
function hasSisterKey(key) {
  return key === 'sister' || key.startsWith('sister_');
}

// دالة مساعدة للتحقق من وجود زوجة
function hasWifeKey(key) {
  return key === 'wife' || key.startsWith('wife_');
}

export function checkHeirs(heirs, condition) {
  if (!heirs || typeof heirs !== 'object') return false;
  
  const keys = Object.keys(heirs);
  
  switch (condition) {
    case CONDITIONS.hasSon:
      // ✅ التصحيح: يشمل son و son_1, son_2, إلخ
      return keys.some(key => hasSonKey(key));
      
    case CONDITIONS.hasDaughter:
      // ✅ التصحيح: يشمل daughter و daughter_1, daughter_2, إلخ
      return keys.some(key => hasDaughterKey(key));
      
    case CONDITIONS.hasMultipleDaughters:
      // ✅ التصحيح: يشمل جميع أشكال البنات
      const daughterKeys = keys.filter(key => hasDaughterKey(key));
      return daughterKeys.length >= 2;
      
    case CONDITIONS.hasFather:
      // ✅ التصحيح: تحقق من وجود أب
      return keys.includes('father') && heirs.father && 
             (heirs.father.title !== undefined || heirs.father.count > 0);
      
    case CONDITIONS.hasMother:
      // ✅ التصحيح: تحقق من وجود أم
      return keys.includes('mother') && heirs.mother && 
             (heirs.mother.title !== undefined || heirs.mother.count > 0);
      
    case CONDITIONS.hasGrandmother:
      // ✅ التصحيح: تحقق من وجود جدة (أي نوع)
      return keys.some(key => key.includes('grandmother')) ||
             (heirs.FR_grandmother && (heirs.FR_grandmother.title !== undefined || heirs.FR_grandmother.count > 0)) || 
             (heirs.MR_grandmother && (heirs.MR_grandmother.title !== undefined || heirs.MR_grandmother.count > 0));
      
    case CONDITIONS.hasHusband:
      // ✅ التصحيح: تحقق من وجود زوج
      return keys.includes('husband') && heirs.husband && 
             (heirs.husband.title !== undefined || heirs.husband.count > 0);
      
    case CONDITIONS.hasWife:
      // ✅ التصحيح: تحقق من وجود زوجة/زوجات
      return keys.some(key => hasWifeKey(key));
      
    case CONDITIONS.hasSister:
      // ✅ التصحيح: تحقق من وجود أخت
      return keys.some(key => hasSisterKey(key));
      
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
  
  if (!heirs || typeof heirs !== 'object') return counts;
  
  for (const key of Object.keys(heirs)) {
    if (hasSonKey(key)) {
      counts[HEIR_TYPES.SON] = (counts[HEIR_TYPES.SON] || 0) + 1;
    } else if (hasDaughterKey(key)) {
      counts[HEIR_TYPES.DAUGHTER] = (counts[HEIR_TYPES.DAUGHTER] || 0) + 1;
    } else if (hasWifeKey(key)) {
      counts[HEIR_TYPES.WIFE] = (counts[HEIR_TYPES.WIFE] || 0) + 1;
    } else if (hasSisterKey(key)) {
      counts[HEIR_TYPES.SISTER] = (counts[HEIR_TYPES.SISTER] || 0) + 1;
    } else if (key === 'father') {
      counts[HEIR_TYPES.FATHER] = 1;
    } else if (key === 'mother') {
      counts[HEIR_TYPES.MOTHER] = 1;
    } else if (key === 'husband') {
      counts[HEIR_TYPES.HUSBAND] = 1;
    } else if (key.includes('grandmother')) {
      counts[HEIR_TYPES.GRANDMOTHER] = (counts[HEIR_TYPES.GRANDMOTHER] || 0) + 1;
    }
  }
  
  return counts;
}

// دالة مساعدة جديدة: الحصول على قائمة مفاتيح الأبناء
export function getSonKeys(heirs) {
  if (!heirs) return [];
  return Object.keys(heirs).filter(key => hasSonKey(key));
}

// دالة مساعدة جديدة: الحصول على قائمة مفاتيح البنات
export function getDaughterKeys(heirs) {
  if (!heirs) return [];
  return Object.keys(heirs).filter(key => hasDaughterKey(key));
}

// دالة مساعدة جديدة: الحصول على قائمة مفاتيح الأخوات
export function getSisterKeys(heirs) {
  if (!heirs) return [];
  return Object.keys(heirs).filter(key => hasSisterKey(key));
}

// دالة مساعدة جديدة: الحصول على قائمة مفاتيح الزوجات
export function getWifeKeys(heirs) {
  if (!heirs) return [];
  return Object.keys(heirs).filter(key => hasWifeKey(key));
}
