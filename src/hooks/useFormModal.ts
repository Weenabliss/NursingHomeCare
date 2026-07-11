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
    // Reset data on close so reopening shows original data
    setLocalData(initialData);
  };

  const markDirty = () => setIsDirty(true);

  /**
   * Helper for array-typed localData.
   * Replaces the repeated boilerplate:
   *   const newData = [...localData]; newData[idx].key = value; setLocalData(newData); markDirty();
   *
   * @param idx   Index of the item to update
   * @param key   Key of the field to update
   * @param value New value for that field
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
    setLocalData,
    openModal,
    closeModal,
    markDirty,
    updateItem,
  };
}
