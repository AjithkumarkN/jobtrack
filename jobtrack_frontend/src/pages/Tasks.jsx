import { useState, useEffect } from 'react'
import api from '../api/axios'
import './Tasks.css'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/')
      setTasks(response.data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    try {
      await api.post('/tasks/', { title: newTask, due_date: dueDate || null })
      setNewTask('')
      setDueDate('')
      fetchTasks()
    } catch (err) {
      console.error('Failed to create task', err)
    }
  }

  const toggleComplete = async (task) => {
    try {
      await api.patch(`/tasks/${task.id}/`, { is_completed: !task.is_completed })
      fetchTasks()
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}/`)
      fetchTasks()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>

      <form className="task-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li className="task-item" key={task.id}>
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={() => toggleComplete(task)}
            />
            <span className={`task-title ${task.is_completed ? 'completed' : ''}`}>
              {task.title}
            </span>
            {task.due_date && <span className="task-due">Due {task.due_date}</span>}
            <button className="btn-delete" onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p>No tasks yet. Add one above.</p>}
    </div>
  )
}

export default Tasks