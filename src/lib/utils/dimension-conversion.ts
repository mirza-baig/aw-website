export const decimalToFraction = (number: string) => {
  const parts = number.split('.');

  if (parts && (parts.length === 1 || (parts[1] && Number(parts[1]) <= 0))) {
    return parts[0];
  }

  const decimal = Number(`0.${parts[1]}`);

  const tolerance = 1.0e-6;
  let numerator = 1;
  let denominator = 1;
  let lowerNumerator = 0;
  let lowerDenominator = 1;
  let upperNumerator = 1;
  let upperDenominator = 1;
  let approximation;

  while (true) {
    approximation = numerator / denominator;

    // Check if the approximation is within the tolerance range
    if (Math.abs(decimal - approximation) < tolerance) {
      if (denominator <= 1000000) {
        // If the denominator is small enough, return the fraction
        return `${parts[0]} ${numerator}/${denominator}`;
      } else {
        // Otherwise, return the decimal with 6 decimal places
        return `${parts[0]}.${decimal.toFixed(6)}`;
      }
    } else if (approximation < decimal) {
      // Update the lower fraction and increase the current fraction
      lowerNumerator = numerator;
      lowerDenominator = denominator;
      numerator += upperNumerator;
      denominator += upperDenominator;
    } else {
      // Update the upper fraction and increase the current fraction
      upperNumerator = numerator;
      upperDenominator = denominator;
      numerator += lowerNumerator;
      denominator += lowerDenominator;
    }
  }
};

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
