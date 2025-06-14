export const toastConfig = (toastId = undefined) => {
  return {
    toastId,
    position: "top-left",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
};
