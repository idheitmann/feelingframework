import { store } from '../store.js';

export function initDetailOverlay() {
    const overlay = document.getElementById('detail-overlay');

    // Close on click outside (or on the overlay background)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            store.clearSelection();
        }
    });

    store.subscribe(state => {
        if (state.selectedElementId) {
            const element = state.elements.find(e => e.number === state.selectedElementId);
            const group = state.groups.find(g => g.id === element.group);
            render(overlay, element, group);
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
            overlay.innerHTML = ''; // Clean up
        }
    });
}

function render(container, element, group) {
    if (!element) return;

    const color = group ? group.color : '#ccc';

    container.innerHTML = `
    <div class="detail-card fade-in" style="--element-color: ${color}">
      <button class="close-btn" onclick="document.getElementById('detail-overlay').click()">×</button>
      
      <div class="detail-header">
        <div class="detail-number">${element.number}</div>
        <div class="detail-symbol">${element.symbol}</div>
        <div class="detail-name">${element.name}</div>
        <div class="detail-group" style="color: ${color}">${group ? group.name : ''}</div>
      </div>
      
      <div class="detail-body">
        <div class="detail-section">
          <h3>Description</h3>
          <p>${element.description}</p>
        </div>
        
        <div class="detail-section">
          <h3>Somatic Experience</h3>
          <p>${element.somatic}</p>
        </div>
        
        <div class="detail-stats">
          <div class="stat">
            <span class="stat-label">Valence</span>
            <span class="stat-value">${element.valence}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Arousal</span>
            <span class="stat-value">${element.arousal}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
