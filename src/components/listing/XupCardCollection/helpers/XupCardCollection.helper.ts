export const ColumnSpans: { [cardsInRow: number]: string } = {
  1: 'md:col-span-12',
  2: 'md:col-span-6',
  3: 'md:col-span-4',
  4: 'md:col-span-3',
};

export function GetLayoutClasses(maxCardsPerRow: number): string {
  return ColumnSpans[maxCardsPerRow];
}
