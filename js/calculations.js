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

// ========== الإصلاح: دالة تنسيق النسب المئوية ب 3 خانات عشرية ==========
function formatPercentage(percentage) {
  const num = parseFloat(percentage);
  return isNaN(num) ? '0.000' : num.toFixed(3);
}

// ================ Calculate Husband ================
export function calculateHusbandHeir(heirs, total, heirCounts = {}) {
  const deceasedType = getDeceasedType();
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفتاح الرابع: الابن اذا المتوفي الأم - الزوج الربع والباقي للابن
  if (deceasedType === DECEASED_TYPE.MOTHER) {
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      amount = calculateShare(total, SHARES.quarter);
      percentage = 25;
      note = 'حصل علي الربع فرض بسبب وجود ابناء';
    } else {
      amount = calculateShare(total, SHARES.half);
      percentage = 50;
      note = 'حصل علي النصف فرض بسبب عدم وجود ابناء';
    }
  } else {
    amount = 0;
    percentage = 0;
    note = 'لا يرث مع المتوفي أب';
  }

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate Wife ================
export function calculateWifeHeir(heirs, total, heirCounts = {}) {
  const deceasedType = getDeceasedType();
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفاتيح 1، 2، 3: المتوفي أب - الزوجة الثمن
  if (deceasedType === DECEASED_TYPE.FATHER) {
    const wifeCount = heirCounts['wife'] || 1;
    
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      const totalShare = calculateShare(total, SHARES.eighth);
      amount = totalShare / wifeCount;
      percentage = (amount / total) * 100;
      note = generateWifeNote('eighth', wifeCount);
    } else {
      const totalShare = calculateShare(total, SHARES.quarter);
      amount = totalShare / wifeCount;
      percentage = (amount / total) * 100;
      note = generateWifeNote('quarter', wifeCount);
    }
  } else {
    amount = 0;
    percentage = 0;
    note = 'لا ترث مع المتوفي أم';
  }

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate DAD ================
export function calculateDadHeir(heirs, total, heirCounts = {}) {
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفاتيح 1، 2، 3، 4، 5، 6: الأب السدس مع وجود الأبناء
  // ========== الإصلاح: تغيير مصطلح "فرع" إلى "أبناء" ==========
  if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
    amount = calculateShare(total, SHARES.sixth);
    percentage = (amount / total) * 100;
    note = 'السدس فرض لوجود أبناء'; // تم التغيير من "فرع وارث" إلى "أبناء"
  } else {
    amount = total;
    percentage = 100;
    note = 'المال كاملاً يوزع لـ الأب'; // تم التغيير من "الباقي تعصيب" إلى "المال كاملاً يوزع لـ"
  }

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate MOM ================
export function calculateMomHeir(heirs, total, heirCounts = {}) {
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفاتيح 1، 2، 3، 4، 5، 6: الأم السدس مع وجود الأبناء
  // ========== الإصلاح: تغيير مصطلح "فرع" إلى "أبناء" ==========
  if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
    amount = calculateShare(total, SHARES.sixth);
    percentage = (amount / total) * 100;
    note = 'السدس فرض لوجود أبناء'; // تم التغيير من "فرع وارث" إلى "أبناء"
  } else {
    amount = calculateShare(total, SHARES.third);
    percentage = (amount / total) * 100;
    note = 'الثلث فرض لعدم وجود أبناء'; // تم التغيير من "فرع وارث" إلى "أبناء"
  }

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate SON ================
export function calculateSonHeir(heirs, total, heirCounts = {}) {
  const deceasedType = getDeceasedType();
  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;
  
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفاتيح 1 و 4: الابن مع المتوفي أب وأم
  if (daughterCount > 0) {
    // للذكر مثل حظ الانثيين - يتم حسابه في دالة التوزيع
    note = 'للذكر مثل حظ الانثيين';
    return { 
      amount: '0.00', 
      percentage: '0.000', // تحديث التنسيق
      note 
    };
  } else {
    // الباقي تعصيباً - يتم حسابه في دالة التوزيع
    note = 'المال كاملاً يوزع لـ الأبناء'; // تم التغيير من "الباقي تعصيباً"
    return { 
      amount: '0.00', 
      percentage: '0.000', // تحديث التنسيق
      note 
    };
  }
}

