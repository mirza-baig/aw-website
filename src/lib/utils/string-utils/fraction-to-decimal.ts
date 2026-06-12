export const fractionToDecimal = (fraction: string): string => {
  // Split the input fraction string into parts using the space and double quotation mark as the separator
  const parts: string[] = fraction.split(' ');

  // If there is only one part, it means there is no fraction part, so parse and return the float value of that part
  if (parts.length === 1) {
    return parts[0].replace('"', '');
  }

  // Extract the whole part from the first part of the split
  const wholePart: number = parseInt(parts[0]);

  // Extract the fraction part from the second part of the split, and remove the double quotation mark
  const fractionPart: string = parts[1].replace('"', '');

  // Split the fraction part using the slash as the separator to get the numerator and denominator, and convert them to numbers
  const [numerator, denominator]: number[] = fractionPart.split('/').map(Number);

  // Calculate and return the decimal value by adding the whole part to the fraction value
  return (wholePart + numerator / denominator).toString();
};

// Example usage
// console.log(fractionToDecimal('92"'), 'ToDecimal');
// console.log(fractionToDecimal('92"'), 'ToDecimal');
// console.log(fractionToDecimal('92 1/16"'), 'ToDecimal');
// console.log(fractionToDecimal('92 1/8"'), 'ToDecimal');
// console.log(decimalToFraction('92.1875'));
// console.log(decimalToFraction('92.25'));
// console.log(decimalToFraction('92.3125'));
// console.log(decimalToFraction('92.375'));
// console.log(decimalToFraction('92.4375'));
// console.log(decimalToFraction('92.5'));
// console.log(decimalToFraction('92.5625'));
// console.log(decimalToFraction('92.625'));
// console.log(decimalToFraction('92.6875'));
// console.log(decimalToFraction('92.75'));
// console.log(decimalToFraction('92.8125'));
// console.log(decimalToFraction('92.875'));
// console.log(decimalToFraction('92.9375'));
