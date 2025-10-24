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
  calculateSN_grandsonHeir,
  calculateSN_granddaughterHeir,
  calculateDR_grandsonHeir,
  calculateDR_granddaughterHeir,
  calculateBrotherHeir,
  calculateSisterHeir,
  calculateMR_brotherHeir,
  calculateMR_mother_sisterHeir,
  calculateFR_brotherHeir,
  calculateFR_sisterHeir,
  calculateBR_boysHeir,
  calculateSR_boysHeir,
  calculateMR_BR_boysHeir,
  calculateMR_SR_boysHeir,
  calculateFR_BR_boysHeir,
  calculateFR_SR_boysHeir,
  calculateBR_girlsHeir,
  calculateSR_girlsHeir,
  calculateMR_BR_girlsHeir,
  calculateMR_SR_girlsHeir,
  calculateFR_BR_girlsHeir,
  calculateFR_SR_girlsHeir,
  calculateFR_uncleHeir,
  calculateFR_auntHeir,
  calculateMR_uncleHeir,
  calculateMR_auntHeir,
  calculateMR_uncle_motherHeir,
  calculateFR_uncle_fatherHeir,
  calculateMR_aunt_motherHeir,
  calculateFR_aunt_fatherHeir,
  calculateFR_uncle_father_AHeir,
  calculateMR_uncle_mother_AHeir,
  calculateFR_aunt_father_KHeir,
  calculateMR_aunt_mother_KHeir,
  calculateUncle_sons_AHeir,
  calculateUncle_daughters_AHeir,
  calculateAunt_sons_AHeir,
  calculateAunt_daughters_AHeir,
  calculateFR_uncle_sons_AHeir,
  calculateMR_uncle_sons_AHeir,
  calculateFR_uncle_daughter_AHeir,
  calculateMR_uncle_daughter_AHeir,
  calculateFR_aunt_sons_AHeir,
  calculateMR_aunt_sons_AHeir,
  calculateFR_aunt_daughter_AHeir,
  calculateMR_aunt_daughter_AHeir,
  calculateUncle_sons_KHeir,
  calculateUncle_daughters_KHeir,
  calculateAunt_sons_KHeir,
  calculateAunt_daughters_KHeir,
  calculateFR_uncle_sons_KHeir,
  calculateMR_uncle_sons_KHeir,
  calculateFR_uncle_daughter_KHeir,
  calculateMR_uncle_daughter_KHeir,
  calculateFR_aunt_sons_KHeir,
  calculateMR_aunt_sons_KHeir,
  calculateFR_aunt_daughter_KHeir,
  calculateMR_aunt_daughter_KHeir,

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

  // ترتيب الحساب حسب الأولوية الشرعية
  const calculationOrder = [
    'husband', 'wife',
    'father', 'mother',
    'FR_grandfather', 'MR_grandfather',
    'FR_grandmother', 'MR_grandmother',
    'sister',
    'daughter', 'son'
  ];

  // حساب الورثة حسب الأولوية
  for (const heirType of calculationOrder) {
    const heirsOfType = Object.entries(heirs).filter(([type]) => 
      type.replace(/_[^_]+$/, '') === heirType
    );

    for (const [type, value] of heirsOfType) {
      let percentage = 0;
      let amount = 0;
      let note = '';
      
      let params = {
        heirCounts,
        heirType,
        percentage,
        amount,
        note,
        type,
        value,
        heirs,
        total: totalAmount,
        results,
        remainingAmount: totalAmount - getTotalAssignedAmount(results),
        remainingPercentage: 100 - getTotalAssignedPercentage(results),
      };

      switch (heirType) {
        case 'husband':
          calculateHusbandHeir(params);
          break;
        case 'wife':
          calculateWifeHeir(params);
          break;
        case 'father':
          calculateDadHeir(params);
          break;
        case 'mother':
          calculateMomHeir(params);
          break;
        case 'son':
          calculateSonHeir(params);
          break;
        case 'daughter':
          calculateDaughterHeir(params);
          break;
        case 'sister':
          calculateSisterHeir(params);
          break;
        case 'FR_grandfather':
          calculateFR_grandfatherHeir(params);
          break;
        case 'MR_grandfather':
          calculateMR_grandfatherHeir(params);
          break;
        case 'FR_grandmother':
          calculateFR_grandmotherHeir(params);
          break;
        case 'MR_grandmother':
          calculateMR_grandmotherHeir(params);
          break;
        case 'SN_grandson':
          calculateSN_grandsonHeir(params);
          break;
        case 'SN_granddaughter':
          calculateSN_granddaughterHeir(params);
          break;
        case 'DR_grandson':
          calculateDR_grandsonHeir(params);
          break;
        case 'DR_granddaughter':
          calculateDR_granddaughterHeir(params);
          break;
        case 'brother':
          calculateBrotherHeir(params);
          break;
        case 'MR_brother':
          calculateMR_brotherHeir(params);
          break;
        case 'MR_mother_sister':
          calculateMR_mother_sisterHeir(params);
          break;
        case 'FR_brother':
          calculateFR_brotherHeir(params);
          break;
        case 'FR_sister':
          calculateFR_sisterHeir(params);
          break;
        case 'BR_boys':
          calculateBR_boysHeir(params);
          break;
        case 'SR_boys':
          calculateSR_boysHeir(params);
          break;
        case 'MR_BR_boys':
          calculateMR_BR_boysHeir(params);
          break;
        case 'MR_SR_boys':
          calculateMR_SR_boysHeir(params);
          break;
        case 'FR_BR_boys':
          calculateFR_BR_boysHeir(params);
          break;
        case 'FR_SR_boys':
          calculateFR_SR_boysHeir(params);
          break;
        case 'BR_girls':
          calculateBR_girlsHeir(params);
          break;
        case 'SR_girls':
          calculateSR_girlsHeir(params);
          break;
        case 'MR_BR_girls':
          calculateMR_BR_girlsHeir(params);
          break;
        case 'MR_SR_girls':
          calculateMR_SR_girlsHeir(params);
          break;
        case 'FR_BR_girls':
          calculateFR_BR_girlsHeir(params);
          break;
        case 'FR_SR_girls':
          calculateFR_SR_girlsHeir(params);
          break;
        case 'FR_uncle':
          calculateFR_uncleHeir(params);
          break;
        case 'FR_aunt':
          calculateFR_auntHeir(params);
          break;
        case 'MR_uncle':
          calculateMR_uncleHeir(params);
          break;
        case 'MR_aunt':
          calculateMR_auntHeir(params);
          break;
        case 'MR_uncle_mother':
          calculateMR_uncle_motherHeir(params);
          break;
        case 'FR_uncle_father':
          calculateFR_uncle_fatherHeir(params);
          break;
        case 'MR_aunt_mother':
          calculateMR_aunt_motherHeir(params);
          break;
        case 'FR_aunt_father':
          calculateFR_aunt_fatherHeir(params);
          break;
        case 'FR_uncle_father_A':
          calculateFR_uncle_father_AHeir(params);
          break;
        case 'MR_uncle_mother_A':
          calculateMR_uncle_mother_AHeir(params);
          break;
        case 'FR_aunt_father_K':
          calculateFR_aunt_father_KHeir(params);
          break;
        case 'MR_aunt_mother_K':
          calculateMR_aunt_mother_KHeir(params);
          break;
        case 'uncle_sons_A':
          calculateUncle_sons_AHeir(params);
          break;
        case 'uncle_daughters_A':
          calculateUncle_daughters_AHeir(params);
          break;
        case 'aunt_sons_A':
          calculateAunt_sons_AHeir(params);
          break;
        case 'aunt_daughters_A':
          calculateAunt_daughters_AHeir(params);
          break;
        case 'FR_uncle_sons_A':
          calculateFR_uncle_sons_AHeir(params);
          break;
        case 'MR_uncle_sons_A':
          calculateMR_uncle_sons_AHeir(params);
          break;
        case 'FR_uncle_daughter_A':
          calculateFR_uncle_daughter_AHeir(params);
          break;
        case 'MR_uncle_daughter_A':
          calculateMR_uncle_daughter_AHeir(params);
          break;
        case 'FR_aunt_sons_A':
          calculateFR_aunt_sons_AHeir(params);
          break;
        case 'MR_aunt_sons_A':
          calculateMR_aunt_sons_AHeir(params);
          break;
        case 'FR_aunt_daughter_A':
          calculateFR_aunt_daughter_AHeir(params);
          break;
        case 'MR_aunt_daughter_A':
          calculateMR_aunt_daughter_AHeir(params);
          break;
        case 'uncle_sons_K':
          calculateUncle_sons_KHeir(params);
          break;
        case 'uncle_daughters_K':
          calculateUncle_daughters_KHeir(params);
          break;
        case 'aunt_sons_K':
          calculateAunt_sons_KHeir(params);
          break;
        case 'aunt_daughters_K':
          calculateAunt_daughters_KHeir(params);
          break;
        case 'FR_uncle_sons_K':
          calculateFR_uncle_sons_KHeir(params);
          break;
        case 'MR_uncle_sons_K':
          calculateMR_uncle_sons_KHeir(params);
          break;
        case 'FR_uncle_daughter_K':
          calculateFR_uncle_daughter_KHeir(params);
          break;
        case 'MR_uncle_daughter_K':
          calculateMR_uncle_daughter_KHeir(params);
          break;
        case 'FR_aunt_sons_K':
          calculateFR_aunt_sons_KHeir(params);
          break;
        case 'MR_aunt_sons_K':
          calculateMR_aunt_sons_KHeir(params);
          break;
        case 'FR_aunt_daughter_K':
          calculateFR_aunt_daughter_KHeir(params);
          break;
        case 'MR_aunt_daughter_K':
          calculateMR_aunt_daughter_KHeir(params);
          break;
        default:
          results[type] = {
            ...value,
            amount: '0.00',
            percentage: '0.00',
            note: 'لم يتم تنفيذ حساب هذا الوارث بعد',
          };
          break;
      }
    }
  }

  // معالجة المتبقي (حالات الرد)
  handleRemainingDistribution(results, totalAmount);

  return results;
}

