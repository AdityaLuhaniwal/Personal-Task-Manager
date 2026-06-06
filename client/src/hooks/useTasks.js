import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../api/taskApi';

export function useTasks(filter, search) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter && filter !== 'all') params.status = filter;
      if (search && search.trim()) params.search = search.trim();
      const data = await taskApi.getAll(params);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    const newTask = await taskApi.create(taskData);
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id, changes) => {
    const updated = await taskApi.update(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTask = async (id) => {
    await taskApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTask = (id, completed) => updateTask(id, { completed: !completed });

  return { tasks, loading, error, createTask, updateTask, deleteTask, toggleTask, refetch: fetchTasks };
}
