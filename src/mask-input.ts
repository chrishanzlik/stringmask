import { MaskInputParameters } from './mask-input-parameters';
import { maskText } from './mask-text';
import { MaskingOptions } from './masking-options';

export function maskInput(settings: {
  input: HTMLInputElement;
  mask: string;
  options?: MaskingOptions;
}): void;
export function maskInput(settings: MaskInputParameters) {
  validateParameters(settings);

  throw new Error('Not implemented yet.');

  settings.input.oninput = (ev: Event) => {
    const t = ev.target as HTMLInputElement;
    t.setAttribute('data-prev-val', '' + t.value);

    ev.preventDefault();
    ev.stopPropagation();

    //t.value = '';

    if (t) {
      const maskingResult = maskText({
        text: t.value,
        mask: settings.mask,
        options: settings.options,
      });
      console.log(maskingResult.output);
    }
  };

  console.log('masking input', settings);
}

function validateParameters(params: MaskInputParameters): void {
  if (!params) {
    throw new Error('A parameter object is required.');
  }

  if (!('value' in params.input)) {
    throw new Error('Not a valid HTML Input element.');
  }

  if (params.input === undefined || params.input === null) {
    throw new Error('Null or undefined is not allowed for "input" parameter.');
  }

  if (!params.mask) {
    throw new Error('The "mask" parameter must provide a value.');
  }
}
