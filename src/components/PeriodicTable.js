import { store } from '../store.js';

export function createPeriodicTable() {
    const container = document.createElement('div');
    container.className = 'periodic-table';

    // Subscribe to store updates
    store.subscribe(state => {
        if (state.loading) return;

        render(container, state);
    });

    return container;
}

function render(container, state) {
    container.innerHTML = '';

    // Create grid container
    // We use a 10x10 grid (Valence 1-10, Arousal 1-10)
    // Plus some padding/margins if needed

    state.elements.forEach(element => {
        const card = document.createElement('div');
        card.className = 'element-card';
        card.dataset.id = element.number;

        // Position Logic
        // Valence (X): 1 (left) -> 10 (right)
        // Arousal (Y): 1 (low/bottom) -> 10 (high/top)
        // CSS Grid Row: 1 is top. So we need to invert Arousal.
        // Row = 11 - Arousal (so 10 becomes 1, 1 becomes 10)

        const col = element.valence;
        const row = 11 - element.arousal;

        card.style.gridColumn = col;
        card.style.gridRow = row;

        // Color based on group
        const group = state.groups.find(g => g.id === element.group);
        const color = group ? group.color : '#ccc';

        card.style.setProperty('--element-color', color);
        if (state.selectedElementId === element.number) {
            card.classList.add('selected');
        }

        card.innerHTML = `
      <div class="element-number">${element.number}</div>
      <div class="element-symbol">${element.symbol}</div>
      <div class="element-name">${element.name}</div>
    `;

        card.addEventListener('click', () => {
            store.selectElement(element.number);
        });

        container.appendChild(card);
    });
}
