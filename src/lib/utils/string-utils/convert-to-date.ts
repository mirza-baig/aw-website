// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToDate(data: any): string {
  if (typeof data == 'number') {
    const formatted = new Date(data);

    const dd = formatted.getDate();
    const yy = formatted.getFullYear();
    const mm = formatted.getMonth() + 1;
    return `${mm}/${dd}/${yy}`;
  } else {
    return data;
  }
}
