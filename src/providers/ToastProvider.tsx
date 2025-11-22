'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';
import { Toast } from 'primereact/toast';

type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

interface ToastContextType {
    showToast: (severity: ToastSeverity, summary: string, detail: string, life?: number) => void;
    showSuccessToast: (summary: string, detail: string) => void;
    showErrorToast: (summary: string, detail: string) => void;
    showInfoToast: (summary: string, detail: string) => void;
    showWarnToast: (summary: string, detail: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const toast = useRef<Toast>(null);

    const showToast = (severity: ToastSeverity, summary: string, detail: string, life: number = 5000) => {
        toast.current?.show({ severity, summary, detail, life });
    };

    const showSuccessToast = (summary: string, detail: string) => {
        showToast('success', summary, detail);
    };

    const showErrorToast = (summary: string, detail: string) => {
        showToast('error', summary, detail);
    };

    const showInfoToast = (summary: string, detail: string) => {
        showToast('info', summary, detail);
    };

    const showWarnToast = (summary: string, detail: string) => {
        showToast('warn', summary, detail);
    };

    const value = {
        showToast,
        showSuccessToast,
        showErrorToast,
        showInfoToast,
        showWarnToast,
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast ref={toast} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
