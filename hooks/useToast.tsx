"use client";

import { toast, ExternalToast } from "sonner";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export const useToast = () => {
  const defaultOptions: ExternalToast = {
    duration: 3000,
    dismissible: true,
    closeButton: true,
  };

  const showSuccess = (message: string, options?: ExternalToast) => {
    toast.success(message, {
      ...defaultOptions,
      duration: 2000,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      ...options,
    });
  };

  const showError = (message: string, options?: ExternalToast) => {
    toast.error(message, {
      ...defaultOptions,
      duration: 5000,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      ...options,
    });
  };

  const showInfo = (message: string, options?: ExternalToast) => {
    toast.info(message, {
      ...defaultOptions,
      icon: <Info className="h-5 w-5 text-blue-500" />,
      ...options,
    });
  };

  const showPromise = <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  };

  return { showSuccess, showError, showInfo, showPromise };
};
