import { FlatType } from './flat-type';
import { maskText } from './mask-text';
import { MaskingOptions } from './masking-options';
import { MaskingResult } from './masking-result';

export declare interface String {
  mask(mask: string, options?: MaskingOptions): FlatType<MaskingResult>;
}

String.prototype.mask = function (
  this: string,
  mask: string,
  options?: MaskingOptions
): FlatType<MaskingResult> {
  return maskText({ text: this, mask, options });
};
