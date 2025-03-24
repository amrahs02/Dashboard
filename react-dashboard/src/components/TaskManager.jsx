import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const TaskManager = () => {
  const token = useSelector((state) => state.auth.token);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, [token]);

  const addTask = async () => {
    if (!newTask) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask, status: "Pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditedTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditedTitle("");
  };

  const saveEditedTask = async (id) => {
    if (!editedTitle) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      setEditingTask(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating task title:", error);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gray-50 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Tasks</h2>

      {/* Add New Task */}
      <div className="flex mt-2 mb-6">
        <input
          type="text"
          className="p-2 border border-gray-200 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-700 placeholder-gray-400"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-1/2 px-5 py-2 ml-2 rounded-3xl transition-colors duration-200"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <table className="w-full rounded-3xl border-collapse bg-white shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border border-gray-200 p-3 text-left font-semibold">Task</th>
            <th className="border border-gray-200 p-3 text-left font-semibold">Status</th>
            <th className="border border-gray-200 p-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="border-r border-gray-200 p-3 text-gray-800">
                {editingTask === task._id ? (
                  <input
                    type="text"
                    className="p-1 border border-gray-200 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-700"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className="border-r border-gray-200 p-3">
                <span
                  className={`px-2 py-1 rounded-3xl text-sm font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td className="p-3 flex space-x-2">
                {editingTask === task._id ? (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-3xl transition-colors duration-200"
                      onClick={() => saveEditedTask(task._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-3xl transition-colors duration-200"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {task.status !== "Completed" && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-3xl transition-colors duration-200"
                        onClick={() => updateTask(task._id)}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-3xl transition-colors duration-200"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-3xl transition-colors duration-200"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManager;