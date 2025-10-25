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
  console.log('=== DISTRIBUTE FUNCTION START ===');
  console.log('Total:', total);
  console.log('Heirs received:', heirs);
  
  const results = {};
  const heirCounts = {};
  
  // ========== الإصلاح 1: استخدام قيمة افتراضية إذا لم يتم إدخال مبلغ ==========
  const totalAmount = parseFloat(total) || 100; // قيمة افتراضية 100% إذا لم يتم إدخال مبلغ
  console.log('Total amount after fix:', totalAmount);

  // ========== الإصلاح 2: التحقق من وجود ورثة لبيت المال ==========
  const hasHeirs = Object.keys(heirs).length > 0;
  if (!hasHeirs) {
    console.log('No heirs found - going to Bayt Al Mal');
    return {
      bayt_al_mal: {
        title: 'بيت المال',
        name: 'بيت المال',
        amount: totalAmount.toFixed(2),
        percentage: '100.000',
        note: 'المال كاملاً يذهب إلى بيت المال لعدم وجود ورثة'
      }
    };
  }

  console.log('Heirs received:', heirs);

  // حساب عدد كل نوع من الورثة
  for (const [type, value] of Object.entries(heirs)) {
    let heirType = type?.replace(/_[^_]+$/, '');
    heirCounts[heirType] = (heirCounts[heirType] || 0) + 1;
  }

  console.log('Heir counts:', heirCounts);

  const sonCount = heirCounts['son'] || 0;
  const daughterCount = heirCounts['daughter'] || 0;
  
  // الإصلاح: التحقق من وجود الجدة بشكل صحيح
  const hasFRGrandmother = heirs.hasOwnProperty('FR_grandmother');
  const hasMRGrandmother = heirs.hasOwnProperty('MR_grandmother');
  const hasGrandmother = hasFRGrandmother || hasMRGrandmother;

  console.log('Son count:', sonCount, 'Daughter count:', daughterCount, 'Has grandmother:', hasGrandmother);
  console.log('Has FR_grandmother:', hasFRGrandmother, 'Has MR_grandmother:', hasMRGrandmother);

  // 1. حساب الأنصبة الثابتة أولاً - الترتيب مهم!
  const fixedHeirs = ['husband', 'wife', 'father', 'mother', 'FR_grandmother', 'MR_grandmother', 'FR_grandfather'];
  
  let totalFixedShares = 0;
  
  for (const heirType of fixedHeirs) {
    // الإصلاح: البحث في heirs مباشرة بدلاً من filter
    const heirsOfType = Object.entries(heirs).filter(([type]) => {
      // مطابقة exact أو partial
      return type === heirType || type.startsWith(heirType + '_');
    });

    console.log(`Processing ${heirType}:`, heirsOfType);

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
          calculationResult = { amount: '0.000', percentage: '0.000', note: 'لم يتم التنفيذ' };
      }

      console.log(`Result for ${type}:`, calculationResult);

      if (parseFloat(calculationResult.amount) > 0) {
        // ========== الإصلاح 3: تحديث تنسيق النسب المئوية ==========
        const updatedResult = {
          ...value,
          amount: calculationResult.amount,
          percentage: formatPercentage(calculationResult.percentage), // استخدام 3 خانات عشرية
          note: calculationResult.note
        };
        
        results[type] = updatedResult;
        totalFixedShares += parseFloat(calculationResult.amount);
        console.log(`Added ${type} with amount: ${calculationResult.amount}`);
      }
    }
  }

  console.log('Total fixed shares:', totalFixedShares);
  console.log('Results after fixed heirs:', results);

  const remainingAmount = totalAmount - totalFixedShares;
  console.log('Remaining amount after fixed shares:', remainingAmount);

  // 2. حساب الأبناء والبنات
  if (sonCount > 0 && daughterCount > 0) {
    console.log('Handling male/female shares');
    handleMaleFemaleShares(results, heirs, totalAmount, remainingAmount, heirCounts);
  } else if (sonCount > 0 && daughterCount === 0) {
    console.log('Handling sons only');
    handleSonsOnly(results, heirs, totalAmount, remainingAmount, heirCounts, hasGrandmother);
  } else if (daughterCount >= 2 && sonCount === 0) {
    console.log('Handling multiple daughters');
    handleMultipleDaughters(results, heirs, totalAmount, remainingAmount, heirCounts);
  } else if (daughterCount === 1 && sonCount === 0) {
    console.log('Handling single daughter');
    handleSingleDaughter(results, heirs, totalAmount, remainingAmount, heirCounts);
  }

  // 3. حساب الأخوات مع الابن
  handleSistersWithSon(results, heirs, totalAmount, heirCounts);

  // ========== الإصلاح 4: التحقق من المتبقي لبيت المال ==========
  const finalTotal = Object.values(results).reduce((sum, result) => 
    sum + parseFloat(result.amount || 0), 0
  );
  
  const finalRemaining = totalAmount - finalTotal;
  
  if (finalRemaining > 0.01) { // تحقق من وجود متبقي مهم
    results.bayt_al_mal = {
      title: 'بيت المال',
      name: 'بيت المال',
      amount: finalRemaining.toFixed(2),
      percentage: formatPercentage((finalRemaining / totalAmount) * 100),
      note: 'المال كاملاً يوزع لـ بيت المال'
    };
    console.log('Added remaining to Bayt Al Mal:', finalRemaining);
  }

  console.log('Final results:', results);
  console.log('=== DISTRIBUTE FUNCTION END ===');

  return results;
}

