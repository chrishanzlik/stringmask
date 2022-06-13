import { FlatType } from './flat-type';
import { maskText } from './mask-text';
import { MaskingOptions } from './masking-options';
import { MaskingResult } from './masking-result';

declare global {
  interface String {
    mask(mask: string, options?: MaskingOptions): FlatType<MaskingResult>;
  }

  interface Window {
    maskText(settings: {
      text: string;
      mask: string;
      options?: MaskingOptions;
    }): FlatType<MaskingResult>;
  }
}

if (window && typeof window.maskText !== 'function') {
  Object.defineProperty(window, 'maskText', {
    get: () => maskText,
  });
}

export { maskText } from './mask-text';
export { maskInput } from './mask-input';
export { MaskingResult } from './masking-result';
export { MaskingOptions } from './masking-options';
export { MaskDefinition, ValidatorFunction } from './mask-definition';
export * from './string.extensions';
