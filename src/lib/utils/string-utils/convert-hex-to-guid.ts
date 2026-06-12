export function convertHexToGUID(guidString: string) {
  return guidString.replace(
    /([0-z]{8})([0-z]{4})([0-z]{4})([0-z]{4})([0-z]{12})/,
    '$1-$2-$3-$4-$5'
  );
}