// ========== الإصلاح 5: دالة تنسيق النسب المئوية ب 3 خانات عشرية ==========
function formatPercentage(percentage) {
  const num = parseFloat(percentage);
  return isNaN(num) ? '0.000' : num.toFixed(3);
}

// ========== الإصلاح 6: تحديث المصطلحات في دوال المعالجة ==========

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
      percentage: formatPercentage(((sharePerUnit * 2) / totalAmount) * 100),
      note: 'للذكر مثل حظ الانثيين'
    };
  }
  
  // توزيع على البنات
  const daughterHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('daughter_'));
  for (const [type, value] of daughterHeirs) {
    results[type] = {
      ...value,
      amount: sharePerUnit.toFixed(2),
      percentage: formatPercentage((sharePerUnit / totalAmount) * 100),
      note: 'للذكر مثل حظ الانثيين'
    };
  }
}

// معالجة: الباقي للابن - تم تغيير المصطلح
function handleSonsOnly(results, heirs, totalAmount, remainingAmount, heirCounts, hasGrandmother) {
  const sonCount = heirCounts['son'] || 0;
  
  let actualRemaining = remainingAmount;
  
  // الإصلاح: إذا كانت الجدة موجودة ولم تحصل على نصيبها بعد
  if (hasGrandmother && !results['FR_grandmother'] && !results['MR_grandmother']) {
    console.log('Grandmother exists but not in results, calculating her share...');
    const grandmotherShare = calculateShare(totalAmount, 'sixth');
    actualRemaining = remainingAmount - grandmotherShare;
    
    // إضافة الجدة إلى النتائج
    if (heirs['FR_grandmother']) {
      results['FR_grandmother'] = {
        ...heirs['FR_grandmother'],
        amount: grandmotherShare.toFixed(2),
        percentage: formatPercentage((grandmotherShare / totalAmount) * 100),
        note: 'السدس فرض'
      };
      console.log('Added FR_grandmother to results');
    } else if (heirs['MR_grandmother']) {
      results['MR_grandmother'] = {
        ...heirs['MR_grandmother'],
        amount: grandmotherShare.toFixed(2),
        percentage: formatPercentage((grandmotherShare / totalAmount) * 100),
        note: 'السدس فرض'
      };
      console.log('Added MR_grandmother to results');
    }
  }
  
  const sharePerSon = actualRemaining / sonCount;
  
  const sonHeirs = Object.entries(heirs).filter(([type]) => type.startsWith('son_'));
  for (const [type, value] of sonHeirs) {
    results[type] = {
      ...value,
      amount: sharePerSon.toFixed(2),
      percentage: formatPercentage((sharePerSon / totalAmount) * 100),
      note: 'المال كاملاً يوزع لـ الأبناء' // تم تغيير المصطلح
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
      percentage: formatPercentage((sharePerDaughter / totalAmount) * 100),
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
      percentage: formatPercentage((daughterShare / totalAmount) * 100),
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
          percentage: formatPercentage((sharePerUnit / totalAmount) * 100),
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
