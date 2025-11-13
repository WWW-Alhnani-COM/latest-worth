import { calculateInheritance } from "./functions.js";
import { t, getCurrentLanguage, setLanguage, isRTL, formatNumber, parseNumber, getOrdinalNumber } from "./translations.js";

const all = {};
const booleanOptions = ["لا", "نعم"];
const defaultOptions = ["لا", ...Array.from({ length: 49 }, (_, i) => i + 1)];
const customOptions = ["لا", "مولى مُعتِق", "مولى مُعتَق", "مولى بالموالاه"];

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
    
    // تحديث خيارات اللغة
    const options = languageSelect.querySelectorAll('option');
    options[0].textContent = t('language') === 'language' ? 'العربية' : t('language');
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

document.addEventListener('DOMContentLoaded', () => {
  // تهيئة نظام الترجمة
  initTranslationSystem();
  initTabs();
  initCalculatorForm();
  initFooterButtons();

  document.getElementById('closeSonsPopup').addEventListener('click', () => {
    document.getElementById('sons_numbers').classList.remove('show')
  })
  
  document.getElementById('sonsNextBtn').addEventListener('click', () => {
    document.getElementById('sons_numbers').classList.remove('show')
    handleCalculatorSubmit();
  })
});

// تهيئة نظام الترجمة
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

// إعادة تحميل بيانات النموذج بعد تغيير اللغة
function reloadFormData() {
  const storedData = localStorage.getItem("inheritanceData");
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

// دالة جديدة للتحكم في أزرار الفوتر
function initFooterButtons() {
  const prevBtn = document.getElementById('footer-prev-btn');
  const nextBtn = document.getElementById('footer-next-btn');
  const printBtn = document.getElementById('footer-print-btn');

  // زر السابق
  prevBtn.addEventListener('click', () => {
    const currentTab = document.querySelector('.tab-content.active').id;
    
    if (currentTab === 'religious') {
      switchTab('calculator');
    } else if (currentTab === 'shares') {
      switchTab('religious');
    }
  });

  // زر التالي
  nextBtn.addEventListener('click', () => {
    const currentTab = document.querySelector('.tab-content.active').id;
    
    if (currentTab === 'calculator') {
      document.getElementById('inheritanceForm').dispatchEvent(new Event('submit'));
    } else if (currentTab === 'religious') {
      document.getElementById('resultForm').dispatchEvent(new Event('submit'));
    }
  });

  // زر الطباعة
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      // التأكد من أن تبويب النتائج هو النشط
      switchTab('shares');
      
      // انتظار حتى يتم التحديث
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
  document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

  // تحديث حالة الأزرار
  updateTabButtonsState(tabId);
  
  // التحكم في إظهار/إخفاء أزرار الفوتر حسب التبويب النشط
  updateFooterButtons(tabId);
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

function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => e.preventDefault());
  });

  document.querySelector('.tab-button.religious').disabled = true;
  document.querySelector('.tab-button.shares').disabled = true;
  
  // تهيئة أزرار الفوتر للتبويب الأول
  updateFooterButtons('calculator');
}

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

  calulcateWarth(all)
}

function handleCalculatorSubmit() {
  const formData = collectFormData();
  localStorage.setItem("inheritanceData", JSON.stringify(formData));

  document.querySelector('.tab-button.religious').disabled = false;
  switchTab('religious');
  updateReligiousTab(formData);
}

