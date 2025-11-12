import { calculateInheritance } from "./functions.js";

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

function numberToArabicWord(number, gender) {
  const masculineWords = [
    "الأول", "الثاني", "الثالث", "الرابع", "الخامس",
    "السادس", "السابع", "الثامن", "التاسع", "العاشر",
    "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر",
    "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
    "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون",
    "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون",
    "الحادي والثلاثون", "الثاني والثلاثون", "الثالث والثلاثون", "الرابع والثلاثون", "الخامس والثلاثون",
    "السادس والثلاثون", "السابع والثلاثون", "الثامن والثلاثون", "التاسع والثلاثون", "الأربعون",
    "الحادي والأربعون", "الثاني والأربعون", "الثالث والأربعون", "الرابع والأربعون", "الخامس والأربعون",
    "السادس والأربعون", "السابع والأربعون", "الثامن والأربعون", "التاسع والأربعون", "الخمسون"
  ];

  const feminineWords = [
    "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة",
    "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة",
    "الحادية عشرة", "الثانية عشرة", "الثالثة عشرة", "الرابعة عشرة", "الخامسة عشرة",
    "السادسة عشرة", "السابعة عشرة", "الثامنة عشرة", "التاسعة عشرة", "العشرون",
    "الحادية والعشرون", "الثانية والعشرون", "الثالثة والعشرون", "الرابعة والعشرون", "الخامسة والعشرون",
    "السادسة والعشرون", "السابعة والعشرون", "الثامنة والعشرون", "التاسعة والعشرون", "الثلاثون",
    "الحادية والثلاثون", "الثانية والثلاثون", "الثالثة والثلاثون", "الرابعة والثلاثون", "الخامسة والثلاثون",
    "السادسة والثلاثون", "السابعة والثلاثون", "الثامنة والثلاثون", "التاسعة والثلاثون", "الأربعون",
    "الحادية والأربعون", "الثانية والأربعون", "الثالثة والأربعون", "الرابعة والأربعون", "الخامسة والأربعون",
    "السادسة والأربعون", "السابعة والأربعون", "الثامنة والأربعون", "التاسعة والأربعون", "الخمسون"
  ];

  return gender === "male" ? masculineWords[number - 1] : feminineWords[number - 1];
}

document.addEventListener('DOMContentLoaded', () => {
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
      window.print();
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
  document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

  // التحكم في إظهار/إخفاء أزرار الفوتر حسب التبويب النشط
  updateFooterButtons(tabId);
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
      nextBtn.textContent = 'التالي';
      break;
    case 'religious':
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'النتيجة';
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
  const template = Handlebars.compile(document.getElementById('field-template').innerHTML);
  document.getElementById('dynamic-fields').innerHTML = template({ groups: fieldsData });

  document.querySelectorAll('input[name="deceased_gender"]').forEach(input => {
    input.addEventListener('change', toggleSpouseField);
  });

  form.addEventListener('submit', openSonsModal);
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
        formData.heirs[`${id}_${i}`] = { title: `الزوجة ${numberToArabicWord(i, "female")}`, name: "" };
      }
      return;
    }

    if (id === "husband" && value === "yes" && formData.deceased_gender === "female") {
      formData.heirs[id] = { title: "الزوج", name: "" };
      return;
    }

    if (value === "نعم") {
      formData.heirs[id] = { title: title, name: "" };
      return;
    }

    if (!isNaN(parseInt(value)) && parseInt(value) > 0) {
      for (let i = 1; i <= parseInt(value); i++) {
        formData.heirs[`${id}_${i}`] = { title: `${title} (${numberToArabicWord(i, gender)})`, name: "" };
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
                <td>${data.deceased_gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                <td>${data.deceased_religion}</td>
                <td>${data.deceased_name}</td>
                <td>${data.amount || 'لم يتم تحديد مبلغ'}</td>
                <td>${data.materials || 'لا توجد'}</td>
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
                <td class="counter">${i}</td>
                <td>${data.heirs[key].title}</td>
                <td>
                  <input 
                    type="text" 
                    class="heir-name" 
                    data-heir-id="${key}" 
                    value="${data.heirs[key].name || ''}" 
                    placeholder="أدخل اسم الوريث"
                    title="اسم الوريث ${data.heirs[key].title}"
                  >
                </td>
                <td>
                    <select class="heir-religion" data-heir-id="${key}" title="ديانة الوريث ${data.heirs[key].title}">
                        <option value="مسلم">مسلم</option>
                        <option value="غير مسلم">غير مسلم</option>
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
  const materialsAmount = parseFloat(data.materials) || 0;
  
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
    hasAmount: !!data.amount && parseFloat(data.amount) > 0
  });
}

