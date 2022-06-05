import { MaskDefinition } from './mask-definition';
import { DEFAULT_SETTINGS, MaskingOptions } from './masking-options';
import { MaskingResult } from './masking-result';

export function maskText(settings: {
  text: string;
  mask: string;
  options?: MaskingOptions;
}): MaskingResult {
  settings.options = mergeSettings(DEFAULT_SETTINGS, settings.options ?? {});
  const { text, mask, options } = settings;
  const result = { success: true, mask, input: text, output: '' };
  let ptr = 0;
  let target = Array(mask.length).fill(undefined);

  for (let i = 0; i < mask.length; i++) {
    const index = options.direction === 'ltr' ? i : mask.length - 1 - i;

    if (isConvertableMaskEntry(mask[index], options)) {
      const { isMatch, outputText } = processCharMatch(
        text.charAt(ptr++),
        mask[index],
        options
      );

      const placeholder =
        ptr > text.length ? undefined : options.invalidCharPlaceholder;
      target[index] = isMatch ? outputText : placeholder;
      result.success &&= isMatch;
    } else {
      target[index] = ptr > text.length ? undefined : mask[index];
    }
  }

  if (!options.partialOutput) {
    target = target.map((char, index) => {
      if (char !== undefined) {
        return char;
      }

      return !isConvertableMaskEntry(mask[index], options)
        ? mask.charAt(index)
        : options.placeholder;
    });
  }

  return { ...result, output: target.join('').trim() };
}

function mergeSettings(...settings: MaskingOptions[]): MaskingOptions {
  return settings.reduce((acc, next) => {
    const definitions = Object.assign({}, acc.definitions, next?.definitions);
    return Object.assign({}, acc, next, { definitions });
  }, {} as MaskingOptions);
}

function processCharMatch(
  inputChar: string,
  maskChar: string,
  options: MaskingOptions
): {
  isMatch: boolean;
  outputText: string | null;
} {
  const maskDefinition = options?.definitions && options.definitions[maskChar];

  if (options.autocapitalize && isAlphabetical(inputChar)) {
    inputChar = adjustCapitalization(maskChar, inputChar);
  }

  return {
    isMatch: validateInputChar(inputChar, maskDefinition),
    outputText: inputChar
  };
}

function validateInputChar(
  inputChar: string,
  definition?: MaskDefinition
): boolean {
  if (!definition?.validator) {
    return true;
  }

  if (typeof definition.validator === 'function') {
    return definition.validator(inputChar);
  } else {
    return definition.validator.test(inputChar);
  }
}

function adjustCapitalization(maskChar: string, inputChar: string): string {
  if (isUpperCase(maskChar) && !isUpperCase(inputChar)) {
    return inputChar.toUpperCase();
  } else if (!isUpperCase(maskChar) && isUpperCase(inputChar)) {
    return inputChar.toLowerCase();
  } else {
    return inputChar;
  }
}

function isConvertableMaskEntry(
  value: string,
  options: MaskingOptions
): boolean {
  const definitionMatch = options?.definitions
    ? Object.keys(options?.definitions).indexOf(value) > -1
    : false;

  return definitionMatch || /^[a-zA-Z0-9]$/.test(value[0]);
}

function isUpperCase(value: string): boolean {
  return value === value.toUpperCase();
}

function isAlphabetical(value: string): boolean {
  return /^[a-zA-Z]$/.test(value[0]);
}
