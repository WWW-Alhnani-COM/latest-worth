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
    
    // الحصول على بيانات الوريث الأصلية
    const heirData = this.heirs[heirType] || {};
    
    // استخدم addHeirWithShare لضمان عدم التكرار
    return this.addHeirWithShare(heirType, shareAmount, t(noteKey) || noteKey, true);
  }

  // ✅ دالة معدلة: إضافة أو تحديث وارث بحصة محددة
  addHeirWithShare(heirType, amount, note = '', fromRemaining = true) {
    const heirData = this.heirs[heirType] || {};
    const percentage = this.formatPercentage((amount / this.totalAmount) * 100);
    
    // إنشاء كائن الوريث
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
    
    // تحديث النتائج
    this.results[heirType] = heirObject;
    
    if (fromRemaining && amount > 0) {
      this.remainingAmount -= amount;
    }
    
    console.log(`➕ ${heirType}: ${amount.toFixed(3)} (${percentage}%) - ${note}`);
    return heirObject;
  }

  // تحديث حصة وارث موجود
  updateHeirShare(heirType, additionalAmount, additionalNote = '') {
    if (!this.results[heirType]) {
      return this.addHeirWithShare(heirType, additionalAmount, additionalNote, true);
    }
    
    const currentAmount = parseFloat(this.results[heirType].amount || 0);
    const newAmount = currentAmount + additionalAmount;
    const newPercentage = this.formatPercentage((newAmount / this.totalAmount) * 100);
    
    const currentNote = this.results[heirType].note || '';
    const newNote = additionalNote ? 
      (currentNote ? `${currentNote} + ${additionalNote}` : additionalNote) : 
      currentNote;
    
    this.results[heirType] = {
      ...this.results[heirType],
      amount: newAmount.toFixed(3),
      percentage: newPercentage,
      note: newNote
    };
    
    if (additionalAmount > 0) {
      this.remainingAmount -= additionalAmount;
    }
    
    console.log(`📈 تحديث ${heirType}: ${additionalAmount.toFixed(3)} إضافي، المجموع: ${newAmount.toFixed(3)}`);
    return this.results[heirType];
  }

  // الحصول على عنوان الوريث
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

  // تحديد جنس الوريث
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

  // ========== نظام "للذكر مثل حظ الانثيين" - الحل النهائي ==========
  
  applyMaleFemaleRatioToRemaining() {
    const sonHeirs = this.getSonKeys();
    const daughterHeirs = this.getDaughterKeys();

    console.log(`👦 الأبناء: ${sonHeirs.length}، 👧 البنات: ${daughterHeirs.length}`);
    console.log(`💰 الباقي للتوزيع: ${this.remainingAmount}`);

    if (sonHeirs.length === 0 && daughterHeirs.length === 0) {
      console.log('⚠️ لا يوجد أبناء أو بنات لتوزيع الباقي عليهم');
      return;
    }

    const totalShares = (sonHeirs.length * 2) + daughterHeirs.length;
    
    if (totalShares === 0) {
      console.log('⚠️ مجموع الحصص صفر');
      return;
    }

    if (this.remainingAmount <= 0) {
      console.log('⚠️ لا يوجد باقي للتوزيع');
      // أعطهم حصة صفرية لكن ظاهرين
      for (const son of sonHeirs) {
        if (!this.results[son]) {
          this.addHeirWithShare(son, 0, t('maleFemaleRatioNote'), false);
        }
      }
      for (const daughter of daughterHeirs) {
        if (!this.results[daughter]) {
          this.addHeirWithShare(daughter, 0, t('maleFemaleRatioNote'), false);
        }
      }
      return;
    }

    const sharePerUnit = this.remainingAmount / totalShares;
    console.log(`📊 قيمة الحصة الواحدة: ${sharePerUnit}`);

    // توزيع على الأبناء (للذكر مثل حظ الانثيين)
    for (const son of sonHeirs) {
      const sonAmount = sharePerUnit * 2;
      if (this.results[son]) {
        this.updateHeirShare(son, sonAmount, t('maleFemaleRatioNote'));
      } else {
        this.addHeirWithShare(son, sonAmount, t('maleFemaleRatioNote'), true);
      }
    }

    // توزيع على البنات
    for (const daughter of daughterHeirs) {
      const daughterAmount = sharePerUnit;
      if (this.results[daughter]) {
        this.updateHeirShare(daughter, daughterAmount, t('maleFemaleRatioNote'));
      } else {
        this.addHeirWithShare(daughter, daughterAmount, t('maleFemaleRatioNote'), true);
      }
    }

    console.log(`✅ تم توزيع الباقي: ${this.remainingAmount} متبقية`);
  }

  // دوال مساعدة للحصول على مفاتيح الورثة
  getSonKeys() {
    return Object.keys(this.heirs).filter(key => 
      key === 'son' || key.startsWith('son_')
    );
  }

  getDaughterKeys() {
    return Object.keys(this.heirs).filter(key => 
      key === 'daughter' || key.startsWith('daughter_')
    );
  }

  getSisterKeys() {
    return Object.keys(this.heirs).filter(key => 
      key === 'sister' || key.startsWith('sister_')
    );
  }

  getWifeKeys() {
    return Object.keys(this.heirs).filter(key => 
      key === 'wife' || key.startsWith('wife_')
    );
  }

  // ========== نظام الرد (Radd) - محسن ==========
  
  applyRaddToEligibleHeirs(eligibleHeirs, noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) {
      console.log('⚠️ لا يوجد باقي للرد');
      return;
    }

    const totalShares = eligibleHeirs.reduce((sum, heir) => {
      return sum + parseFloat(this.results[heir]?.percentage || 0);
    }, 0);

    if (totalShares === 0) {
      console.log('⚠️ مجموع حصص الورثة المؤهلين للرد صفر');
      return;
    }

    console.log(`🔄 تطبيق الرد: ${this.remainingAmount} على ${eligibleHeirs.length} وارث`);

    for (const heir of eligibleHeirs) {
      if (this.results[heir]) {
        const heirPercentage = parseFloat(this.results[heir].percentage);
        const additionalAmount = (heirPercentage / totalShares) * this.remainingAmount;
        
        if (additionalAmount > 0) {
          this.updateHeirShare(heir, additionalAmount, t(noteKey));
        }
      }
    }
    
    this.remainingAmount = 0;
  }

  applyRaddToDaughtersOnly(noteKey = '') {
    if (this.remainingAmount <= 0 || this.remainingAmount < 0.01) return;

    const daughterHeirs = this.getDaughterKeys();
    const daughterCount = daughterHeirs.length;
    
    if (daughterCount === 0) return;

    const sharePerDaughter = this.remainingAmount / daughterCount;
    
    console.log(`🔄 تطبيق الرد على البنات فقط: ${sharePerDaughter} لكل بنت`);

    for (const daughter of daughterHeirs) {
      this.updateHeirShare(daughter, sharePerDaughter, t(noteKey));
    }
    
    this.remainingAmount = 0;
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

  // ========== المفاتيح الستة الرئيسية - معدلة نهائياً ==========

  // المفتاح الأول: الابن + متوفي أب
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
      const wifeHeirs = this.getWifeKeys();
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

    // 3. الابن مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 4. الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 5. الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 6. الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 7. الابن مع الزوجة
    else if (hasWife) {
      const wifeHeirs = this.getWifeKeys();
      const wifeCount = wifeHeirs.length;
      const totalWifeShare = this.calculateShare(SHARES.eighth);
      const sharePerWife = totalWifeShare / wifeCount;
      
      for (const wife of wifeHeirs) {
        this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
      }
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
  }

  // المفتاح الثاني: الابنة + متوفي أب
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

    const daughterHeirs = this.getDaughterKeys();
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

  // المفتاح الثالث: ابنتين فصاعدا + متوفي أب
  applyKey3() {
    console.log('🔑 تطبيق المفتاح 3: ابنتين فصاعداً + متوفي أب');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = this.getDaughterKeys();

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

  // المفتاح الرابع: الابن + متوفي أم
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

    // 3. الابن مع الأب والأم
    if (hasFather && hasMother) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 4. الابن مع الأب
    else if (hasFather) {
      this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 5. الابن مع الأم
    else if (hasMother) {
      this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 6. الابن مع الجدة
    else if (hasGrandmother) {
      this.assignFixedShare('FR_grandmother', SHARES.sixth, 'sixthSunnaNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
    // 7. الابن مع الزوج
    else if (hasHusband) {
      this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
      
      const sonHeirs = this.getSonKeys();
      const sharePerSon = this.remainingAmount / sonHeirs.length;
      
      for (const son of sonHeirs) {
        this.addHeirWithShare(son, sharePerSon, t('remainderToSonNote'), true);
      }
      this.remainingAmount = 0;
    }
  }

  // المفتاح الخامس: الابنة + متوفي أم
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

    const daughterHeirs = this.getDaughterKeys();
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

  // المفتاح السادس: ابنتين فصاعدا + متوفي أم
  applyKey6() {
    console.log('🔑 تطبيق المفتاح 6: ابنتين فصاعداً + متوفي أم');
    
    const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
    const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
    const hasGrandmother = checkHeirs(this.heirs, CONDITIONS.hasGrandmother);
    const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
    const hasSon = checkHeirs(this.heirs, CONDITIONS.hasSon);

    const daughterHeirs = this.getDaughterKeys();

    // ========== الحالة الخاصة: زوج + أب + أم + أبناء/بنات ==========
    if (hasHusband && hasFather && hasMother) {
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

  // ========== التأكد من ظهور جميع الورثة بحصصهم الصحيحة ==========
  
  ensureAllHeirsAreIncluded() {
    console.log('🔍 التأكد من ظهور جميع الورثة بحصصهم...');
    
    // إضافة أي وارث مفقود بحصة صفرية (لكن يظهر)
    for (const heirKey of this.allHeirKeys) {
      if (!this.results[heirKey]) {
        console.log(`➕ إضافة وارث مفقود: ${heirKey}`);
        this.addHeirWithShare(heirKey, 0, 'لا حصة', false);
      }
    }
    
    console.log('✅ جميع الورثة ظاهرون:', Object.keys(this.results).length, 'وارث');
  }

  // ========== الدالة الرئيسية للحساب - الحل النهائي ==========
  
  calculate() {
    console.log('🧮 === بدء الحسابات ===');
    console.log('نوع المتوفى:', this.deceasedType === DECEASED_TYPE.FATHER ? 'أب' : 'أم');
    console.log('الورثة المدخلون:', this.allHeirKeys);
    console.log('المبلغ الكلي:', this.totalAmount);
    
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
    console.log('👧 له بنت؟:', hasDaughter);
    console.log('👧👧 له أكثر من بنت؟:', hasMultipleDaughters);

    // ✅✅✅ الحل النهائي: حالة الابن والابنة معاً ✅✅✅
    if (hasSon && hasDaughter) {
      console.log('⚖️ حالة: الابن والابنة معاً (للذكر مثل حظ الأنثيين)');
      
      // أولاً: تخصيص الحصص الثابتة
      if (this.deceasedType === DECEASED_TYPE.MOTHER) {
        const hasHusband = checkHeirs(this.heirs, CONDITIONS.hasHusband);
        const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
        const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
        
        if (hasHusband) {
          this.assignFixedShare('husband', SHARES.quarter, 'quarterNote');
        }
        if (hasFather) {
          this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
        }
        if (hasMother) {
          this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
        }
      } else if (this.deceasedType === DECEASED_TYPE.FATHER) {
        const hasWife = checkHeirs(this.heirs, CONDITIONS.hasWife);
        const hasFather = checkHeirs(this.heirs, CONDITIONS.hasFather);
        const hasMother = checkHeirs(this.heirs, CONDITIONS.hasMother);
        
        if (hasWife) {
          const wifeHeirs = this.getWifeKeys();
          const wifeCount = wifeHeirs.length;
          const totalWifeShare = this.calculateShare(SHARES.eighth);
          const sharePerWife = totalWifeShare / wifeCount;
          
          for (const wife of wifeHeirs) {
            this.addHeirWithShare(wife, sharePerWife, this.generateWifeNote(wifeCount), true);
          }
        }
        
        if (hasFather) {
          this.assignFixedShare('father', SHARES.sixth, 'sixthNote');
        }
        if (hasMother) {
          this.assignFixedShare('mother', SHARES.sixth, 'sixthNote');
        }
      }
      
      // ثانياً: توزيع الباقي (للذكر مثل حظ الأنثيين)
      console.log(`💰 الباقي بعد الحصص الثابتة: ${this.remainingAmount}`);
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

    // التحقق من باقي المبلغ وإضافته لبيت المال إذا لزم الأمر
    if (this.remainingAmount > 0.01) {
      const percentage = this.formatPercentage((this.remainingAmount / this.totalAmount) * 100);
      this.results['bayt_al_mal'] = {
        title: t('baytAlMal') || 'بيت المال',
        amount: this.remainingAmount.toFixed(3),
        percentage: percentage,
        note: t('baytAlMalNote') || 'الباقي لبيت المال'
      };
      this.remainingAmount = 0;
    }

    // التأكد من ظهور جميع الورثة
    this.ensureAllHeirsAreIncluded();

    console.log('📊 النتائج النهائية:', this.results);
    console.log('🏁 === انتهاء الحسابات ===');

    return this.ensureAllData(this.results);
  }

  // حالة خاصة: الأب + الأم + الابنة
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
      
      const daughterHeirs = this.getDaughterKeys();
      if (daughterHeirs.length > 0) {
        this.assignFixedShare(daughterHeirs[0], SHARES.half, 'halfNote');
      }
      
      const fatherShare = this.remainingAmount;
      const fatherPercentage = this.formatPercentage((fatherShare / this.totalAmount) * 100);
      
      this.results['father'] = {
        ...(this.heirs['father'] || {}),
        title: this.getHeirTitle('father'),
        name: this.heirs['father']?.name || '',
        religion: this.heirs['father']?.religion || 'مسلم',
        gender: 'male',
        amount: fatherShare.toFixed(3),
        percentage: fatherPercentage,
        note: t('remainderNote'),
        originalTitle: this.heirs['father']?.title || 'أب'
      };
      
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
