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

  // ========== الدوال الأساسية المحسنة ==========
  
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

  // تخصيص حصة ثابتة لوارث مع بيانات كاملة
  assignFixedShare(heirType, shareType, noteKey = '') {
    const shareAmount = this.calculateShare(shareType);
    const percentage = this.formatPercentage((shareAmount / this.totalAmount) * 100);
    
    // الحصول على بيانات الوريث الأصلية للحفاظ على جميع المعلومات
    const heirData = this.heirs[heirType] || {};
    
    this.results[heirType] = {
      ...heirData,
      title: heirData.title || this.getHeirTitle(heirType),
      name: heirData.name || '',
      religion: heirData.religion || 'مسلم',
      gender: heirData.gender || this.getHeirGender(heirType),
      amount: shareAmount.toFixed(3),
      percentage: percentage,
      note: t(noteKey) || noteKey,
      originalTitle: heirData.originalTitle || heirData.title
    };
    
    this.remainingAmount -= shareAmount;
    return shareAmount;
  }

  // الحصول على عنوان الوريث من البيانات الأصلية
  getHeirTitle(heirType) {
    if (this.heirs[heirType]) {
      return this.heirs[heirType].title || this.heirs[heirType].originalTitle || heirType;
    }
    
    // إذا كان المفتاح يحتوي على رقم (مثل son_1, daughter_2)
    if (heirType.includes('_')) {
      const baseKey = heirType.split('_')[0];
      if (this.heirs[baseKey]) {
        return this.heirs[baseKey].title || this.heirs[baseKey].originalTitle || baseKey;
      }
    }
    
    return heirType;
  }

  // تحديد جنس الوريث
  getHeirGender(heirType) {
    const heir = this.heirs[heirType];
    if (heir && heir.gender) return heir.gender;
    
    // تحديد الجنس من نوع الوريث
    if (heirType.includes('son') || heirType.includes('brother') || heirType.includes('husband') || 
        heirType.includes('father') || heirType.includes('grandfather') || heirType.includes('uncle')) {
      return 'male';
    } else if (heirType.includes('daughter') || heirType.includes('sister') || heirType.includes('wife') || 
               heirType.includes('mother') || heirType.includes('grandmother') || heirType.includes('aunt')) {
      return 'female';
    }
    
    return 'male'; // افتراضي
  }

  // ========== نظام الرد (Radd) المحسن ==========
  
  applyRadd(eligibleHeirs, noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

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
        
        // منع تكرار الملاحظات
        const currentNote = this.results[heir].note || '';
        const newNotePart = t(noteKey);
        let finalNote = currentNote;
        
        if (newNotePart && !currentNote.includes(newNotePart)) {
          finalNote = currentNote ? `${currentNote} + ${newNotePart}` : newNotePart;
        }
        
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

  applyRaddToDaughtersOnly(noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));
    const daughterCount = daughterHeirs.length;
    
    if (daughterCount === 0) return;

    const sharePerDaughter = this.remainingAmount / daughterCount;
    
    for (const daughter of daughterHeirs) {
      if (this.results[daughter]) {
        const currentAmount = parseFloat(this.results[daughter].amount || 0);
        const newAmount = currentAmount + sharePerDaughter;
        const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
        
        const currentNote = this.results[daughter].note || '';
        const newNotePart = t(noteKey);
        let finalNote = currentNote;
        
        if (newNotePart && !currentNote.includes(newNotePart)) {
          finalNote = currentNote ? `${currentNote} + ${newNotePart}` : newNotePart;
        }
        
        this.results[daughter] = {
          ...this.results[daughter],
          amount: newAmount.toFixed(3),
          percentage: newPercentage,
          note: finalNote
        };
      }
    }
    
    this.remainingAmount = 0;
  }

  giveRemainingToSonOnly(noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

    const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_'));
    if (sonHeirs.length === 0) return;

    const sharePerSon = this.remainingAmount / sonHeirs.length;
    
    for (const son of sonHeirs) {
      if (this.results[son]) {
        const currentAmount = parseFloat(this.results[son].amount || 0);
        const newAmount = currentAmount + sharePerSon;
        const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
        
        this.results[son] = {
          ...this.results[son],
          amount: newAmount.toFixed(3),
          percentage: newPercentage,
          note: t(noteKey) || noteKey
        };
      } else {
        // إذا لم يكن الابن موجوداً في النتائج بعد، نضيفه
        const sonData = this.heirs[son] || {};
        this.results[son] = {
          ...sonData,
          title: sonData.title || this.getHeirTitle(son),
          name: sonData.name || '',
          religion: sonData.religion || 'مسلم',
          gender: 'male',
          amount: sharePerSon.toFixed(3),
          percentage: this.formatPercentage((sharePerSon / this.totalAmount) * 100),
          note: t(noteKey) || noteKey,
          originalTitle: sonData.originalTitle || sonData.title
        };
      }
    }
    
    this.remainingAmount = 0;
  }

  // ========== نظام "للذكر مثل حظ الانثيين" المحسن ==========
  
  applyMaleFemaleRatio() {
    const sonHeirs = Object.keys(this.heirs).filter(key => key.startsWith('son_') || key === 'son');
    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));

    // إذا لم يكن هناك أبناء أو بنات، لا تفعل شيئاً
    if (sonHeirs.length === 0 && daughterHeirs.length === 0) {
      return;
    }

    // حساب حصص الأبناء والبنات
    const totalShares = (sonHeirs.length * 2) + daughterHeirs.length;
    
    if (totalShares === 0) return;

    const sharePerUnit = this.remainingAmount / totalShares;

    // توزيع على الأبناء (للذكر مثل حظ الانثيين)
    for (const son of sonHeirs) {
      const sonData = this.heirs[son] || {};
      // تأكد من عدم تكرر الابن في النتائج
      if (!this.results[son]) {
        this.results[son] = {
          ...sonData,
          title: sonData.title || this.getHeirTitle(son),
          name: sonData.name || '',
          religion: sonData.religion || 'مسلم',
          gender: 'male',
          amount: (sharePerUnit * 2).toFixed(3),
          percentage: this.formatPercentage(((sharePerUnit * 2) / this.totalAmount) * 100),
          note: t('maleFemaleRatioNote'),
          originalTitle: sonData.originalTitle || sonData.title
        };
      }
    }

    // توزيع على البنات
    for (const daughter of daughterHeirs) {
      const daughterData = this.heirs[daughter] || {};
      // تأكد من عدم تكرار البنت في النتائج
      if (!this.results[daughter]) {
        this.results[daughter] = {
          ...daughterData,
          title: daughterData.title || this.getHeirTitle(daughter),
          name: daughterData.name || '',
          religion: daughterData.religion || 'مسلم',
          gender: 'female',
          amount: sharePerUnit.toFixed(3),
          percentage: this.formatPercentage((sharePerUnit / this.totalAmount) * 100),
          note: t('maleFemaleRatioNote'),
          originalTitle: daughterData.originalTitle || daughterData.title
        };
      }
    }

    this.remainingAmount = 0;
  }

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

    // الزوجات
    if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        const wifeData = this.heirs[wife] || {};
        this.results[wife] = {
          ...wifeData,
          title: wifeData.title || this.getHeirTitle(wife),
          name: wifeData.name || '',
          religion: wifeData.religion || 'مسلم',
          gender: 'female',
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: this.generateWifeNote(wifeCount),
          originalTitle: wifeData.originalTitle || wifeData.title
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

  // توليد ملاحظة خاصة للزوجات
  generateWifeNote(wifeCount) {
    const notes = {
      1: t('wifeOneShare') || 'الثمن فرض للزوجة لوجود أبناء',
      2: t('wifeTwoShare') || 'نصف الثمن فرض للزوجتين لوجود أبناء',
      3: t('wifeThreeShare') || 'ثلث الثمن فرض لثلاث زوجات لوجود أبناء',
      4: t('wifeFourShare') || 'ربع الثمن فرض لأربع زوجات لوجود أبناء'
    };
    
    return notes[wifeCount] || `حصة الزوجة (${wifeCount} زوجات)`;
  }

  // ========== حالة خاصة: الأب + الأم + الابنة ==========
  
  handleFatherMotherDaughterCase() {
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);
    const hasOtherHeirs = this.hasOtherHeirs();

    // الحالة الأساسية: أب + أم + ابنة واحدة فقط
    if (hasFather && hasMother && hasDaughter && !hasSon && !hasMultipleDaughters && !hasOtherHeirs) {
      console.log('🔑 تطبيق الحالة الخاصة: أب + أم + ابنة واحدة');
      
      // الأم: سدس
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      // الابنة: نصف
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      const daughterData = this.heirs[daughterKey] || {};
      
      this.results[daughterKey] = {
        ...daughterData,
        title: daughterData.title || this.getHeirTitle(daughterKey),
        name: daughterData.name || '',
        religion: daughterData.religion || 'مسلم',
        gender: 'female',
        amount: this.calculateShare(SHARES.half).toFixed(3),
        percentage: this.formatPercentage(50),
        note: t('halfNote'),
        originalTitle: daughterData.originalTitle || daughterData.title
      };
      this.remainingAmount -= this.calculateShare(SHARES.half);
      
      // الأب: الباقي (ثلث)
      const fatherShare = this.remainingAmount;
      const fatherPercentage = this.formatPercentage((fatherShare / this.totalAmount) * 100);
      const fatherData = this.heirs['father'] || {};
      
      this.results['father'] = {
        ...fatherData,
        title: fatherData.title || this.getHeirTitle('father'),
        name: fatherData.name || '',
        religion: fatherData.religion || 'مسلم',
        gender: 'male',
        amount: fatherShare.toFixed(3),
        percentage: fatherPercentage,
        note: t('remainderNote'),
        originalTitle: fatherData.originalTitle || fatherData.title
      };
      
      this.remainingAmount = 0;
      this.specialCaseHandled = true;
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

  // ========== المفاتيح الستة الرئيسية - المحسنة ==========

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

    // الحالة: زوجة + أب + أم + أبناء
    if (hasWife && hasFather && hasMother) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        const wifeData = this.heirs[wife] || {};
        this.results[wife] = {
          ...wifeData,
          title: wifeData.title || this.getHeirTitle(wife),
          name: wifeData.name || '',
          religion: wifeData.religion || 'مسلم',
          gender: 'female',
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: this.generateWifeNote(wifeCount),
          originalTitle: wifeData.originalTitle || wifeData.title
        };
        this.remainingAmount -= sharePerWife;
      }
      
      // الأب: السدس
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      // الأم: السدس
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      // الباقي للأبناء (للذكر مثل حظ الانثيين)
      this.applyMaleFemaleRatio();
      return;
    }

    // الابن مع الأب والأم (بدون زوجة)
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأب (بدون أم)
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأم (بدون أب)
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الزوجة (بدون أب وأم)
    else if (hasWife) {
      const wifeHeirs = Object.keys(this.heirs).filter(key => key.startsWith('wife_'));
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        const wifeData = this.heirs[wife] || {};
        this.results[wife] = {
          ...wifeData,
          title: wifeData.title || this.getHeirTitle(wife),
          name: wifeData.name || '',
          religion: wifeData.religion || 'مسلم',
          gender: 'female',
          amount: sharePerWife.toFixed(3),
          percentage: this.formatPercentage((sharePerWife / this.totalAmount) * 100),
          note: this.generateWifeNote(wifeCount),
          originalTitle: wifeData.originalTitle || wifeData.title
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
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['father', 'mother', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['father', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['mother', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'eighthNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd([daughterKey], 'remainderToDaughterNote');
      }
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd([daughterKey], 'remainderToDaughterNote');
      }
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
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRadd(['father', 'mother', ...daughterHeirs], 'raddNote');
    }
    // ابنتين مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRadd(['father', ...daughterHeirs], 'raddNote');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRadd(['mother', ...daughterHeirs], 'raddNote');
    }
    // ابنتين مع الزوجة
    else if (hasWife) {
      this.assignFixedShare('wife_1', SHARES.eighth, 'eighthNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  // دالة مساعدة لتوزيع حصة متعددة البنات
  assignMultipleDaughtersShare(daughterHeirs, shareType, noteKey) {
    const totalDaughtersShare = this.calculateShare(shareType);
    const sharePerDaughter = totalDaughtersShare / daughterHeirs.length;
    
    for (const daughter of daughterHeirs) {
      const daughterData = this.heirs[daughter] || {};
      this.results[daughter] = {
        ...daughterData,
        title: daughterData.title || this.getHeirTitle(daughter),
        name: daughterData.name || '',
        religion: daughterData.religion || 'مسلم',
        gender: 'female',
        amount: sharePerDaughter.toFixed(3),
        percentage: this.formatPercentage((sharePerDaughter / this.totalAmount) * 100),
        note: t(noteKey),
        originalTitle: daughterData.originalTitle || daughterData.title
      };
      this.remainingAmount -= sharePerDaughter;
    }
  }

  // المفتاح الرابع: الابن + متوفي أم
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

    // الحالة: زوج + أب + أم + أبناء
    if (hasHusband && hasFather && hasMother) {
      // الزوج: الربع
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      // الأب: السدس
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      // الأم: السدس
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      // الباقي للأبناء (للذكر مثل حظ الانثيين)
      this.applyMaleFemaleRatio();
      return;
    }

    // الابن مع الأب والأم (بدون زوج)
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأب (بدون أم)
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الأم (بدون أب)
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
    // الابن مع الزوج (بدون أب وأم)
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      this.giveRemainingToSonOnly('remainderToSonNote');
    }
  }

  // المفتاح الخامس: الابنة + متوفي أم
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
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['father', 'mother', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['father', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd(['mother', daughterKey], 'raddNote');
      }
    }
    // الابنة مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd([daughterKey], 'remainderToDaughterNote');
      }
    }
    // الابنة مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const daughterKey = Object.keys(this.heirs).find(key => key.startsWith('daughter_'));
      if (daughterKey) {
        this.assignFixedShare(daughterKey, SHARES.half, 'halfNote');
        this.applyRadd([daughterKey], 'remainderToDaughterNote');
      }
    }
  }

  // المفتاح السادس: ابنتين فصاعدا + متوفي أم
  applyKey6() {
    if (this.handleFatherMotherDaughterCase()) return;
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = Object.keys(this.heirs).filter(key => key.startsWith('daughter_'));

    // ========== التصحيح: إضافة حالة خاصة للزوج + أب + أم + أبناء/بنات ==========
    if (hasHusband && hasFather && hasMother && (hasSon || daughterHeirs.length > 0)) {
      console.log('🔑 تطبيق الحالة الخاصة: زوج + أب + أم + أبناء/بنات');
      
      // الزوج: الربع
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      // الأب: السدس
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      // الأم: السدس
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      // الباقي للأبناء والبنات (للذكر مثل حظ الانثيين)
      this.applyMaleFemaleRatio();
      return;
    }

    // ابنتين مع الابن
    if (hasSon) {
      this.applyMaleFemaleRatio();
      return;
    }

    // ابنتين مع الأب
    if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRadd(['father', ...daughterHeirs], 'raddNote');
    }
    // ابنتين مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRadd(['mother', ...daughterHeirs], 'raddNote');
    }
    // ابنتين مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
    // ابنتين مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      this.assignMultipleDaughtersShare(daughterHeirs, SHARES.twoThirds, 'twoThirdsNote');
      this.applyRaddToDaughtersOnly('raddToDaughtersNote');
    }
  }

  // ========== الدالة الرئيسية للحساب ==========
  
  calculate() {
    console.log('🧮 === بدء الحسابات ===');
    console.log('نوع المتوفى:', this.deceasedType === DECEASED_TYPE.FATHER ? 'أب' : 'أم');
    console.log('الورثة:', Object.keys(this.heirs));
    
    // حالة خاصة: أب + أم + ابنة واحدة
    if (this.handleFatherMotherDaughterCase()) {
      console.log('✅ تمت معالجة الحالة الخاصة: أب + أم + ابنة واحدة');
      return this.ensureAllData(this.results);
    }

    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);
    const hasDaughter = checkHeirs(this.heirs, CONDITIONS.hasDaughter);
    const hasMultipleDaughters = checkHeirs(this.heirs, CONDITIONS.hasMultipleDaughters);

    console.log('👦 له ابن؟:', hasSon);
    console.log('👧 له بنت؟:', hasDaughter);
    console.log('👧👧 له أكثر من بنت؟:', hasMultipleDaughters);

    // حالة الابن والابنة معاً
    if (hasSon && hasDaughter) {
      console.log('⚖️ تطبيق قاعدة: للذكر مثل حظ الأنثيين');
      this.applyMaleFemaleRatio();
      return this.ensureAllData(this.results);
    }

    if (this.deceasedType === DECEASED_TYPE.FATHER) {
      if (hasSon) {
        console.log('🔑 تطبيق المفتاح 1: الابن + متوفي أب');
        this.applyKey1();
      } else if (hasDaughter) {
        if (hasMultipleDaughters) {
          console.log('🔑 تطبيق المفتاح 3: ابنتين فصاعداً + متوفي أب');
          this.applyKey3();
        } else {
          console.log('🔑 تطبيق المفتاح 2: الابنة + متوفي أب');
          this.applyKey2();
        }
      }
    } else if (this.deceasedType === DECEASED_TYPE.MOTHER) {
      if (hasSon) {
        console.log('🔑 تطبيق المفتاح 4: الابن + متوفي أم');
        this.applyKey4();
      } else if (hasDaughter) {
        if (hasMultipleDaughters) {
          console.log('🔑 تطبيق المفتاح 6: ابنتين فصاعداً + متوفي أم');
          this.applyKey6();
        } else {
          console.log('🔑 تطبيق المفتاح 5: الابنة + متوفي أم');
          this.applyKey5();
        }
      }
    }

    // التحقق من باقي المبلغ وإضافته لبيت المال إذا لزم الأمر
    if (this.remainingAmount > 0.01) {
      const percentage = this.formatPercentage((this.remainingAmount / this.totalAmount) * 100);
      this.results['bayt_al_mal'] = {
        title: t('baytAlMal') || 'بيت المال',
        amount: this.remainingAmount.toFixed(3),
        percentage: percentage,
        note: t('baytAlMalNote') || 'الباقي لبيت المال'
      };
    }

    console.log('📊 النتائج النهائية:', this.results);
    console.log('🏁 === انتهاء الحسابات ===');

    return this.ensureAllData(this.results);
  }

  // تأكيد احتواء جميع البيانات المطلوبة
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
}

// دالة التوزيع الرئيسية للاستيراد
export function distribute(total = 100, heirs, deceasedType) {
  const calculator = new InheritanceCalculator(deceasedType, heirs, total);
  return calculator.calculate();
}
