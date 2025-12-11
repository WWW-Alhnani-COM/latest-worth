import { calculateInheritance } from "./functions.js";
import { t, getCurrentLanguage, setLanguage, isRTL, formatNumber, parseNumber, getOrdinalNumber } from "./translations.js";

// ========== ⭐ Helpers for Handlebars ==========
document.addEventListener('DOMContentLoaded', function() {
    // تسجيل helper جديد لـ Handlebars
    Handlebars.registerHelper('isTranslatable', function(value) {
        return typeof value === 'string' && ['noOption', 'yesOption'].includes(value);
    });

    Handlebars.registerHelper('t', function(key) {
        return window.t ? window.t(key) : key;
    });

    // جعل دالة الترجمة متاحة globally لـ Handlebars
    window.t = t;
    
    // الآن تهيئة التطبيق
    initTranslationSystem();
    initTabs();
    initCalculatorForm();
    initFooterButtons();
    
    // إضافة مستمعين للأبناء
    document.getElementById('closeSonsPopup').addEventListener('click', () => {
        document.getElementById('sons_numbers').classList.remove('show');
    });
    
    document.getElementById('sonsNextBtn').addEventListener('click', () => {
        document.getElementById('sons_numbers').classList.remove('show');
        setTimeout(() => {
            handleCalculatorSubmit();
        }, 300);
    });
    
    // التأكد من التبويب الأول هو النشط
    setTimeout(() => {
        switchTab('calculator');
    }, 100);
});

const all = {};
const booleanOptions = ["noOption", "yesOption"];
const defaultOptions = ["noOption", ...Array.from({ length: 49 }, (_, i) => i + 1)];

