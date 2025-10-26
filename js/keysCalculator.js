import { 
  SHARES, 
  DECEASED_TYPE, 
  HEIR_TYPES,
  CONDITIONS, 
  checkHeirs, 
  getHeirCounts 
} from "./conditions.js";

export class InheritanceCalculator {
  constructor(deceasedType, heirs, totalAmount = 100) {
    this.deceasedType = deceasedType;
    this.heirs = heirs;
    this.totalAmount = parseFloat(totalAmount) || 100;
    this.heirCounts = getHeirCounts(heirs);
    this.results = {};
    this.remainingAmount = this.totalAmount;
  }

  // الدوال الأساسية للحساب
  calculateShare(shareType) {
    const shares = {
      [SHARES.quarter]: 1 / 4,
      [SHARES.eighth]: 1 / 8,
      [SHARES.half]: 1 / 2,
      [SHARES.third]: 1 / 3,
      [SHARES.sixth]: 1 / 6,
      [SHARES.twoThirds]: 2 / 3
    };
    return this.totalAmount * (shares[shareType] || 0);
  }

  formatPercentage(percentage) {
    const num = parseFloat(percentage);
    return isNaN(num) ? '0.000' : num.toFixed(3);
  }

  // تخصيص حصة ثابتة لوارث
  assignFixedShare(heirType, shareType, note = '') {
    const shareAmount = this.calculateShare(shareType);
    const percentage = this.formatPercentage((shareAmount / this.totalAmount) * 100);
    
    this.results[heirType] = {
      ...this.heirs[heirType],
      amount: shareAmount.toFixed(2),
      percentage: percentage,
      note: note
    };
    
    this.remainingAmount -= shareAmount;
    return shareAmount;
  }

  // تطبيق الرد (الباقي) على مجموعة من الورثة
  applyRadd(eligibleHeirs, note = '') {
  if (this.remainingAmount <= 0) return;

  const totalShares = eligibleHeirs.reduce((sum, heir) => {
    return sum + parseFloat(this.results[heir]?.percentage || 0);
  }, 0);

  if (totalShares === 0) return;

  for (const heir of eligibleHeirs) {
    if (this.results[heir]) {
      const heirPercentage = parseFloat(this.results[heir].percentage);
      const additionalAmount = (heirPercentage / totalShares) * this.remainingAmount;
      const newAmount = parseFloat(this.results[heir].amount) + additionalAmount;
      const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
      
      // الإصلاح: منع تكرار كلمة "رحم"
      const currentNote = this.results[heir].note || '';
      const newNotePart = 'الباقي يرد رحم حسب سهامهما';
      const finalNote = currentNote && !currentNote.includes('يرد رحم') ? 
        currentNote + ' + ' + newNotePart : newNotePart;
      
      this.results[heir] = {
        ...this.results[heir],
        amount: newAmount.toFixed(2),
        percentage: newPercentage,
        note: finalNote
      };
    }
  }
  
  this.remainingAmount = 0;
}

  // تطبيق الرد على البنات فقط بالتساوي
applyRaddToDaughtersOnly(note = '') {
  if (this.remainingAmount <= 0) return;

  const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));
  const daughterCount = daughterHeirs.length;
  
  if (daughterCount === 0) return;

  const sharePerDaughter = this.remainingAmount / daughterCount;
  
  for (const daughter of daughterHeirs) {
    const currentAmount = parseFloat(this.results[daughter]?.amount || 0);
    const newAmount = currentAmount + sharePerDaughter;
    const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
    
    // الإصلاح: منع تكرار كلمة "رحم"
    const currentNote = this.results[daughter]?.note || '';
    const newNotePart = 'الباقي يرد رحم على البنات فقط بالتساوي';
    const finalNote = currentNote && !currentNote.includes('يرد رحم') ? 
      currentNote + ' + ' + newNotePart : newNotePart;
    
    this.results[daughter] = {
      ...this.results[daughter],
      amount: newAmount.toFixed(2),
      percentage: newPercentage,
      note: finalNote
    };
  }
  
  this.remainingAmount = 0;
}

  // ========== إضافة الدالة المفقودة: إعطاء الباقي للابن فقط ==========
  giveRemainingToSonOnly(note = '') {
    if (this.remainingAmount <= 0) return;

    const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_'));
    if (sonHeirs.length === 0) return;

    const sharePerSon = this.remainingAmount / sonHeirs.length;
    
    for (const son of sonHeirs) {
      const currentAmount = parseFloat(this.results[son]?.amount || 0);
      const newAmount = currentAmount + sharePerSon;
      const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
      
      this.results[son] = {
        ...this.results[son],
        amount: newAmount.toFixed(2),
        percentage: newPercentage,
        note: 'والباقي كاملاً للابن'
      };
    }
    
    this.remainingAmount = 0;
  }
