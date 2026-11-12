'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SurveyTask {
  id: string;
  title: string;
  status: string;
  // Add your fields here
}

interface TaskContextType {
  tasks: SurveyTask[];
  addTask: (task: SurveyTask) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<SurveyTask[]>([]);
  const addTask = (task: SurveyTask) => setTasks((prev) => [...prev, task]);

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}