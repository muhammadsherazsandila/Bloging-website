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

export const translate = (axis, mode, value) => {
  // Ensure value is a number
  const numericValue = typeof value === "number" ? value : parseFloat(value);

  // Apply sign based on mode
  const finalValue = mode === "negative" ? -numericValue : numericValue;

  // Return Framer Motion style object
  return {
    [axis]: finalValue,
  };
};

// utils/motionVariants.js
export const translation = (axis = "x", mode = "positive", value = 100) => {
  const direction = mode === "positive" ? value : -value;
  return {
    hidden: {
      opacity: 0,
      [axis]: direction,
    },
    visible: {
      opacity: 1,
      [axis]: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      [axis]: direction,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };
};
