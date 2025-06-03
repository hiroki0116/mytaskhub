import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 5000,
  });
};

export const showLoadingToast = (message: string): string | number => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
