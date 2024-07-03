import { Bounce, ToastPosition, toast } from "react-toastify";

export const useToast = () => {
  const toastConfig = {
    position: "top-right" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
  const showSuccessToast = (message: string) => {
    toast.success(message, toastConfig);
  };

  const showErrorToast = (message: string) => {
    toast.error(message, toastConfig);
  };

  return { showSuccessToast, showErrorToast };
};
