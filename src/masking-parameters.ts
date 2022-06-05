import { MaskingOptions } from './masking-options';

export interface MaskingParameters {
  text: string;
  mask: string;
  options?: MaskingOptions;
}
