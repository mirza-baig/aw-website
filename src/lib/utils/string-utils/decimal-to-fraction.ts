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

// Example usage
// console.log(decimalToFraction('92.0'), 'ToFraction');
// console.log(decimalToFraction('92.000'), 'ToFraction');
// console.log(decimalToFraction('92.0625'), 'ToFraction');
// console.log(decimalToFraction('92.125'), 'ToFraction');
