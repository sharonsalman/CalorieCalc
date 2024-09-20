// app.js
import IDBLibrary from './idb.js';

const db = new IDBLibrary('CalorieCalculatorDB', 1);

document.addEventListener('DOMContentLoaded', async () => {
  await db.open();
  setupEventListeners();
  updateCalorieList();
});

function setupEventListeners() {
  document.getElementById('addCalorieForm').addEventListener('submit', addCalorieItem);
}

async function addCalorieItem(event) {
  event.preventDefault();
  const calories = parseInt(document.getElementById('calories').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;

  const item = {
    calories,
    category,
    description,
    date: new Date().toISOString()
  };

  await db.add(item);
  updateCalorieList();
  event.target.reset();
}

async function updateCalorieList() {
  const items = await db.getAll();
  const list = document.getElementById('calorieList');
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.calories} calories - ${item.category} - ${item.description} (${new Date(item.date).toLocaleDateString()})`;
    list.appendChild(li);
  });
}