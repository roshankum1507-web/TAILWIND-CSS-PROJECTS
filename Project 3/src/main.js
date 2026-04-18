import "./style.css";

const form = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const statTotal = document.querySelector("#stat-total");
const statDone = document.querySelector("#stat-done");
const filterButtons = [...document.querySelectorAll(".filter-btn")];

let filter = "all";
let tasks = JSON.parse(localStorage.getItem("flowboard.tasks") ?? "[]");

function saveTasks() {
  localStorage.setItem("flowboard.tasks", JSON.stringify(tasks));
}

function priorityClass(priority) {
  if (priority === "High") return "chip-high";
  if (priority === "Low") return "chip-low";
  return "chip-medium";
}

function filteredTasks() {
  if (filter === "all") return tasks;
  return tasks.filter((task) => task.category === filter);
}

function updateStats() {
  statTotal.textContent = String(tasks.length);
  statDone.textContent = String(tasks.filter((task) => task.done).length);
}

function toggleEmptyState(list) {
  emptyState.classList.toggle("hidden", list.length > 0);
}

function render() {
  const list = filteredTasks();
  toggleEmptyState(list);

  taskList.innerHTML = list
    .sort((a, b) => Number(a.done) - Number(b.done))
    .map(
      (task) => `
      <li class="rounded-2xl border border-slate-200 p-4 transition hover:border-brand-200 ${
        task.done ? "bg-slate-50" : "bg-white"
      }">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-semibold ${task.done ? "line-through text-slate-400" : "text-slate-800"}">${task.title}</p>
              <span class="rounded-full border px-2 py-0.5 text-xs font-medium ${priorityClass(task.priority)}">${task.priority}</span>
            </div>
            <p class="mt-1 text-sm text-slate-500">${task.category} • Due ${task.due}</p>
          </div>

          <div class="flex gap-2">
            <button data-action="toggle" data-id="${task.id}" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:border-brand-500 hover:text-brand-700">
              ${task.done ? "Undo" : "Done"}
            </button>
            <button data-action="delete" data-id="${task.id}" class="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-500 transition hover:bg-rose-50">
              Delete
            </button>
          </div>
        </div>
      </li>
    `
    )
    .join("");

  updateStats();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "Work");
  const priority = String(formData.get("priority") || "Medium");
  const due = String(formData.get("due") || "");

  if (!title || !due) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    category,
    priority,
    due,
    done: false
  });

  saveTasks();
  form.reset();
  render();
});

taskList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  if (action === "toggle") {
    tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
  }

  if (action === "delete") {
    tasks = tasks.filter((task) => task.id !== id);
  }

  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.remove("filter-btn-active"));
    button.classList.add("filter-btn-active");

    render();
  });
});

// Default selected filter on initial load.
filterButtons[0]?.classList.add("filter-btn-active");
render();
