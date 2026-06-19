'use client';

import { TaskCard } from '@/components/ui/task-card';

const tasks = [
  { 
    id: 1, 
    title: "Follow up ลูกค้า TK-1001 เรื่องการจัดส่ง", 
    assignee: "นัท", 
    dueDate: "Today", 
    status: "todo", 
    labels: ["urgent"], 
    linkedOrder: "TK-1001" 
  },
  { 
    id: 2, 
    title: "จัดส่งออเดอร์ SP-2847 ไป Kerry", 
    assignee: "บีม", 
    dueDate: "Tomorrow", 
    status: "inprogress", 
    labels: ["shipping"], 
    linkedOrder: "SP-2847" 
  },
  { 
    id: 3, 
    title: "ตอบแชทคืนเงิน FB-5512", 
    assignee: "นัท", 
    dueDate: "Today", 
    status: "todo", 
    labels: ["refund"], 
    linkedOrder: "FB-5512" 
  },
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Completed' },
];

export default function TaskBoardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-muted">Drag & drop task management</p>
        </div>
        <button className="btn btn-primary">+ New Task</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          
          return (
            <div key={column.id} className="card p-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="font-semibold text-sm">{column.title}</div>
                <div className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-muted">
                  {columnTasks.length}
                </div>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    assignee={task.assignee}
                    dueDate={task.dueDate}
                    labels={task.labels}
                    linkedOrder={task.linkedOrder}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
