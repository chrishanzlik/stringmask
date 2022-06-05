import { maskText } from '../src/mask-text';

describe('A suite is just a function', () => {
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
});