// دالة مساعدة لحساب إجمالي المبالغ المخصصة
function getTotalAssignedAmount(results) {
  return Object.values(results).reduce((total, result) => {
    return total + (parseFloat(result.amount) || 0);
  }, 0);
}

// دالة مساعدة لحساب إجمالي النسب المخصصة
function getTotalAssignedPercentage(results) {
  return Object.values(results).reduce((total, result) => {
    return total + (parseFloat(result.percentage) || 0);
  }, 0);
}

// دالة محسنة لمعالجة المتبقي
function handleRemainingDistribution(results, totalAmount) {
  const totalAssigned = getTotalAssignedAmount(results);
  const remaining = totalAmount - totalAssigned;

  if (remaining > 0.01) { // تحمل خطأ بسيط في الحسابات العشرية
    const eligibleHeirs = Object.entries(results)
      .filter(([type, result]) => {
        const amount = parseFloat(result.amount) || 0;
        return amount > 0 && !type.includes('wife') && !type.includes('husband');
      });

    if (eligibleHeirs.length > 0) {
      const sharePerHeir = remaining / eligibleHeirs.length;
      
      for (const [type, result] of eligibleHeirs) {
        const currentAmount = parseFloat(result.amount) || 0;
        results[type].amount = (currentAmount + sharePerHeir).toFixed(2);
        results[type].percentage = ((parseFloat(results[type].amount) / totalAmount) * 100).toFixed(2);
        
        if (!results[type].note.includes('الرد')) {
          results[type].note += ' مع الرد';
        }
      }
    }
  }

  // التأكد من أن المجموع النهائي = المبلغ الكلي
  const finalTotal = getTotalAssignedAmount(results);
  if (Math.abs(finalTotal - totalAmount) > 0.01) {
    // تصحيح الفروق البسيطة
    const difference = totalAmount - finalTotal;
    const firstHeir = Object.keys(results).find(key => parseFloat(results[key].amount) > 0);
    if (firstHeir) {
      results[firstHeir].amount = (parseFloat(results[firstHeir].amount) + difference).toFixed(2);
      results[firstHeir].percentage = ((parseFloat(results[firstHeir].amount) / totalAmount) * 100).toFixed(2);
    }
  }
}