// للذكر مثل حظ الانثيين
applyMaleFemaleRatio() {
  const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_'));
  const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));
  const sisterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('sister_'));

  const totalShares = (sonHeirs.length * 2) + daughterHeirs.length + sisterHeirs.length;
  if (totalShares === 0) return;

  const sharePerUnit = this.remainingAmount / totalShares;

  // توزيع على الأبناء
  for (const son of sonHeirs) {
    this.results[son] = {
      ...this.heirs[son],
      amount: (sharePerUnit * 2).toFixed(2),
      percentage: this.formatPercentage(((sharePerUnit * 2) / this.totalAmount) * 100),
      note: 'للذكر مثل حظ الانثيين'
    };
  }

  // ========== الإصلاح: توزيع على البنات وإضافتهن إلى النتائج ==========
  for (const daughter of daughterHeirs) {
    this.results[daughter] = {
      ...this.heirs[daughter],
      amount: sharePerUnit.toFixed(2),
      percentage: this.formatPercentage((sharePerUnit / this.totalAmount) * 100),
      note: 'للذكر مثل حظ الانثيين'
    };
  }

  // توزيع على الأخوات
  for (const sister of sisterHeirs) {
    this.results[sister] = {
      ...this.heirs[sister],
      amount: sharePerUnit.toFixed(2),
      percentage: this.formatPercentage((sharePerUnit / this.totalAmount) * 100),
      note: 'للذكر مثل حظ الانثيين'
    };
  }

  this.remainingAmount = 0;
}

  // ========== المفاتيح الستة الرئيسية ==========

  // المفتاح الأول: الابن + متوفي أب
  applyKey1() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSister = checkHeirs(this.heirs, CONDITIONS.hasSister);

    // الابن مع الأخت
    if (hasSister) {
      this.applyMaleFemaleRatio();
      return;
    }

    // الابن مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الزوجة
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.results[wife] = {
          ...this.heirs[wife],
          amount: sharePerWife.toFixed(2),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: `حصة الزوجة ${wifeCount > 1 ? `(${wifeCount} زوجات)` : ''}`
        };
        this.remainingAmount -= sharePerWife;
      }
      
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
  }

  // المفتاح الثاني: الابنة + متوفي أب
  applyKey2() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    // الابنة مع الابن
    if (hasSon) {
      this.applyMaleFemaleRatio();
      return;
    }

    // الابنة مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['father', 'mother', 'daughter_1'], 'الباقي يرد رحم على الابنة والأب والأم حسب سهامهما');
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['father', 'daughter_1'], 'الباقي يرد رحم على الابنة والأب حسب سهامهما');
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['mother', 'daughter_1'], 'الباقي يرد رحم على الابنة والأم حسب سهامهما');
    }
    // الابنة مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'الثمن فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['daughter_1'], 'الباقي يرد رحم للابنة فقط');
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['daughter_1'], 'الباقي يرد رحم للابنة فقط');
    }
  }

  // المفتاح الثالث: ابنتين فصاعدا + متوفي أب
  applyKey3() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));

    // ابنتين مع الابن
    if (hasSon) {
      this.applyMaleFemaleRatio();
      return;
    }

    // ابنتين مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', 'mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'الباقي يرد رحم على البنات والأب والأم حسب سهامهما');
    }
    // ابنتين مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'الباقي يرد رحم على البنات والأب حسب سهامهما');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'الباقي يرد رحم على البنات والأم حسب سهامهما');
    }
    // ابنتين مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'الثمن فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('الباقي يرد رحم على البنات فقط بالتساوي');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('الباقي يرد رحم على البنات فقط بالتساوي');
    }
  }

  // المفتاح الرابع: الابن + متوفي أم
  applyKey4() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSister = checkHeirs(this.heirs, CONDITIONS.hasSister);

    // الابن مع الأخت
    if (hasSister) {
      this.applyMaleFemaleRatio();
      return;
    }

    // الابن مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
    // الابن مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'الربع فرض');
      this.giveRemainingToSonOnly('الباقي يرد رحم للابن فقط');
    }
  }

  // المفتاح الخامس: الابنة + متوفي أم
  applyKey5() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    // الابنة مع الابن
    if (hasSon) {
      this.applyMaleFemaleRatio();
      return;
    }

    // الابنة مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['father', 'mother', 'daughter_1'], 'الباقي يرد رحم على الابنة والأب والأم حسب سهامهما');
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['father', 'daughter_1'], 'الباقي يرد رحم على الابنة والأب حسب سهامهما');
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['mother', 'daughter_1'], 'الباقي يرد رحم على الابنة والأم حسب سهامهما');
    }
    // الابنة مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'الربع فرض');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['daughter_1'], 'الباقي يرد رحم للابنة فقط');
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      this.assignFixedShare('daughter_1', SHARES.half, 'النصف فرض');
      this.applyRadd(['daughter_1'], 'الباقي يرد رحم للابنة فقط');
    }
  }

  // المفتاح السادس: ابنتين فصاعدا + متوفي أم
  applyKey6() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));

    // ابنتين مع الابن
    if (hasSon) {
      this.applyMaleFemaleRatio();
      return;
    }

    // ابنتين مع الأب
    if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'السدس فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'الباقي يرد رحم على البنات والأب حسب سهامهما');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'السدس فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'الباقي يرد رحم على البنات والأم حسب سهامهما');
    }
    // ابنتين مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'الربع فرض');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('الباقي يرد رحم على البنات فقط بالتساوي');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'السدس سنة');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(2),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: 'ثلثين فرض'
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('الباقي يرد رحم على البنات فقط بالتساوي');
    }
  }
