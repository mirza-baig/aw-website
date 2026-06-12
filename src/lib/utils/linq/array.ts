/* eslint-disable @typescript-eslint/no-this-alias */
//SQ-NOSCAN-START SonarQube doesn't like extending this way
declare global {
  interface Array<T> {
    single(predicate?: (value: T, index: number, obj: T[]) => unknown): T;
    singleOrDefault(predicate?: (value: T, index: number, obj: T[]) => unknown): T | null;
    first(predicate?: (value: T, index: number, obj: T[]) => unknown): T;
    firstOrDefault(predicate?: (value: T, index: number, obj: T[]) => unknown): T | null;
  }
}

Array.prototype.single = function <T>(
  this: T[],
  predicate?: (value: T, index: number, obj: T[]) => unknown
): T | null {
  let results = this;

  if (predicate !== undefined) {
    results = results.filter(predicate);
  }

  if (results.length == 0) {
    throw new Error('Array is empty');
  } else if (results.length > 1) {
    throw new Error('More than one element satisfies the condition');
  } else {
    return results[0];
  }
};

Array.prototype.singleOrDefault = function <T>(
  this: T[],
  predicate?: (value: T, index: number, obj: T[]) => unknown
): T | null {
  let results = this;

  if (predicate !== undefined) {
    results = results.filter(predicate);
  }

  if (results.length == 0) {
    return null;
  } else if (results.length > 1) {
    throw new Error('More than one element satisfies the condition');
  } else {
    return results[0];
  }
};

Array.prototype.first = function <T>(
  this: T[],
  predicate?: (value: T, index: number, obj: T[]) => unknown
): T | null {
  let results = this;

  if (predicate !== undefined) {
    results = results.filter(predicate);
  }

  if (results.length == 0) {
    throw new Error('Array is empty');
  } else {
    return results[0];
  }
};

Array.prototype.firstOrDefault = function <T>(
  this: T[],
  predicate?: (value: T, index: number, obj: T[]) => unknown
): T | null {
  let results = this;

  if (predicate !== undefined) {
    results = results.filter(predicate);
  }

  if (results.length == 0) {
    return null;
  } else {
    return results[0];
  }
};

export {};
//SQ-NOSCAN-END
