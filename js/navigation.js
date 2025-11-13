// navigation.js - التحكم في التنقل بين الخطوات

class NavigationManager {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateNavigation();
  }

  setupEventListeners() {
    // زر التالي
    const nextButton = document.getElementById('footer-next-btn');
    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextStep());
    }

    // زر السابق
    const prevButton = document.getElementById('footer-prev-btn');
    if (prevButton) {
      prevButton.addEventListener('click', () => this.previousStep());
    }

    // زر الطباعة
    const printButton = document.getElementById('footer-print-btn');
    if (printButton) {
      printButton.addEventListener('click', () => this.printResults());
    }

    // زر إغلاق المودال
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => this.closeValidationModal());
    }

    // زر التالي في المودال
    const sonsNextBtn = document.getElementById('sonsNextBtn');
    if (sonsNextBtn) {
      sonsNextBtn.addEventListener('click', () => this.closeSonsModal());
    }

    // زر إغلاق مودال الأبناء
    const closeSonsPopup = document.getElementById('closeSonsPopup');
    if (closeSonsPopup) {
      closeSonsPopup.addEventListener('click', () => this.closeSonsModal());
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      // التحقق من صحة البيانات في الخطوة الحالية
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.updateNavigation();
      } else {
        this.showValidationError('يجب ملء جميع الحقول المطلوبة قبل المتابعة');
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateNavigation();
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return true; // الخطوة 3 لا تحتاج تحقق
      default:
        return true;
    }
  }

  validateStep1() {
    const deceasedGender = document.querySelector('input[name="deceased_gender"]:checked');
    const deceasedName = document.getElementById('deceased_name').value.trim();
    
    if (!deceasedGender) {
      this.showValidationError('يجب تحديد نوع المتوفى');
      return false;
    }
    
    if (!deceasedName) {
      this.showValidationError('يجب إدخال اسم المتوفى');
      return false;
    }
    
    return true;
  }

  validateStep2() {
    // التحقق من وجود ورثة على الأقل
    const heirsCount = document.getElementById('worthCount').textContent;
    if (parseInt(heirsCount) === 0) {
      this.showValidationError('يجب إضافة وارث واحد على الأقل');
      return false;
    }
    
    return true;
  }

  updateNavigation() {
    // تحديث التبويبات
    this.updateTabs();
    
    // تحديث محتوى الخطوة
    this.updateStepContent();
    
    // تحديث أزرار التنقل
    this.updateNavigationButtons();
  }

  updateTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach((tab, index) => {
      const stepNumber = index + 1;
      
      if (stepNumber === this.currentStep) {
        tab.classList.add('active');
        tab.disabled = false;
      } else if (stepNumber < this.currentStep) {
        tab.classList.remove('active');
        tab.disabled = false;
      } else {
        tab.classList.remove('active');
        tab.disabled = true;
      }
    });
  }

  updateStepContent() {
    const stepContents = document.querySelectorAll('.tab-content');
    stepContents.forEach((content, index) => {
      const stepNumber = index + 1;
      
      if (stepNumber === this.currentStep) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  updateNavigationButtons() {
    const prevButton = document.getElementById('footer-prev-btn');
    const nextButton = document.getElementById('footer-next-btn');
    const printButton = document.getElementById('footer-print-btn');

    // تحديث زر السابق
    if (this.currentStep > 1) {
      prevButton.classList.remove('hidden');
    } else {
      prevButton.classList.add('hidden');
    }

    // تحديث زر التالي وزر الطباعة
    if (this.currentStep < this.totalSteps) {
      nextButton.classList.remove('hidden');
      printButton.classList.add('hidden');
      nextButton.textContent = 'التالي';
    } else {
      nextButton.classList.add('hidden');
      printButton.classList.remove('hidden');
    }
  }

  showValidationError(message) {
    const modal = document.getElementById('modalOverlay');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal && modalContent) {
      modalContent.textContent = message;
      modal.classList.remove('hidden');
      modal.classList.add('active');
    } else {
      alert(message);
    }
  }

  closeValidationModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('active');
    }
  }

  closeSonsModal() {
    const modal = document.getElementById('sons_numbers');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('active');
    }
  }

  printResults() {
    window.print();
  }

  // دالة للانتقال إلى خطوة معينة
  goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
      this.currentStep = stepNumber;
      this.updateNavigation();
    }
  }
}

// تهيئة مدير التنقل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  window.navigationManager = new NavigationManager();
});
