'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SurveyTask {
  id: string;
  clientName: string;
  surveyType: string;
  location: string;
  contactPerson: string;
  contactPhone: string;
  assignedEngineer: string;
  assignedDepartment: 'Technology Operations' | 'Research & Development';
  status: 'Assigned' | 'In Progress' | 'Pending Review' | 'Ready for Sales' | 'Completed';
  quotationAmount?: string;
}

interface TaskContextType {
  tasks: SurveyTask[];
  addTask: (task: Omit<SurveyTask, 'id' | 'status'>) => void;
  updateTaskStatus: (id: string, status: SurveyTask['status']) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<SurveyTask[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cloudalign_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
  }, []);

  const saveAndSetTasks = (newTasks: SurveyTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('cloudalign_tasks', JSON.stringify(newTasks));
  };

  const addTask = (taskData: Omit<SurveyTask, 'id' | 'status'>) => {
    const newTask: SurveyTask = {
      ...taskData,
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Assigned',
      quotationAmount: 'M 125,000.00',
    };
    saveAndSetTasks([newTask, ...tasks]);
  };

  const updateTaskStatus = (id: string, status: SurveyTask['status']) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    saveAndSetTasks(updated);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}