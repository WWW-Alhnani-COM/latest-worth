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
    decimalSeparator: ",",  // فاصلة عربية
    
    // آلاف separator جديد
    thousandsSeparator: ",",

    // التنبيهات
    alertTitle: "تنبيه",
    deceasedTypeRequired: "يجب تحديد نوع المتوفى للمتابعة",
    heirsRequired: "يجب اختيار وارث واحد على الأقل للمتابعة",

    // أزرار التنبيهات
    ok: "حسناً",
    confirm: "تأكيد",
    cancel: "إلغاء",
    
    // Step numbers
    step: "الخطوة",
    noOption: "لا",
    yesOption: "نعم",
    
    // Buttons
    next: "التالي",
    previous: "السابق",
    result: "النتيجة",
    print: "طباعة",
    close: "إغلاق",
    
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
    
    // Extended family
    FR_grandfather: "جد لأب",
    MR_grandfather: "جد لأم",
    FR_grandmother: "جدة لأب",
    MR_grandmother: "جدة لأم",
    SN_grandson: "ابن ابن",
    SN_granddaughter: "ابنة ابن",
    DR_grandson: "ابن بنت",
    DR_granddaughter: "ابنة بنت",
    MR_brother: "أخ لأم",
    MR_mother_sister: "أخت لأم",
    FR_brother: "أخ لأب",
    FR_sister: "أخت لأب",
    BR_boys: "ولد أخ",
    SR_boys: "ولد أخت",
    MR_BR_boys: "ولد أخ لأم",
    MR_SR_boys: "ولد أخت لأم",
    FR_BR_boys: "ولد أخ لأب",
    FR_SR_boys: "ولد أخت لأب",
    BR_girls: "بنت أخ",
    SR_girls: "بنت أخت",
    MR_BR_girls: "بنت أخ لأم",
    MR_SR_girls: "بنت أخت لأم",
    FR_BR_girls: "بنت أخ لأب",
    FR_SR_girls: "بنت أخت لأب",
    FR_uncle: "عم",
    FR_aunt: "عمة",
    MR_uncle: "خال",
    MR_aunt: "خالة",
    MR_uncle_mother: "خال لأم",
    FR_uncle_father: "خال لأب",
    MR_aunt_mother: "خالة لأم",
    FR_aunt_father: "خالة لأب",
    FR_uncle_father_A: "عم لأب",
    MR_uncle_mother_A: "عم لأم",
    FR_aunt_father_K: "عمة لأب",
    MR_aunt_mother_K: "عمة لأم",
    uncle_sons_A: "ابن عم",
    uncle_daughters_A: "بنت عم",
    aunt_sons_A: "ابن عمة",
    aunt_daughters_A: "بنت عمة",
    FR_uncle_sons_A: "ابن عم لأب",
    MR_uncle_sons_A: "ابن عم لأم",
    FR_uncle_daughter_A: "بنت عم لأب",
    MR_uncle_daughter_A: "بنت عم لأم",
    FR_aunt_sons_A: "ابن عمة لأب",
    MR_aunt_sons_A: "ابن عمة لأم",
    FR_aunt_daughter_A: "بنت عمة لأب",
    MR_aunt_daughter_A: "بنت عمة لأم",
    uncle_sons_K: "ابن خال",
    uncle_daughters_K: "بنت خال",
    aunt_sons_K: "ابن خالة",
    aunt_daughters_K: "بنت خالة",
    FR_uncle_sons_K: "ابن خال لأب",
    MR_uncle_sons_K: "ابن خال لأم",
    FR_uncle_daughter_K: "بنت خال لأب",
    MR_uncle_daughter_K: "بنت خال لأم",
    FR_aunt_sons_K: "ابن خالة لأب",
    MR_aunt_sons_K: "ابن خالة لأم",
    FR_aunt_daughter_K: "بنت خالة لأب",
    MR_aunt_daughter_K: "بنت خالة لأم",

    // Calculation notes - تم التعديل هنا
    quarterNote: "الربع فرض",
    eighthNote: "الثمن فرض",
    halfNote: "النصف فرض",
    sixthNote: "السدس فرض",
    sixthSunnaNote: "السدس سنة",
    twoThirdsNote: "ثلثين فرض",
    remainderNote: "الباقي تعصيب",
    raddNote: "الباقي يرد بالرحم حسب سهامهم",
    raddToDaughtersNote: "الباقي يرد بالرحم على البنات بالتساوي",
    maleFemaleRatioNote: "للذكر مثل حظ الأنثيين",
    remainderToSonNote: "والباقي كاملاً للابن",
    remainderToDaughterNote: "الباقي يرد بالرحم للابنة",
    baytAlMalNote: "الباقي لبيت المال",
    wifeShareNote: "حصة الزوجة",

    // Wife share notes - جديد
    wifeOneShare: "الثمن فرض للزوجة لوجود أبناء",
    wifeTwoShare: "نصف الثمن فرض للزوجتين لوجود أبناء",
    wifeThreeShare: "ثلث الثمن فرض لثلاث زوجات لوجود أبناء", 
    wifeFourShare: "ربع الثمن فرض لأربع زوجات لوجود أبناء",

    // Missing keys - جديد
    remainderToSingleDaughter: "النصف فرض والباقي يرد على الابنة",
    remainderToMultipleDaughters: "الثلثين فرض والباقي يرد على البنات",
    remainderToSons: "الباقي تعصيب للأبناء",
    baytAlMal: "بيت المال",

    // Numbers
    numbers: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
    
    // Ordinal numbers (masculine)
    ordinalMale: [
      "الأول", "الثاني", "الثالث", "الرابع", "الخامس",
      "السادس", "السابع", "الثامن", "التاسع", "العاشر"
    ],
    
    // Ordinal numbers (feminine)
    ordinalFemale: [
      "الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة",
      "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"
    ]
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
    
    // Alerts
    alertTitle: "Alert",
    deceasedTypeRequired: "You must specify the deceased type to continue",
    heirsRequired: "You must select at least one heir to continue",
    decimalSeparator: ".",  // نقطة إنجليزية
    thousandsSeparator: ",",

    // Alert buttons
    ok: "OK",
    confirm: "Confirm", 
    cancel: "Cancel",
    
    // Step numbers
    step: "Step",
    noOption: "No",
    yesOption: "Yes",
    
    // Buttons
    next: "Next",
    previous: "Previous",
    result: "Result",
    print: "Print",
    close: "Close",
    
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
    enterHeirName: "Enter name",
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
    FR_grandmother: "Paternal Grandmother",
    MR_grandmother: "Maternal Grandmother",
    SN_grandson: "Son's Son",
    SN_granddaughter: "Son's Daughter",
    DR_grandson: "Daughter's Son",
    DR_granddaughter: "Daughter's Daughter",
    MR_brother: "Maternal Brother",
    MR_mother_sister: "Maternal Sister",
    FR_brother: "Paternal Brother",
    FR_sister: "Paternal Sister",
    BR_boys: "Brother's Son",
    SR_boys: "Sister's Son",
    MR_BR_boys: "Maternal Brother's Son",
    MR_SR_boys: "Maternal Sister's Son",
    FR_BR_boys: "Paternal Brother's Son",
    FR_SR_boys: "Paternal Sister's Son",
    BR_girls: "Brother's Daughter",
    SR_girls: "Sister's Daughter",
    MR_BR_girls: "Maternal Brother's Daughter",
    MR_SR_girls: "Maternal Sister's Daughter",
    FR_BR_girls: "Paternal Brother's Daughter",
    FR_SR_girls: "Paternal Sister's Daughter",
    FR_uncle: "Paternal Uncle",
    FR_aunt: "Paternal Aunt",
    MR_uncle: "Maternal Uncle",
    MR_aunt: "Maternal Aunt",
    MR_uncle_mother: "Maternal Uncle (Mother's side)",
    FR_uncle_father: "Maternal Uncle (Father's side)",
    MR_aunt_mother: "Maternal Aunt (Mother's side)",
    FR_aunt_father: "Maternal Aunt (Father's side)",
    FR_uncle_father_A: "Paternal Uncle (Father's side)",
    MR_uncle_mother_A: "Paternal Uncle (Mother's side)",
    FR_aunt_father_K: "Paternal Aunt (Father's side)",
    MR_aunt_mother_K: "Paternal Aunt (Mother's side)",
    uncle_sons_A: "Paternal Uncle's Son",
    uncle_daughters_A: "Paternal Uncle's Daughter",
    aunt_sons_A: "Paternal Aunt's Son",
    aunt_daughters_A: "Paternal Aunt's Daughter",
    FR_uncle_sons_A: "Paternal Uncle's Son (Father's side)",
    MR_uncle_sons_A: "Paternal Uncle's Son (Mother's side)",
    FR_uncle_daughter_A: "Paternal Uncle's Daughter (Father's side)",
    MR_uncle_daughter_A: "Paternal Uncle's Daughter (Mother's side)",
    FR_aunt_sons_A: "Paternal Aunt's Son (Father's side)",
    MR_aunt_sons_A: "Paternal Aunt's Son (Mother's side)",
    FR_aunt_daughter_A: "Paternal Aunt's Daughter (Father's side)",
    MR_aunt_daughter_A: "Paternal Aunt's Daughter (Mother's side)",
    uncle_sons_K: "Maternal Uncle's Son",
    uncle_daughters_K: "Maternal Uncle's Daughter",
    aunt_sons_K: "Maternal Aunt's Son",
    aunt_daughters_K: "Maternal Aunt's Daughter",
    FR_uncle_sons_K: "Maternal Uncle's Son (Father's side)",
    MR_uncle_sons_K: "Maternal Uncle's Son (Mother's side)",
    FR_uncle_daughter_K: "Maternal Uncle's Daughter (Father's side)",
    MR_uncle_daughter_K: "Maternal Uncle's Daughter (Mother's side)",
    FR_aunt_sons_K: "Maternal Aunt's Son (Father's side)",
    MR_aunt_sons_K: "Maternal Aunt's Son (Mother's side)",
    FR_aunt_daughter_K: "Maternal Aunt's Daughter (Father's side)",
    MR_aunt_daughter_K: "Maternal Aunt's Daughter (Mother's side)",

    // Calculation notes
    quarterNote: "Quarter share",
    eighthNote: "Eighth share",
    halfNote: "Half share",
    sixthNote: "Sixth share",
    sixthSunnaNote: "Sixth share (Sunna)",
    twoThirdsNote: "Two thirds share",
    remainderNote: "Remainder by agnation",
    raddNote: "Remainder returns to heirs according to their shares",
    raddToDaughtersNote: "Remainder returns to daughters equally",
    maleFemaleRatioNote: "Male gets twice the share of female",
    remainderToSonNote: "Remainder goes entirely to son",
    remainderToDaughterNote: "Remainder returns to daughter",
    baytAlMalNote: "Remainder to public treasury",
    wifeShareNote: "Wife's share",

    // Wife share notes
    wifeOneShare: "Eighth share for wife due to presence of children",
    wifeTwoShare: "Half of eighth share for two wives due to presence of children",
    wifeThreeShare: "Third of eighth share for three wives due to presence of children",
    wifeFourShare: "Quarter of eighth share for four wives due to presence of children",

    // Missing keys
    remainderToSingleDaughter: "Half share and remainder returns to daughter",
    remainderToMultipleDaughters: "Two-thirds share and remainder returns to daughters",
    remainderToSons: "Remainder by agnation to sons",
    baytAlMal: "Public Treasury",

    // Numbers
    numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    
    // Ordinal numbers (masculine)
    ordinalMale: [
      "First", "Second", "Third", "Fourth", "Fifth",
      "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"
    ],
    
    // Ordinal numbers (feminine)
    ordinalFemale: [
      "First", "Second", "Third", "Fourth", "Fifth",
      "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"
    ]
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
    decimalSeparator: ",",  // فاصلة عربية
    thousandsSeparator: ",",
    
    // التنبيهات
    alertTitle: "تنبيه",
    deceasedTypeRequired: "جاری رکھنے کے لیے متوفی کی قسم متعین کرنا ضروری ہے",
    heirsRequired: "جاری رکھنے کے لیے کم از کم ایک وارث منتخب کرنا ضروری ہے",

    // أزرار التنبيهات
    ok: "ٹھیک ہے",
    confirm: "تصدیق کریں",
    cancel: "منسوخ کریں",
    
    // Step numbers
    step: "مرحلہ",
    noOption: "نہیں",
    yesOption: "جی ہاں",
    
    // Buttons
    next: "اگلا",
    previous: "پچھلا",
    result: "نتیجہ",
    print: "پرنٹ",
    close: "بند کریں",
    
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
    FR_grandmother: "دادی",
    MR_grandmother: "نانی",
    SN_grandson: "پوتا",
    SN_granddaughter: "پوتی",
    DR_grandson: "نواسا",
    DR_granddaughter: "نواسی",
    MR_brother: "ماں شریک بھائی",
    MR_mother_sister: "ماں شریک بہن",
    FR_brother: "باپ شریک بھائی",
    FR_sister: "باپ شریک بہن",
    BR_boys: "بھتیجا",
    SR_boys: "بہن کا بیٹا",
    MR_BR_boys: "ماں شریک بھائی کا بیٹا",
    MR_SR_boys: "ماں شریک بہن کا بیٹا",
    FR_BR_boys: "باپ شریک بھائی کا بیٹا",
    FR_SR_boys: "باپ شریک بہن کا بیٹا",
    BR_girls: "بھتیجی",
    SR_girls: "بہن کی بیٹی",
    MR_BR_girls: "ماں شریک بھائی کی بیٹی",
    MR_SR_girls: "ماں شریک بہن کی بیٹی",
    FR_BR_girls: "باپ شریک بھائی کی بیٹی",
    FR_SR_girls: "باپ شریک بہن کی بیٹی",
    FR_uncle: "چچا",
    FR_aunt: "پھوپھی",
    MR_uncle: "ماموں",
    MR_aunt: "خالہ",
    MR_uncle_mother: "ماموں (ماں کی طرف)",
    FR_uncle_father: "ماموں (باپ کی طرف)",
    MR_aunt_mother: "خالہ (ماں کی طرف)",
    FR_aunt_father: "خالہ (باپ کی طرف)",
    FR_uncle_father_A: "چچا (باپ کی طرف)",
    MR_uncle_mother_A: "چچا (ماں کی طرف)",
    FR_aunt_father_K: "پھوپھی (باپ کی طرف)",
    MR_aunt_mother_K: "پھوپھی (ماں کی طرف)",
    uncle_sons_A: "چچا زاد بھائی",
    uncle_daughters_A: "چچا زاد بہن",
    aunt_sons_A: "پھوپھی زاد بھائی",
    aunt_daughters_A: "پھوپھی زاد بہن",
    FR_uncle_sons_A: "چچا زاد بھائی (باپ کی طرف)",
    MR_uncle_sons_A: "چچا زاد بھائی (ماں کی طرف)",
    FR_uncle_daughter_A: "چچا زاد بہن (باپ کی طرف)",
    MR_uncle_daughter_A: "چچا زاد بہن (ماں کی طرف)",
    FR_aunt_sons_A: "پھوپھی زاد بھائی (باپ کی طرف)",
    MR_aunt_sons_A: "پھوپھی زاد بھائی (ماں کی طرف)",
    FR_aunt_daughter_A: "پھوپھی زاد بہن (باپ کی طرف)",
    MR_aunt_daughter_A: "پھوپھی زاد بہن (ماں کی طرف)",
    uncle_sons_K: "ماموں زاد بھائی",
    uncle_daughters_K: "ماموں زاد بہن",
    aunt_sons_K: "خالہ زاد بھائی",
    aunt_daughters_K: "خالہ زاد بہن",
    FR_uncle_sons_K: "ماموں زاد بھائی (باپ کی طرف)",
    MR_uncle_sons_K: "ماموں زاد بھائی (ماں کی طرف)",
    FR_uncle_daughter_K: "ماموں زاد بہن (باپ کی طرف)",
    MR_uncle_daughter_K: "ماموں زاد بہن (ماں کی طرف)",
    FR_aunt_sons_K: "خالہ زاد بھائی (باپ کی طرف)",
    MR_aunt_sons_K: "خالہ زاد بھائی (ماں کی طرف)",
    FR_aunt_daughter_K: "خالہ زاد بہن (باپ کی طرف)",
    MR_aunt_daughter_K: "خالہ زاد بہن (ماں کی طرف)",

    // Calculation notes
    quarterNote: "ربع فرض",
    eighthNote: "ثمن فرض",
    halfNote: "نصف فرض",
    sixthNote: "سدس فرض",
    sixthSunnaNote: "سدس سنت",
    twoThirdsNote: "ثلثين فرض",
    remainderNote: "باقي تعصيب",
    raddNote: "باقي يرد رحم حسب سهامهم",
    raddToDaughtersNote: "باقي يرد رحم على البنات بالتساوي",
    maleFemaleRatioNote: "للذكر مثل حظ الأنثيين",
    remainderToSonNote: "والباقي كاملاً للابن",
    remainderToDaughterNote: "الباقي يرد رحم للابنة",
    baytAlMalNote: "الباقي لبيت المال",
    wifeShareNote: "حصه الزوجه",

    // Wife share notes
    wifeOneShare: "بیوی کا آٹھواں حصہ اولاد کی موجودگی میں",
    wifeTwoShare: "دو بیویوں کا آدھا آٹھواں حصہ اولاد کی موجودگی میں",
    wifeThreeShare: "تین بیویوں کا تیسرا آٹھواں حصہ اولاد کی موجودگی میں", 
    wifeFourShare: "چار بیویوں کا چوتھا آٹھواں حصه اولاد کی موجودگی میں",

    // Missing keys
    remainderToSingleDaughter: "نصف فرض اور باقی لڑکی پر واپس آتا ہے",
    remainderToMultipleDaughters: "دو تہائی فرض اور باقی لڑکیوں پر واپس آتا ہے",
    remainderToSons: "باقی بیٹوں کے لیے تعصیب",
    baytAlMal: "بيت المال",

    // Numbers
    numbers: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
    
    // Ordinal numbers (masculine)
    ordinalMale: [
      "پہلا", "دوسرا", "تیسرا", "چوتھا", "پانچواں",
      "چھٹا", "ساتواں", "آٹھواں", "نواں", "دسواں"
    ],
    
    // Ordinal numbers (feminine)
    ordinalFemale: [
      "پہلی", "دوسری", "تیسری", "چوتھی", "پانچویں",
      "چھٹی", "ساتویں", "آٹھویں", "نویں", "دسویں"
    ]
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

