//import '../src/string.extensions';

import '../src/string.extensions';
import * as TextMaskModule from '../src/mask-text';

describe('string extensions', () => {
  describe('.mask()', () => {
    it('executes the maskText function', () => {
      spyOn(TextMaskModule, 'maskText');
      'abc'.mask('A.A.A');
      expect(TextMaskModule.maskText).toHaveBeenCalled();
    });

    it('returns a masked result', () => {
      const result = 'abc'.mask('A.A.A');
      expect(result.success).toBeTrue();
      expect(result.output).toBe('A.B.C');
    });
  });
});
