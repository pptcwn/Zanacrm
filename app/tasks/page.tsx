'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/lib/store/taskStore';
import { Database } from '@/types/database.types';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';
import { AddTaskModal } from './add-task-modal';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskStatus = TaskRow['status'];

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' }
];

// --- Sortable Task Card Component ---
function TaskCard({ task }: { task: TaskRow }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-zinc-800 text-zinc-400',
    medium: 'bg-blue-500/10 text-blue-400',
    high: 'bg-orange-500/10 text-orange-400',
    urgent: 'bg-red-500/10 text-red-400'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
          {task.priority}
        </span>
        <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <h4 className="text-sm font-medium text-zinc-200 mb-2 leading-snug">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-4">
        {task.due_date ? (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        ) : (
          <div></div>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="flex -space-x-1">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-zinc-400">
              +{task.labels.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Droppable Column Component ---
function Column({ column, tasks, onAdd }: { column: typeof COLUMNS[0], tasks: TaskRow[], onAdd: () => void }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'Column', column }
  });

  return (
    <Card className="bg-zinc-950/30 border-zinc-800/50 flex flex-col max-h-[calc(100vh-14rem)]">
      <CardHeader className="py-4 px-4 flex flex-row items-center justify-between border-b border-zinc-800/50 sticky top-0 bg-zinc-900/50 backdrop-blur-md rounded-t-xl z-10">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium text-zinc-200 uppercase tracking-wider">{column.title}</CardTitle>
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button onClick={onAdd} className="text-zinc-500 hover:text-white transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </CardHeader>
      
      <div 
        ref={setNodeRef}
        className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]"
      >
        <SortableContext 
          id={column.id}
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-xl p-6 text-center text-zinc-600 text-sm">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </Card>
  );
}

// --- Main Kanban Board Page ---
export default function KanbanPage() {
  const { tasks, fetchTasks, subscribeToTasks, unsubscribeFromTasks, updateTaskStatus } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    fetchTasks();
    subscribeToTasks();
    return () => unsubscribeFromTasks();
  }, [fetchTasks, subscribeToTasks, unsubscribeFromTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(active.data.current?.task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverColumn) {
      const newStatus = overId as TaskStatus;
      const activeTask = tasks.find(t => t.id === activeId);
      if (activeTask && activeTask.status !== newStatus) {
        updateTaskStatus(activeId, newStatus);
      }
      return;
    }

    if (isActiveTask && isOverTask) {
      const activeTask = tasks.find(t => t.id === activeId);
      const overTask = tasks.find(t => t.id === overId);
      
      if (!activeTask || !overTask) return;
      if (activeTask.status !== overTask.status) {
        updateTaskStatus(activeId, overTask.status, overTask.position);
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Tasks</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage project workflow and team assignments</p>
        </div>
        <Button onClick={() => { setDefaultStatus('todo'); setIsAddModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {COLUMNS.map(column => {
            const columnTasks = tasks
              .filter(t => t.status === column.id)
              .sort((a, b) => (a.position || 0) - (b.position || 0));

            return (
              <Column 
                key={column.id} 
                column={column} 
                tasks={columnTasks} 
                onAdd={() => { setDefaultStatus(column.id); setIsAddModalOpen(true); }}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeId && activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {isAddModalOpen && (
        <AddTaskModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );
}
