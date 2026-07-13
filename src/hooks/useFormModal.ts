import { useState, useEffect } from "react";

export function useFormModal<T>(initialData: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [localData, setLocalData] = useState<T>(initialData);
  const [committedData, setCommittedData] = useState<T>(initialData);

  // Sync both if initialData changes from outside
  useEffect(() => {
    setLocalData(initialData);
    setCommittedData(initialData);
  }, [initialData]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setIsDirty(false);
    // Reset data on close so reopening shows committed data
    setLocalData(committedData);
  };

  const saveData = () => {
    setCommittedData(localData);
    setIsOpen(false);
    setIsDirty(false);
  };

  const markDirty = () => setIsDirty(true);

  /**
   * Helper for array-typed localData.
   */
  const updateItem = <Item>(idx: number, key: keyof Item, value: Item[keyof Item]) => {
    const arr = localData as unknown as Item[];
    const newArr = arr.map((item, i) =>
      i === idx ? { ...item, [key]: value } : item
    );
    setLocalData(newArr as unknown as T);
    markDirty();
  };

  return {
    isOpen,
    isDirty,
    localData,
    committedData,
    setLocalData,
    openModal,
    closeModal,
    saveData,
    markDirty,
    updateItem,
  };
}