function collectFormData() {
  const formData = {
    deceased_gender: document.querySelector('input[name="deceased_gender"]:checked')?.value || "",
    deceased_religion: document.getElementById("deceased_religion").value || "",
    deceased_name: document.getElementById("deceased_name").value || "",
    amount: document.getElementById("amount").value || "",
    materials: document.getElementById("materials").value || "",
    heirs: {}
  };

  document.querySelectorAll("#inheritanceForm select").forEach(select => {
    const id = select.id;
    const title = select.parentElement.querySelector("label").textContent;
    const value = select.value;
    const fieldConfig = fieldsData.flatMap(group => group.fields).find(field => field.id === id);
    const gender = fieldConfig?.gender || "male";

    if (id === "wife" && parseInt(value) > 0) {
      for (let i = 1; i <= parseInt(value); i++) {
        formData.heirs[`${id}_${i}`] = { 
          title: `${t('wife')} ${numberToLocalizedWord(i, "female")}`, 
          name: "" 
        };
      }
      return;
    }

    if (id === "husband" && value === "yes" && formData.deceased_gender === "female") {
      formData.heirs[id] = { title: t('husband'), name: "" };
      return;
    }

    if (value === "نعم") {
      formData.heirs[id] = { title: title, name: "" };
      return;
    }

    if (!isNaN(parseInt(value)) && parseInt(value) > 0) {
      for (let i = 1; i <= parseInt(value); i++) {
        formData.heirs[`${id}_${i}`] = { 
          title: `${title} ${numberToLocalizedWord(i, gender)}`, 
          name: "" 
        };
      }
    }
  });

  return formData;
}

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
  for (let key in data.heirs) {
    if (data.deceased_gender === 'female' && key.startsWith("wife")) {
      continue;
    }
    i++
    heirsHTML += `
            <tr>
                <td class="counter">${formatNumber(i)}</td>
                <td>${data.heirs[key].title}</td>
                <td>
                  <input 
                    type="text" 
                    class="heir-name" 
                    data-heir-id="${key}" 
                    value="${data.heirs[key].name || ''}" 
                    placeholder="${t('enterHeirName')}"
                    title="${t('enterHeirName')}"
                  >
                </td>
                <td>
                    <select class="heir-religion" data-heir-id="${key}" title="${t('religiousStatus')}">
                        <option value="مسلم">${t('muslim')}</option>
                        <option value="غير مسلم">${t('nonMuslim')}</option>
                    </select>
                </td>
            </tr>
        `;
  }
  document.getElementById('resultTableBody').innerHTML = heirsHTML;

  document.getElementById('resultForm').onsubmit = handleReligiousSubmit;
}

