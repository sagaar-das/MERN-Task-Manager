import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const API = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    const response = await axios.get(API);
    setTasks(response.data);
  };

  useEffect(function () {
    fetchTasks();
  }, []);

  const showMessage = function (msg) {
    setMessage(msg);
    setTimeout(function () {
      setMessage("");
    }, 2000);
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    if (title.trim() === "") return;

    if (editingId) {
      await axios.put(API + "/" + editingId, { title: title });
      setEditingId(null);
      showMessage("Task Updated ✅");
    } else {
      await axios.post(API, { title: title });
      showMessage("Task Added ✅");
    }

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async function (id) {
    await axios.delete(API + "/" + id);
    showMessage("Task Deleted ❌");
    fetchTasks();
  };

  const toggleTask = async function (task) {
    await axios.put(API + "/" + task._id, {
      completed: !task.completed
    });
    fetchTasks();
  };

  const editTask = function (task) {
    setTitle(task.title);
    setEditingId(task._id);
  };

  const filteredTasks = tasks.filter(function (task) {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter(function (t) {
    return t.completed;
  }).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">

        <h1 className="text-2xl font-bold text-center mb-4">
         MERN Task Manager
        </h1>

        {message && (
          <div className="mb-4 text-center bg-green-100 text-green-700 py-2 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-4">
          <button onClick={function(){setFilter("all")}} className="text-sm">All</button>
          <button onClick={function(){setFilter("completed")}} className="text-sm">Completed</button>
          <button onClick={function(){setFilter("pending")}} className="text-sm">Pending</button>
        </div>

        {/* Counters */}
        <div className="text-sm text-center mb-4">
          Total: {total} | Completed: {completed} | Pending: {pending}
        </div>

        <ul className="space-y-3">
          {filteredTasks.map(function (task) {
            return (
              <li
                key={task._id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
              >
                <span
                  onClick={function () {
                    toggleTask(task);
                  }}
                  className={
                    "cursor-pointer " +
                    (task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700")
                  }
                >
                  {task.title}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={function () {
                      editTask(task);
                    }}
                    className="bg-yellow-400 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={function () {
                      deleteTask(task._id);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}

export default App;