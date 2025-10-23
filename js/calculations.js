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
  return total * (shares[shareType] || 0)
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
  
  if (deceasedType === DECEASED_TYPE.MOTHER) {
    // المفتاح الرابع والخامس والسادس - المتوفي أم
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      amount = calculateShare(total, SHARES.quarter).toFixed(2)
      percentage = 25
      note = 'حصل علي الربع فرض بسبب وجود ابناء'
    } else {
      amount = calculateShare(total, SHARES.half).toFixed(2)
      percentage = 50
      note = 'حصل علي النصف فرض بسبب عدم وجود ابناء'
    }
  } else {
    // المتوفي أب - الزوج غير وارد في المفاتيح
    amount = '0.00';
    percentage = 0;
    note = 'لا يرث مع المتوفي أب';
  }
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
  }
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
  
  if (deceasedType === DECEASED_TYPE.FATHER) {
    // المفاتيح 1، 2، 3 - المتوفي أب
    if (checkHeirs(heirs, CONDITIONS.hasSon) || checkHeirs(heirs, CONDITIONS.hasDaughter)) {
      amount = calculateShare(total, SHARES.eighth)
      percentage = 12.5
      note = generateWifeNote('eighth', heirCounts[heirType])
    } else {
      percentage = 25
      amount = calculateShare(total, SHARES.quarter)
      note = generateWifeNote('quarter', heirCounts[heirType])
    }
  } else {
    // المتوفي أم - الزوجة غير واردة في المفاتيح
    amount = 0;
    percentage = 0;
    note = 'لا ترث مع المتوفي أم';
  }
  
  const sharePerWife = (amount / heirCounts[heirType]).toFixed(2);
  const percentagePerWife = (percentage / heirCounts[heirType]).toFixed(2);
  
  remainingAmount -= parseFloat(sharePerWife);
  remainingPercentage -= parseFloat(percentagePerWife);
  
  results[type] = {
    ...value,
    amount: sharePerWife,
    percentage: percentagePerWife,
    note,
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
  const hasSon = checkHeirs(heirs, CONDITIONS.hasSon);
  const hasDaughter = checkHeirs(heirs, CONDITIONS.hasDaughter);
  
  if (hasSon || hasDaughter) {
    // المفاتيح 1، 2، 3، 4، 5، 6 - مع الابن أو البنت
    amount = calculateShare(total, SHARES.sixth).toFixed(2)
    percentage = 16.67
    note = 'السدس فرض لوجود فرع وارث'
  } else {
    // لا يوجد أبناء
    amount = remainingAmount.toFixed(2)
    percentage = remainingPercentage.toFixed(2)
    note = 'الباقي تعصيب لعدم وجود فرع وارث'
  }
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
  }
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
  const hasSon = checkHeirs(heirs, CONDITIONS.hasSon);
  const hasDaughter = checkHeirs(heirs, CONDITIONS.hasDaughter);
  const hasMultipleDaughters = checkHeirs(heirs, CONDITIONS.hasMultipleDaughters);
  
  if (hasSon || hasDaughter || hasMultipleDaughters) {
    // المفاتيح 1، 2، 3، 4، 5، 6 - مع الأبناء
    amount = calculateShare(total, SHARES.sixth).toFixed(2)
    percentage = 16.67
    note = 'السدس فرض لوجود فرع وارث'
  } else {
    // لا يوجد أبناء
    amount = calculateShare(total, SHARES.third).toFixed(2)
    percentage = 33.33
    note = 'الثلث فرض لعدم وجود فرع وارث'
  }
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
  }
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
  
  let calculatedAmount = 0;
  let calculatedPercentage = 0;
  let calculatedNote = '';
  
  // المفاتيح 1 و 4 - الابن مع المتوفي أب وأم
  if (hasSister) {
    // الابن مع الأخت - للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount * 1;
    const sharePerUnit = remainingAmount / totalShares;
    calculatedAmount = sharePerUnit * 2;
    calculatedNote = 'للذكر مثل حظ الانثيين مع الأخت';
  } 
  else if (hasDad) {
    // الابن مع الأب - الأب السدس والباقي للابن
    const dadShare = calculateShare(total, SHARES.sixth);
    calculatedAmount = remainingAmount - dadShare;
    calculatedNote = 'الباقي بعد سدس الأب';
  }
  else if (hasMom) {
    // الابن مع الأم - الأم السدس والباقي للابن
    const momShare = calculateShare(total, SHARES.sixth);
    calculatedAmount = remainingAmount - momShare;
    calculatedNote = 'الباقي بعد سدس الأم';
  }
  else if (hasGrandmother) {
    // الابن مع الجدة - الجدة السدس والباقي للابن
    const grandmotherShare = calculateShare(total, SHARES.sixth);
    calculatedAmount = remainingAmount - grandmotherShare;
    calculatedNote = 'الباقي بعد سدس الجدة';
  }
  else if (hasWife && deceasedType === DECEASED_TYPE.FATHER) {
    // الابن مع الزوجة - الزوجة الثمن والباقي للابن (المتوفي أب)
    const wifeShare = calculateShare(total, SHARES.eighth);
    calculatedAmount = remainingAmount - wifeShare;
    calculatedNote = 'الباقي بعد ثمن الزوجة';
  }
  else if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) {
    // الابن مع الزوج - الزوج الربع والباقي للابن (المتوفي أم)
    const husbandShare = calculateShare(total, SHARES.quarter);
    calculatedAmount = remainingAmount - husbandShare;
    calculatedNote = 'الباقي بعد ربع الزوج';
  }
  else if (hasDaughter) {
    // الابن مع البنت - للذكر مثل حظ الانثيين
    const totalShares = sonCount * 2 + daughterCount * 1;
    const sharePerUnit = remainingAmount / totalShares;
    calculatedAmount = sharePerUnit * 2;
    calculatedNote = 'للذكر مثل حظ الانثيين مع البنات';
  }
  else {
    // الابن بمفرده
    calculatedAmount = remainingAmount;
    calculatedNote = 'يرث كل التركة تعصيباً';
  }
  
  // إذا كان هناك أكثر من ابن، نقسم المبلغ عليهم
  if (sonCount > 1) {
    calculatedAmount = calculatedAmount / sonCount;
  }
  
  calculatedPercentage = (calculatedAmount / total) * 100;
  
  results[type] = {
    ...value,
    amount: calculatedAmount.toFixed(2),
    percentage: calculatedPercentage.toFixed(2),
    note: calculatedNote,
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
  
  let calculatedAmount = 0;
  let calculatedPercentage = 0;
  let calculatedNote = '';
  
  if (hasSon) {
    // الابنة مع الابن - للذكر مثل حظ الانثيين (المفاتيح 2، 3، 5، 6)
    const totalShares = sonCount * 2 + daughterCount;
    const sharePerUnit = remainingAmount / totalShares;
    calculatedAmount = sharePerUnit;
    calculatedNote = 'للذكر مثل حظ الانثيين مع الابن';
  } 
  else if (daughterCount >= 2) {
    // ابنتين فصاعدا (المفاتيح 3، 6)
    const daughtersShare = calculateShare(total, SHARES.twoThirds);
    
    if (hasDad) {
      // الأب السدس والابنتين فاكثر الثلثين والباقي يرد
      const dadShare = calculateShare(total, SHARES.sixth);
      const totalShares = dadShare + daughtersShare;
      
      if (totalShares > total) {
        // حالة الرد
        const remaining = total - dadShare;
        calculatedAmount = remaining / daughterCount;
        calculatedNote = 'نصيبها من الثلثين مع الرد بعد سدس الأب';
      } else {
        calculatedAmount = daughtersShare / daughterCount;
        calculatedNote = 'ثلثين فرض مع الأب';
      }
    }
    else if (hasMom) {
      // الأم السدس والابنتين فاكثر الثلثين والباقي يرد
      const momShare = calculateShare(total, SHARES.sixth);
      const totalShares = momShare + daughtersShare;
      
      if (totalShares > total) {
        // حالة الرد
        const remaining = total - momShare;
        calculatedAmount = remaining / daughterCount;
        calculatedNote = 'نصيبها من الثلثين مع الرد بعد سدس الأم';
      } else {
        calculatedAmount = daughtersShare / daughterCount;
        calculatedNote = 'ثلثين فرض مع الأم';
      }
    }
    else if (hasWife && deceasedType === DECEASED_TYPE.FATHER) {
      // الزوجة الثمن والابنتين فاكثر الثلثين والباقي يرد
      const wifeShare = calculateShare(total, SHARES.eighth);
      const totalShares = wifeShare + daughtersShare;
      
      if (totalShares > total) {
        // حالة الرد
        const remaining = total - wifeShare;
        calculatedAmount = remaining / daughterCount;
        calculatedNote = 'نصيبها من الثلثين مع الرد بعد ثمن الزوجة';
      } else {
        calculatedAmount = daughtersShare / daughterCount;
        calculatedNote = 'ثلثين فرض مع الزوجة';
      }
    }
    else if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) {
      // الزوج الربع والابنتين فاكثر الباقي يقسم على البنات
      const husbandShare = calculateShare(total, SHARES.quarter);
      calculatedAmount = (total - husbandShare) / daughterCount;
      calculatedNote = 'الباقي بعد ربع الزوج يقسم على البنات';
    }
    else if (hasGrandmother) {
      // الجدة السدس والابنتين فاكثر الثلثين والباقي يرد
      const grandmotherShare = calculateShare(total, SHARES.sixth);
      const totalShares = grandmotherShare + daughtersShare;
      
      if (totalShares > total) {
        // حالة الرد
        const remaining = total - grandmotherShare;
        calculatedAmount = remaining / daughterCount;
        calculatedNote = 'نصيبها من الثلثين مع الرد بعد سدس الجدة';
      } else {
        calculatedAmount = daughtersShare / daughterCount;
        calculatedNote = 'ثلثين فرض مع الجدة';
      }
    }
    else if (hasGrandfather) {
      // الجد السدس والابنتين فاكثر الثلثين والباقي يرد
      const grandfatherShare = calculateShare(total, SHARES.sixth);
      const totalShares = grandfatherShare + daughtersShare;
      
      if (totalShares > total) {
        // حالة الرد
        const remaining = total - grandfatherShare;
        calculatedAmount = remaining / daughterCount;
        calculatedNote = 'نصيبها من الثلثين مع الرد بعد سدس الجد';
      } else {
        calculatedAmount = daughtersShare / daughterCount;
        calculatedNote = 'ثلثين فرض مع الجد';
      }
    }
    else {
      // ابنتين فصاعدا بدون مرافق
      calculatedAmount = daughtersShare / daughterCount;
      calculatedNote = 'ثلثين فرض';
    }
  }
  else {
    // ابنة واحدة (المفاتيح 2، 5)
    const daughterShare = calculateShare(total, SHARES.half);
    
    if (hasDad) {
      // الأب السدس والابنة النصف والباقي يرد
      const dadShare = calculateShare(total, SHARES.sixth);
      const totalShares = dadShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - dadShare;
        calculatedNote = 'نصف مع الرد بعد سدس الأب';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الأب';
      }
    }
    else if (hasMom) {
      // الأم السدس والابنة النصف والباقي يرد
      const momShare = calculateShare(total, SHARES.sixth);
      const totalShares = momShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - momShare;
        calculatedNote = 'نصف مع الرد بعد سدس الأم';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الأم';
      }
    }
    else if (hasWife && deceasedType === DECEASED_TYPE.FATHER) {
      // الزوجة الثمن والابنة النصف والباقي يرد
      const wifeShare = calculateShare(total, SHARES.eighth);
      const totalShares = wifeShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - wifeShare;
        calculatedNote = 'نصف مع الرد بعد ثمن الزوجة';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الزوجة';
      }
    }
    else if (hasHusband && deceasedType === DECEASED_TYPE.MOTHER) {
      // الزوج الربع والابنة النصف والباقي يرد
      const husbandShare = calculateShare(total, SHARES.quarter);
      const totalShares = husbandShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - husbandShare;
        calculatedNote = 'نصف مع الرد بعد ربع الزوج';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الزوج';
      }
    }
    else if (hasGrandmother) {
      // الجدة السدس والابنة النصف والباقي يرد
      const grandmotherShare = calculateShare(total, SHARES.sixth);
      const totalShares = grandmotherShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - grandmotherShare;
        calculatedNote = 'نصف مع الرد بعد سدس الجدة';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الجدة';
      }
    }
    else if (hasGrandfather) {
      // الجد السدس والابنة النصف والباقي يرد
      const grandfatherShare = calculateShare(total, SHARES.sixth);
      const totalShares = grandfatherShare + daughterShare;
      
      if (totalShares > total) {
        // حالة الرد
        calculatedAmount = total - grandfatherShare;
        calculatedNote = 'نصف مع الرد بعد سدس الجد';
      } else {
        calculatedAmount = daughterShare;
        calculatedNote = 'نصف فرض مع الجد';
      }
    }
    else {
      // ابنة واحدة بدون مرافق
      calculatedAmount = daughterShare;
      calculatedNote = 'نصف فرض';
    }
  }
  
  calculatedPercentage = (calculatedAmount / total) * 100;
  
  results[type] = {
    ...value,
    amount: calculatedAmount.toFixed(2),
    percentage: calculatedPercentage.toFixed(2),
    note: calculatedNote,
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
    // الأخت مع الابن - للذكر مثل حظ الانثيين (المفتاح 1، 4)
    const sisterCount = heirCounts['sister'] || 0;
    const sonCount = heirCounts['son'] || 0;
    
    const totalShares = sonCount * 2 + sisterCount;
    const sharePerUnit = remainingAmount / totalShares;
    const sisterAmount = sharePerUnit;
    
    results[type] = {
      ...value,
      amount: sisterAmount.toFixed(2),
      percentage: ((sisterAmount / total) * 100).toFixed(2),
      note: 'للذكر مثل حظ الانثيين مع الابن',
    };
  } else {
    // لا توجد معالجة للأخت بدون ابن في المفاتيح المطلوبة
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
  // الجدة لاب - السدس في جميع الحالات (المفاتيح 1، 2، 3، 4، 5، 6)
  amount = calculateShare(total, SHARES.sixth).toFixed(2);
  percentage = 16.67;
  note = 'السدس فرض';
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
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
  // الجدة لأم - السدس في جميع الحالات
  amount = calculateShare(total, SHARES.sixth).toFixed(2);
  percentage = 16.67;
  note = 'السدس فرض';
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
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
  // الجد لاب - السدس في جميع الحالات (المفاتيح 2، 5)
  amount = calculateShare(total, SHARES.sixth).toFixed(2);
  percentage = 16.67;
  note = 'السدس فرض';
  
  remainingAmount -= parseFloat(amount);
  remainingPercentage -= parseFloat(percentage);
  
  results[type] = {
    ...value,
    amount,
    percentage,
    note,
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