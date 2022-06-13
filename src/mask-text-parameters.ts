import { MaskingOptions } from './masking-options';

export interface MaskTextParameters {
  text: string;
  mask: string;
  options?: MaskingOptions;
}
