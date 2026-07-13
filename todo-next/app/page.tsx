"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTodos(JSON.parse(raw));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, loaded]);

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, completed: false }]);
    setText("");
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-100 px-5 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Todo
        </h1>

        <form onSubmit={addTodo} className="mb-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="タスクを入力..."
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            追加
          </button>
        </form>

        <div className="mb-4 flex gap-2">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs ${
                filter === f
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-zinc-300 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {f === "all" ? "すべて" : f === "active" ? "未完了" : "完了済み"}
            </button>
          ))}
        </div>

        <ul className="min-h-10">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 border-b border-zinc-100 py-2.5 last:border-none dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-[18px] w-[18px] accent-indigo-600"
              />
              <span
                className={`flex-1 break-words text-sm ${
                  todo.completed
                    ? "text-zinc-400 line-through"
                    : "text-zinc-800 dark:text-zinc-100"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-lg leading-none text-zinc-400 hover:text-red-500"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          <span>{activeCount}件の未完了タスク</span>
          <button onClick={clearCompleted} className="underline hover:text-red-500">
            完了済みを削除
          </button>
        </div>
      </div>
    </div>
  );
}