// Format number according to language with thousands separator
export function formatNumber(number, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  const translation = translations[currentLang];
  
  if (!number && number !== 0) return '';
  
  let numStr = number.toString();
  
  // Check for NaN or Infinity
  if (!isFinite(number)) return numStr;
  
  // Handle negative numbers
  const isNegative = number < 0;
  if (isNegative) {
    numStr = numStr.substring(1);
  }
  
  // Split into integer and decimal parts
  const parts = numStr.split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1] || '';
  
  // Add thousands separator
  if (translation.thousandsSeparator) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, translation.thousandsSeparator);
  }
  
  // Convert digits to local numerals
  let formattedInteger = '';
  for (let i = 0; i < integerPart.length; i++) {
    const char = integerPart[i];
    const digit = parseInt(char);
    
    if (!isNaN(digit) && digit >= 0 && digit <= 9) {
      formattedInteger += translation.numbers[digit];
    } else {
      formattedInteger += char;
    }
  }
  
  // Convert decimal part
  let formattedDecimal = '';
  if (decimalPart) {
    for (let i = 0; i < decimalPart.length; i++) {
      const char = decimalPart[i];
      const digit = parseInt(char);
      
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        formattedDecimal += translation.numbers[digit];
      } else {
        formattedDecimal += char;
      }
    }
  }
  
  // Build the final result
  let result = formattedInteger;
  if (formattedDecimal) {
    result += translation.decimalSeparator + formattedDecimal;
  }
  
  // Add negative sign if needed
  if (isNegative) {
    result = '-' + result;
  }
  
  return result;
}

