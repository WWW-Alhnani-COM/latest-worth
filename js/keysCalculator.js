import { 
  SHARES, 
  DECEASED_TYPE, 
  HEIR_TYPES,
  CONDITIONS, 
  checkHeirs, 
  getHeirCounts 
} from "./conditions.js";
import { t, formatNumber, parseNumber } from "./translations.js";

export class InheritanceCalculator {
  constructor(deceasedType, heirs, totalAmount = 100) {
    this.deceasedType = deceasedType;
    this.heirs = heirs;
    this.totalAmount = parseNumber(totalAmount) || 100;
    this.heirCounts = getHeirCounts(heirs);
    this.results = {};
    this.remainingAmount = this.totalAmount;
    this.specialCaseHandled = false;
    
    // تسجيل جميع الورثة المدخلين
    this.allHeirKeys = Object.keys(heirs);
    console.log('📋 جميع الورثة المسجلين:', this.allHeirKeys);
  }

  // ========== الدوال الأساسية ==========
  
  calculateShare(shareType) {
    const shares = {
      [SHARES.quarter]: 1 / 4,
      [SHARES.eighth]: 1 / 8,
      [SHARES.half]: 1 / 2,
      [SHARES.third]: 1 / 3,
      [SHARES.sixth]: 1 / 6,
      [SHARES.twoThirds]: 2 / 3
    };
    const share = shares[shareType] || 0;
    return this.totalAmount * share;
  }

  formatPercentage(percentage) {
    const num = parseFloat(percentage);
    return isNaN(num) ? '0.000' : num.toFixed(3);
  }

  assignFixedShare(heirType, shareType, noteKey = '') {
    const shareAmount = this.calculateShare(shareType);
    return this.addHeirWithShare(heirType, shareAmount, t(noteKey) || noteKey, true);
  }

  addHeirWithShare(heirType, amount, note = '', fromRemaining = true) {
    const heirData = this.heirs[heirType] || {};
    const percentage = this.formatPercentage((amount / this.totalAmount) * 100);
    
    const heirObject = {
      ...heirData,
      title: heirData.title || this.getHeirTitle(heirType),
      name: heirData.name || '',
      religion: heirData.religion || 'مسلم',
      gender: heirData.gender || this.getHeirGender(heirType),
      amount: amount.toFixed(3),
      percentage: percentage,
      note: note,
      originalTitle: heirData.originalTitle || heirData.title
    };
    
    this.results[heirType] = heirObject;
    
    if (fromRemaining && amount > 0) {
      this.remainingAmount -= amount;
    }
    
    return heirObject;
  }

  getHeirTitle(heirType) {
    if (this.heirs[heirType]) {
      return this.heirs[heirType].title || this.heirs[heirType].originalTitle || heirType;
    }
    
    if (heirType.includes('_')) {
      const baseKey = heirType.split('_')[0];
      if (this.heirs[baseKey]) {
        return this.heirs[baseKey].title || this.heirs[baseKey].originalTitle || baseKey;
      }
    }
    
    return heirType;
  }

  getHeirGender(heirType) {
    const heir = this.heirs[heirType];
    if (heir && heir.gender) return heir.gender;
    
    if (heirType.includes('son') || heirType.includes('brother') || heirType.includes('husband') || 
        heirType.includes('father') || heirType.includes('grandfather') || heirType.includes('uncle')) {
      return 'male';
    } else if (heirType.includes('daughter') || heirType.includes('sister') || heirType.includes('wife') || 
               heirType.includes('mother') || heirType.includes('grandmother') || heirType.includes('aunt')) {
      return 'female';
    }
    
    return 'male';
  }

  // ========== المفاتيح الستة الرئيسية ==========

  // 🔑 المفتاح الأول: الابن + متوفي أب
  applyKey1() {
    console.log('🔑 تطبيق المفتاح 1: الابن + متوفي أب');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSister = checkHeirs(this.heirs, CONDITIONS.hasSister);

    // 1. الابن مع الأخت: للذكر مثل حظ الانثيين
    if (hasSister) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    // 2. الحالة: زوجة + أب + أم + أبناء
    if (hasWife && hasFather && hasMother) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    // 3. الابن مع الأب والأم (بدون زوجة)
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 4. الابن مع الأب (بدون أم)
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 5. الابن مع الأم (بدون أب)
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 6. الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 7. الابن مع الزوجة (بدون أب وأم)
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
  }

