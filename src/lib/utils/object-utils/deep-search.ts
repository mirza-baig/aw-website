// We can ignore explicit any warning for this file, which is containing util functions
/* eslint-disable @typescript-eslint/no-explicit-any */
export const deepSearch = <T = any>(
  root: any,
  predicate: (obj: T) => boolean,
  stopAtFirst = false
) => {
  const processedObjects: any[] = [];
  const matchingObjects: T[] = [];
  (function find(obj) {
    if (predicate(obj) === true) {
      matchingObjects.push(obj);
      if (stopAtFirst) {
        return;
      }
    }
    for (const key of Object.keys(obj)) {
      const o: any = obj[key];
      if (o && typeof o === 'object') {
        if (!processedObjects.find((obj) => obj === o)) {
          processedObjects.push(o);
          find(o);
        }
      }
    }
  })(root);
  return matchingObjects;
};
