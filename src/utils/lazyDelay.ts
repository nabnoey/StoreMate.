export function lazyDelay<T>(importFunc: () => Promise<T>, delay: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(importFunc());
    }, delay);
  });
}
