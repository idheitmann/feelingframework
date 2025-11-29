import './assets/styles/main.css';
import { loadAllData } from './utils/dataLoader.js';
import { store } from './store.js';
import { createPeriodicTable } from './components/PeriodicTable.js';
import { createLegend } from './components/Legend.js';
import { initDetailOverlay } from './components/DetailView.js';

async function init() {
  try {
    // 1. Load Data
    const data = await loadAllData();
    store.setInitialData(data);

    // 2. Initialize Components
    const tableContainer = document.getElementById('periodic-table-container');
    const legendContainer = document.getElementById('legend-container');

    tableContainer.appendChild(createPeriodicTable());
    legendContainer.appendChild(createLegend());

    // 3. Initialize Overlay
    initDetailOverlay();

  } catch (error) {
    console.error('Failed to initialize app:', error);
    document.body.innerHTML = `<div style="padding: 2rem; color: red;">Error loading application: ${error.message}</div>`;
  }
}

init();
