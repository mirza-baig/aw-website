// used for replacing token placeholders with actual values
export function replacePlaceholders(
  inputString: string,
  placeholders: Record<string, boolean | string | unknown[] | number | undefined>,
  useDoubleBraces = false
): string {
  const regexPattern = useDoubleBraces ? /{{(.*?)}}/g : /{(.*?)}/g;

  const typeConverters: Record<string, (value: unknown) => string> = {
    string: (value: string | undefined | null) => value ?? '',
    boolean: (value: boolean | undefined | null) => (value ? 'true' : 'false'),
    number: (value: number | undefined | null) => String(value),
    object: (value: object | undefined | null) => {
      if (value == undefined || value == null) {
        return '';
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '';
        }
        return value.map((_) => JSON.stringify(_)).join(', ');
      }
      return JSON.stringify(value);
    },
  };

  return inputString?.replace(regexPattern, (_match, placeholderName) => {
    const placeholderValue = placeholders[placeholderName];
    const valueType = typeof placeholderValue;

    const converter = typeConverters[valueType] || typeConverters.string;

    return converter(placeholderValue);
  });
}
