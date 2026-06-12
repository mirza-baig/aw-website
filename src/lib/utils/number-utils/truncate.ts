export const truncate = (number: number, digits: number) => {
  const re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)'),
    m = re.exec(number.toString());
  return m ? parseFloat(m[1]) : number.valueOf();
};
