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
  let remainingAmount = parseFloat(total);
  let remainingPercentage = 100;

  // حساب عدد كل نوع من الورثة
  for (const [type, value] of Object.entries(heirs)) {
    let heirType = type?.replace(/_[^_]+$/, '');
    heirCounts[heirType] = (heirCounts[heirType] || 0) + 1;
  }

  // معالجة كل وارث
  for (const [type, value] of Object.entries(heirs)) {
    let heirType = type?.replace(/_[^_]+$/, '');
    let percentage = 0
    let amount = 0
    let note = ''
    let params = {
      heirCounts,
      heirType,
      percentage,
      amount,
      note,
      type,
      value,
      heirs,
      total: parseFloat(total),
      results,
      remainingAmount,
      remainingPercentage,
    }

    switch (heirType) {
      case 'husband':
        calculateHusbandHeir(params)
        break;
      case 'wife':
        calculateWifeHeir(params)
        break;
      case 'father':
        calculateDadHeir(params)
        break;
      case 'mother':
        calculateMomHeir(params)
        break;
      case 'son':
        calculateSonHeir(params)
        break;
      case 'daughter':
        calculateDaughterHeir(params)
        break;
      case 'FR_grandfather':
        calculateFR_grandfatherHeir(params)
        break;
      case 'MR_grandfather':
        calculateMR_grandfatherHeir(params)
        break;
      case 'FR_grandmother':
        calculateFR_grandmotherHeir(params)
        break;
      case 'MR_grandmother':
        calculateMR_grandmotherHeir(params)
        break;
      case 'SN_grandson':
        calculateSN_grandsonHeir(params)
        break;
      case 'SN_granddaughter':
        calculateSN_granddaughterHeir(params)
        break;
      case 'DR_grandson':
        calculateDR_grandsonHeir(params)
        break;
      case 'DR_granddaughter':
        calculateDR_granddaughterHeir(params)
        break;
      case 'brother':
        calculateBrotherHeir(params)
        break;
      case 'sister':
        calculateSisterHeir(params)
        break;
      case 'MR_brother':
        calculateMR_brotherHeir(params)
        break;
      case 'MR_mother_sister':
        calculateMR_mother_sisterHeir(params)
        break;
      case 'FR_brother':
        calculateFR_brotherHeir(params)
        break;
      case 'FR_sister':
        calculateFR_sisterHeir(params)
        break;
      case 'BR_boys':
        calculateBR_boysHeir(params)
        break;
      case 'SR_boys':
        calculateSR_boysHeir(params)
        break;
      case 'MR_BR_boys':
        calculateMR_BR_boysHeir(params)
        break;
      case 'MR_SR_boys':
        calculateMR_SR_boysHeir(params)
        break;
      case 'FR_BR_boys':
        calculateFR_BR_boysHeir(params)
        break;
      case 'FR_SR_boys':
        calculateFR_SR_boysHeir(params)
        break;
      case 'BR_girls':
        calculateBR_girlsHeir(params)
        break;
      case 'SR_girls':
        calculateSR_girlsHeir(params)
        break;
      case 'MR_BR_girls':
        calculateMR_BR_girlsHeir(params)
        break;
      case 'MR_SR_girls':
        calculateMR_SR_girlsHeir(params)
        break;
      case 'FR_BR_girls':
        calculateFR_BR_girlsHeir(params)
        break;
      case 'FR_SR_girls':
        calculateFR_SR_girlsHeir(params)
        break;
      case 'FR_uncle':
        calculateFR_uncleHeir(params)
        break;
      case 'FR_aunt':
        calculateFR_auntHeir(params)
        break;
      case 'MR_uncle':
        calculateMR_uncleHeir(params)
        break;
      case 'MR_aunt':
        calculateMR_auntHeir(params)
        break;
      case 'MR_uncle_mother':
        calculateMR_uncle_motherHeir(params)
        break;
      case 'FR_uncle_father':
        calculateFR_uncle_fatherHeir(params)
        break;
      case 'MR_aunt_mother':
        calculateMR_aunt_motherHeir(params)
        break;
      case 'FR_aunt_father':
        calculateFR_aunt_fatherHeir(params)
        break;
      case 'FR_uncle_father_A':
        calculateFR_uncle_father_AHeir(params)
        break;
      case 'MR_uncle_mother_A':
        calculateMR_uncle_mother_AHeir(params)
        break;
      case 'FR_aunt_father_K':
        calculateFR_aunt_father_KHeir(params)
        break;
      case 'MR_aunt_mother_K':
        calculateMR_aunt_mother_KHeir(params)
        break;
      case 'uncle_sons_A':
        calculateUncle_sons_AHeir(params)
        break;
      case 'uncle_daughters_A':
        calculateUncle_daughters_AHeir(params)
        break;
      case 'aunt_sons_A':
        calculateAunt_sons_AHeir(params)
        break;
      case 'aunt_daughters_A':
        calculateAunt_daughters_AHeir(params)
        break;
      case 'FR_uncle_sons_A':
        calculateFR_uncle_sons_AHeir(params)
        break;
      case 'MR_uncle_sons_A':
        calculateMR_uncle_sons_AHeir(params)
        break;
      case 'FR_uncle_daughter_A':
        calculateFR_uncle_daughter_AHeir(params)
        break;
      case 'MR_uncle_daughter_A':
        calculateMR_uncle_daughter_AHeir(params)
        break;
      case 'FR_aunt_sons_A':
        calculateFR_aunt_sons_AHeir(params)
        break;
      case 'MR_aunt_sons_A':
        calculateMR_aunt_sons_AHeir(params)
        break;
      case 'FR_aunt_daughter_A':
        calculateFR_aunt_daughter_AHeir(params)
        break;
      case 'MR_aunt_daughter_A':
        calculateMR_aunt_daughter_AHeir(params)
        break;
      case 'uncle_sons_K':
        calculateUncle_sons_KHeir(params)
        break;
      case 'uncle_daughters_K':
        calculateUncle_daughters_KHeir(params)
        break;
      case 'aunt_sons_K':
        calculateAunt_sons_KHeir(params)
        break;
      case 'aunt_daughters_K':
        calculateAunt_daughters_KHeir(params)
        break;
      case 'FR_uncle_sons_K':
        calculateFR_uncle_sons_KHeir(params)
        break;
      case 'MR_uncle_sons_K':
        calculateMR_uncle_sons_KHeir(params)
        break;
      case 'FR_uncle_daughter_K':
        calculateFR_uncle_daughter_KHeir(params)
        break;
      case 'MR_uncle_daughter_K':
        calculateMR_uncle_daughter_KHeir(params)
        break;
      case 'FR_aunt_sons_K':
        calculateFR_aunt_sons_KHeir(params)
        break;
      case 'MR_aunt_sons_K':
        calculateMR_aunt_sons_KHeir(params)
        break;
      case 'FR_aunt_daughter_K':
        calculateFR_aunt_daughter_KHeir(params)
        break;
      case 'MR_aunt_daughter_K':
        calculateMR_aunt_daughter_KHeir(params)
        break;
      default:
        // للدوال غير المعرفة
        results[type] = {
          ...value,
          amount: '0.00',
          percentage: '0.00',
          note: 'لم يتم تنفيذ حساب هذا الوارث بعد',
        }
        break;
    }

    // تحديث المبالغ المتبقية بناءً على النتائج
    if (results[type] && results[type].amount && results[type].amount !== '0.00') {
      const amountValue = parseFloat(results[type].amount);
      const percentageValue = parseFloat(results[type].percentage);
      
      if (!isNaN(amountValue)) {
        remainingAmount -= amountValue;
      }
      if (!isNaN(percentageValue)) {
        remainingPercentage -= percentageValue;
      }
    }
  }

  // معالجة المتبقي من التركة (حالات الرد)
  handleRemainingAmount(results, remainingAmount, remainingPercentage, heirCounts);

  return results;
}

