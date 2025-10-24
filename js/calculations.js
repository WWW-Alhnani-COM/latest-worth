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
    results[type] = {
      ...value,
      amount: '0.00',
      percentage: '0.00',
      note: 'لا يرث مع المتوفي أب',
    };
    return;
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
      const wifeShare = calculateShare(total, SHARES.eighth);
      const wifeCount = heirCounts[heirType] || 1;
      const sharePerWife = wifeShare / wifeCount;
      
      results[type] = {
        ...value,
        amount: sharePerWife.toFixed(2),
        percentage: ((sharePerWife / total) * 100).toFixed(2),
        note: generateWifeNote('eighth', wifeCount),
      };
    } else {
      const wifeShare = calculateShare(total, SHARES.quarter);
      const wifeCount = heirCounts[heirType] || 1;
      const sharePerWife = wifeShare / wifeCount;
      
      results[type] = {
        ...value,
        amount: sharePerWife.toFixed(2),
        percentage: ((sharePerWife / total) * 100).toFixed(2),
        note: generateWifeNote('quarter', wifeCount),
      };
    }
  } else {
    results[type] = {
      ...value,
      amount: '0.00',
      percentage: '0.00',
      note: 'لا ترث مع المتوفي أم',
    };
  }
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
  const hasSister = checkHeirs(heirs, CONDITIONS.hasSister);
  const hasDad = checkHeirs(heirs, CONDITIONS.hasDad);
  const hasMom = checkHeirs(heirs, CONDITIONS.hasMom);
  const hasGrandmother = checkHeirs(heirs, CONDITIONS.hasGrandmother);
  const hasWife = checkHeirs(heirs, CONDITIONS.hasWife);
  const hasHusband = checkHeirs(heirs, CONDITIONS.hasHusband);
  const hasDaughter = checkHeirs(heirs, CONDITIONS.hasDaughter);
  
  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;

  // حساب الأنصبة الثابتة أولاً
  let fixedShares = 0;
  if (hasDad) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasMom) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasGrandmother) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasWife && deceasedType === DECEASED_TYPE.FATHER) fixedShares += calculateShare(total, SHARES.eighth);
  if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) fixedShares += calculateShare(total, SHARES.quarter);

  const remainingForChildren = total - fixedShares;
  
  let sonAmount = 0;
  let sonNote = '';

  if (hasSister || hasDaughter) {
    // للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount;
    const sharePerUnit = remainingForChildren / totalShares;
    sonAmount = sharePerUnit * 2;
    sonNote = 'للذكر مثل حظ الانثيين';
  } else {
    // الباقي كله للأبناء
    sonAmount = remainingForChildren / sonCount;
    sonNote = 'الباقي تعصيباً';
  }

  results[type] = {
    ...value,
    amount: sonAmount.toFixed(2),
    percentage: ((sonAmount / total) * 100).toFixed(2),
    note: sonNote,
  };
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
  const hasSon = checkHeirs(heirs, CONDITIONS.hasSon);
  const hasDad = checkHeirs(heirs, CONDITIONS.hasDad);
  const hasMom = checkHeirs(heirs, CONDITIONS.hasMom);
  const hasWife = checkHeirs(heirs, CONDITIONS.hasWife);
  const hasHusband = checkHeirs(heirs, CONDITIONS.hasHusband);
  const hasGrandmother = checkHeirs(heirs, CONDITIONS.hasGrandmother);
  const hasGrandfather = checkHeirs(heirs, CONDITIONS.hasGrandfather);
  
  const daughterCount = heirCounts['daughter'] || 0;
  const sonCount = heirCounts['son'] || 0;

  // حساب الأنصبة الثابتة أولاً
  let fixedShares = 0;
  if (hasDad) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasMom) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasGrandmother) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasGrandfather) fixedShares += calculateShare(total, SHARES.sixth);
  if (hasWife && deceasedType === DECEASED_TYPE.FATHER) fixedShares += calculateShare(total, SHARES.eighth);
  if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) fixedShares += calculateShare(total, SHARES.quarter);

  const remainingForChildren = total - fixedShares;
  
  let daughterAmount = 0;
  let daughterNote = '';

  if (hasSon) {
    // للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount;
    const sharePerUnit = remainingForChildren / totalShares;
    daughterAmount = sharePerUnit;
    daughterNote = 'للذكر مثل حظ الانثيين';
  } else if (daughterCount >= 2) {
    // ابنتين فصاعدا - الثلثين
    const daughtersTotalShare = calculateShare(total, SHARES.twoThirds);
    daughterAmount = daughtersTotalShare / daughterCount;
    daughterNote = 'ثلثين فرض';
  } else {
    // بنت واحدة - النصف
    daughterAmount = calculateShare(total, SHARES.half);
    daughterNote = 'نصف فرض';
  }

  results[type] = {
    ...value,
    amount: daughterAmount.toFixed(2),
    percentage: ((daughterAmount / total) * 100).toFixed(2),
    note: daughterNote,
  };
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
  const hasSon = checkHeirs(heirs, CONDITIONS.hasSon);
  
  if (hasSon) {
    const sisterCount = heirCounts['sister'] || 0;
    const sonCount = heirCounts['son'] || 0;
    
    // حساب الأنصبة الثابتة أولاً
    let fixedShares = 0;
    if (checkHeirs(heirs, CONDITIONS.hasDad)) fixedShares += calculateShare(total, SHARES.sixth);
    if (checkHeirs(heirs, CONDITIONS.hasMom)) fixedShares += calculateShare(total, SHARES.sixth);
    
    const remainingForSiblings = total - fixedShares;
    const totalShares = sonCount * 2 + sisterCount;
    const sharePerUnit = remainingForSiblings / totalShares;
    const sisterAmount = sharePerUnit;
    
    results[type] = {
      ...value,
      amount: sisterAmount.toFixed(2),
      percentage: ((sisterAmount / total) * 100).toFixed(2),
      note: 'للذكر مثل حظ الانثيين مع الابن',
    };
  } else {
    results[type] = {
      ...value,
      amount: '0.00',
      percentage: '0.00',
      note: 'لا توجد معالجة في المفاتيح المطلوبة',
    };
  }
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
  const shareAmount = calculateShare(total, SHARES.sixth);
  
  results[type] = {
    ...value,
    amount: shareAmount.toFixed(2),
    percentage: ((shareAmount / total) * 100).toFixed(2),
    note: 'السدس فرض',
  };
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
  const shareAmount = calculateShare(total, SHARES.sixth);
  
  results[type] = {
    ...value,
    amount: shareAmount.toFixed(2),
    percentage: ((shareAmount / total) * 100).toFixed(2),
    note: 'السدس فرض',
  };
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
  const shareAmount = calculateShare(total, SHARES.sixth);
  
  results[type] = {
    ...value,
    amount: shareAmount.toFixed(2),
    percentage: ((shareAmount / total) * 100).toFixed(2),
    note: 'السدس فرض',
  };
}

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
