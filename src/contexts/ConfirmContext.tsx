import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { BaseModal } from "../shared/components/BaseModal";
import { AlertTriangle, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmOptions {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setResolver({ resolve });
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver) resolver.resolve(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolver) resolver.resolve(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <BaseModal
          isOpen={isOpen}
          onClose={handleCancel}
          title={options.title || "Xác nhận"}
          confirmText={options.confirmText || t("common.confirm")}
          onConfirm={handleConfirm}
          isDanger={options.isDanger}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.5rem 0" }}>
            {options.isDanger ? (
              <div style={{ padding: "8px", background: "#fef2f2", borderRadius: "50%", color: "#dc2626" }}>
                <AlertTriangle size={24} />
              </div>
            ) : (
              <div style={{ padding: "8px", background: "#eff6ff", borderRadius: "50%", color: "#3b82f6" }}>
                <Info size={24} />
              </div>
            )}
            <div style={{ flex: 1, paddingTop: "2px", lineHeight: 1.5, color: "var(--text-main)" }}>
              {typeof options.message === "string" ? (
                // Nếu message có chứa \n, split ra và render xuống dòng
                options.message.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              ) : (
                options.message
              )}
            </div>
          </div>
        </BaseModal>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
