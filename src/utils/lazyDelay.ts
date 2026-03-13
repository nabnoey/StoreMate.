export function lazyDelay<T>(importFn: () => Promise<T>, delay = 1500) {
  return new Promise<T>((resolve) => {
    setTimeout(async () => {
      const module = await importFn()
      resolve(module)
    }, delay)
  })
}   