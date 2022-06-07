import { MaskDefinition } from './mask-definition';

export type MaskingOptions = {
  partialOutput?: boolean;
  placeholder?: string;
  autocapitalize?: boolean;
  invalidCharPlaceholder?: string;
  direction?: 'ltr' | 'rtl';
  definitions?: { [maskValue: string]: MaskDefinition | null };
};

const DEFAULT_NUMBERS_DEFS = Array(10)
  .fill(0)
  .map((_, i) => i)
  .reduce(
    (acc, next) => Object.assign(acc, { [next]: { validator: /^[0-9]$/ } }),
    {} as { [maskValue: string]: MaskDefinition }
  );

const DEFAULT_LOWER_LETTERS_DEFS = Array(26)
  .fill(0)
  .map((_, i) => String.fromCharCode(i + 97))
  .reduce(
    (acc, next) => Object.assign(acc, { [next]: { validator: /^[a-z]$/ } }),
    {} as { [maskValue: string]: MaskDefinition }
  );

const DEFAULT_UPPER_LETTERS_DEFS = Array(26)
  .fill(0)
  .map((_, i) => String.fromCharCode(i + 65))
  .reduce(
    (acc, next) => Object.assign(acc, { [next]: { validator: /^[A-Z]$/ } }),
    {} as { [maskValue: string]: MaskDefinition }
  );

export const DEFAULT_SETTINGS: MaskingOptions = {
  partialOutput: true,
  autocapitalize: true,
  invalidCharPlaceholder: '',
  direction: 'ltr',
  definitions: {
    ...DEFAULT_NUMBERS_DEFS,
    ...DEFAULT_LOWER_LETTERS_DEFS,
    ...DEFAULT_UPPER_LETTERS_DEFS
  }
};
