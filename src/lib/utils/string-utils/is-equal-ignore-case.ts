export const isEqualIgnoreCase = (left: string | undefined, right: string | undefined) => {
  if (left === undefined && right === undefined) {
    return true;
  }

  if (left === undefined || right === undefined) {
    return false;
  }

  return left.localeCompare(right, undefined, { sensitivity: 'base' }) === 0;
};
