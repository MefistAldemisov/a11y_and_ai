import { useState } from 'react';

export const useModal = <T = undefined>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const open = (modalData?: T) => {
    setData(modalData);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(undefined);
  };

  return {
    isOpen,
    data,
    open,
    close,
  };
};
