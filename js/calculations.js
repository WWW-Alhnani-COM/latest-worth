import { checkHeirs, CONDITIONS, SHARES, DECEASED_TYPE, getDeceasedType } from "./conditions.js"
import { generateWifeNote } from "./notes.js";

export function calculateShare(total, shareType) {
  const shares = {
    [SHARES.quarter]: 1 / 4,
    [SHARES.eighth]: 1 / 8,
    [SHARES.half]: 1 / 2,
    [SHARES.third]: 1 / 3,
    [SHARES.sixth]: 1 / 6,
    [SHARES.twoThirds]: 2 / 3
  };
  return total * (shares[shareType] || 0);
}

// نظام جديد لتتبع الأنصبة
class InheritanceCalculator {
  constructor(total, heirs) {
    this.total = parseFloat(total);
    this.heirs = heirs;
    this.shares = {};
    this.remainingAmount = this.total;
    this.remainingPercentage = 100;
  }

  assignFixedShare(heirType, shareType, note = '') {
    const shareAmount = calculateShare(this.total, shareType);
    this.shares[heirType] = {
      amount: shareAmount,
      percentage: (shareAmount / this.total) * 100,
      note
    };
    this.remainingAmount -= shareAmount;
    this.remainingPercentage -= this.shares[heirType].percentage;
  }

  assignRemainingTo(heirType, note = '') {
    this.shares[heirType] = {
      amount: this.remainingAmount,
      percentage: this.remainingPercentage,
      note
    };
    this.remainingAmount = 0;
    this.remainingPercentage = 0;
  }

  getResults() {
    return this.shares;
  }
}

