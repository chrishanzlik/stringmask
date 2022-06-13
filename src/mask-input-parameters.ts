import { MaskingOptions } from './masking-options';

export interface MaskInputParameters {
  input: HTMLInputElement;
  mask: string;
  options?: MaskingOptions;
}
