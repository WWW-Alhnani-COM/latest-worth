import { distribute } from "./keysCalculator.js";
import { getDeceasedType } from "./conditions.js";

export function calculateInheritance(total = 100, heirs) {
  console.log('=== CALCULATE INHERITANCE START ===');
  console.log('Total:', total);
  console.log('Heirs:', heirs);
  
  const deceasedType = getDeceasedType();
  console.log('Deceased Type:', deceasedType);
  
  const results = distribute(total, heirs, deceasedType);
  
  console.log('Final results:', results);
  console.log('=== CALCULATE INHERITANCE END ===');
  
  return results;
}
