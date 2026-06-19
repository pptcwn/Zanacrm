'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createTaskSchema } from '@/lib/validations/task.schema';
import { useTaskStore } from '@/lib/store/taskStore';
import { z } from 'zod';
import { Database } from '@/types/database.types';

type TaskStatus = Database['public']['Tables']['tasks']['Row']['status'];

export function AddTaskModal({ isOpen, onClose, defaultStatus = 'todo' }: { isOpen: boolean; onClose: () => void; defaultStatus?: TaskStatus }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: defaultStatus
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { createTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const validatedData = createTaskSchema.parse(formData);
      await createTask(validatedData);
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo' });
      onClose();
    } catch (err: any) {
      if (err instanceof z.ZodError || err.errors) {
        const errors: Record<string, string> = {};
        const zodErr = err as any;
        zodErr.errors.forEach((e: any) => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Task Title" 
          placeholder="e.g., Call customer regarding order..." 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={fieldErrors.title}
        />
        
        <Textarea 
          label="Description" 
          placeholder="Optional details..." 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={fieldErrors.description}
          rows={3}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Priority"
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' }
            ]}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            error={fieldErrors.priority}
          />
          <Select 
            label="Status"
            options={[
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Review', value: 'review' },
              { label: 'Completed', value: 'completed' }
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            error={fieldErrors.status}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
