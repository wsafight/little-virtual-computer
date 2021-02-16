/**
 *
 * @param val
 */
export default function notNull<T>(val?: T): T {
  if (val != null) return val;
  throw new Error('unexpected null');
}