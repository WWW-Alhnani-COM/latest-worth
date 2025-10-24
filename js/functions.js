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

  // حساب الأنصبة الثابتة أولاً (الزوج، الزوجة، الأب، الأم، الجدات)
  const fixedHeirs = ['husband', 'wife', 'father', 'mother', 'FR_grandmother', 'MR_grandmother', 'FR_grandfather'];
  
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

      results[type] = {
        ...value,
        ...calculationResult
      };
    }
  }

  // حساب مجموع الأنصبة الثابتة
  const totalFixedShares = Object.values(results).reduce((sum, result) => {
    return sum + parseFloat(result.amount || 0);
  }, 0);

  const remainingAmount = totalAmount - totalFixedShares;

  // الآن حساب الأبناء والبنات والأخوات (الذين يعتمدون على الباقي)
  const remainingHeirs = ['son', 'daughter', 'sister'];
  
  for (const heirType of remainingHeirs) {
    const heirsOfType = Object.entries(heirs).filter(([type]) => 
      type.replace(/_[^_]+$/, '') === heirType
    );

    if (heirsOfType.length > 0) {
      const sonCount = heirCounts['son'] || 0;
      const daughterCount = heirCounts['daughter'] || 0;
      const sisterCount = heirCounts['sister'] || 0;

      if (sonCount > 0 && daughterCount > 0) {
        // حالة: للذكر مثل حظ الانثيين
        const totalShares = sonCount * 2 + daughterCount;
        const sharePerUnit = remainingAmount / totalShares;
        
        // توزيع على الأبناء
        const sonHeirs = heirsOfType.filter(([type]) => type.startsWith('son_'));
        for (const [type, value] of sonHeirs) {
          results[type] = {
            ...value,
            amount: (sharePerUnit * 2).toFixed(2),
            percentage: (((sharePerUnit * 2) / totalAmount) * 100).toFixed(2),
            note: 'للذكر مثل حظ الانثيين'
          };
        }

        // توزيع على البنات
        const daughterHeirs = heirsOfType.filter(([type]) => type.startsWith('daughter_'));
        for (const [type, value] of daughterHeirs) {
          results[type] = {
            ...value,
            amount: sharePerUnit.toFixed(2),
            percentage: ((sharePerUnit / totalAmount) * 100).toFixed(2),
            note: 'للذكر مثل حظ الانثيين'
          };
        }

      } else if (daughterCount >= 2 && sonCount === 0) {
        // حالة: ابنتين فصاعدا - الثلثين
        const daughtersTotalShare = totalAmount * (2/3);
        const sharePerDaughter = daughtersTotalShare / daughterCount;
        
        for (const [type, value] of heirsOfType) {
          results[type] = {
            ...value,
            amount: sharePerDaughter.toFixed(2),
            percentage: ((sharePerDaughter / totalAmount) * 100).toFixed(2),
            note: 'ثلثين فرض'
          };
        }

      } else if (daughterCount === 1 && sonCount === 0) {
        // حالة: بنت واحدة - النصف
        for (const [type, value] of heirsOfType) {
          const share = totalAmount * (1/2);
          results[type] = {
            ...value,
            amount: share.toFixed(2),
            percentage: ((share / totalAmount) * 100).toFixed(2),
            note: 'نصف فرض'
          };
        }

      } else if (sonCount > 0 && daughterCount === 0) {
        // حالة: أبناء فقط - الباقي تعصيباً
        const sharePerSon = remainingAmount / sonCount;
        
        for (const [type, value] of heirsOfType) {
          results[type] = {
            ...value,
            amount: sharePerSon.toFixed(2),
            percentage: ((sharePerSon / totalAmount) * 100).toFixed(2),
            note: 'الباقي تعصيباً'
          };
        }

      } else if (sisterCount > 0 && sonCount > 0) {
        // حالة: أخت مع ابن - للذكر مثل حظ الانثيين
        const totalShares = sonCount * 2 + sisterCount;
        const sharePerUnit = remainingAmount / totalShares;
        
        // توزيع على الأخوات
        for (const [type, value] of heirsOfType) {
          results[type] = {
            ...value,
            amount: sharePerUnit.toFixed(2),
            percentage: ((sharePerUnit / totalAmount) * 100).toFixed(2),
            note: 'للذكر مثل حظ الانثيين مع الابن'
          };
        }
      } else {
        // الحالات الأخرى
        for (const [type, value] of heirsOfType) {
          results[type] = {
            ...value,
            amount: '0.00',
            percentage: '0.00',
            note: 'لا توجد معالجة مناسبة'
          };
        }
      }
    }
  }

  // معالجة الرد إذا كان هناك متبقي
  handleAlRadd(results, totalAmount);

  return results;
}

// دالة معالجة الرد
function handleAlRadd(results, totalAmount) {
  const totalAssigned = Object.values(results).reduce((sum, result) => {
    return sum + parseFloat(result.amount || 0);
  }, 0);

  const remaining = totalAmount - totalAssigned;

  if (remaining > 0.01) {
    // الورثة الذين يستفيدون من الرد (غير الزوج/الزوجة)
    const eligibleHeirs = Object.entries(results).filter(([type, result]) => {
      const amount = parseFloat(result.amount || 0);
      return amount > 0 && 
             !type.includes('wife') && 
             !type.includes('husband') &&
             !result.note.includes('تعصيب');
    });

    if (eligibleHeirs.length > 0) {
      const sharePerHeir = remaining / eligibleHeirs.length;
      
      for (const [type, result] of eligibleHeirs) {
        const currentAmount = parseFloat(result.amount || 0);
        results[type].amount = (currentAmount + sharePerHeir).toFixed(2);
        results[type].percentage = ((parseFloat(results[type].amount) / totalAmount) * 100).toFixed(2);
        
        if (!results[type].note.includes('الرد')) {
          results[type].note += ' + الرد';
        }
      }
    }
  }

  // التأكد من أن المجموع = 100%
  const finalTotal = Object.values(results).reduce((sum, result) => {
    return sum + parseFloat(result.amount || 0);
  }, 0);

  if (Math.abs(finalTotal - totalAmount) > 0.01) {
    // تصحيح الفروق البسيطة
    const difference = totalAmount - finalTotal;
    const firstHeir = Object.keys(results).find(key => parseFloat(results[key].amount || 0) > 0);
    if (firstHeir) {
      const currentAmount = parseFloat(results[firstHeir].amount || 0);
      results[firstHeir].amount = (currentAmount + difference).toFixed(2);
      results[firstHeir].percentage = ((parseFloat(results[firstHeir].amount) / totalAmount) * 100).toFixed(2);
    }
  }
}
