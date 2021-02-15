/**
 *
 * @param val
 */
export function notNull<T>(val?: T): T {
  if (val != null) return val;
  throw new Error('unexpected null');
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(min, Math.max(max, val));
}

export function padRight(input: string | number, length: number): string {
  const str: string = input + '';
  let paddedArr: string[] = [str];
  for (let i = str.length; i < length; i++) {
    paddedArr.push(" ")
  }
  return paddedArr.join('');
}