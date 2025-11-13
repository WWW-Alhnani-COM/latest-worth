// interactions.js - إدارة التفاعلات والتحديدات

class InteractionManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupGenderSelection();
    this.setupReligionSelection();
    this.setupCategorySelections();
    this.setupDynamicFields();
  }

  setupGenderSelection() {
    const maleItem = document.getElementById('maleItem');
    const femaleItem = document.getElementById('femaleItem');
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');

    if (maleItem && femaleItem) {
      maleItem.addEventListener('click', () => {
        this.selectGender('male', maleItem, femaleItem);
      });

      femaleItem.addEventListener('click', () => {
        this.selectGender('female', femaleItem, maleItem);
      });
    }

    // تحديث حالة العناصر عند تحميل الصفحة
    if (maleRadio && maleRadio.checked) {
      this.selectGender('male', maleItem, femaleItem);
    } else if (femaleRadio && femaleRadio.checked) {
      this.selectGender('female', femaleItem, maleItem);
    }
  }

  selectGender(gender, selectedItem, unselectedItem) {
    if (selectedItem) selectedItem.classList.add('selected');
    if (unselectedItem) unselectedItem.classList.remove('selected');
    
    // إظهار/إخفاء حقول الزوج/الزوجة
    this.toggleSpouseFields(gender);
  }

  toggleSpouseFields(gender) {
    const spouseFemale = document.getElementById('spouse_female');
    const spouseMale = document.getElementById('spouse_male');
    
    if (gender === 'male') {
      spouseFemale.classList.remove('hidden');
      spouseMale.classList.add('hidden');
    } else {
      spouseMale.classList.remove('hidden');
      spouseFemale.classList.add('hidden');
    }
  }

  setupReligionSelection() {
    const muslimItem = document.getElementById('muslimItem');
    const nonMuslimItem = document.getElementById('nonMuslimItem');
    const religionSelect = document.getElementById('deceased_religion');

    if (muslimItem && nonMuslimItem) {
      muslimItem.addEventListener('click', () => {
        this.selectReligion('مسلم', muslimItem, nonMuslimItem);
      });

      nonMuslimItem.addEventListener('click', () => {
        this.selectReligion('غير مسلم', nonMuslimItem, muslimItem);
      });
    }

    // تحديث حالة العناصر عند تحميل الصفحة
    if (religionSelect) {
      if (religionSelect.value === 'مسلم') {
        this.selectReligion('مسلم', muslimItem, nonMuslimItem);
      } else {
        this.selectReligion('غير مسلم', nonMuslimItem, muslimItem);
      }
    }
  }

  selectReligion(religion, selectedItem, unselectedItem) {
    if (selectedItem) selectedItem.classList.add('selected');
    if (unselectedItem) unselectedItem.classList.remove('selected');
    
    // تحديث قيمة select الديانة
    const religionSelect = document.getElementById('deceased_religion');
    if (religionSelect) {
      religionSelect.value = religion;
    }
  }

  setupCategorySelections() {
    // إضافة مستمع للأحداث لجميع عناصر select في الفئات
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('category-select')) {
        this.handleCategorySelection(e.target);
      }
    });

    // تحديث عدد الورثة
    this.updateHeirsCount();
  }

  handleCategorySelection(selectElement) {
    if (selectElement.value !== '0' && selectElement.value !== 'no') {
      selectElement.classList.add('selected');
    } else {
      selectElement.classList.remove('selected');
    }
    
    // تحديث عدد الورثة
    this.updateHeirsCount();
  }

  updateHeirsCount() {
    const worthCount = document.getElementById('worthCount');
    if (!worthCount) return;

    let count = 0;
    
    // حساب عدد الزوجات
    const wifeSelect = document.getElementById('wife');
    if (wifeSelect && wifeSelect.value !== '0') {
      count += parseInt(wifeSelect.value);
    }
    
    // حساب الزوج
    const husbandSelect = document.getElementById('husband');
    if (huslimSelect && husbandSelect.value === 'yes') {
      count += 1;
    }
    
    // حساب الورثة من الفئات الديناميكية
    const categorySelects = document.querySelectorAll('.category-select:not(#wife):not(#husband)');
    categorySelects.forEach(select => {
      if (select.value !== '0' && select.value !== 'no') {
        count += 1;
      }
    });
    
    worthCount.textContent = count;
  }

  setupDynamicFields() {
    // هذا سيكون مرتبطًا بـ new_script.js
    // يمكن إضافة التفاعلات الإضافية هنا
  }
}

// تهيئة مدير التفاعلات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  window.interactionManager = new InteractionManager();
});
