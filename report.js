// report.js
// Developer: Sharon Salman, ID: 206919979, Developer: Ido Michael Bernea , ID: 316315837 

import IDBLibrary from './idb.js';

const db = new IDBLibrary('CalorieCalculatorDB', 1);

document.addEventListener('DOMContentLoaded', async () => {
  await db.open();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('generateReport').addEventListener('click', generateMonthlyReport);
}

async function generateMonthlyReport() {
  const month = parseInt(document.getElementById('reportMonth').value);
  const year = parseInt(document.getElementById('reportYear').value);

  const items = await db.getByMonthYear(month, year);
  const report = document.getElementById('monthlyReport');
  report.innerHTML = '';

  if (items.length === 0) {
    report.textContent = 'No data for the selected month and year.';
    return;
  }

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const categorySums = items.reduce((sums, item) => {
    sums[item.category] = (sums[item.category] || 0) + item.calories;
    return sums;
  }, {});

  const reportHTML = `
    <h3>Report for ${month}/${year}</h3>
    <p>Total Calories: ${totalCalories}</p>
    <h4>Breakdown by Category:</h4>
    <ul>
      ${Object.entries(categorySums).map(([category, sum]) => `<li>${category}: ${sum} calories</li>`).join('')}
    </ul>
    <h4>Detailed List:</h4>
    <ul>
      ${items.map(item => `<li>${item.calories} calories - ${item.category} - ${item.description} (${new Date(item.date).toLocaleDateString()})</li>`).join('')}
    </ul>
  `;

  report.innerHTML = reportHTML;
}