// Convert Arabic/Urdu numbers to English for calculations
export function parseNumber(numberStr) {
  if (!numberStr) return 0;
  
  const str = numberStr.toString();
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const arabicIndex = translations.ar.numbers.indexOf(char);
    const urduIndex = translations.ur.numbers.indexOf(char);
    
    if (arabicIndex !== -1) {
      result += arabicIndex.toString();
    } else if (urduIndex !== -1) {
      result += urduIndex.toString();
    } else if (char === ',' || char === '٫' || char === '،') {
      // Handle different comma types
      result += '.';
    } else {
      // Remove thousands separators
      if (char !== ',') {
        result += char;
      }
    }
  }
  
  return parseFloat(result) || 0;
}

// New function to format currency with proper separators
export function formatCurrency(amount, lang = null) {
  const currentLang = lang || getCurrentLanguage();
  
  if (!amount && amount !== 0) return '';
  
  // Format the number
  const formattedNumber = formatNumber(amount, currentLang);
  
  // Add currency symbol based on language
  const translations = {
    ar: 'ر.س',
    en: 'SAR',
    ur: 'ر.س'
  };

  // في نهاية translations.js، أضف:
if (typeof window !== 'undefined') {
  window.translations = {
    translations,
    t,
    getCurrentLanguage,
    setLanguage,
    isRTL,
    getOrdinalNumber,
    formatNumber,
    parseNumber,
    formatCurrency
  };
  console.log('🌍 translations.js محمل وجاهز للاستخدام');
}
  const currencySymbol = translations[currentLang] || 'ر.س';
  
  return `${formattedNumber} ${currencySymbol}`;
}