function handleReligiousSubmit(event) {
  event.preventDefault();
  const data = JSON.parse(localStorage.getItem("inheritanceData"));

  document.querySelectorAll('.heir-name').forEach(input => {
    const heirId = input.getAttribute('data-heir-id');
    data.heirs[heirId].name = input.value;
    data.heirs[heirId].religion = document.querySelector(`.heir-religion[data-heir-id="${heirId}"]`).value;
  });

  localStorage.setItem("inheritanceData", JSON.stringify(data));

  document.querySelector('.tab-button.shares').disabled = false;
  switchTab('shares');

  // ========== استخدام النظام الجديد للمفاتيح الستة ==========
  const totalAmount = processTotalAmount(data.amount);
  const materialsAmount = parseNumber(data.materials) || 0;
  
  // حساب توزيع المال باستخدام النظام الجديد
  const moneyResults = calculateInheritance(totalAmount, data?.heirs);
  
  // حساب توزيع المواد (بنفس النسب) فقط إذا كانت هناك مواد
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

// ========== دالة معالجة المبلغ فقط (بدون مواد) ==========
function processTotalAmount(amount) {
  let total = parseNumber(amount) || 0;
  
  // إذا لم يتم إدخال أي مبلغ، نستخدم قيمة افتراضية للحسابات النسبية
  if (total === 0) {
    total = 100; // قيمة افتراضية للحسابات النسبية
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
      materialsPercentage: heirData.percentage // نفس النسبة المئوية
    };
  }
  
  return materialsDistribution;
}

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
  
  // ========== التحكم في عرض المبالغ بناء على وجود مبلغ تركة ==========
  const showAmounts = data.hasAmount;
  
  for (let key in data.heirs) {
    i++;
    
    // ========== معالجة صلة القرابة ==========
    let relationship = data.heirs[key].title;
    
    // إذا كان العنوان غير محدد، نستخدم معرف الوارث لاستنتاج الصلة
    if (!relationship || relationship === 'undefined' || relationship.includes('undefined')) {
      if (key.startsWith('son_')) {
        const sonNumber = key.split('_')[1] || '';
        relationship = sonNumber ? `${t('son')} (${numberToLocalizedWord(parseInt(sonNumber), 'male')})` : t('son');
      } else if (key.startsWith('daughter_')) {
        const daughterNumber = key.split('_')[1] || '';
        relationship = daughterNumber ? `${t('daughter')} (${numberToLocalizedWord(parseInt(daughterNumber), 'female')})` : t('daughter');
      } else if (key.startsWith('wife_')) {
        const wifeNumber = key.split('_')[1] || '';
        relationship = wifeNumber ? `${t('wife')} (${numberToLocalizedWord(parseInt(wifeNumber), 'female')})` : t('wife');
      } else if (key.startsWith('sister_')) {
        const sisterNumber = key.split('_')[1] || '';
        relationship = sisterNumber ? `${t('sister')} (${numberToLocalizedWord(parseInt(sisterNumber), 'female')})` : t('sister');
      } else if (key === 'father') {
        relationship = t('father');
      } else if (key === 'mother') {
        relationship = t('mother');
      } else if (key === 'husband') {
        relationship = t('husband');
      } else if (key === 'FR_grandmother') {
        relationship = t('FR_grandmother');
      } else if (key === 'MR_grandmother') {
        relationship = t('MR_grandmother');
      } else {
        relationship = key;
      }
    }
    
    // ========== معالجة رسائل التوضيح ==========
    let note = data.heirs[key].note || '';
    
    // تنظيف الملاحظات
    if (note.includes('الباقي يرد')) {
      note = note.replace('الباقي يرد', t('raddNote').split('حسب')[0]);
    }
    if (note.includes('حسب سهامهم')) {
      note = note.replace('حسب سهامهم', t('raddNote').split('حسب')[1]);
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
    
    // الحصول على كمية المواد لهذا الوريث
    const materialsData = data.materialsDistribution?.[key];
    const materialsAmount = materialsData?.materialsAmount || '0.000';
    const materialsDisplay = data.materials ? `${formatNumber(Number(materialsAmount).toFixed(3))} ${t('meter')}` : '-';
    
    const moneyAmount = data.heirs[key].amount ? Number(data.heirs[key].amount).toFixed(3) : '-';
    const moneyDisplay = showAmounts ? formatNumber(moneyAmount) : '-';
    
    sharesHTML += `
        <tr>
            <td class="counter">${formatNumber(i)}</td>
            <td>${relationship}</td>
            <td>${data.heirs[key].name || '-'}</td>
            <td>${moneyDisplay}</td>
            <td>${materialsDisplay}</td>
            <td>${formatNumber(data.heirs[key].percentage) + '%' || '-'}</td>
            <td>${note}</td>
        </tr>
    `;
  }
  
  // ========== إضافة بيت المال إذا كان موجوداً في النتائج ==========
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

function hasSelectedHeirs() {
  const hasOtherHeirs = [...document.querySelectorAll('#dynamic-fields select')].some(select => select.value !== 'لا');
  const maleChecked = document.getElementById('male').checked;
  const femaleChecked = document.getElementById('female').checked;
  const deceasedGender = document.querySelector('input[name="deceased_gender"]:checked')?.value;
  const husbandSelected = deceasedGender === 'female' && document.getElementById('husband')?.value === 'yes';
  const wifeSelected = deceasedGender === 'male' && parseInt(document.getElementById('wife')?.value) > 0;
  return (hasOtherHeirs || husbandSelected || wifeSelected) && (maleChecked || femaleChecked);
}

function showModal() {
  document.getElementById('modalOverlay').style.display = 'block';
  document.getElementById('validationModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('validationModal').style.display = 'none';
}

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

function openSonsModal(e) {
  e.preventDefault()
  let daughter = document.getElementById('daughter').value === 'لا'
  let mother = document.getElementById('mother').value === 'نعم'
  let father = document.getElementById('father').value === 'نعم'
  let son = document.getElementById('son').value === 'لا'

  if (!hasSelectedHeirs()) {
    showModal();
    return;
  }

  if (mother && father && daughter && son) {
    document.getElementById('sons_numbers').classList.add('show')
  } else {
    document.getElementById('dad_sons').value = 'لا'
    document.getElementById('dad_girls').value = 'لا'
    handleCalculatorSubmit()
  }
}
