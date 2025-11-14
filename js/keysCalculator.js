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
  assignFixedShare(heirType, shareType, noteKey = '') {
    const shareAmount = this.calculateShare(shareType);
    const percentage = this.formatPercentage((shareAmount / this.totalAmount) * 100);
    
    this.results[heirType] = {
      ...this.heirs[heirType],
      amount: shareAmount.toFixed(3),
      percentage: percentage,
      note: t(noteKey) || noteKey
    };
    
    this.remainingAmount -= shareAmount;
    return shareAmount;
  }

  // تطبيق الرد (الباقي) على مجموعة من الورثة
  applyRadd(eligibleHeirs, noteKey = '') {
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
        const newNotePart = t(noteKey);
        const finalNote = currentNote && !currentNote.includes(t('raddNote')) ? 
          currentNote + ' + ' + newNotePart : newNotePart;
        
        this.results[heir] = {
          ...this.results[heir],
          amount: newAmount.toFixed(3),
          percentage: newPercentage,
          note: finalNote
        };
      }
    }
    
    this.remainingAmount = 0;
  }

  // تطبيق الرد على البنات فقط بالتساوي
  applyRaddToDaughtersOnly(noteKey = '') {
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
      const newNotePart = t(noteKey);
      const finalNote = currentNote && !currentNote.includes(t('raddNote')) ? 
        currentNote + ' + ' + newNotePart : newNotePart;
      
      this.results[daughter] = {
        ...this.results[daughter],
        amount: newAmount.toFixed(3),
        percentage: newPercentage,
        note: finalNote
      };
    }
    
    this.remainingAmount = 0;
  }

  // إعطاء الباقي للابن فقط
  giveRemainingToSonOnly(noteKey = '') {
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
        amount: newAmount.toFixed(3),
        percentage: newPercentage,
        note: t(noteKey)
      };
    }
    
    this.remainingAmount = 0;
  }

  // للذكر مثل حظ الانثيين
  applyMaleFemaleRatio() {
    const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_'));
    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));
    const sisterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('sister_'));

    // حساب الأنصبة الثابتة أولاً (الزوج/الزوجة، الأب، الأم)
    this.calculateFixedSharesBeforeRatio();

    const totalShares = (sonHeirs.length * 2) + daughterHeirs.length + sisterHeirs.length;
    if (totalShares === 0) return;

    const sharePerUnit = this.remainingAmount / totalShares;

    // توزيع على الأبناء
    for (const son of sonHeirs) {
      this.results[son] = {
        ...this.heirs[son],
        amount: (sharePerUnit * 2).toFixed(3),
        percentage: this.formatPercentage(((sharePerUnit * 2) / this.totalAmount) * 100),
        note: t('maleFemaleRatioNote')
      };
    }

    // توزيع على البنات
    for (const daughter of daughterHeirs) {
      this.results[daughter] = {
        ...this.heirs[daughter],
        amount: sharePerUnit.toFixed(3),
        percentage: this.formatPercentage((sharePerUnit / this.totalAmount) * 100),
        note: t('maleFemaleRatioNote')
      };
    }

    // توزيع على الأخوات
    for (const sister of sisterHeirs) {
      this.results[sister] = {
        ...this.heirs[sister],
        amount: sharePerUnit.toFixed(3),
        percentage: this.formatPercentage((sharePerUnit / this.totalAmount) * 100),
        note: t('maleFemaleRatioNote')
      };
    }

    this.remainingAmount = 0;
  }

  // حساب الأنصبة الثابتة قبل تطبيق "للذكر مثل حظ الانثيين"
  calculateFixedSharesBeforeRatio() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);

    // الزوج
    if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
    }

    // الزوجة - تم التعديل هنا
    if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      // تحديد رسالة التوضيح بناءً على عدد الزوجات
      let wifeNote = '';
      switch(wifeCount) {
        case 1:
          wifeNote = t('wifeOneShare');
          break;
        case 2:
          wifeNote = t('wifeTwoShare');
          break;
        case 3:
          wifeNote = t('wifeThreeShare');
          break;
        case 4:
          wifeNote = t('wifeFourShare');
          break;
        default:
          wifeNote = t('wifeShareNote') + ` (${wifeCount} ${t('numberOfWives')})`;
      }
      
      for (const wife of wifeHeirs) {
        this.results[wife] = {
          ...this.heirs[wife],
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: wifeNote
        };
        this.remainingAmount -= sharePerWife;
      }
    }

    // الأب
    if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
    }

    // الأم
    if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
    }

    // الجدة
    if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
    }
  }

  // ========== التعديل الرئيسي: حالة الأب + الأم + الابنة ==========
  handleFatherMotherDaughterCase() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);
    const hasOtherHeirs = this.hasOtherHeirs();

    // الحالة الأساسية: أب + أم + ابنة واحدة فقط
    if (hasFather && hasMother && hasDaughter && !hasSon && !hasMultipleDaughters && !hasOtherHeirs) {
      console.log('APPLYING SPECIAL CASE: Father + Mother + Single Daughter');
      
      // الأم: سدس
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      // الابنة: نصف
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      this.results[daughterKey] = {
        ...this.heirs[daughterKey],
        amount: this.calculateShare(SHARES.half).toFixed(3),
        percentage: this.formatPercentage(50),
        note: t('halfNote')
      };
      this.remainingAmount -= this.calculateShare(SHARES.half);
      
      // الأب: الباقي (ثلث)
      const fatherShare = this.remainingAmount;
      const fatherPercentage = this.formatPercentage((fatherShare / this.totalAmount) * 100);
      
      this.results['father'] = {
        ...this.heirs['father'],
        amount: fatherShare.toFixed(3),
        percentage: fatherPercentage,
        note: t('remainderNote')
      };
      
      this.remainingAmount = 0;
      this.specialCaseHandled = true;
      return true;
    }
    
    return false;
  }

  // دالة مساعدة للتحقق من وجود ورثة آخرين
  hasOtherHeirs() {
    const excludedKeys = ['father', 'mother', 'son', 'daughter'];
    return Object.keys(this.heirs).some(key => {
      return !excludedKeys.some(excluded => key.startsWith(excluded) || key === excluded);
    });
  }

  // ========== المفاتيح الستة الرئيسية ==========

  // المفتاح الأول: الابن + متوفي أب
  applyKey1() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الزوجة
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      // تحديد رسالة التوضيح بناءً على عدد الزوجات
      let wifeNote = '';
      switch(wifeCount) {
        case 1:
          wifeNote = t('wifeOneShare');
          break;
        case 2:
          wifeNote = t('wifeTwoShare');
          break;
        case 3:
          wifeNote = t('wifeThreeShare');
          break;
        case 4:
          wifeNote = t('wifeFourShare');
          break;
        default:
          wifeNote = t('wifeShareNote') + ` (${wifeCount} ${t('numberOfWives')})`;
      }
      
      for (const wife of wifeHeirs) {
        this.results[wife] = {
          ...this.heirs[wife],
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: wifeNote
        };
        this.remainingAmount -= sharePerWife;
      }
      
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
  }

  // المفتاح الثاني: الابنة + متوفي أب
  applyKey2() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['father', 'mother', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['father', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['mother', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الزوجة
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      // تحديد رسالة التوضيح بناءً على عدد الزوجات
      let wifeNote = '';
      switch(wifeCount) {
        case 1:
          wifeNote = t('wifeOneShare');
          break;
        case 2:
          wifeNote = t('wifeTwoShare');
          break;
        case 3:
          wifeNote = t('wifeThreeShare');
          break;
        case 4:
          wifeNote = t('wifeFourShare');
          break;
        default:
          wifeNote = t('wifeShareNote') + ` (${wifeCount} ${t('numberOfWives')})`;
      }
      
      for (const wife of wifeHeirs) {
        this.results[wife] = {
          ...this.heirs[wife],
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: wifeNote
        };
        this.remainingAmount -= sharePerWife;
      }
      
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['daughter_1'], 'remainderToDaughterNote');
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['daughter_1'], 'remainderToDaughterNote');
    }
  }

  // المفتاح الثالث: ابنتين فصاعدا + متوفي أب
  applyKey3() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', 'mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'raddNote');
    }
    // ابنتين مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'raddNote');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'raddNote');
    }
    // ابنتين مع الزوجة
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      // تحديد رسالة التوضيح بناءً على عدد الزوجات
      let wifeNote = '';
      switch(wifeCount) {
        case 1:
          wifeNote = t('wifeOneShare');
          break;
        case 2:
          wifeNote = t('wifeTwoShare');
          break;
        case 3:
          wifeNote = t('wifeThreeShare');
          break;
        case 4:
          wifeNote = t('wifeFourShare');
          break;
        default:
          wifeNote = t('wifeShareNote') + ` (${wifeCount} ${t('numberOfWives')})`;
      }
      
      for (const wife of wifeHeirs) {
        this.results[wife] = {
          ...this.heirs[wife],
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: wifeNote
        };
        this.remainingAmount -= sharePerWife;
      }
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  // المفاتيح 4، 5، 6 (نفس المنطق مع تعديلات الزوجة)
  applyKey4() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
  }

  applyKey5() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['father', 'mother', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['father', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['mother', 'daughter_1'], 'raddNote');
    }
    // الابنة مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['daughter_1'], 'remainderToDaughterNote');
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.assignFixedShare('daughter_1', SHARES.half, 'halfNote');
      this.applyRadd(['daughter_1'], 'remainderToDaughterNote');
    }
  }

  applyKey6() {
    if (this.handleFatherMotherDaughterCase()) return;
    
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
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['father', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'raddNote');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      const eligibleHeirs = ['mother', ...daughterHeirs];
      this.applyRadd(eligibleHeirs, 'raddNote');
    }
    // ابنتين مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const totalDaughtersShare = this.calculateShare(SHARES.twoThirds);
      const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
      
      for (const daughter of daughterHeirs) {
        this.results[daughter] = {
          ...this.heirs[daughter],
          amount: sharePerDaughter.toFixed(3),
          percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
          note: t('twoThirdsNote')
        };
        this.remainingAmount -= sharePerDaughter;
      }
      
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  calculate() {
    console.log('=== CALCULATION DEBUG ===');
    console.log('Deceased Type:', this.deceasedType);
    console.log('All Heirs:', Object.keys(this.heirs));
    
    // حالة خاصة: أب + أم + ابنة واحدة
    if (this.handleFatherMotherDaughterCase()) {
      console.log('Handled special case: Father + Mother + Single Daughter');
      return this.results;
    }

    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);

    console.log('Has Son:', hasSon);
    console.log('Has Daughter:', hasDaughter);
    console.log('Has Multiple Daughters:', hasMultipleDaughters);

    // حالة الابن والابنة معاً
    if (hasSon && hasDaughter) {
      console.log('Applying MALE/FEMALE RATIO: للذكر مثل حظ الأنثيين');
      this.applyMaleFemaleRatio();
      return this.results;
    }

    if (this.deceasedType === DECEASED_TYPE.FATHER) {
      if (hasSon) {
        console.log('Applying KEY 1: الابن + متوفي أب');
        this.applyKey1();
      } else if (hasDaughter) {
        if (hasMultipleDaughters) {
          console.log('Applying KEY 3: ابنتين فصاعداً + متوفي أب');
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
          console.log('Applying KEY 6: ابنتين فصاعداً + متوفي أم');
          this.applyKey6();
        } else {
          console.log('Applying KEY 5: الابنة + متوفي أم');
          this.applyKey5();
        }
      }
    }

    // التحقق من باقي المبلغ وإضافته لبيت المال إذا لزم الأمر
    if (this.remainingAmount > 0.01) {
      const percentage = this.formatPercentage((this.remainingAmount / this.totalAmount) * 100);
      this.results['bayt_al_mal'] = {
        title: t('baytAlMal'),
        amount: this.remainingAmount.toFixed(3),
        percentage: percentage,
        note: t('baytAlMalNote')
      };
    }

    console.log('Final Results:', this.results);
    console.log('=== END CALCULATION DEBUG ===');

    return this.results;
  }
}

// دالة التوزيع الرئيسية للاستيراد
export function distribute(total = 100, heirs, deceasedType) {
  const calculator = new InheritanceCalculator(deceasedType, heirs, total);
  return calculator.calculate();
}
