import { maskText } from '../src/mask-text';
import { MaskTextParameters } from '../src/mask-text-parameters';

describe('maskText', () => {
  describe('Common', () => {
    it('will use the mask value, when placeholder not provided', () => {
      const r = maskText({
        text: '',
        mask: '123_456',
        options: {
          placeholder: undefined,
          partialOutput: false
        }
      });
      expect(r.output).toBe('123_456');
    });

    it('will handle special characters as static mask tokens by default', () => {
      const r = maskText({ text: '123', mask: '!.999#.?=' });
      expect(r.success).toBeTrue();
      expect(r.output).toBe('!.123#.?=');
    });

    it('will set correct placeholders, when an empty text was passed.', () => {
      const r = maskText({
        text: '',
        mask: '000-000-000',
        options: { partialOutput: false, placeholder: '_' }
      });
      expect(r.success).toBeFalse();
      expect(r.output).toBe('___-___-___');
    });

    it('will partial resolve a mask', () => {
      const r = maskText({
        text: '4567',
        mask: '000-000-000',
        options: { partialOutput: true }
      });
      expect(r.success).toBeFalse();
      expect(r.output).toBe('456-7');
    });

    it('will fully resolve a mask', () => {
      const r = maskText({
        text: '111222111',
        mask: '(000)-000-000',
        options: { partialOutput: true }
      });
      expect(r.success).toBeTrue();
      expect(r.output).toBe('(111)-222-111');
    });
  });

  describe('Function parameter validation', () => {
    it('will throw an error, when the settings object is null or undefined', () => {
      expect(() => maskText(<MaskTextParameters>(<unknown>null))).toThrowError(
        'A parameter object is required.'
      );
      expect(() =>
        maskText(<MaskTextParameters>(<unknown>undefined))
      ).toThrowError('A parameter object is required.');
    });

    it('will throw an error, when the given text input is not valid', () => {
      expect(() =>
        maskText({ text: <string>(<unknown>undefined), mask: '000' })
      ).toThrowError('Null or undefined is not allowed for "text" parameter.');
      expect(() =>
        maskText({ text: <string>(<unknown>null), mask: '000' })
      ).toThrowError('Null or undefined is not allowed for "text" parameter.');
    });

    it('will throw an error, when the given mask input is not valid', () => {
      expect(() => maskText({ text: '000', mask: '' })).toThrowError(
        'The "mask" parameter must provide a value.'
      );
      expect(() =>
        maskText({ text: '000', mask: <string>(<unknown>null) })
      ).toThrowError('The "mask" parameter must provide a value.');
      expect(() =>
        maskText({ text: '000', mask: <string>(<unknown>undefined) })
      ).toThrowError('The "mask" parameter must provide a value.');
    });
  });

  describe('Capitalization', () => {
    it('will capitalize values when capitalization flag enabled', () => {
      const settings: MaskTextParameters = {
        text: 'ABCabc',
        mask: 'AAAAAA',
        options: { autocapitalize: false, invalidCharPlaceholder: '#' }
      };
      const result1 = maskText(settings);
      expect(result1.success).toBeFalse();
      expect(result1.output).toBe('ABC###');

      settings.options = { ...settings.options, autocapitalize: true };
      const result2 = maskText(settings);
      expect(result2.success).toBeTrue();
      expect(result2.output).toBe('ABCABC');
    });

    it('will uncapitalize values when capitalization flag enabled', () => {
      const settings: MaskTextParameters = {
        text: 'ABCabc',
        mask: 'aaaaaa',
        options: { autocapitalize: false, invalidCharPlaceholder: '#' }
      };
      const result1 = maskText(settings);
      expect(result1.success).toBeFalse();
      expect(result1.output).toBe('###abc');

      settings.options = { ...settings.options, autocapitalize: true };
      const result2 = maskText(settings);
      expect(result2.success).toBeTrue();
      expect(result2.output).toBe('abcabc');
    });
  });

  describe('Custom definitions', () => {
    it('will handle special characters', () => {
      const r = maskText({
        text: '!$!%',
        mask: '-? ? ? ?-',
        options: {
          definitions: {
            '?': {
              validator: (val: string) => ['!', '$', '%'].includes(val)
            }
          }
        }
      });
      expect(r.success).toBeTrue();
      expect(r.output).toBe('-! $ ! %-');
    });

    it('will handle removed definitions as static mask token', () => {
      let params: MaskTextParameters = {
        text: '111111',
        mask: '888-999'
      };
      const beforeResult = maskText(params);
      expect(beforeResult.output).toBe('111-111');

      params = {
        ...params,
        options: {
          definitions: {
            ['8']: null
          }
        }
      };

      const afterResult = maskText(params);
      expect(afterResult.output).toBe('888-111');
    });

    it('will override a definition with new validation RegExp', () => {
      const params: MaskTextParameters = {
        text: '666666',
        mask: '555-666',
        options: {
          partialOutput: true,
          invalidCharPlaceholder: '#',
          definitions: { '5': { validator: /^[0-5]$/ } }
        }
      };
      const beforeResult = maskText(params);
      expect(beforeResult.success).toBeFalse();
      expect(beforeResult.output).toBe('###-666');

      const afterResult = maskText({ ...params, text: '555555' });
      expect(afterResult.success).toBeTrue();
      expect(afterResult.output).toBe('555-555');
    });

    it('will add a wildcard character by validation func', () => {
      const params: MaskTextParameters = {
        text: 'ABC123!',
        mask: 'PPPPPPP',
        options: {
          partialOutput: true,
          invalidCharPlaceholder: '#'
        }
      };
      expect(maskText(params).success).toBeFalse();
      params.options = {
        ...params.options,
        definitions: { P: { validator: () => true } }
      };
      expect(maskText(params).success).toBeTrue();
    });
  });

  describe('Right-To-Left support', () => {
    it('will support partial RTL support with full output', () => {
      const r = maskText({
        text: '4567',
        mask: '000-000-000',
        options: { partialOutput: false, direction: 'rtl', placeholder: '_' }
      });
      expect(r.success).toBeFalse();
      expect(r.output).toBe('___-__7-654');
    });

    it('will support partial RTL support with partial output', () => {
      const r = maskText({
        text: '4567',
        mask: '000-000-000',
        options: { partialOutput: true, direction: 'rtl', placeholder: '_' }
      });
      expect(r.success).toBeFalse();
      expect(r.output).toBe('7-654');
    });

    it('will output full text with RTL support', () => {
      const r = maskText({
        text: '123456789',
        mask: '000-(000)-000',
        options: { partialOutput: true, direction: 'rtl' }
      });
      expect(r.success).toBeTrue();
      expect(r.output).toBe('987-(654)-321');
    });
  });
});
