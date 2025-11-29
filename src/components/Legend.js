import { store } from '../store.js';

export function createLegend() {
    const container = document.createElement('div');
    container.className = 'legend';

    store.subscribe(state => {
        if (state.loading) return;
        render(container, state.groups);
    });

    return container;
}

function render(container, groups) {
    container.innerHTML = '';

    // Sort groups by position
    const sortedGroups = [...groups].sort((a, b) => a.position - b.position);

    sortedGroups.forEach(group => {
        const item = document.createElement('div');
        item.className = 'legend-item';

        item.innerHTML = `
      <div class="legend-color" style="background-color: ${group.color}"></div>
      <span class="legend-name">${group.name}</span>
    `;

        container.appendChild(item);
    });
}
