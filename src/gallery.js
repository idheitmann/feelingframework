import './assets/styles/main.css';
import { loadAllData } from './utils/dataLoader.js';
import { createElementCard } from './components/ElementCard.js';

/**
 * Art-review gallery: every element's full card next to its raw motif at
 * two scales (review size and grid size), so each art pass judges the set's
 * coherence rather than one card at a time.
 */
async function init() {
  const { elements, groups } = await loadAllData();
  const gallery = document.getElementById('gallery');

  [...elements]
    .sort((a, b) => a.number - b.number)
    .forEach(element => {
      const group = groups.find(g => g.id === element.group);
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.appendChild(createElementCard(element, group));

      const motifs = document.createElement('div');
      motifs.className = 'gallery-motifs';
      for (const size of [120, 40]) {
        const slot = document.createElement('div');
        slot.className = 'gallery-motif';
        slot.style.width = `${size}px`;
        slot.style.height = `${size}px`;
        if (element.illustration?.svg) {
          slot.innerHTML = element.illustration.svg;
        } else {
          slot.classList.add('gallery-motif-missing');
          slot.textContent = '—';
        }
        motifs.appendChild(slot);
      }

      const caption = document.createElement('div');
      caption.className = 'gallery-caption';
      const meta = element.illustration
        ? `${element.illustration.source} · v${element.illustration.version}`
        : 'no illustration';
      caption.innerHTML = `<strong>${element.symbol}</strong> ${element.name}<br><span>${meta}</span>`;

      item.append(card, motifs, caption);
      gallery.appendChild(item);
    });
}

init().catch(error => {
  console.error(error);
  document.body.innerHTML = `<div style="padding: 2rem; color: red;">Error loading gallery: ${error.message}</div>`;
});