// دالة لمعالجة المبلغ المتبقي (حالات الرد)
function handleRemainingAmount(results, remainingAmount, remainingPercentage, heirCounts) {
  if (remainingAmount > 0) {
    // البحث عن الورثة الذين يمكن أن يستفيدوا من الرد
    const eligibleHeirs = [];
    
    for (const [type, result] of Object.entries(results)) {
      if (result.amount && parseFloat(result.amount) > 0) {
        // الورثة الذين يمكن أن يستفيدوا من الرد (غير الزوج/الزوجة في بعض الحالات)
        const heirType = type?.replace(/_[^_]+$/, '');
        if (heirType !== 'husband' && heirType !== 'wife') {
          eligibleHeirs.push(type);
        }
      }
    }

    if (eligibleHeirs.length > 0) {
      // توزيع المتبقي على الورثة المؤهلين
      const sharePerHeir = remainingAmount / eligibleHeirs.length;
      const percentagePerHeir = remainingPercentage / eligibleHeirs.length;

      for (const heir of eligibleHeirs) {
        const currentAmount = parseFloat(results[heir].amount);
        const currentPercentage = parseFloat(results[heir].percentage);
        
        results[heir].amount = (currentAmount + sharePerHeir).toFixed(2);
        results[heir].percentage = (currentPercentage + percentagePerHeir).toFixed(2);
        
        // إضافة ملاحظة عن الرد إذا لم تكن موجودة
        if (!results[heir].note.includes('الرد')) {
          results[heir].note += ' مع الرد';
        }
      }
    }
  }
}