// ================ Calculate DAUGHTER ================
export function calculateDaughterHeir(heirs, total, heirCounts = {}) {
  const daughterCount = heirCounts['daughter'] || 0;
  const sonCount = heirCounts['son'] || 0;
  
  let amount = 0;
  let percentage = 0;
  let note = '';

  if (sonCount > 0) {
    // للذكر مثل حظ الانثيين - المفاتيح 1، 4
    note = 'للذكر مثل حظ الانثيين';
    return { 
      amount: '0.00', 
      percentage: '0.000', // تحديث التنسيق
      note 
    };
  } else if (daughterCount >= 2) {
    // ابنتين فصاعدا - الثلثين - المفاتيح 3، 6
    const totalShare = calculateShare(total, SHARES.twoThirds);
    amount = totalShare / daughterCount;
    percentage = (amount / total) * 100;
    note = 'ثلثين فرض';
  } else if (daughterCount === 1) {
    // بنت واحدة - النصف - المفاتيح 2، 5
    amount = calculateShare(total, SHARES.half);
    percentage = (amount / total) * 100;
    note = 'نصف فرض';
  }

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate SISTER ================
export function calculateSisterHeir(heirs, total, heirCounts = {}) {
  const sisterCount = heirCounts['sister'] || 0;
  const sonCount = heirCounts['son'] || 0;
  
  let amount = 0;
  let percentage = 0;
  let note = '';

  // المفتاح 1 و 4: الابن مع الأخت - للذكر مثل حظ الانثيين
  if (sonCount > 0) {
    note = 'للذكر مثل حظ الانثيين مع الابن';
    return { 
      amount: '0.00', 
      percentage: '0.000', // تحديث التنسيق
      note 
    };
  } else {
    note = 'لا توجد معالجة في المفاتيح المطلوبة';
    return { 
      amount: '0.00', 
      percentage: '0.000', // تحديث التنسيق
      note 
    };
  }
}

// ================ Calculate GRANDMOTHER ================
export function calculateFR_grandmotherHeir(heirs, total, heirCounts = {}) {
  const amount = calculateShare(total, SHARES.sixth);
  const percentage = (amount / total) * 100;
  const note = 'السدس فرض';

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

export function calculateMR_grandmotherHeir(heirs, total, heirCounts = {}) {
  const amount = calculateShare(total, SHARES.sixth);
  const percentage = (amount / total) * 100;
  const note = 'السدس فرض';

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// ================ Calculate GRANDFATHER ================
export function calculateFR_grandfatherHeir(heirs, total, heirCounts = {}) {
  const amount = calculateShare(total, SHARES.sixth);
  const percentage = (amount / total) * 100;
  const note = 'السدس فرض';

  return { 
    amount: amount.toFixed(2), 
    percentage: formatPercentage(percentage), // تطبيق التنسيق الجديد
    note 
  };
}

// الدوال الأخرى تبقى فارغة مع تحديث التنسيق
export function calculateMR_grandfatherHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', // تحديث التنسيق
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateSN_grandsonHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', // تحديث التنسيق
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateSN_granddaughterHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', // تحديث التنسيق
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateDR_grandsonHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', // تحديث التنسيق
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateDR_granddaughterHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', // تحديث التنسيق
    note: 'لم يتم التنفيذ' 
  }; 
}

// تحديث جميع الدوال الأخرى بنفس التنسيق
export function calculateBrotherHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', 
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateMR_brotherHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', 
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateMR_mother_sisterHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', 
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateFR_brotherHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', 
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateFR_sisterHeir() { 
  return { 
    amount: '0.00', 
    percentage: '0.000', 
    note: 'لم يتم التنفيذ' 
  }; 
}

export function calculateBR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateSR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_BR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_SR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_BR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_SR_boysHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateBR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateSR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_BR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_SR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_BR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_SR_girlsHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncleHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_auntHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncleHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_auntHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_motherHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_fatherHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_motherHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_fatherHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_father_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_mother_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_father_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_mother_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateUncle_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateUncle_daughters_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateAunt_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateAunt_daughters_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_daughter_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_daughter_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_sons_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_daughter_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_daughter_AHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateUncle_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateUncle_daughters_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateAunt_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateAunt_daughters_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_uncle_daughter_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_uncle_daughter_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_sons_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateFR_aunt_daughter_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
export function calculateMR_aunt_daughter_KHeir() { return { amount: '0.00', percentage: '0.000', note: 'لم يتم التنفيذ' }; }