// الدالة الرئيسية لتحديد المفتاح المناسب
calculate() {
  const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
  const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
  const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);

  console.log('=== CALCULATION DEBUG ===');
  console.log('Deceased Type:', this.deceasedType);
  console.log('Has Son:', hasSon);
  console.log('Has Daughter:', hasDaughter);
  console.log('Has Multiple Daughters:', hasMultipleDaughters);
  console.log('All Heirs:', Object.keys(this.heirs));

  // ========== الإصلاح: عندما يوجد ابن وابنة معاً ==========
  if (hasSon && hasDaughter) {
    console.log('Applying MALE/FEMALE RATIO: للذكر مثل حظ الانثيين');
    this.applyMaleFemaleRatio();
    return this.results;
  }

  if (this.deceasedType === DECEASED_TYPE.FATHER) {
    if (hasSon) {
      console.log('Applying KEY 1: الابن + متوفي أب');
      this.applyKey1();
    } else if (hasDaughter) {
      if (hasMultipleDaughters) {
        console.log('Applying KEY 3: ابنتين فصاعدا + متوفي أب');
        this.applyKey3();
      } else {
        console.log('Applying KEY 2: الابنة + متوفي أب');
        this.applyKey2();
      }
    }
  } else if (this.deceasedType === DECEASED_TYPE.MOTHER) {
    if (hasSon) {
      console.log('Applying KEY 4: الابن + متوفي أم');
      this.applyKey4();
    } else if (hasDaughter) {
      if (hasMultipleDaughters) {
        console.log('Applying KEY 6: ابنتين فصاعدا + متوفي أم');
        this.applyKey6();
      } else {
        console.log('Applying KEY 5: الابنة + متوفي أم');
        this.applyKey5();
      }
    }
  }

  console.log('Final Results:', this.results);
  console.log('=== END CALCULATION DEBUG ===');

  return this.results;
}

// دالة التوزيع الرئيسية للاستيراد
export function distribute(total = 100, heirs, deceasedType) {
  const calculator = new InheritanceCalculator(deceasedType, heirs, total);
  return calculator.calculate();
}
