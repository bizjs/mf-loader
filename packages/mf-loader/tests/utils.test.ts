import { maxSatisfying, validRange } from 'es-semver';

describe('utils test', () => {
  it('test maxSatisfying', () => {
    const caseList = [
      { versions: ['1.0.9', '2.3.1'], range: '', expected: '2.3.1' },
      { versions: ['1.0.9', '2.3.1'], range: '^1', expected: '1.0.9' },
      { versions: ['1.0.9', '2.3.1'], range: 'latest', expected: null },
    ];
    caseList.forEach((item) => {
      const target = maxSatisfying(item.versions, item.range);
      expect(target).toBe(item.expected);
    });
  });
  it('test validRange', () => {
    const trueCaseList = [
      { version: 'latest', expected: null },
      { version: '1.x', expected: '>=1.0.0 <2.0.0' },
      { version: 'beta', expected: null },
      { version: '^2', expected: '>=2.0.0 <3.0.0' },
      { version: '3', expected: '>=3.0.0 <4.0.0' },
      { version: '~3.3', expected: '>=3.3.0 <3.4.0' },
      { version: '^0.3', expected: '>=0.3.0 <0.4.0' },
      { version: '~0.3', expected: '>=0.3.0 <0.4.0' },
      { version: '^0.0.3', expected: '>=0.0.3 <0.0.4' },
    ];
    trueCaseList.forEach((item) => {
      const target = validRange(item.version);
      expect(target).toBe(item.expected);
    });
  });
});