// ========== دالة معالجة المبلغ فقط (بدون مواد) ==========
function processTotalAmount(amount) {
  let total = parseFloat(amount) || 0;
  
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
      materialsAmount: materialsShare.toFixed(2),
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
            <td>${data.deceased_gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${data.deceased_religion}</td>
            <td>${data.deceased_name}</td>
            <td>${data.amount || 'لم يتم تحديد مبلغ'}</td>
            <td>${data.materials || 'لا توجد'}</td>
        </tr>
    `;
  }
  document.getElementById('sharesDeceasedInfoBody').innerHTML = deceasedInfoHTML;

  let sharesHTML = "";
  let i = 0;
  
  // ========== التحكم في عرض المبالغ بناء على وجود مبلغ تركة ==========
  const showAmounts = data.hasAmount; // عرض المبالغ فقط إذا كان هناك مبلغ تركة
  
  for (let key in data.heirs) {
    i++;
    
    // ========== الإصلاح 1: معالجة صلة القرابة لمنع undefined ==========
    let relationship = data.heirs[key].title;
    
    // إذا كان العنوان غير محدد، نستخدم معرف الوارث لاستنتاج الصلة
    if (!relationship || relationship === 'undefined' || relationship.includes('undefined')) {
      if (key.startsWith('son_')) {
        const sonNumber = key.split('_')[1] || '';
        relationship = sonNumber ? `ابن (${numberToArabicWord(parseInt(sonNumber), 'male')})` : 'ابن';
      } else if (key.startsWith('daughter_')) {
        const daughterNumber = key.split('_')[1] || '';
        relationship = daughterNumber ? `ابنة (${numberToArabicWord(parseInt(daughterNumber), 'female')})` : 'ابنة';
      } else if (key.startsWith('wife_')) {
        const wifeNumber = key.split('_')[1] || '';
        relationship = wifeNumber ? `زوجة (${numberToArabicWord(parseInt(wifeNumber), 'female')})` : 'زوجة';
      } else if (key.startsWith('sister_')) {
        const sisterNumber = key.split('_')[1] || '';
        relationship = sisterNumber ? `أخت (${numberToArabicWord(parseInt(sisterNumber), 'female')})` : 'أخت';
      } else if (key === 'father') {
        relationship = 'أب';
      } else if (key === 'mother') {
        relationship = 'أم';
      } else if (key === 'husband') {
        relationship = 'زوج';
      } else if (key === 'FR_grandmother') {
        relationship = 'جدة لاب';
      } else if (key === 'MR_grandmother') {
        relationship = 'جدة لأم';
      } else {
        relationship = key; // استخدام المعرف كبديل
      }
    }
    
    // ========== الإصلاح 2: تنظيف رسائل التوضيح ==========
    let note = data.heirs[key].note || '';
    
    // استبدال العبارات في الملاحظات
    if (note.includes('الباقي يرد')) {
      note = note.replace('الباقي يرد', 'الباقي يرد ');
    }
    if (note.includes('حسب سهامهم')) {
      note = note.replace('حسب سهامهم', 'حسب سهامهما');
    }
    if (note.includes('حسب سهامها')) {
      note = note.replace('حسب سهامها',  'حسب سهامهما');
    }
    if (note.includes('يرد على الابنة')) {
      note = note.replace('يرد على الابنة', 'يرد رحم على الابنة');
    }
    if (note.includes('يرد للابنة')) {
      note = note.replace('يرد للابنة', 'يرد رحم للابنة');
    }
    if (note.includes('يرد على البنات')) {
      note = note.replace('يرد على البنات', 'يرد رحم على البنات');
    }
    
    // الحصول على كمية المواد لهذا الوريث
    const materialsData = data.materialsDistribution?.[key];
    const materialsAmount = materialsData?.materialsAmount || '0.00';
    const materialsDisplay = data.materials ? `${materialsAmount} متر` : '-';
    
    sharesHTML += `
        <tr>
            <td class="counter">${i}</td>
            <td>${relationship}</td>
            <td>${data.heirs[key].name || '-'}</td>
            <td>${showAmounts ? (data.heirs[key].amount || '-') : '-'}</td>
            <td>${materialsDisplay}</td>
            <td>${data.heirs[key].percentage + '%' || '-'}</td>
            <td>${note}</td>
        </tr>
    `;
  }
  
  // ========== إضافة بيت المال إذا كان موجوداً في النتائج ==========
  if (data.heirs.bayt_al_mal) {
    i++;
    const materialsData = data.materialsDistribution?.bayt_al_mal;
    const materialsAmount = materialsData?.materialsAmount || '0.00';
    const materialsDisplay = data.materials ? `${materialsAmount} متر` : '-';
    
    // تنظيف ملاحظة بيت المال أيضاً
    let baytNote = data.heirs.bayt_al_mal.note || '';
    if (baytNote.includes('الباقي يرد')) {
      baytNote = baytNote.replace('الباقي يرد', 'الباقي يرد رحم');
    }
    
    sharesHTML += `
        <tr>
            <td class="counter">${i}</td>
            <td>${data.heirs.bayt_al_mal.title}</td>
            <td>${data.heirs.bayt_al_mal.name || '-'}</td>
            <td>${showAmounts ? (data.heirs.bayt_al_mal.amount || '-') : '-'}</td>
            <td>${materialsDisplay}</td>
            <td>${data.heirs.bayt_al_mal.percentage + '%' || '-'}</td>
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
      console.log('called here');
      
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
      count += +item
    }
  }
  document.getElementById('worthCount').textContent = count
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
