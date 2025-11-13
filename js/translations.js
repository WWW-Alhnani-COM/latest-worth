// Multi-language translations for Islamic Inheritance Calculator
// Supported languages: Arabic (ar), English (en), Urdu (ur)

export const translations = {
  ar: {
    // Page title and headers
    pageTitle: "الفتح السليماني الطيبي - حاسبة الميراث",
    mainTitle: "حاسبة تقسيم الميراث",
    printTitle: "نتيجة تقسيم الميراث",
    madhhabTitle: "حسب مذهب آل البيت عليهم الصلاة والسلام",
    
    // Language selector
    language: "اللغة",
    selectLanguage: "اختر اللغة",
    
    // Tab titles
    tab1Title: "البيانات الأساسية",
    tab2Title: "بيانات الورثة",
    tab3Title: "نتائج التوزيع",
    
    // Step numbers
    step: "الخطوة",
    
    // Buttons
    next: "التالي",
    previous: "السابق",
    result: "النتيجة",
    print: "طباعة",
    close: "إغلاق",
    ok: "حسناً",
    
    // Deceased info
    deceasedType: "نوع المتوفى",
    male: "ذكر",
    female: "أنثى",
    religion: "الديانة",
    muslim: "مسلم",
    nonMuslim: "غير مسلم",
    deceasedName: "اسم المتوفى",
    enterDeceasedName: "أدخل اسم المتوفى",
    estateAmount: "مبلغ التركة",
    enterAmount: "أدخل المبلغ إذا كان معروفاً",
    materials: "الأمتار المراد توزيعها",
    enterMaterials: "أدخل الأمتار المراد توزيعها إذا كانت معروفة",
    riyal: "ريال",
    meter: "متر",
    heir: "وريث",
    
    // Spouse
    numberOfWives: "عدد الزوجات",
    hasHusband: "هل يوجد زوج؟",
    no: "لا",
    yes: "نعم",
    
    // Alerts
    alert1: "قم بإدخال جنس المتوفى واسمه ومبلغ التركة إن كان معروفاً والأمتار المراد تقسيمها إن كانت معروفة وقم بتحديد جميع ورثته ثم اضغط على التالي",
    alert2: "اكتب أسماء الورثة واختر ديانة كل وارث ثم اضغط على التالي",
    alert3: "تمت القسمة ويمكنك طباعة نتيجة القسمة أو اضغط على السابق للتعديل",
    validationError: "يجب اختيار وارث واحد على الأقل للمتابعة",
    
    // Table headers
    category: "الفئة",
    name: "الاسم",
    religiousStatus: "الحالة الدينية",
    relationship: "صلة القرابة",
    heirName: "اسم الوارث",
    enterHeirName: "أدخل اسم الوريث",
    moneyShare: "مقدار الورث من المال",
    materialsShare: "مقدار الورث من الأمتار",
    percentageShare: "مقدار الورث بالنسبة",
    explanation: "توضيح",
    noAmount: "لم يتم تحديد مبلغ",
    noMaterials: "لا توجد",
    
    // Modal for father's children
    fatherChildrenTitle: "كم عدد أبناء وبنات الأب",
    fatherChildrenSubtitle: "(إخوة وأخوات المتوفى)",
    fatherSons: "عدد أولاد الأب",
    fatherDaughters: "عدد بنات الأب",
    oneSon: "ولد",
    twoSons: "ولدين",
    moreThanTwoSons: "أكثر من ولدين",
    oneDaughter: "بنت",
    twoDaughters: "بنتين",
    threeDaughters: "ثلاث بنات",
    fourDaughters: "أربع بنات",
    moreThanFourDaughters: "أكثر من أربع بنات",
    
    // Heir categories
    category1: "الفئة 1",
    category2: "الفئة 2",
    category3: "الفئة 3",
    category4: "الفئة 4",
    category5: "الفئة 5",
    category6: "الفئة 6",
    category7: "الفئة 7",
    category8: "الفئة 8",
    category9: "الفئة 9",
    
    // Heir relationships
    father: "أب",
    mother: "أم",
    son: "ابن",
    daughter: "ابنة",
    husband: "زوج",
    wife: "زوجة",
    brother: "أخ",
    sister: "أخت",
    
    // Extended family (add more as needed)
    FR_grandfather: "جد لأب",
    MR_grandfather: "جد لأم",
    
    // ... (جميع العلاقات العائلية الأخرى)
  },
  
  en: {
    // Page title and headers
    pageTitle: "Al-Fath Al-Sulaimani Al-Taybi - Inheritance Calculator",
    mainTitle: "Islamic Inheritance Distribution Calculator",
    printTitle: "Inheritance Distribution Result",
    madhhabTitle: "According to the School of Ahl al-Bayt (Peace be upon them)",
    
    // Language selector
    language: "Language",
    selectLanguage: "Select Language",
    
    // Tab titles
    tab1Title: "Basic Information",
    tab2Title: "Heirs Information",
    tab3Title: "Distribution Results",
    
    // Step numbers
    step: "Step",
    
    // Buttons
    next: "Next",
    previous: "Previous",
    result: "Result",
    print: "Print",
    close: "Close",
    ok: "OK",
    
    // Deceased info
    deceasedType: "Deceased Type",
    male: "Male",
    female: "Female",
    religion: "Religion",
    muslim: "Muslim",
    nonMuslim: "Non-Muslim",
    deceasedName: "Deceased Name",
    enterDeceasedName: "Enter deceased name",
    estateAmount: "Estate Amount",
    enterAmount: "Enter amount if known",
    materials: "Materials to Distribute",
    enterMaterials: "Enter materials if known",
    riyal: "Riyal",
    meter: "Meter",
    heir: "Heir",
    
    // Spouse
    numberOfWives: "Number of Wives",
    hasHusband: "Is there a husband?",
    no: "No",
    yes: "Yes",
    
    // Alerts
    alert1: "Enter the deceased's gender, name, estate amount if known, and materials to distribute if known. Select all heirs then click Next",
    alert2: "Enter the names of heirs and select the religion of each heir, then click Next",
    alert3: "Distribution completed. You can print the result or click Previous to edit",
    validationError: "At least one heir must be selected to continue",
    
    // Table headers
    category: "Category",
    name: "Name",
    religiousStatus: "Religious Status",
    relationship: "Relationship",
    heirName: "Heir Name",
    enterHeirName: "Enter heir name",
    moneyShare: "Money Share",
    materialsShare: "Materials Share",
    percentageShare: "Percentage Share",
    explanation: "Explanation",
    noAmount: "No amount specified",
    noMaterials: "None",
    
    // Modal for father's children
    fatherChildrenTitle: "How many sons and daughters does the father have",
    fatherChildrenSubtitle: "(Brothers and sisters of the deceased)",
    fatherSons: "Number of father's sons",
    fatherDaughters: "Number of father's daughters",
    oneSon: "One son",
    twoSons: "Two sons",
    moreThanTwoSons: "More than two sons",
    oneDaughter: "One daughter",
    twoDaughters: "Two daughters",
    threeDaughters: "Three daughters",
    fourDaughters: "Four daughters",
    moreThanFourDaughters: "More than four daughters",
    
    // Heir categories
    category1: "Category 1",
    category2: "Category 2",
    category3: "Category 3",
    category4: "Category 4",
    category5: "Category 5",
    category6: "Category 6",
    category7: "Category 7",
    category8: "Category 8",
    category9: "Category 9",
    
    // Heir relationships
    father: "Father",
    mother: "Mother",
    son: "Son",
    daughter: "Daughter",
    husband: "Husband",
    wife: "Wife",
    brother: "Brother",
    sister: "Sister",
    
    // Extended family
    FR_grandfather: "Paternal Grandfather",
    MR_grandfather: "Maternal Grandfather",
    
    // ... (جميع العلاقات العائلية الأخرى)
  },
  
  ur: {
    // Page title and headers
    pageTitle: "الفتح السلیمانی الطیبی - وراثت کیلکولیٹر",
    mainTitle: "اسلامی وراثت تقسیم کیلکولیٹر",
    printTitle: "وراثت کی تقسیم کا نتیجہ",
    madhhabTitle: "اہل بیت علیہم السلام کے مذہب کے مطابق",
    
    // Language selector
    language: "زبان",
    selectLanguage: "زبان منتخب کریں",
    
    // Tab titles
    tab1Title: "بنیادی معلومات",
    tab2Title: "وارثوں کی معلومات",
    tab3Title: "تقسیم کے نتائج",
    
    // Step numbers
    step: "مرحلہ",
    
    // Buttons
    next: "اگلا",
    previous: "پچھلا",
    result: "نتیجہ",
    print: "پرنٹ",
    close: "بند کریں",
    ok: "ٹھیک ہے",
    
    // Deceased info
    deceasedType: "متوفی کی قسم",
    male: "مرد",
    female: "عورت",
    religion: "مذہب",
    muslim: "مسلم",
    nonMuslim: "غیر مسلم",
    deceasedName: "متوفی کا نام",
    enterDeceasedName: "متوفی کا نام درج کریں",
    estateAmount: "ترکہ کی رقم",
    enterAmount: "اگر معلوم ہو تو رقم درج کریں",
    materials: "تقسیم کے لیے میٹر",
    enterMaterials: "اگر معلوم ہو تو میٹر درج کریں",
    riyal: "ریال",
    meter: "میٹر",
    heir: "وارث",
    
    // Spouse
    numberOfWives: "بیویوں کی تعداد",
    hasHusband: "کیا شوہر موجود ہے؟",
    no: "نہیں",
    yes: "ہاں",
    
    // Alerts
    alert1: "متوفی کی جنس، نام، ترکہ کی رقم اگر معلوم ہو، اور تقسیم کے لیے میٹر اگر معلوم ہو درج کریں۔ تمام وارثوں کو منتخب کریں پھر اگلا دبائیں",
    alert2: "وارثوں کے نام لکھیں اور ہر وارث کا مذہب منتخب کریں، پھر اگلا دبائیں",
    alert3: "تقسیم مکمل ہو گئی۔ آپ نتیجہ پرنٹ کر سکتے ہیں یا ترمیم کے لیے پچھلا دبائیں",
    validationError: "جاری رکھنے کے لیے کم از کم ایک وارث منتخب کرنا ضروری ہے",
    
    // Table headers
    category: "زمرہ",
    name: "نام",
    religiousStatus: "مذہبی حیثیت",
    relationship: "رشتہ",
    heirName: "وارث کا نام",
    enterHeirName: "وارث کا نام درج کریں",
    moneyShare: "رقم کا حصہ",
    materialsShare: "میٹر کا حصہ",
    percentageShare: "فیصد کا حصہ",
    explanation: "وضاحت",
    noAmount: "کوئی رقم متعین نہیں",
    noMaterials: "کوئی نہیں",
    
    // Modal for father's children
    fatherChildrenTitle: "باپ کے کتنے بیٹے اور بیٹیاں ہیں",
    fatherChildrenSubtitle: "(متوفی کے بھائی اور بہنیں)",
    fatherSons: "باپ کے بیٹوں کی تعداد",
    fatherDaughters: "باپ کی بیٹیوں کی تعداد",
    oneSon: "ایک بیٹا",
    twoSons: "دو بیٹے",
    moreThanTwoSons: "دو سے زیادہ بیٹے",
    oneDaughter: "ایک بیٹی",
    twoDaughters: "دو بیٹیاں",
    threeDaughters: "تین بیٹیاں",
    fourDaughters: "چار بیٹیاں",
    moreThanFourDaughters: "چار سے زیادہ بیٹیاں",
    
    // Heir categories
    category1: "زمرہ 1",
    category2: "زمرہ 2",
    category3: "زمرہ 3",
    category4: "زمرہ 4",
    category5: "زمرہ 5",
    category6: "زمرہ 6",
    category7: "زمرہ 7",
    category8: "زمرہ 8",
    category9: "زمرہ 9",
    
    // Heir relationships
    father: "والد",
    mother: "والدہ",
    son: "بیٹا",
    daughter: "بیٹی",
    husband: "شوہر",
    wife: "بیوی",
    brother: "بھائی",
    sister: "بہن",
    
    // Extended family
    FR_grandfather: "دادا",
    MR_grandfather: "نانا",
    
    // ... (جميع العلاقات العائلية الأخرى)
  }
};

// Get current language from localStorage or default to Arabic
export function getCurrentLanguage() {
  return localStorage.getItem('language') || 'ar';
}

// Set language and save to localStorage
export function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    return true;
  }
  return false;
}

// Get translation for a key
export function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations['ar'][key] || key;
}

// Check if language is RTL
export function isRTL(lang = null) {
  const currentLang = lang || getCurrentLanguage();
  return currentLang === 'ar' || currentLang === 'ur';
}

// Get ordinal number word
export function getOrdinalNumber(number, gender) {
  const lang = getCurrentLanguage();
  const index = number - 1;
  
  if (gender === 'male') {
    return translations[lang].ordinalMale?.[index] || number.toString();
  } else {
    return translations[lang].ordinalFemale?.[index] || number.toString();
  }
}