// ================ Calculate Husband ================
export function calculateHusbandHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const deceasedType = getDeceasedType();
  const calculator = new InheritanceCalculator(total, heirs);
  
  if (deceasedType === DECEASED_TYPE.MOTHER) {
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      calculator.assignFixedShare(type, SHARES.quarter, 'حصل علي الربع فرض بسبب وجود ابناء');
    } else {
      calculator.assignFixedShare(type, SHARES.half, 'حصل علي النصف فرض بسبب عدم وجود ابناء');
    }
  } else {
    amount = '0.00';
    percentage = 0;
    note = 'لا يرث مع المتوفي أب';
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate Wife ================
export function calculateWifeHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  heirCounts,
  heirType,
  remainingPercentage
}) {
  const deceasedType = getDeceasedType();
  const calculator = new InheritanceCalculator(total, heirs);
  
  if (deceasedType === DECEASED_TYPE.FATHER) {
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      calculator.assignFixedShare(type, SHARES.eighth, generateWifeNote('eighth', heirCounts[heirType]));
    } else {
      calculator.assignFixedShare(type, SHARES.quarter, generateWifeNote('quarter', heirCounts[heirType]));
    }
  } else {
    amount = '0.00';
    percentage = 0;
    note = 'لا ترث مع المتوفي أم';
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate DAD ================
export function calculateDadHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  
  if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
    calculator.assignFixedShare(type, SHARES.sixth, 'السدس فرض لوجود فرع وارث');
  } else {
    calculator.assignRemainingTo(type, 'الباقي تعصيب لعدم وجود فرع وارث');
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate MOM ================
export function calculateMomHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  
  if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
    calculator.assignFixedShare(type, SHARES.sixth, 'السدس فرض لوجود فرع وارث');
  } else {
    calculator.assignFixedShare(type, SHARES.third, 'الثلث فرض لعدم وجود فرع وارث');
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate SON ================
export function calculateSonHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage,
  heirCounts,
  heirType
}) {
  const deceasedType = getDeceasedType();
  const calculator = new InheritanceCalculator(total, heirs);
  
  const hasSister = checkHeirs(heirs, CONDITIONS.hasSister);
  const hasDad = checkHeirs(heirs, CONDITIONS.hasDad);
  const hasMom = checkHeirs(heirs, CONDITIONS.hasMom);
  const hasGrandmother = checkHeirs(heirs, CONDITIONS.hasGrandmother);
  const hasWife = checkHeirs(heirs, CONDITIONS.hasWife);
  const hasHusband = checkHeirs(heirs, CONDITIONS.hasHusband);
  const hasDaughter = checkHeirs(heirs, CONDITIONS.hasDaughter);
  
  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;

  // أولاً: خصم الأنصبة الثابتة
  if (hasDad) {
    calculator.assignFixedShare('father', SHARES.sixth, 'سدس الأب');
  }
  if (hasMom) {
    calculator.assignFixedShare('mother', SHARES.sixth, 'سدس الأم');
  }
  if (hasGrandmother) {
    calculator.assignFixedShare('FR_grandmother', SHARES.sixth, 'سدس الجدة');
  }
  if (hasWife && deceasedType === DECEASED_TYPE.FATHER) {
    calculator.assignFixedShare('wife', SHARES.eighth, 'ثمن الزوجة');
  }
  if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) {
    calculator.assignFixedShare('husband', SHARES.quarter, 'ربع الزوج');
  }

  // ثانياً: توزيع الباقي على الأبناء
  if (hasSister || hasDaughter) {
    // للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount;
    const sharePerUnit = calculator.remainingAmount / totalShares;
    const sonAmount = sharePerUnit * 2;
    
    calculator.shares[type] = {
      amount: sonAmount,
      percentage: (sonAmount / total) * 100,
      note: 'للذكر مثل حظ الانثيين'
    };
  } else {
    // الباقي كله للابن
    calculator.assignRemainingTo(type, 'الباقي تعصيباً');
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate DAUGHTER ================
export function calculateDaughterHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage,
  heirCounts,
  heirType
}) {
  const deceasedType = getDeceasedType();
  const calculator = new InheritanceCalculator(total, heirs);
  
  const hasSon = checkHeirs(heirs, CONDITIONS.hasSon);
  const hasDad = checkHeirs(heirs, CONDITIONS.hasDad);
  const hasMom = checkHeirs(heirs, CONDITIONS.hasMom);
  const hasWife = checkHeirs(heirs, CONDITIONS.hasWife);
  const hasHusband = checkHeirs(heirs, CONDITIONS.hasHusband);
  const hasGrandmother = checkHeirs(heirs, CONDITIONS.hasGrandmother);
  const hasGrandfather = checkHeirs(heirs, CONDITIONS.hasGrandfather);
  
  const daughterCount = heirCounts['daughter'] || 0;
  const sonCount = heirCounts['son'] || 0;

  // أولاً: خصم الأنصبة الثابتة
  if (hasDad) {
    calculator.assignFixedShare('father', SHARES.sixth, 'سدس الأب');
  }
  if (hasMom) {
    calculator.assignFixedShare('mother', SHARES.sixth, 'سدس الأم');
  }
  if (hasGrandmother) {
    calculator.assignFixedShare('FR_grandmother', SHARES.sixth, 'سدس الجدة');
  }
  if (hasGrandfather) {
    calculator.assignFixedShare('FR_grandfather', SHARES.sixth, 'سدس الجد');
  }
  if (hasWife && deceasedType === DECEASED_TYPE.FATHER) {
    calculator.assignFixedShare('wife', SHARES.eighth, 'ثمن الزوجة');
  }
  if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) {
    calculator.assignFixedShare('husband', SHARES.quarter, 'ربع الزوج');
  }

  // ثانياً: حساب نصيب البنات
  if (hasSon) {
    // للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount;
    const sharePerUnit = calculator.remainingAmount / totalShares;
    const daughterAmount = sharePerUnit;
    
    calculator.shares[type] = {
      amount: daughterAmount,
      percentage: (daughterAmount / total) * 100,
      note: 'للذكر مثل حظ الانثيين'
    };
  } else if (daughterCount >= 2) {
    // ابنتين فصاعدا - الثلثين
    const daughtersTotalShare = calculateShare(total, SHARES.twoThirds);
    const daughterAmount = daughtersTotalShare / daughterCount;
    
    calculator.shares[type] = {
      amount: daughterAmount,
      percentage: (daughterAmount / total) * 100,
      note: 'ثلثين فرض'
    };
  } else {
    // بنت واحدة - النصف
    calculator.assignFixedShare(type, SHARES.half, 'نصف فرض');
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate SISTER ================
export function calculateSisterHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage,
  heirCounts,
  heirType
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  
  if (checkHeirs(heirs, CONDITIONS.hasSon)) {
    const sisterCount = heirCounts['sister'] || 0;
    const sonCount = heirCounts['son'] || 0;
    
    const totalShares = sonCount * 2 + sisterCount;
    const sharePerUnit = calculator.remainingAmount / totalShares;
    const sisterAmount = sharePerUnit;
    
    calculator.shares[type] = {
      amount: sisterAmount,
      percentage: (sisterAmount / total) * 100,
      note: 'للذكر مثل حظ الانثيين مع الابن'
    };
  } else {
    calculator.shares[type] = {
      amount: 0,
      percentage: 0,
      note: 'لا توجد معالجة في المفاتيح المطلوبة'
    };
  }
  
  Object.assign(results, calculator.getResults());
}