  // 🔑 المفتاح الثاني: الابنة + متوفي أب
  applyKey2() {
    console.log('🔑 تطبيق المفتاح 2: الابنة + متوفي أب');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    // 1. الابنة مع الابن: للذكر مثل حظ الانثيين
    if (hasSon) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );
    if (daughterHeirs.length === 0) return;

    const daughterKey = daughterHeirs[0]; // أول بنت فقط

    // 2. الابنة مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['father', 'mother', daughterKey], 'raddNote');
    }
    // 3. الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['father', daughterKey], 'raddNote');
    }
    // 4. الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['mother', daughterKey], 'raddNote');
    }
    // 5. الابنة مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'eighthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs([daughterKey], 'remainderToDaughterNote');
    }
    // 6. الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs([daughterKey], 'remainderToDaughterNote');
    }
  }

  // 🔑 المفتاح الثالث: ابنتين فصاعدا + متوفي أب
  applyKey3() {
    console.log('🔑 تطبيق المفتاح 3: ابنتين فصاعداً + متوفي أب');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );

    // 1. ابنتين مع الابن: للذكر مثل حظ الانثيين
    if (hasSon) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    if (daughterHeirs.length < 2) {
      console.log('⚠️ ليس هناك ابنتين فصاعداً');
      return;
    }

    // توزيع حصة الثلثين على البنات
    const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
    const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
    
    for (const daughter of daughterHeirs) {
      this.addHeirWithShare(daughter, sharePerDaughter, t('twoThirdsNote'), true);
    }

    // 2. ابنتين مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.applyRaddToEligibleHeirs(['father', 'mother', ...daughterHeirs], 'raddNote');
    }
    // 3. ابنتين مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      this.applyRaddToEligibleHeirs(['father', ...daughterHeirs], 'raddNote');
    }
    // 4. ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.applyRaddToEligibleHeirs(['mother', ...daughterHeirs], 'raddNote');
    }
    // 5. ابنتين مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'eighthNote');
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // 6. ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  // 🔑 المفتاح الرابع: الابن + متوفي أم
  applyKey4() {
    console.log('🔑 تطبيق المفتاح 4: الابن + متوفي أم');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSister = checkHeirs(this.heirs, CONDITIONS.hasSister);

    // 1. الابن مع الأخت: للذكر مثل حظ الانثيين
    if (hasSister) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    // 2. الحالة: زوج + أب + أم + أبناء
    if (hasHusband && hasFather && hasMother) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    // 3. الابن مع الأب والأم (بدون زوج)
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 4. الابن مع الأب (بدون أم)
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 5. الابن مع الأم (بدون أب)
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 6. الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 7. الابن مع الزوج (بدون أب وأم)
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
  }

  // 🔑 المفتاح الخامس: الابنة + متوفي أم
  applyKey5() {
    console.log('🔑 تطبيق المفتاح 5: الابنة + متوفي أم');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    // 1. الابنة مع الابن: للذكر مثل حظ الانثيين
    if (hasSon) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );
    if (daughterHeirs.length === 0) return;

    const daughterKey = daughterHeirs[0]; // أول بنت فقط

    // 2. الابنة مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['father', 'mother', daughterKey], 'raddNote');
    }
    // 3. الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['father', daughterKey], 'raddNote');
    }
    // 4. الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs(['mother', daughterKey], 'raddNote');
    }
    // 5. الابنة مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs([daughterKey], 'remainderToDaughterNote');
    }
    // 6. الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
      
      this.applyRaddToEligibleHeirs([daughterKey], 'remainderToDaughterNote');
    }
  }

  // 🔑 المفتاح السادس: ابنتين فصاعدا + متوفي أم
  applyKey6() {
    console.log('🔑 تطبيق المفتاح 6: ابنتين فصاعداً + متوفي أم');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );

    // ========== الحالة الخاصة: زوج + أب + أم + أبناء/بنات ==========
    if (hasHusband && hasFather && hasMother && (hasSon || daughterHeirs.length > 0)) {
      console.log('🔑 تطبيق الحالة الخاصة: زوج + أب + أم + أبناء/بنات');
      
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      if (hasSon || daughterHeirs.length > 0) {
        this.applyMaleFemaleRatioToRemaining();
      }
      return;
    }

    // 1. ابنتين مع الابن: للذكر مثل حظ الانثيين
    if (hasSon) {
      this.applyMaleFemaleRatioToRemaining();
      return;
    }

    if (daughterHeirs.length < 2) {
      console.log('⚠️ ليس هناك ابنتين فصاعداً');
      return;
    }

    // توزيع حصة الثلثين على البنات
    const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
    const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
    
    for (const daughter of daughterHeirs) {
      this.addHeirWithShare(daughter, sharePerDaughter, t('twoThirdsNote'), true);
    }

    // 2. ابنتين مع الأب
    if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      this.applyRaddToEligibleHeirs(['father', ...daughterHeirs], 'raddNote');
    }
    // 3. ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.applyRaddToEligibleHeirs(['mother', ...daughterHeirs], 'raddNote');
    }
    // 4. ابنتين مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // 5. ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  // ========== الدوال المساعدة للمفاتيح ==========

  applyMaleFemaleRatioToRemaining() {
    const sonHeirs = Object.keys(this.heirs).filter(key => 
      key === 'son' || key.startsWith('son_')
    );
    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );

    if (sonHeirs.length === 0 && daughterHeirs.length === 0) {
      return;
    }

    const totalShares = (sonHeirs.length * 2) + daughterHeirs.length;
    
    if (totalShares === 0 || this.remainingAmount <= 0) return;

    const sharePerUnit = this.remainingAmount / totalShares;

    // توزيع على الأبناء (للذكر مثل حظ الانثيين)
    for (const son of sonHeirs) {
      const sonAmount = sharePerUnit * 2;
      this.addHeirWithShare(son, sonAmount, t('maleFemaleRatioNote'), true);
    }

    // توزيع على البنات
    for (const daughter of daughterHeirs) {
      const daughterAmount = sharePerUnit;
      this.addHeirWithShare(daughter, daughterAmount, t('maleFemaleRatioNote'), true);
    }
  }

  applyRaddToEligibleHeirs(eligibleHeirs, noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

    const totalShares = eligibleHeirs.reduce((sum, heir) => {
      return sum + parseFloat(this.results[heir]?.percentage || 0);
    }, 0);

    if (totalShares === 0) return;

    for (const heir of eligibleHeirs) {
      if (this.results[heir]) {
        const heirPercentage = parseFloat(this.results[heir].percentage);
        const additionalAmount = (heirPercentage / totalShares) * this.remainingAmount;
        
        this.results[heir].amount = (parseFloat(this.results[heir].amount) + additionalAmount).toFixed(3);
        this.results[heir].percentage = this.formatPercentage((parseFloat(this.results[heir].amount) / this.totalAmount) * 100);
        this.results[heir].note = this.results[heir].note + ' + ' + t(noteKey);
      }
    }
    
    this.remainingAmount = 0;
  }

  applyRaddToDaughtersOnly(noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

    const daughterHeirs = Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );
    const daughterCount = daughterHeirs.length;
    
    if (daughterCount === 0) return;

    const sharePerDaughter = this.remainingAmount / daughterCount;
    
    for (const daughter of daughterHeirs) {
      if (this.results[daughter]) {
        this.results[daughter].amount = (parseFloat(this.results[daughter].amount) + sharePerDaughter).toFixed(3);
        this.results[daughter].percentage = this.formatPercentage((parseFloat(this.results[daughter].amount) / this.totalAmount) * 100);
        this.results[daughter].note = this.results[daughter].note + ' + ' + t(noteKey);
      } else {
        this.addHeirWithShare(daughter, sharePerDaughter, t(noteKey), true);
      }
    }
    
    this.remainingAmount = 0;
  }

  generateWifeNote(wifeCount) {
    const notes = {
      1: t('wifeOneShare') || 'الثمن فرض للزوجة لوجود أبناء',
      2: t('wifeTwoShare') || 'نصف الثمن فرض للزوجتين لوجود أبناء',
      3: t('wifeThreeShare') || 'ثلث الثمن فرض لثلاث زوجات لوجود أبناء',
      4: t('wifeFourShare') || 'ربع الثمن فرض لأربع زوجات لوجود أبناء'
    };
    
    return notes[wifeCount] || `حصة الزوجة (${wifeCount} زوجات)`;
  }

  // ========== الدالة الرئيسية ==========
  
  calculate() {
    console.log('🧮 === بدء الحسابات ===');
    console.log('نوع المتوفى:', this.deceasedType === DECEASED_TYPE.FATHER ? 'أب' : 'أم');
    console.log('الورثة المدخلون:', this.allHeirKeys);
    
    // حالة خاصة: أب + أم + ابنة واحدة
    if (this.handleFatherMotherDaughterCase()) {
      console.log('✅ تمت معالجة الحالة الخاصة: أب + أم + ابنة واحدة');
      this.ensureAllHeirsAreIncluded();
      return this.ensureAllData(this.results);
    }

    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);

    console.log('👦 له ابن؟:', hasSon);
    // ======== أضف هذا بعد applyRaddToDaughtersOnly ========
  
  // 🔑 المفتاح السابع: حالة عدم وجود أبناء أو بنات
  applyKey7() {
    console.log('🔑 تطبيق المفتاح 7: حالة عدم وجود أبناء أو بنات');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasBrother = checkHeirs(this.heirs, CONDITIONS.hasBrother);
    const hasSister = checkHeirs(this.heirs, CONDITIONS.hasSister);
    const hasGrandfather = checkHeirs(this.heirs, CONDITIONS.hasGrandfather);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);

    // الحالة 1: زوج فقط
    if (hasHusband && this.allHeirKeys.length === 1) {
      this.addHeirWithShare('husband', this.totalAmount, 'كل التركة للزوج', false);
      return true;
    }

    // الحالة 2: زوجة فقط
    if (hasWife && this.allHeirKeys.length === 1) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const sharePerWife = this.totalAmount / wifeHeirs.length;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, 'كل التركة للزوجة', false);
      }
      return true;
    }

    // الحالة 3: أب فقط
    if (hasFather && this.allHeirKeys.length === 1) {
      this.addHeirWithShare('father', this.totalAmount, 'كل التركة للأب', false);
      return true;
    }

    // الحالة 4: أم فقط
    if (hasMother && this.allHeirKeys.length === 1) {
      this.addHeirWithShare('mother', this.totalAmount, 'كل التركة للأم', false);
      return true;
    }

    // الحالة 5: زوج + أب + أم
    if (hasHusband && hasFather && hasMother) {
      this.assignFixedShare('husband', SHARES.half, 'halfNote');
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.third, 'thirdNote');
      
      this.applyRaddToEligibleHeirs(['husband', 'father', 'mother'], 'raddNote');
      return true;
    }

    // الحالة 6: زوجة + أب + أم
    if (hasWife && hasFather && hasMother) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.quarter);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.third, 'thirdNote');
      
      this.applyRaddToEligibleHeirs(['father', 'mother', ...wifeHeirs], 'raddNote');
      return true;
    }

    // الحالة 7: زوج + أب
    if (hasHusband && hasFather) {
      this.assignFixedShare('husband', SHARES.half, 'halfNote');
      this.addHeirWithShare('father', this.remainingAmount, 'الباقي للأب', true);
      return true;
    }

    // الحالة 8: زوج + أم
    if (hasHusband && hasMother) {
      this.assignFixedShare('husband', SHARES.half, 'halfNote');
      this.assignFixedShare('mother', SHARES.third, 'thirdNote');
      
      this.applyRaddToEligibleHeirs(['husband', 'mother'], 'raddNote');
      return true;
    }

    // الحالة 9: زوجة + أب
    if (hasWife && hasFather) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.quarter);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      this.addHeirWithShare('father', this.remainingAmount, 'الباقي للأب', true);
      return true;
    }

    // الحالة 10: زوجة + أم
    if (hasWife && hasMother) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.quarter);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      this.assignFixedShare('mother', SHARES.third, 'thirdNote');
      
      this.applyRaddToEligibleHeirs(['mother', ...wifeHeirs], 'raddNote');
      return true;
    }

    // الحالة 11: أب + أم
    if (hasFather && hasMother) {
      this.assignFixedShare('mother', SHARES.third, 'thirdNote');
      this.addHeirWithShare('father', this.remainingAmount, 'الباقي للأب', true);
      return true;
    }

    // الحالة 12: إخوة وأخوات (عصبة)
    if ((hasBrother || hasSister) && !hasFather && !hasMother) {
      this.applyMaleFemaleRatioToRemaining();
      return true;
    }

    // الحالة 13: جد + جدة
    if (hasGrandfather && hasGrandmother) {
      this.assignFixedShare('grandmother', SHARES.sixth, 'sixthNote');
      this.addHeirWithShare('grandfather', this.remainingAmount, 'الباقي للجد', true);
      return true;
    }

    return false;
  }

