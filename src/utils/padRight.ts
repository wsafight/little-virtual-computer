export default function padRight(input: string | number, length: number): string {
  const str: string = input + '';
  let paddedArr: string[] = [str];
  for (let i = str.length; i < length; i++) {
    paddedArr.push(" ")
  }
  return paddedArr.join('');
}