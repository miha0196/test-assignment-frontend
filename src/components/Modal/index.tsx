import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal');

type ModalProps = { children: React.ReactNode };

export const Modal: React.FC<ModalProps> = ({ children }) => {
  const modal = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    modalRoot!.appendChild(modal);

    return () => {
      modalRoot!.removeChild(modal);
    };
  }, [modal]);

  return createPortal(children, modal);
};