const fieldsData = [
  {
    groupTitle: "1",
    fields: [
      { id: "father", title: "أب", options: booleanOptions, gender: "male" },
      { id: "mother", title: "أم", options: booleanOptions, gender: "female" },
      { id: "son", title: "ابن", options: defaultOptions, gender: "male" },
      { id: "daughter", title: "ابنة", options: defaultOptions, gender: "female" },
    ]
  },
  {
    groupTitle: "2",
    fields: [
      { id: "FR_grandfather", title: "جد لاب", options: booleanOptions, gender: "male" },
      { id: "MR_grandfather", title: "جد لأم", options: booleanOptions, gender: "male" },
      { id: "FR_grandmother", title: "جدة لاب", options: booleanOptions, gender: "female" },
      { id: "MR_grandmother", title: "جدة لأم", options: booleanOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "3",
    fields: [
      { id: "SN_grandson", title: "ابن ابن", options: defaultOptions, gender: "male" },
      { id: "SN_granddaughter", title: "ابنة ابن", options: defaultOptions, gender: "female" },
      { id: "DR_grandson", title: "ابن بنت", options: defaultOptions, gender: "male" },
      { id: "DR_granddaughter", title: "ابنة بنت", options: defaultOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "4",
    fields: [
      { id: "brother", title: "أخ", options: defaultOptions, gender: "male" },
      { id: "sister", title: "أخت", options: defaultOptions, gender: "female" },
      { id: "MR_brother", title: "أخ لأم", options: defaultOptions, gender: "male" },
      { id: "MR_mother_sister", title: "أخت لأم", options: defaultOptions, gender: "female" },
      { id: "FR_brother", title: "أخ لأبيه", options: defaultOptions, gender: "male" },
      { id: "FR_sister", title: "أخت لأبيه", options: defaultOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "5",
    fields: [
      { id: "BR_boys", title: "ولد أخ", options: defaultOptions, gender: "male" },
      { id: "SR_boys", title: "ولد أخت", options: defaultOptions, gender: "male" },
      { id: "MR_BR_boys", title: "ولد أخ لأم", options: defaultOptions, gender: "male" },
      { id: "MR_SR_boys", title: "ولد أخت لأم", options: defaultOptions, gender: "male" },
      { id: "FR_BR_boys", title: "ولد أخ لأبيه", options: defaultOptions, gender: "male" },
      { id: "FR_SR_boys", title: "ولد أخت لأبيه", options: defaultOptions, gender: "male" }
    ]
  }, {
    groupTitle: "6",
    fields: [
      { id: "BR_girls", title: "بنت أخ", options: defaultOptions, gender: "female" },
      { id: "SR_girls", title: "بنت أخت", options: defaultOptions, gender: "female" },
      { id: "MR_BR_girls", title: "بنت أخ لأم", options: defaultOptions, gender: "female" },
      { id: "MR_SR_girls", title: "بنت أخت لأم", options: defaultOptions, gender: "female" },
      { id: "FR_BR_girls", title: "بنت أخ لأبيه", options: defaultOptions, gender: "female" },
      { id: "FR_SR_girls", title: "بنت أخت لأبيه", options: defaultOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "7",
    fields: [
      { id: "FR_uncle", title: "عم", options: defaultOptions, gender: "male" },
      { id: "FR_aunt", title: "عمة", options: defaultOptions, gender: "female" },
      { id: "MR_uncle", title: "خال", options: defaultOptions, gender: "male" },
      { id: "MR_aunt", title: "خالة", options: defaultOptions, gender: "female" },
      { id: "MR_uncle_mother", title: "خال لأم", options: defaultOptions, gender: "male" },
      { id: "FR_uncle_father", title: "خال لأب", options: defaultOptions, gender: "male" },
      { id: "MR_aunt_mother", title: "خالة لأم", options: defaultOptions, gender: "female" },
      { id: "FR_aunt_father", title: "خالة لأب", options: defaultOptions, gender: "female" },
      { id: "FR_uncle_father_A", title: "عم لأبيه", options: defaultOptions, gender: "male" },
      { id: "MR_uncle_mother_A", title: "عم لأمه", options: defaultOptions, gender: "male" },
      { id: "FR_aunt_father_K", title: "عمة لأبيه", options: defaultOptions, gender: "female" },
      { id: "MR_aunt_mother_K", title: "عمة لأمه", options: defaultOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "8",
    fields: [
      { id: "uncle_sons_A", title: "ابن عم", options: defaultOptions, gender: "male" },
      { id: "uncle_daughters_A", title: "بنت عم", options: defaultOptions, gender: "female" },
      { id: "aunt_sons_A", title: "ابن عمة", options: defaultOptions, gender: "male" },
      { id: "aunt_daughters_A", title: "بنت عمة", options: defaultOptions, gender: "female" },
      { id: "FR_uncle_sons_A", title: "ابن عم لأبيه", options: defaultOptions, gender: "male" },
      { id: "MR_uncle_sons_A", title: "ابن عم لأمه", options: defaultOptions, gender: "male" },
      { id: "FR_uncle_daughter_A", title: "بنت عم لأبيه", options: defaultOptions, gender: "female" },
      { id: "MR_uncle_daughter_A", title: "بنت عم لأمه", options: defaultOptions, gender: "female" },
      { id: "FR_aunt_sons_A", title: "ابن عمة لأم", options: defaultOptions, gender: "male" },
      { id: "MR_aunt_sons_A", title: "ابن عمة لأبيه", options: defaultOptions, gender: "male" },
      { id: "FR_aunt_daughter_A", title: "بنت عمة لأبيه", options: defaultOptions, gender: "female" },
      { id: "MR_aunt_daughter_A", title: "بنت عمة لأم", options: defaultOptions, gender: "female" }
    ]
  },
  {
    groupTitle: "9",
    fields: [
      { id: "uncle_sons_K", title: "ابن خال", options: defaultOptions, gender: "male" },
      { id: "uncle_daughters_K", title: "بنت خال", options: defaultOptions, gender: "female" },
      { id: "aunt_sons_K", title: "ابن خالة", options: defaultOptions, gender: "male" },
      { id: "aunt_daughters_K", title: "بنت خالة", options: defaultOptions, gender: "female" },
      { id: "FR_uncle_sons_K", title: "ابن خال لأبيه", options: defaultOptions, gender: "male" },
      { id: "MR_uncle_sons_K", title: "ابن خال لأمه", options: defaultOptions, gender: "male" },
      { id: "FR_uncle_daughter_K", title: "بنت خال لأبيه", options: defaultOptions, gender: "female" },
      { id: "MR_uncle_daughter_K", title: "بنت خال لأمه", options: defaultOptions, gender: "female" },
      { id: "FR_aunt_sons_K", title: "ابن خالة لأبيه", options: defaultOptions, gender: "male" },
      { id: "MR_aunt_sons_K", title: "ابن خالة لأم", options: defaultOptions, gender: "male" },
      { id: "FR_aunt_daughter_K", title: "بنت خالة لأبيه", options: defaultOptions, gender: "female" },
      { id: "MR_aunt_daughter_K", title: "بنت خالة لأمه", options: defaultOptions, gender: "female" }
    ]
  }
];

// ========== نظام ترميز الألوان لحقول الورثة وحقل الديانة ==========

function updateHeirFieldStyle(selectElement) {
    // تحديث سمة value لتعمل مع CSS
    selectElement.setAttribute('value', selectElement.value);
    
    // إزالة الفئات القديمة
    selectElement.classList.remove('filled-field', 'empty-field');
    
    // الحصول على القيمة الافتراضية للحقل
    const defaultValue = selectElement.options[0] ? selectElement.options[0].value : '0';
    const isBooleanField = ['father', 'mother', 'husband', 'wife'].includes(selectElement.id);
    
    // تحديد إذا كان الحقل مملوءاً أم لا
    let isFilled = false;
    
    if (isBooleanField) {
        // للحقول المنطقية (نعم/لا)
        isFilled = selectElement.value === 'yesOption' || selectElement.value === 'نعم';
    } else {
        // للحقول العددية
        isFilled = selectElement.value !== defaultValue && 
                  selectElement.value !== '0' && 
                  selectElement.value !== '' &&
                  selectElement.value !== 'noOption' &&
                  selectElement.value !== 'لا';
    }
    
    if (isFilled) {
        selectElement.classList.add('filled-field');
    } else {
        selectElement.classList.add('empty-field');
    }
}

function updateReligionFieldStyle(selectElement) {
    // تحديث سمة value لتعمل مع CSS
    selectElement.setAttribute('value', selectElement.value);
    
    // إزالة جميع الفئات الملونة أولاً
    selectElement.classList.remove('non-muslim-field', 'muslim-field', 'empty-field');
    
    // تطبيق الأنماط بناءً على القيمة
    if (selectElement.value === 'غير مسلم') {
        selectElement.classList.add('non-muslim-field');
    } else if (selectElement.value === 'مسلم') {
        selectElement.classList.add('muslim-field');
    } else {
        selectElement.classList.add('empty-field');
    }
}

function initColorCodingSystem() {
    // 1. تحديث جميع حقول الورثة
    function updateAllHeirFields() {
        const heirSelects = document.querySelectorAll('#dynamic-fields select');
        heirSelects.forEach(select => {
            updateHeirFieldStyle(select);
        });
    }
    
    // 2. تحديث حقل الديانة
    function setupReligionField() {
        const religionSelect = document.getElementById('deceased_religion');
        if (religionSelect) {
            updateReligionFieldStyle(religionSelect);
            
            // إضافة مستمع للتحديث عند التغيير
            religionSelect.addEventListener('change', function() {
                updateReligionFieldStyle(this);
            });
        }
    }
    
    // 3. إضافة مستمعات الأحداث لحقول الورثة
    function setupHeirFieldEvents() {
        const dynamicFields = document.getElementById('dynamic-fields');
        if (!dynamicFields) return;
        
        // تحديث عند تغيير أي حقل
        dynamicFields.addEventListener('change', function(e) {
            if (e.target.tagName === 'SELECT') {
                updateHeirFieldStyle(e.target);
                // تحديث العداد بعد التغيير
                setTimeout(() => calulcateWarth(all), 100);
            }
        });
    }
    
    // 4. تشغيل النظام
    updateAllHeirFields();
    setupReligionField();
    setupHeirFieldEvents();
}

// ========== نظام ترميز الألوان للتبويب الثاني ==========

function updateHeirNameFieldStyle(inputElement) {
    // إزالة الفئات القديمة
    inputElement.classList.remove('filled-field', 'empty-field');
    
    // تحديد إذا كان الحقل مملوءاً
    if (inputElement.value && inputElement.value.trim() !== '') {
        inputElement.classList.add('filled-field');
    } else {
        inputElement.classList.add('empty-field');
    }
}

function updateHeirReligionFieldStyle(selectElement) {
    // إزالة جميع الفئات الملونة
    selectElement.classList.remove('non-muslim-field', 'muslim-field', 'empty-field');
    
    // تطبيق الأنماط بناءً على القيمة
    if (selectElement.value === 'غير مسلم') {
        selectElement.classList.add('non-muslim-field');
    } else if (selectElement.value === 'مسلم') {
        selectElement.classList.add('muslim-field');
    } else {
        selectElement.classList.add('empty-field');
    }
}

function initTab2ColorCodingSystem() {
    // تحديث جميع حقول الاسم والديانة في التبويب الثاني
    function updateAllTab2Fields() {
        // تحديث حقول الأسماء
        const heirNameInputs = document.querySelectorAll('#resultTableBody .heir-name');
        heirNameInputs.forEach(input => {
            updateHeirNameFieldStyle(input);
        });
        
        // تحديث حقول الديانة
        const heirReligionSelects = document.querySelectorAll('#resultTableBody .heir-religion');
        heirReligionSelects.forEach(select => {
            updateHeirReligionFieldStyle(select);
        });
    }
    
    // إضافة مستمعات الأحداث
    function setupTab2FieldEvents() {
        const resultTableBody = document.getElementById('resultTableBody');
        if (!resultTableBody) return;
        
        // تحديث عند تغيير اسم الوريث
        resultTableBody.addEventListener('input', function(e) {
            if (e.target.classList.contains('heir-name')) {
                updateHeirNameFieldStyle(e.target);
            }
        });
        
        // تحديث عند تغيير ديانة الوريث
        resultTableBody.addEventListener('change', function(e) {
            if (e.target.classList.contains('heir-religion')) {
                updateHeirReligionFieldStyle(e.target);
            }
        });
    }
    
    // تشغيل النظام
    updateAllTab2Fields();
    setupTab2FieldEvents();
}

// تطبيق الترجمة على الصفحة
function applyTranslations() {
  const lang = getCurrentLanguage();
  
  // تحديث اتجاه الصفحة
  document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.body.className = isRTL(lang) ? '' : 'ltr';
  if (lang === 'ur') document.body.classList.add('lang-ur');
  
  // تحديث مبدل اللغة
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = lang;
    
    // استخدام نصوص ثابتة للغات
    const options = languageSelect.querySelectorAll('option');
    options[0].textContent = 'العربية';
    options[1].textContent = 'English';
    options[2].textContent = 'اردو';
  }
  
  // ترجمة النصوص
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    if (translation && translation !== key) {
      element.textContent = translation;
    }
  });
  
  // ترجمة العنواين
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation && translation !== key) {
      element.title = translation;
    }
  });
  
  // ترجمة النصوص التوضيحية
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation && translation !== key) {
      element.placeholder = translation;
    }
  });
  
  // تحديث تسميات الأزرار
  updateButtonTexts();
  
  // تحديث تنسيق الأرقام في المدخلات
  updateNumberInputs();
  translateSelectOptions();
  
  // تحديث نظام ترميز الألوان بعد الترجمة
  setTimeout(() => {
      initColorCodingSystem();
  }, 300);
}

// دالة جديدة لترجمة خيارات القوائم المنسدلة
function translateSelectOptions() {
  const lang = getCurrentLanguage();
  
  // ترجمة جميع عناصر select
  document.querySelectorAll('select').forEach(select => {
    Array.from(select.options).forEach(option => {
      const key = option.getAttribute('data-i18n');
      if (key) {
        const translation = t(key);
        if (translation && translation !== key) {
          option.textContent = translation;
        }
      }
    });
  });
}

// تحديث تسميات الأزرار
function updateButtonTexts() {
  const nextBtn = document.getElementById('footer-next-btn');
  const prevBtn = document.getElementById('footer-prev-btn');
  const printBtn = document.getElementById('footer-print-btn');
  const closeSonsBtn = document.getElementById('closeSonsPopup');
  const sonsNextBtn = document.getElementById('sonsNextBtn');
  const closeModalBtn = document.getElementById('closeModal');
  
  if (nextBtn) nextBtn.innerHTML = `<span data-i18n="next">${t('next')}</span>`;
  if (prevBtn) prevBtn.innerHTML = `<span data-i18n="previous">${t('previous')}</span>`;
  if (printBtn) printBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
        <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
      </svg><span data-i18n="print">${t('print')}</span>`;
  if (closeSonsBtn) closeSonsBtn.textContent = t('close');
  if (sonsNextBtn) sonsNextBtn.textContent = t('next');
  if (closeModalBtn) closeModalBtn.textContent = t('ok');
}

// تحديث تنسيق الأرقام في المدخلات
function updateNumberInputs() {
  const amountInput = document.getElementById('amount');
  const materialsInput = document.getElementById('materials');
  
  if (amountInput && amountInput.value) {
    const currentValue = parseNumber(amountInput.value);
    amountInput.value = formatNumber(currentValue);
  }
  
  if (materialsInput && materialsInput.value) {
    const currentValue = parseNumber(materialsInput.value);
    materialsInput.value = formatNumber(currentValue);
  }
}

// تحويل الأرقام إلى كلمات حسب اللغة
function numberToLocalizedWord(number, gender) {
  return getOrdinalNumber(number, gender) || number.toString();
}

// ========== نظام التنبيهات المحسن ==========
class AlertSystem {
  constructor() {
    this.alertSystem = document.getElementById('alertSystem');
    this.alertContainer = this.alertSystem.querySelector('.alert-container');
    this.alertHeader = this.alertSystem.querySelector('.alert-header');
    this.alertIcon = this.alertSystem.querySelector('.alert-icon');
    this.alertTitle = this.alertSystem.querySelector('.alert-title');
    this.alertMessage = document.getElementById('alertMessage');
    this.alertConfirm = document.getElementById('alertConfirm');
    
    this.init();
  }

  init() {
    this.alertConfirm.addEventListener('click', () => this.hide());
    this.alertSystem.addEventListener('click', (e) => {
      if (e.target === this.alertSystem) {
        this.hide();
      }
    });
  }

  show(type, message, title = null) {
    this.setAlertType(type);
    
    this.alertMessage.textContent = message;
    if (title) {
      this.alertTitle.textContent = title;
    }
    
    this.alertSystem.classList.remove('hidden');
    setTimeout(() => {
      this.alertSystem.classList.add('active');
    }, 10);
  }

  setAlertType(type) {
    this.alertContainer.classList.remove('alert-error', 'alert-warning', 'alert-success', 'alert-info');
    this.alertContainer.classList.add(`alert-${type}`);
    
    const icon = this.alertIcon.querySelector('i');
    icon.className = this.getIconForType(type);
  }

  getIconForType(type) {
    const icons = {
      'error': 'fas fa-exclamation-circle',
      'warning': 'fas fa-exclamation-triangle',
      'success': 'fas fa-check-circle',
      'info': 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  hide() {
    this.alertSystem.classList.remove('active');
    setTimeout(() => {
      this.alertSystem.classList.add('hidden');
    }, 300);
  }
}

let alertSystem;

function showAlert(type, messageKey, titleKey = null) {
  if (!alertSystem) {
    alertSystem = new AlertSystem();
  }
  
  const message = t(messageKey);
  const title = titleKey ? t(titleKey) : null;
  alertSystem.show(type, message, title);
}

function showDeceasedTypeAlert() {
  showAlert('error', 'deceasedTypeRequired', 'alertTitle');
}

function showHeirsRequiredAlert() {
  showAlert('warning', 'heirsRequired', 'alertTitle');
}

// ========== تهيئة نظام الترجمة ==========
function initTranslationSystem() {
  // تطبيق الترجمة عند التحميل
  applyTranslations();
  
  // إضافة مستمع لتغيير اللغة
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function(e) {
      const lang = e.target.value;
      setLanguage(lang);
      applyTranslations();
      // إعادة تحميل البيانات إذا كانت موجودة
      reloadFormData();
    });
  }
}

// ========== دالة التحقق من الصحة ==========
function validateCalculatorForm() {
  const deceasedGender = document.querySelector('input[name="deceased_gender"]:checked');
  const hasHeirs = hasSelectedHeirs();

  if (!deceasedGender) {
    showDeceasedTypeAlert();
    return false;
  }

  if (!hasHeirs) {
    showHeirsRequiredAlert();
    return false;
  }

  return true;
}

// ========== فتح نافذة الأبناء ==========
function openSonsModal(e) {
  e.preventDefault();
  
  // التحقق من الصحة أولاً
  if (!validateCalculatorForm()) {
    return;
  }

  let daughter = document.getElementById('daughter').value === 'noOption';
  let mother = document.getElementById('mother').value === 'yesOption';
  let father = document.getElementById('father').value === 'yesOption';
  let son = document.getElementById('son').value === 'noOption';

  if (mother && father && daughter && son) {
    document.getElementById('sons_numbers').classList.add('show');
  } else {
    document.getElementById('dad_sons').value = 'noOption';
    document.getElementById('dad_girls').value = 'noOption';
    handleCalculatorSubmit();
  }
}

// ========== إعادة تحميل بيانات النموذج بعد تغيير اللغة ==========
function reloadFormData() {
  const storedData = appStorage.getItem("inheritanceData");
  if (storedData) {
    const data = JSON.parse(storedData);
    updateReligiousTab(data);
    
    // تحديث تبويب النتائج إذا كان نشطاً
    const activeTab = document.querySelector('.tab-content.active').id;
    if (activeTab === 'shares') {
      const totalAmount = processTotalAmount(data.amount);
      const materialsAmount = parseNumber(data.materials) || 0;
      
      const moneyResults = calculateInheritance(totalAmount, data?.heirs);
      
      let materialsResults = null;
      if (materialsAmount > 0) {
        materialsResults = calculateMaterialsDistribution(moneyResults, materialsAmount);
      }

      updateSharesTab({ 
        ...data, 
        heirs: moneyResults,
        materialsDistribution: materialsResults,
        hasAmount: !!data.amount && parseNumber(data.amount) > 0
      });
    }
  }
}

// ========== دالة التحكم في أزرار الفوتر ==========
function initFooterButtons() {
  const prevBtn = document.getElementById('footer-prev-btn');
  const nextBtn = document.getElementById('footer-next-btn');
  const printBtn = document.getElementById('footer-print-btn');

  // إزالة جميع الأحداث القديمة
  const newNextBtn = nextBtn.cloneNode(true);
  const newPrevBtn = prevBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

  // الحصول على الأزرار الجديدة
  const newNextButton = document.getElementById('footer-next-btn');
  const newPrevButton = document.getElementById('footer-prev-btn');

  // زر السابق
  newPrevButton.addEventListener('click', () => {
    const currentTab = document.querySelector('.tab-content.active').id;
    
    if (currentTab === 'religious') {
      switchTab('calculator');
    } else if (currentTab === 'shares') {
      switchTab('religious');
    }
  });

  // زر التالي - الإصلاح الرئيسي هنا
  newNextButton.addEventListener('click', () => {
    const currentTab = document.querySelector('.tab-content.active').id;
    
    if (currentTab === 'calculator') {
      // التحقق من الصحة أولاً
      if (!validateCalculatorForm()) {
        return;
      }
      
      // الانتقال مباشرة إلى الخطوة الثانية
      handleCalculatorSubmit();
    } else if (currentTab === 'religious') {
      document.getElementById('resultForm').dispatchEvent(new Event('submit'));
    }
  });

  // زر الطباعة
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      switchTab('shares');
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }
}

// ========== تبديل التبويبات ==========
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
  document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

  // تحديث حالة الأزرار
  updateTabButtonsState(tabId);
  
  // التحكم في إظهار/إخفاء أزرار الفوتر حسب التبويب النشط
  updateFooterButtons(tabId);
  
  // تطبيق نظام ترميز الألوان عند تغيير التبويب
  setTimeout(() => {
      if (tabId === 'calculator') {
          initColorCodingSystem();
      } else if (tabId === 'religious') {
          initTab2ColorCodingSystem();
      }
  }, 300);
}

// تحديث حالة أزرار التبويب
function updateTabButtonsState(activeTab) {
  const tabs = document.querySelectorAll('.tab-button');
  
  tabs.forEach(tab => {
    const tabName = tab.getAttribute('data-tab');
    
    if (tabName === activeTab) {
      tab.disabled = false;
    } else if (tabName === 'religious' && activeTab === 'calculator') {
      tab.disabled = true;
    } else if (tabName === 'shares' && (activeTab === 'calculator' || activeTab === 'religious')) {
      tab.disabled = true;
    }
  });
}

// إصلاح دالة updateFooterButtons لتشمل زر الطباعة
function updateFooterButtons(activeTab) {
  const prevBtn = document.getElementById('footer-prev-btn');
  const nextBtn = document.getElementById('footer-next-btn');
  const printBtn = document.getElementById('footer-print-btn');

  // إخفاء جميع الأزرار أولاً
  prevBtn.classList.add('hidden');
  nextBtn.classList.add('hidden');
  if (printBtn) printBtn.classList.add('hidden');

  switch(activeTab) {
    case 'calculator':
      nextBtn.classList.remove('hidden');
      nextBtn.innerHTML = `<span data-i18n="next">${t('next')}</span>`;
      break;
    case 'religious':
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      nextBtn.innerHTML = `<span data-i18n="result">${t('result')}</span>`;
      break;
    case 'shares':
      prevBtn.classList.remove('hidden');
      if (printBtn) printBtn.classList.remove('hidden');
      break;
  }
}

// ========== تهيئة التبويبات ==========
function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = button.getAttribute('data-tab');
      
      // التحقق من أن التبويب ليس معطلاً
      if (!button.disabled) {
        switchTab(tabId);
      }
    });
  });

  document.querySelector('.tab-button.religious').disabled = true;
  document.querySelector('.tab-button.shares').disabled = true;
  
  // تهيئة أزرار الفوتر للتبويب الأول
  updateFooterButtons('calculator');
}

// ========== تهيئة نموذج الحاسبة ==========
function initCalculatorForm() {
  const form = document.getElementById('inheritanceForm');
  const templateSource = document.getElementById('field-template').innerHTML;
  const template = Handlebars.compile(templateSource);
  document.getElementById('dynamic-fields').innerHTML = template({ groups: fieldsData });

  // تحديث العناوين بعد الترجمة
  setTimeout(() => {
    document.querySelectorAll('.group-header h3').forEach((header, index) => {
      header.setAttribute('data-i18n', `category${index + 1}`);
      header.textContent = t(`category${index + 1}`);
    });
  }, 100);

  document.querySelectorAll('input[name="deceased_gender"]').forEach(input => {
    input.addEventListener('change', toggleSpouseField);
  });

  form.addEventListener('submit', openSonsModal);
  
  // تحديث تسميات الحقول بعد الترجمة
  updateFieldLabels();
  
  // تهيئة نظام ترميز الألوان
  setTimeout(() => {
      initColorCodingSystem();
  }, 500);
}

// تحديث تسميات الحقول
function updateFieldLabels() {
  setTimeout(() => {
    document.querySelectorAll('.form-group label').forEach(label => {
      const fieldId = label.getAttribute('for');
      if (fieldId) {
        const translation = t(fieldId);
        if (translation && translation !== fieldId) {
          label.textContent = translation;
        }
      }
    });
  }, 200);
}

// ========== تبديل حقل الزوج/الزوجة ==========
function toggleSpouseField() {
  const deceasedGender = document.querySelector('input[name="deceased_gender"]:checked')?.value;
  if (deceasedGender !== 'male') {
    document.getElementById('spouse_female').classList.add('hidden');
    document.getElementById('spouse_male').classList.remove('hidden');
    document.getElementById('wife').value = 'no'
    all.wife = 0
  } else {
    document.getElementById('spouse_female').classList.remove('hidden');
    document.getElementById('spouse_male').classList.add('hidden');
    document.getElementById('husband').value = 'no'
    all.husband = 0
  }

  calulcateWarth(all);
  
  // تحديث ألوان الحقول المتأثرة
  setTimeout(() => {
    const wifeSelect = document.getElementById('wife');
    const husbandSelect = document.getElementById('husband');
    
    if (wifeSelect) updateHeirFieldStyle(wifeSelect);
    if (husbandSelect) updateHeirFieldStyle(husbandSelect);
  }, 100);
}

// ========== معالجة إرسال الحاسبة ==========
function handleCalculatorSubmit() {
  const formData = collectFormData();
  appStorage.setItem("inheritanceData", JSON.stringify(formData));

  document.querySelector('.tab-button.religious').disabled = false;
  switchTab('religious');
  updateReligiousTab(formData);
}

// ========== جمع بيانات النموذج ==========
// ========== جمع بيانات النموذج ==========
function collectFormData() {
  const formData = {
    deceased_gender: document.querySelector('input[name="deceased_gender"]:checked')?.value || "",
    deceased_religion: document.getElementById("deceased_religion")?.value || "مسلم",
    deceased_name: document.getElementById("deceased_name")?.value || "",
    amount: document.getElementById("amount")?.value || "",
    materials: document.getElementById("materials")?.value || "",
    heirs: {}
  };

  document.querySelectorAll("#inheritanceForm select").forEach(select => {
    const id = select.id;
    const label = select.parentElement.querySelector("label");
    const title = label ? label.textContent : id;
    const value = select.value;
    const fieldConfig = fieldsData.flatMap(group => group.fields).find(field => field.id === id);
    const gender = fieldConfig?.gender || "male";

    // ========== إصلاح: معالجة حقول الزوج والزوجة ==========
    if (id === "wife") {
      if (parseInt(value) > 0) {
        formData.heirs["wife"] = { 
          title: t('wife') || 'زوجة',
          name: "",
          count: parseInt(value),
          religion: "مسلم",
          isMultiple: true,
          gender: "female"
        };
      }
      return;
    }

    if (id === "husband" && value === "yes" && formData.deceased_gender === "female") {
      formData.heirs["husband"] = { 
        title: t('husband') || 'زوج', 
        name: "",
        religion: "مسلم"
      };
      return;
    }

    // ========== إصلاح: معالجة الحقول العادية ==========
    if (value === "نعم" || value === "yesOption") {
      formData.heirs[id] = { 
        title: title, 
        name: "",
        religion: "مسلم"
      };
      return;
    }

    if (!isNaN(parseInt(value)) && parseInt(value) > 0) {
      // ========== إصلاح: إنشاء مفتاح واحد للحقول المتعددة ==========
      formData.heirs[id] = { 
        title: title,
        name: "",
        count: parseInt(value),
        religion: "مسلم",
        isMultiple: true,
        gender: gender
      };
    }
  });

  return formData;
}

// ========== تحديث تبويب البيانات الدينية ==========
function updateReligiousTab(data) {
  let deceasedInfoHTML = "";
  if (data.deceased_gender) {
    deceasedInfoHTML = `
            <tr>
                <td>${data.deceased_gender === 'male' ? t('male') : t('female')}</td>
                <td>${data.deceased_religion}</td>
                <td>${data.deceased_name}</td>
                <td>${data.amount || t('noAmount')}</td>
                <td>${data.materials || t('noMaterials')}</td>
            </tr>
        `;
  }
  document.getElementById('deceasedInfoBody').innerHTML = deceasedInfoHTML;

  let heirsHTML = "";
  let i = 0;
  
  // ========== إصلاح: عرض جميع الورثة ==========
  for (let key in data.heirs) {
    const heir = data.heirs[key];
    
    // تخطي الزوجات الذكور إذا كان المتوفى أنثى
    if (data.deceased_gender === 'female' && key === "wife") {
      continue;
    }
    
    i++;
    
    // ========== إصلاح: معالجة الحقول المتعددة ==========
    if (heir.isMultiple && heir.count > 1) {
      for (let j = 1; j <= heir.count; j++) {
        heirsHTML += `
                <tr>
                    <td class="counter">${formatNumber(i)}</td>
                    <td>${heir.title} ${numberToLocalizedWord(j, heir.gender || 'male')}</td>
                    <td>
                      <input 
                        type="text" 
                        class="heir-name" 
                        data-heir-id="${key}_${j}" 
                        value="${heir.names && heir.names[j] ? heir.names[j] : ''}" 
                        placeholder="${t('enterHeirName')}"
                        title="${t('enterHeirName')}"
                      >
                    </td>
                    <td>
                        <select class="heir-religion" data-heir-id="${key}_${j}" title="${t('religiousStatus')}">
                            <option value="مسلم" ${heir.religion === 'مسلم' ? 'selected' : ''}>${t('muslim')}</option>
                            <option value="غير مسلم" ${heir.religion === 'غير مسلم' ? 'selected' : ''}>${t('nonMuslim')}</option>
                        </select>
                    </td>
                </tr>
            `;
        i++; // زيادة العداد لكل فرد
      }
      i--; // تصحيح العداد
    } else {
      // ========== إصلاح: الحقول المفردة ==========
      heirsHTML += `
            <tr>
                <td class="counter">${formatNumber(i)}</td>
                <td>${heir.title}</td>
                <td>
                  <input 
                    type="text" 
                    class="heir-name" 
                    data-heir-id="${key}" 
                    value="${heir.name || ''}" 
                    placeholder="${t('enterHeirName')}"
                    title="${t('enterHeirName')}"
                  >
                </td>
                <td>
                    <select class="heir-religion" data-heir-id="${key}" title="${t('religiousStatus')}">
                        <option value="مسلم" ${heir.religion === 'مسلم' ? 'selected' : ''}>${t('muslim')}</option>
                        <option value="غير مسلم" ${heir.religion === 'غير مسلم' ? 'selected' : ''}>${t('nonMuslim')}</option>
                    </select>
                </td>
            </tr>
        `;
    }
  }
  
  document.getElementById('resultTableBody').innerHTML = heirsHTML;

  document.getElementById('resultForm').onsubmit = handleReligiousSubmit;
  
  // تهيئة نظام ترميز الألوان للتبويب الثاني
  setTimeout(() => {
      initTab2ColorCodingSystem();
  }, 100);
}

// ========== معالجة إرسال البيانات الدينية ==========
function handleReligiousSubmit(event) {
  event.preventDefault();
  const data = JSON.parse(appStorage.getItem("inheritanceData"));

  // ========== إصلاح: جمع بيانات الأسماء والديانات ==========
  document.querySelectorAll('.heir-name').forEach(input => {
    const heirId = input.getAttribute('data-heir-id');
    const religionSelect = document.querySelector(`.heir-religion[data-heir-id="${heirId}"]`);
    
    // حفظ الاسم والديانة
    if (heirId.includes('_')) {
      // حالة الحقول المتعددة (son_1, son_2, إلخ)
      const [baseId, index] = heirId.split('_');
      if (!data.heirs[baseId].names) {
        data.heirs[baseId].names = {};
      }
      data.heirs[baseId].names[index] = input.value;
      data.heirs[baseId].religion = religionSelect.value;
    } else {
      // حالة الحقول المفردة
      data.heirs[heirId].name = input.value;
      data.heirs[heirId].religion = religionSelect.value;
    }
  });

  appStorage.setItem("inheritanceData", JSON.stringify(data));

  document.querySelector('.tab-button.shares').disabled = false;
  switchTab('shares');

  // حساب التوزيع
  const totalAmount = processTotalAmount(data.amount);
  const materialsAmount = parseNumber(data.materials) || 0;
  
  // ========== إصلاح: تحويل البيانات إلى تنسيق مناسب لدالة الحساب ==========
  const formattedHeirs = formatHeirsForCalculation(data.heirs);
  
  const moneyResults = calculateInheritance(totalAmount, formattedHeirs);
  
  let materialsResults = null;
  if (materialsAmount > 0) {
    materialsResults = calculateMaterialsDistribution(moneyResults, materialsAmount);
  }

  updateSharesTab({ 
    ...data, 
    heirs: moneyResults,
    materialsDistribution: materialsResults,
    hasAmount: !!data.amount && parseNumber(data.amount) > 0
  });
}

// ========== دالة جديدة: تنسيق الورثة للحساب ==========
function formatHeirsForCalculation(heirsData) {
  const formatted = {};
  
  for (let key in heirsData) {
    const heir = heirsData[key];
    
    if (heir.isMultiple && heir.count > 1) {
      // تقسيم الحقول المتعددة إلى أفراد
      for (let i = 1; i <= heir.count; i++) {
        const individualKey = `${key}_${i}`;
        formatted[individualKey] = {
          title: `${heir.title} ${numberToLocalizedWord(i, heir.gender || 'male')}`,
          name: heir.names && heir.names[i] ? heir.names[i] : '',
          religion: heir.religion || 'مسلم'
        };
      }
    } else {
      // الحقول المفردة
      formatted[key] = {
        title: heir.title,
        name: heir.name || '',
        religion: heir.religion || 'مسلم'
      };
    }
  }
  
  return formatted;
}

// ========== دالة معالجة المبلغ فقط ==========
function processTotalAmount(amount) {
  let total = parseNumber(amount) || 0;
  
  if (total === 0) {
    total = 100;
  }
  
  return total;
}

// ========== دالة حساب توزيع المواد ==========
function calculateMaterialsDistribution(moneyResults, materialsAmount) {
  const materialsDistribution = {};
  
  for (const [key, heirData] of Object.entries(moneyResults)) {
    const percentage = parseFloat(heirData.percentage) || 0;
    const materialsShare = (percentage / 100) * materialsAmount;
    
    materialsDistribution[key] = {
      ...heirData,
      materialsAmount: materialsShare.toFixed(3),
      materialsPercentage: heirData.percentage
    };
  }
  
  return materialsDistribution;
}

// ========== تحديث تبويب النتائج ==========
function updateSharesTab(data) {
  let deceasedInfoHTML = "";
  if (data.deceased_gender) {
    deceasedInfoHTML = `
        <tr>
            <td>${data.deceased_gender === 'male' ? t('male') : t('female')}</td>
            <td>${data.deceased_religion}</td>
            <td>${data.deceased_name}</td>
            <td>${data.amount || t('noAmount')}</td>
            <td>${data.materials || t('noMaterials')}</td>
        </tr>
    `;
  }
  document.getElementById('sharesDeceasedInfoBody').innerHTML = deceasedInfoHTML;

  let sharesHTML = "";
  let i = 0;
  
  const showAmounts = data.hasAmount;
  
  // ========== إصلاح: عرض جميع الورثة ==========
  for (let key in data.heirs) {
    i++;
    
    const heir = data.heirs[key];
    
    // ========== إصلاح: عرض الاسم ==========
    const heirName = heir.name || '-';
    
    // ========== إصلاح: عرض صلة القرابة ==========
    let relationship = heir.title || '-';
    
    // تحسين عرض صلة القرابة
    if (relationship.includes('undefined')) {
      // استخراج نوع العلاقة من المفتاح
      const relationshipMap = {
        'father': t('father'),
        'mother': t('mother'),
        'son': t('son'),
        'daughter': t('daughter'),
        'brother': t('brother'),
        'sister': t('sister'),
        'husband': t('husband'),
        'wife': t('wife'),
        'FR_grandfather': t('FR_grandfather'),
        'MR_grandfather': t('MR_grandfather'),
        'FR_grandmother': t('FR_grandmother'),
        'MR_grandmother': t('MR_grandmother'),
        'SN_grandson': t('SN_grandson'),
        'SN_granddaughter': t('SN_granddaughter'),
        'DR_grandson': t('DR_grandson'),
        'DR_granddaughter': t('DR_granddaughter')
      };
      
      // البحث عن الترجمة المناسبة
      for (const [fieldId, translation] of Object.entries(relationshipMap)) {
        if (key.startsWith(fieldId)) {
          relationship = translation;
          
          // إضافة الرقم إذا كان حقل متعدد
          if (key.includes('_') && !isNaN(key.split('_')[1])) {
            const num = key.split('_')[1];
            relationship += ` ${numberToLocalizedWord(parseInt(num), heir.gender || 'male')}`;
          }
          break;
        }
      }
    }
    
    let note = heir.note || '';
    
    if (note.includes('الباقي يرد')) {
      note = note.replace('الباقي يرد', t('raddNote').split('حسب')[0]);
    }
    if (note.includes('حسب سهامهما')) {
      note = note.replace('حسب سهامهما', t('raddNote').split('حسب')[1]);
    }
    if (note.includes('يرد على الابنة')) {
      note = t('remainderToDaughterNote');
    }
    if (note.includes('يرد على البنات')) {
      note = t('raddToDaughtersNote');
    }
    if (note.includes('للذكر مثل حظ الأنثيين')) {
      note = t('maleFemaleRatioNote');
    }
    if (note.includes('والباقي كاملاً للابن')) {
      note = t('remainderToSonNote');
    }
    if (note.includes('الباقي تعصيب')) {
      note = t('remainderNote');
    }
    
    const materialsData = data.materialsDistribution?.[key];
    const materialsAmount = materialsData?.materialsAmount || '0.000';
    const materialsDisplay = data.materials ? `${formatNumber(Number(materialsAmount).toFixed(3))} ${t('meter')}` : '-';
    
    const moneyAmount = heir.amount ? Number(heir.amount).toFixed(3) : '-';
    const moneyDisplay = showAmounts ? formatNumber(moneyAmount) : '-';
    
    sharesHTML += `
        <tr>
            <td class="counter">${formatNumber(i)}</td>
            <td>${relationship}</td>
            <td>${heirName}</td>
            <td>${moneyDisplay}</td>
            <td>${materialsDisplay}</td>
            <td>${formatNumber(heir.percentage) + '%' || '-'}</td>
            <td>${note}</td>
        </tr>
    `;
  }
  
  if (data.heirs.bayt_al_mal) {
    i++;
    const materialsData = data.materialsDistribution?.bayt_al_mal;
    const materialsAmount = materialsData?.materialsAmount || '0.000';
    const materialsDisplay = data.materials ? `${formatNumber(Number(materialsAmount).toFixed(3))} ${t('meter')}` : '-';
    
    const baytMoneyAmount = data.heirs.bayt_al_mal.amount ? Number(data.heirs.bayt_al_mal.amount).toFixed(3) : '-';
    const baytMoneyDisplay = showAmounts ? formatNumber(baytMoneyAmount) : '-';
    
    let baytNote = data.heirs.bayt_al_mal.note || '';
    if (baytNote.includes('الباقي يرد')) {
      baytNote = t('baytAlMalNote');
    }
    
    sharesHTML += `
        <tr>
            <td class="counter">${formatNumber(i)}</td>
            <td>${t('baytAlMal')}</td>
            <td>-</td>
            <td>${baytMoneyDisplay}</td>
            <td>${materialsDisplay}</td>
            <td>${formatNumber(data.heirs.bayt_al_mal.percentage) + '%' || '-'}</td>
            <td>${baytNote}</td>
        </tr>
    `;
  }
  
  document.getElementById('sharesTableBody').innerHTML = sharesHTML;
}

// ========== التحقق من وجود ورثة ==========
function hasSelectedHeirs() {
    const hasOtherHeirs = [...document.querySelectorAll('#dynamic-fields select')].some(select => 
        select.value !== 'noOption' && select.value !== 'لا'
    );
    const maleChecked = document.getElementById('male').checked;
    const femaleChecked = document.getElementById('female').checked;
    const deceasedGender = document.querySelector('input[name="deceased_gender"]:checked')?.value;
    const husbandSelected = deceasedGender === 'female' && document.getElementById('husband')?.value === 'yesOption';
    const wifeSelected = deceasedGender === 'male' && parseInt(document.getElementById('wife')?.value) > 0;
    
    return (hasOtherHeirs || husbandSelected || wifeSelected) && (maleChecked || femaleChecked);
}

// ========== إظهار وإغلاق المودال ==========
function showModal() {
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('validationModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('validationModal').style.display = 'none';
}

// ========== حساب عدد الورثة ==========
window.addEventListener('DOMContentLoaded', (e) => {
  const allSelect = [...document.querySelectorAll('select')];
  allSelect.forEach(el => {
    all[el.id] = el.value || 0
    el.addEventListener('change', (e) => {
      all[el.id] = el.value
      calulcateWarth(all)
    })
  })

  document.getElementById('closeModal').addEventListener('click', closeModal)
})

function calulcateWarth(all) {
  let count = 0
  let hiddenWift = document.getElementById('spouse_female').classList.contains('hidden');
  let hiddenHasband = document.getElementById('spouse_male').classList.contains('hidden')
  for (const [key, item] of Object.entries(all)) {
    if (key === 'dad_sons' || key === 'dad_girls') {
      continue
    }
    if (key === 'wift' && hiddenWift) {
      continue
    }
    if (key === 'husband' && hiddenHasband) {
      continue
    }

    if (item === 'نعم' || item === 'yes') {
      count += 1
    } else if (item === 'لا' || item === 'مسلم' || item === 'غير مسلم' || item === 'no') {
      continue
    }
    else {
      count += parseNumber(item)
    }
  }
  document.getElementById('worthCount').textContent = formatNumber(count)
}

// جعل الدوال متاحة globally
window.initColorCodingSystem = initColorCodingSystem;
window.initTab2ColorCodingSystem = initTab2ColorCodingSystem;
window.updateHeirFieldStyle = updateHeirFieldStyle;
window.updateReligionFieldStyle = updateReligionFieldStyle;
window.updateHeirNameFieldStyle = updateHeirNameFieldStyle;
window.updateHeirReligionFieldStyle = updateHeirReligionFieldStyle;

// استدعاء الأنظمة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // مراقبة تغيير التبويبات
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => {
                const activeTab = document.querySelector('.tab-content.active').id;
                if (activeTab === 'religious') {
                    initTab2ColorCodingSystem();
                }
            }, 350);
        });
    });
});

