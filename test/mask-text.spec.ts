import { maskText } from '../src/mask-text';
import { MaskingParameters } from '../src/masking-parameters';

describe('maskText', () => {
  describe('Common', () => {
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

  describe('Custom definitions', () => {
    it('will override a definition with new validation RegExp', () => {
      const params: MaskingParameters = {
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
      const params: MaskingParameters = {
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
