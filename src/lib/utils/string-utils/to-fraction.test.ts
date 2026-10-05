import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { toFraction } from './to-fraction';

describe('lib > utils > string-utils > to-fraction', () => {
  const wholeNumber = faker.number.int().toString();
  const fractions = [
    [`${wholeNumber}.0`, wholeNumber],
    [`${wholeNumber}.0625`, `${wholeNumber} 1/16`],
    [`${wholeNumber}.125`, `${wholeNumber} 1/8`],
    [`${wholeNumber}.1875`, `${wholeNumber} 3/16`],
    [`${wholeNumber}.25`, `${wholeNumber} 1/4`],
    [`${wholeNumber}.3125`, `${wholeNumber} 5/16`],
    [`${wholeNumber}.375`, `${wholeNumber} 3/8`],
    [`${wholeNumber}.4375`, `${wholeNumber} 7/16`],
    [`${wholeNumber}.5`, `${wholeNumber} 1/2`],
    [`${wholeNumber}.5625`, `${wholeNumber} 9/16`],
    [`${wholeNumber}.625`, `${wholeNumber} 5/8`],
    [`${wholeNumber}.6875`, `${wholeNumber} 11/16`],
    [`${wholeNumber}.75`, `${wholeNumber} 3/4`],
    [`${wholeNumber}.8125`, `${wholeNumber} 13/16`],
    [`${wholeNumber}.875`, `${wholeNumber} 7/8`],
    [`${wholeNumber}.9375`, `${wholeNumber} 15/16`],
  ];

  it('returns empty string for undefined', () => {
    expect(toFraction(undefined)).toBe(undefined);
  });

  it('handles a whole number', () => {
    const number = faker.number.int().toString();
    expect(toFraction(number)).toBe(number);
  });

  it('handles an unknown decimal', () => {
    const number = `${faker.number.int()}.1234`;
    expect(toFraction(number)).toBe(number);
  });

  it.each(fractions)('returns $2 for $1', (input, expected) => {
    expect(toFraction(input)).toBe(expected);
  });
});
