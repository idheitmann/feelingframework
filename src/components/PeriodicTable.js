import { store } from '../store.js';
import { createElementCard } from './ElementCard.js';

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

    // Layout: one column per group (ordered by group position, like element
    // families in a periodic table), elements sorted top-down from highest
    // to lowest valence within their column. Fully data-driven — columns
    // and rows follow whatever groups.yaml and elements.yaml contain.

    const sortedGroups = [...state.groups].sort((a, b) => a.position - b.position);
    container.style.setProperty('--group-count', sortedGroups.length);

    sortedGroups.forEach((group, colIndex) => {
        const col = colIndex + 1;

        const header = document.createElement('div');
        header.className = 'group-header';
        header.style.gridColumn = col;
        header.style.gridRow = 1;
        header.style.color = group.color;
        header.textContent = group.name;
        container.appendChild(header);

        const members = state.elements
            .filter(e => e.group === group.id)
            .sort((a, b) =>
                b.valence - a.valence || b.arousal - a.arousal || a.number - b.number
            );

        members.forEach((element, rowIndex) => {
            const card = document.createElement('div');
            card.className = 'element-card';
            card.dataset.id = element.number;
            card.style.gridColumn = col;
            card.style.gridRow = rowIndex + 2;

            if (state.selectedElementId === element.number) {
                card.classList.add('selected');
            }

            card.appendChild(createElementCard(element, group));

            card.addEventListener('click', () => {
                store.selectElement(element.number);
            });

            container.appendChild(card);
        });
    });
}
