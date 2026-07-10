import { useState, useEffect } from "react";

export function useFormModal<T>(initialData: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [localData, setLocalData] = useState<T>(initialData);

  // Sync localData if initialData changes from outside
  useEffect(() => {
    setLocalData(initialData);
  }, [initialData]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setIsDirty(false);
    // Optionally reset data on close so reopening shows original data
    setLocalData(initialData);
  };

  const markDirty = () => setIsDirty(true);

  return {
    isOpen,
    isDirty,
    localData,
    setLocalData,
    openModal,
    closeModal,
    markDirty,
  };
}
