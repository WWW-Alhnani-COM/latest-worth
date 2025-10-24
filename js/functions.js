import {
  calculateDadHeir,
  calculateHusbandHeir,
  calculateMomHeir,
  calculateWifeHeir,
  calculateSonHeir,
  calculateDaughterHeir,
  calculateFR_grandfatherHeir,
  calculateMR_grandfatherHeir,
  calculateFR_grandmotherHeir,
  calculateMR_grandmotherHeir,
  calculateSisterHeir,
} from "./calculations.js";

export function distribute(total = 10000, heirs) {
  const results = {};
  const heirCounts = {};
  const totalAmount = parseFloat(total);

  // حساب عدد كل نوع من الورثة
  for (const [type, value] of Object.entries(heirs)) {
    let heirType = type?.replace(/_[^_]+$/, '');
    heirCounts[heirType] = (heirCounts[heirType] || 0) + 1;
  }

  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;

  // 1. حساب الأنصبة الثابتة أولاً (الجدة، الأب، الأم، الزوجة، الزوج)
  const fixedHeirs = ['husband', 'wife', 'father', 'mother', 'FR_grandmother', 'MR_grandmother', 'FR_grandfather'];
  
  let totalFixedShares = 0;
  for (const heirType of fixedHeirs) {
    const heirsOfType = Object.entries(heirs).filter(([type]) => 
      type.replace(/_[^_]+$/, '') === heirType
    );

    for (const [type, value] of heirsOfType) {
      let calculationResult;

      switch (heirType) {
        case 'husband':
          calculationResult = calculateHusbandHeir(heirs, totalAmount, heirCounts);
          break;
        case 'wife':
          calculationResult = calculateWifeHeir(heirs, totalAmount, heirCounts);
          break;
        case 'father':
          calculationResult = calculateDadHeir(heirs, totalAmount, heirCounts);
          break;
        case 'mother':
          calculationResult = calculateMomHeir(heirs, totalAmount, heirCounts);
          break;
        case 'FR_grandmother':
          calculationResult = calculateFR_grandmotherHeir(heirs, totalAmount, heirCounts);
          break;
        case 'MR_grandmother':
          calculationResult = calculateMR_grandmotherHeir(heirs, totalAmount, heirCounts);
          break;
        case 'FR_grandfather':
          calculationResult = calculateFR_grandfatherHeir(heirs, totalAmount, heirCounts);
          break;
        default:
          calculationResult = { amount: '0.00', percentage: '0.00', note: 'لم يتم التنفيذ' };
      }

      if (parseFloat(calculationResult.amount) > 0) {
        results[type] = {
          ...value,
          ...calculationResult
        };
        totalFixedShares += parseFloat(calculationResult.amount);
      }
    }
  }

  const remainingAmount = totalAmount - totalFixedShares;

  // 2. حساب الأبناء والبنات حسب المفاتيح
  if (sonCount > 0 && daughterCount > 0) {
    // المفاتيح 1، 4: للذكر مثل حظ الانثيين
    handleMaleFemaleShares(results, heirs, totalAmount, remainingAmount, heirCounts);
  } else if (sonCount > 0 && daughterCount === 0) {
    // المفاتيح 1، 4: الباقي للابن
    handleSonsOnly(results, heirs, totalAmount, remainingAmount, heirCounts);
  } else if (daughterCount >= 2 && sonCount === 0) {
    // المفاتيح 3، 6: الثلثين للبنات + الرد
    handleMultipleDaughters(results, heirs, totalAmount, remainingAmount, heirCounts);
  } else if (daughterCount === 1 && sonCount === 0) {
    // المفاتيح 2، 5: النصف للبنت + الرد
    handleSingleDaughter(results, heirs, totalAmount, remainingAmount, heirCounts);
  }

  // 3. حساب الأخوات مع الابن
  handleSistersWithSon(results, heirs, totalAmount, heirCounts);

  return results;
}

// معالجة: للذكر مثل حظ الانثيين
function handleMaleFemaleShares(results, heirs, totalAmount, remainingAmount, heirCounts) {
  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;
  
  const totalShares = sonCount * 2 + daughterCount;
  const sharePerUnit = remainingAmount / totalShares;
  
  // توزيع على الأبناء
  const sonHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('son_'));
  for (const [type, value] of sonHeirs) {
    results[type] = {
      ...value,
      amount: (sharePerUnit * 2).toFixed(2),
      percentage: (((sharePerUnit * 2) / totalAmount) * 100).toFixed(2),
      note: 'للذكر مثل حظ الانثيين'
    };
  }
  
  // توزيع على البنات
  const daughterHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('daughter_'));
  for (const [type, value] of daughterHeirs) {
    results[type] = {
      ...value,
      amount: sharePerUnit.toFixed(2),
      percentage: ((sharePerUnit / totalAmount) * 100).toFixed(2),
      note: 'للذكر مثل حظ الانثيين'
    };
  }
}

