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

export const UI = {
  $(selector: string): Element {
    const el = document.querySelector(selector);
    if (el == null) throw new Error(`couldn't find selector '${selector}'`);
    return el;
  },

  $Input(selector: string) {
    const el = UI.$(selector);
    if (el instanceof HTMLInputElement) return el;
    throw new Error('expected HTMLInputElement');
  },
  $TextArea(selector: string) {
    const el = UI.$(selector);
    if (el instanceof HTMLTextAreaElement) return el;
    throw new Error('expected HTMLTextAreaElement');
  },
  $Button(selector: string) {
    const el = UI.$(selector);
    if (el instanceof HTMLButtonElement) return el;
    throw new Error('expected HTMLButtonElement');
  },
  $Canvas(selector: string) {
    const el = UI.$(selector);
    if (el instanceof HTMLCanvasElement) return el;
    throw new Error('expected HTMLCanvasElement');
  },
  $Select(selector: string) {
    const el = UI.$(selector);
    if (el instanceof HTMLSelectElement) return el;
    throw new Error('expected HTMLSelectElement');
  },

  virtualizedScrollView(
    container: HTMLElement,
    containerHeight: number,
    itemHeight: number,
    numItems: number,
    renderItems: (start: number, end: number) => string
  ) {
    Object.assign(container.style, {
      height: `${containerHeight}px`,
      overflow: 'auto',
    });
    const content = document.createElement('div');
    Object.assign(content.style, {
      height: `${itemHeight * numItems}px`,
      overflow: 'hidden',
    });
    container.appendChild(content);

    const rows = document.createElement('div');
    content.appendChild(rows);

    const overscan = 10; // how many rows above/below viewport to render

    const renderRowsInView = () => requestAnimationFrame(() => {
      const start = Math.max(0, Math.floor(container.scrollTop / itemHeight) - overscan);
      const end = Math.min(numItems, Math.ceil((container.scrollTop + containerHeight) / itemHeight) + overscan);
      const offsetTop = start * itemHeight;

      rows.style.transform = `translateY(${offsetTop}px)`;
      rows.innerHTML = renderItems(start, end);
    });

    container.onscroll = renderRowsInView;

    return renderRowsInView;
  }
}