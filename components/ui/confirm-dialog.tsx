import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  const Icon = variant === 'info' ? Info : AlertTriangle;
  const iconColor = 
    variant === 'danger' ? 'text-red-500' : 
    variant === 'warning' ? 'text-yellow-500' : 'text-blue-500';
    
  const confirmButtonVariant = 
    variant === 'danger' ? 'destructive' : 
    variant === 'warning' ? 'primary' : 'primary'; // Could add a warning button variant if needed

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center pb-4">
        <div className={`p-3 rounded-full bg-zinc-800 mb-4 ${iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
        <p className="text-zinc-300">{message}</p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-2">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={confirmButtonVariant as any} onClick={() => {
          onConfirm();
          onClose();
        }}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