// معالجة: الباقي للابن
function handleSonsOnly(results, heirs, totalAmount, remainingAmount, heirCounts) {
  const sonCount = heirCounts['son'] || 0;
  
  // إذا كان هناك جدة، نخصم نصيبها أولاً
  const hasGrandmother = Object.keys(heirs).some(key => 
    key.includes('grandmother') && parseFloat(results[key]?.amount || 0) > 0
  );
  
  let actualRemaining = remainingAmount;
  
  // إذا كانت الجدة موجودة ولم تحصل على نصيبها بعد
  if (hasGrandmother) {
    const grandmotherShare = calculateShare(totalAmount, 'sixth');
    actualRemaining = remainingAmount - grandmotherShare;
  }
  
  const sharePerSon = actualRemaining / sonCount;
  
  const sonHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('son_'));
  for (const [type, value] of sonHeirs) {
    results[type] = {
      ...value,
      amount: sharePerSon.toFixed(2),
      percentage: ((sharePerSon / totalAmount) * 100).toFixed(2),
      note: 'الباقي تعصيباً'
    };
  }
}

// معالجة: ابنتين فصاعدا - الثلثين + الرد
function handleMultipleDaughters(results, heirs, totalAmount, remainingAmount, heirCounts) {
  const daughterCount = heirCounts['daughter'] || 0;
  const daughtersTotalShare = calculateShare(totalAmount, 'twoThirds');
  
  const sharePerDaughter = daughtersTotalShare / daughterCount;
  
  const daughterHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('daughter_'));
  for (const [type, value] of daughterHeirs) {
    results[type] = {
      ...value,
      amount: sharePerDaughter.toFixed(2),
      percentage: ((sharePerDaughter / totalAmount) * 100).toFixed(2),
      note: 'ثلثين فرض'
    };
  }
}

// معالجة: بنت واحدة - النصف + الرد
function handleSingleDaughter(results, heirs, totalAmount, remainingAmount, heirCounts) {
  const daughterShare = calculateShare(totalAmount, 'half');
  
  const daughterHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('daughter_'));
  for (const [type, value] of daughterHeirs) {
    results[type] = {
      ...value,
      amount: daughterShare.toFixed(2),
      percentage: ((daughterShare / totalAmount) * 100).toFixed(2),
      note: 'نصف فرض'
    };
  }
}

// معالجة: الأخت مع الابن
function handleSistersWithSon(results, heirs, totalAmount, heirCounts) {
  const sisterCount = heirCounts['sister'] || 0;
  const sonCount = heirCounts['son'] || 0;
  
  if (sisterCount > 0 && sonCount > 0) {
    // حساب المتبقي بعد كل التوزيعات
    const totalAssigned = Object.values(results).reduce((sum, result) => 
      sum + parseFloat(result.amount || 0), 0
    );
    const remainingAmount = totalAmount - totalAssigned;
    
    if (remainingAmount > 0) {
      const totalShares = sonCount * 2 + sisterCount;
      const sharePerUnit = remainingAmount / totalShares;
      
      const sisterHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('sister_'));
      for (const [type, value] of sisterHeirs) {
        results[type] = {
          ...value,
          amount: sharePerUnit.toFixed(2),
          percentage: ((sharePerUnit / totalAmount) * 100).toFixed(2),
          note: 'للذكر مثل حظ الانثيين مع الابن'
        };
      }
    }
  }
}

// دالة مساعدة للحساب
function calculateShare(total, shareType) {
  const shares = {
    'quarter': 1 / 4,
    'eighth': 1 / 8,
    'half': 1 / 2,
    'third': 1 / 3,
    'sixth': 1 / 6,
    'twoThirds': 2 / 3
  };
  return total * (shares[shareType] || 0);
}

// دالة الحصول على نوع المتوفي
function getDeceasedType() {
  const maleRadio = document.getElementById('male');
  return maleRadio?.checked ? 'father' : 'mother';
}