// ======== وأضف هذا في دالة calculate() ========

    // 🔴 التعديل الجديد: إذا لم يكن هناك ابن أو ابنة، جرب المفتاح السابع
    if (!hasSon && !hasDaughter) {
      console.log('🔑 لا يوجد أبناء أو بنات، جرب المفتاح السابع');
      const key7Applied = this.applyKey7();
      
      if (key7Applied) {
        console.log('✅ تم تطبيق المفتاح السابع بنجاح');
        this.ensureAllHeirsAreIncluded();
        return this.ensureAllData(this.results);
      }
    }
    console.log('👧 له بنت؟:', hasDaughter);
    console.log('👧👧 له أكثر من بنت؟:', hasMultipleDaughters);

    // حالة الابن والابنة معاً
    if (hasSon && hasDaughter) {
      console.log('⚖️ حالة: الابن والابنة معاً (للذكر مثل حظ الأنثيين)');
      
      // الحالة الخاصة: زوج/زوجة + أب + أم + أبناء + بنات
      if (this.deceasedType === DECEASED_TYPE.MOTHER) {
        const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
        const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
        const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
        
        if (hasHusband) this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
        if (hasFather) this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
        if (hasMother) this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      } else if (this.deceasedType === DECEASED_TYPE.FATHER) {
        const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
        const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
        const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
        
        if (hasWife) {
          const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
          const wifeCount = wifeHeirs.length;
          const totalWifeShare = this.calculateShare(SHARES.eighth);
          const sharePerWife = totalWifeShare / wifeCount;
          
          for (const wife of wifeHeirs) {
            this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
          }
        }
        
        if (hasFather) this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
        if (hasMother) this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      }
      
      this.applyMaleFemaleRatioToRemaining();
      this.ensureAllHeirsAreIncluded();
      return this.ensureAllData(this.results);
    }

    // تطبيق المفاتيح حسب نوع المتوفى
    if (this.deceasedType === DECEASED_TYPE.FATHER) {
      if (hasSon) {
        this.applyKey1();
      } else if (hasDaughter) {
        if (hasMultipleDaughters) {
          this.applyKey3();
        } else {
          this.applyKey2();
        }
      }
    } else if (this.deceasedType === DECEASED_TYPE.MOTHER) {
      if (hasSon) {
        this.applyKey4();
      } else if (hasDaughter) {
        if (hasMultipleDaughters) {
          this.applyKey6();
        } else {
          this.applyKey5();
        }
      }
    }

    // إضافة بيت المال إذا كان هناك باقي
    if (this.remainingAmount > 0.01) {
      const percentage = this.formatPercentage((this.remainingAmount / this.totalAmount) * 100);
      this.results['bayt_al_mal'] = {
        title: t('baytAlMal') || 'بيت المال',
        amount: this.remainingAmount.toFixed(3),
        percentage: percentage,
        note: t('baytAlMalNote') || 'الباقي لبيت المال'
      };
    }

    this.ensureAllHeirsAreIncluded();
    return this.ensureAllData(this.results);
  }

  // دوال مساعدة أخرى
  ensureAllHeirsAreIncluded() {
    for (const heirKey of this.allHeirKeys) {
      if (!this.results[heirKey]) {
        this.addHeirWithShare(heirKey, 0, 'لا حصة', false);
      }
    }
  }

  ensureAllData(results) {
    const finalResults = {};
    for (const [key, result] of Object.entries(results)) {
      finalResults[key] = {
        ...result,
        title: result.title || this.getHeirTitle(key),
        name: result.name || '',
        religion: result.religion || 'مسلم',
        gender: result.gender || this.getHeirGender(key),
        originalTitle: result.originalTitle || result.title || this.getHeirTitle(key)
      };
    }
    return finalResults;
  }

  handleFatherMotherDaughterCase() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);
    const hasOtherHeirs = this.hasOtherHeirs();

    if (hasFather && hasMother && hasDaughter && !hasSon && !hasMultipleDaughters && !hasOtherHeirs) {
      console.log('🔑 تطبيق الحالة الخاصة: أب + أم + ابنة واحدة');
      
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const daughterHeirs = Object.keys(this.heirs).filter(key => 
        key === 'daughter' || key.startsWith('daughter_')
      );
      if (daughterHeirs.length > 0) {
        this.assignFixedShare(daughterHeirs[0], SHARES.half, 'halfNote');
      }
      
      const fatherShare = this.remainingAmount;
      this.addHeirWithShare('father', fatherShare, t('remainderNote'), true);
      
      this.remainingAmount = 0;
      return true;
    }
    
    return false;
  }

  hasOtherHeirs() {
    const excludedKeys = ['father', 'mother', 'son', 'daughter'];
    return Object.keys(this.heirs).some(key => {
      return !excludedKeys.some(excluded => key.startsWith(excluded) || key === excluded);
    });
  }
}

// دالة التوزيع الرئيسية
export function distribute(total = 100, heirs, deceasedType) {
  const calculator = new InheritanceCalculator(deceasedType, heirs, total);
  return calculator.calculate();
}
