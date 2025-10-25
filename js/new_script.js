import { distribute } from "./functions.js";

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
  // ... باقي الحقول بدون تغيير
];

function numberToArabicWord(number, gender) {
  // ... الدالة بدون تغيير
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCalculatorForm();

  document.getElementById('closeSonsPopup').addEventListener('click', () => {
    document.getElementById('sons_numbers').classList.remove('show')
  })
  document.getElementById('sonsNextBtn').addEventListener('click', () => {
    document.getElementById('sons_numbers').classList.remove('show')
    handleCalculatorSubmit();
  })
});

function initTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', (e) => e.preventDefault());
  });

  document.querySelector('.tab-button.religious').disabled = true;
  document.querySelector('.tab-button.shares').disabled = true;
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
  document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
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
                <td><input type="text" class="heir-name" data-heir-id="${key}" value="${data.heirs[key].name || ''}"></td>
                <td>
                    <select class="heir-religion" data-heir-id="${key}">
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

  // ========== الإصلاح: معالجة حقل المواد والمبلغ ==========
  const totalAmount = processTotalAmount(data.amount, data.materials);
  const results = distribute(totalAmount, data?.heirs)

  updateSharesTab({ ...data, heirs: results });
}

// ========== الإصلاح: دالة معالجة المبلغ والمواد ==========
function processTotalAmount(amount, materials) {
  let total = parseFloat(amount) || 0;
  
  // إذا تم إدخال مواد، نضيفها إلى المبلغ الإجمالي
  if (materials && materials.trim() !== '') {
    const materialsValue = parseFloat(materials) || 0;
    total += materialsValue;
  }
  
  // إذا لم يتم إدخال أي مبلغ أو مواد، نستخدم قيمة افتراضية للحسابات النسبية
  if (total === 0) {
    total = 100; // قيمة افتراضية للحسابات النسبية
  }
  
  return total;
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
  let i = 0
  for (let key in data.heirs) {
    i++
    sharesHTML += `
        <tr>
            <td class="counter">${i}</td>
            <td>${data.heirs[key].title}</td>
            <td>${data.heirs[key].name || '-'}</td>
            <td>${data.heirs[key].amount || '-'}</td>
            <td>-</td>
            <td>${data.heirs[key].percentage + '%' || '-'}</td>
            <td>${data.heirs[key].note || '-'}</td>
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
  document.getElementById('backToCalculator').addEventListener('click', () => switchTab('calculator'))
  document.getElementById('backToReligious').addEventListener('click', () => switchTab('religious'))
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
