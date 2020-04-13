import { SafeCodePipe } from './safe-code.pipe';

describe('SafeCodePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeCodePipe();
    expect(pipe).toBeTruthy();
  });
});
