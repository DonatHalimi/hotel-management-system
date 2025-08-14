import React, { createContext, useContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastContextType = {
    toast: (toastProps: any) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toastRef = useRef<Toast>(null);

    const toast = (toastProps: any) => {
        toastRef.current?.show({ ...toastProps, position: 'bottom-left' });
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <Toast
                ref={toastRef}
                position="bottom-left"
                onClick={() => toastRef.current?.clear()}
                className="cursor-pointer"
            />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};