// ================ Calculate GRANDMOTHER ================
export function calculateFR_grandmotherHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  calculator.assignFixedShare(type, SHARES.sixth, 'السدس فرض');
  Object.assign(results, calculator.getResults());
}

export function calculateMR_grandmotherHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  calculator.assignFixedShare(type, SHARES.sixth, 'السدس فرض');
  Object.assign(results, calculator.getResults());
}

// ================ Calculate GRANDFATHER ================
export function calculateFR_grandfatherHeir({
  type,
  value,
  note,
  amount,
  percentage,
  heirs,
  total,
  results,
  remainingAmount,
  remainingPercentage
}) {
  const calculator = new InheritanceCalculator(total, heirs);
  calculator.assignFixedShare(type, SHARES.sixth, 'السدس فرض');
  Object.assign(results, calculator.getResults());
}

// ... باقي الدوال تبقى كما هي

// الدوال الأخرى تبقى فارغة كما هي
export function calculateMR_grandfatherHeir() {}
export function calculateSN_grandsonHeir() {}
export function calculateSN_granddaughterHeir() {}
export function calculateDR_grandsonHeir() {}
export function calculateDR_granddaughterHeir() {}
export function calculateBrotherHeir() {}
export function calculateMR_brotherHeir() {}
export function calculateMR_mother_sisterHeir() {}
export function calculateFR_brotherHeir() {}
export function calculateFR_sisterHeir() {}
export function calculateBR_boysHeir() {}
export function calculateSR_boysHeir() {}
export function calculateMR_BR_boysHeir() {}
export function calculateMR_SR_boysHeir() {}
export function calculateFR_BR_boysHeir() {}
export function calculateFR_SR_boysHeir() {}
export function calculateBR_girlsHeir() {}
export function calculateSR_girlsHeir() {}
export function calculateMR_BR_girlsHeir() {}
export function calculateMR_SR_girlsHeir() {}
export function calculateFR_BR_girlsHeir() {}
export function calculateFR_SR_girlsHeir() {}
export function calculateFR_uncleHeir() {}
export function calculateFR_auntHeir() {}
export function calculateMR_uncleHeir() {}
export function calculateMR_auntHeir() {}
export function calculateMR_uncle_motherHeir() {}
export function calculateFR_uncle_fatherHeir() {}
export function calculateMR_aunt_motherHeir() {}
export function calculateFR_aunt_fatherHeir() {}
export function calculateFR_uncle_father_AHeir() {}
export function calculateMR_uncle_mother_AHeir() {}
export function calculateFR_aunt_father_KHeir() {}
export function calculateMR_aunt_mother_KHeir() {}
export function calculateUncle_sons_AHeir() {}
export function calculateUncle_daughters_AHeir() {}
export function calculateAunt_sons_AHeir() {}
export function calculateAunt_daughters_AHeir() {}
export function calculateFR_uncle_sons_AHeir() {}
export function calculateMR_uncle_sons_AHeir() {}
export function calculateFR_uncle_daughter_AHeir() {}
export function calculateMR_uncle_daughter_AHeir() {}
export function calculateFR_aunt_sons_AHeir() {}
export function calculateMR_aunt_sons_AHeir() {}
export function calculateFR_aunt_daughter_AHeir() {}
export function calculateMR_aunt_daughter_AHeir() {}
export function calculateUncle_sons_KHeir() {}
export function calculateUncle_daughters_KHeir() {}
export function calculateAunt_sons_KHeir() {}
export function calculateAunt_daughters_KHeir() {}
export function calculateFR_uncle_sons_KHeir() {}
export function calculateMR_uncle_sons_KHeir() {}
export function calculateFR_uncle_daughter_KHeir() {}
export function calculateMR_uncle_daughter_KHeir() {}
export function calculateFR_aunt_sons_KHeir() {}
export function calculateMR_aunt_sons_KHeir() {}
export function calculateFR_aunt_daughter_KHeir() {}

export function calculateMR_aunt_daughter_KHeir() {}
