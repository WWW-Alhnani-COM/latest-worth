import { distribute } from './keysCalculator.js';
import { getDeceasedType } from './conditions.js';
import { t, formatNumber } from './translations.js';

export function calculateInheritance(totalAmount, heirs) {
    const deceasedType = getDeceasedType();
    return distribute(totalAmount, heirs, deceasedType);
}

// دالة مساعدة لتنسيق الأرقام في النتائج
export function formatResultNumbers(results) {
    const formattedResults = {};
    
    for (const [key, data] of Object.entries(results)) {
        formattedResults[key] = {
            ...data,
            amount: formatNumber(parseFloat(data.amount || 0).toFixed(3)),
            percentage: formatNumber(parseFloat(data.percentage || 0).toFixed(3))
        };
    }
    
    return formattedResults;
}
