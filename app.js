// app.js
// Developer: Sharon Salman, ID: 206919979, Developer: Ido Michael Bernea , ID: 316315837
import IDBLibrary from './idb.js';

const db = new IDBLibrary('CalorieCalculatorDB', 1);

document.addEventListener('DOMContentLoaded', async () => {
  await db.open();
  setupEventListeners();
  updateCalorieList();
  setDefaultDate();
});

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0]; 
  document.getElementById('date').value = today; 
}

function setupEventListeners() {
  document.getElementById('addCalorieForm').addEventListener('submit', addCalorieItem);
}

async function addCalorieItem(event) {
  event.preventDefault();
  
  const calories = parseInt(document.getElementById('calories').value);
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value; 

  if (!calories || !category || !description || !date) {
    alert('Please fill out all fields!');
    return;
  }


  const item = {
    calories,
    category,
    description,
    date: new Date(date).toISOString() 
  };

  try {
    await db.add(item); 
    updateCalorieList(); 
   
    alert('Item added successfully!');
    event.target.reset(); 
    setDefaultDate(); 
  } catch (error) {

  alert('Error adding item. Please try again.')
}
}


async function updateCalorieList() {
  const items = await db.getAll(); // Retrieve all items from IndexedDB
  const list = document.getElementById('calorieList');
  list.innerHTML = '';

  items.forEach(item => {
    const date = new Date(item.date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    const li = document.createElement('li');
    li.textContent = `${item.calories} calories - ${item.category} - ${item.description} (${formattedDate})`;
    list.appendChild(li);
  });
}
