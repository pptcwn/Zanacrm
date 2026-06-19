import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { taskService } from '@/lib/services/task.service';
import { CreateTask, UpdateTask } from '@/lib/validations/task.schema';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

interface TaskState {
  tasks: TaskRow[];
  isLoading: boolean;
  error: string | null;
  subscriptionRef: any | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTask) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskRow['status'], position?: number) => Promise<void>;
  subscribeToTasks: () => void;
  unsubscribeFromTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  subscriptionRef: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await taskService.getAll();
      set({ tasks: data as TaskRow[] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      const newTask = await taskService.create(data);
      // Optimistic update
      set((state) => {
        if (state.tasks.find((t) => t.id === newTask.id)) return state;
        return { tasks: [...state.tasks, newTask] };
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateTaskStatus: async (id, status, position) => {
    try {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, status, position: position ?? t.position } : t
        )
      }));

      const updateData: UpdateTask = { status };
      if (position !== undefined) {
        updateData.position = position;
      }
      
      await taskService.update(id, updateData);
    } catch (err: any) {
      set({ error: err.message });
      // Revert optimistic update by refetching on error
      get().fetchTasks();
    }
  },

  subscribeToTasks: () => {
    const { createBrowserClient } = require('@/lib/supabase/client');
    const supabase = createBrowserClient();
    
    const currentSub = get().subscriptionRef;
    if (currentSub) {
      currentSub.unsubscribe();
    }

    const subscription = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as TaskRow;
            set((state) => {
              if (state.tasks.find((t) => t.id === newTask.id)) return state;
              return { tasks: [...state.tasks, newTask] };
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as TaskRow;
            set((state) => ({
              tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            }));
          } else if (payload.eventType === 'DELETE') {
            set((state) => ({
              tasks: state.tasks.filter((t) => t.id !== payload.old.id)
            }));
          }
        }
      )
      .subscribe();

    set({ subscriptionRef: subscription });
  },

  unsubscribeFromTasks: () => {
    const { subscriptionRef } = get();
    if (subscriptionRef) {
      subscriptionRef.unsubscribe();
      set({ subscriptionRef: null });
    }
  },
}));
