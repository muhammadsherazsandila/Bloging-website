export const scale = () => ({
  initial: { scale: 0.9, opacity: 0.8 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
});
export const fadeOut = () => ({
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 1 } },
});
export const fadeIn = () => ({
  initial: { scale: 1.5, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 1 } },
});
