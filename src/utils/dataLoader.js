import yaml from 'js-yaml';

/**
 * Fetches and parses a YAML file from the public/data directory.
 * @param {string} filename - The name of the YAML file (e.g., 'elements.yaml')
 * @returns {Promise<any>} - The parsed data
 */
export async function loadYamlData(filename) {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
    }
    const text = await response.text();
    return yaml.load(text);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
}

/**
 * Loads all initial application data.
 * @returns {Promise<{elements: Array, groups: Array, compounds: Array}>}
 */
export async function loadAllData() {
  const [elements, groups, compounds] = await Promise.all([
    loadYamlData('elements.yaml'),
    loadYamlData('groups.yaml'),
    loadYamlData('compounds.yaml')
  ]);

  await loadIllustrations(elements);

  return { elements, groups, compounds };
}

/**
 * Fetches the SVG source for every element that declares an illustration
 * and attaches it as `element.illustration.svg`. A missing or failing
 * illustration is non-fatal — the card renderer falls back to a glyph.
 */
async function loadIllustrations(elements) {
  await Promise.all(elements.map(async element => {
    const file = element.illustration?.file;
    if (!file) return;
    try {
      const response = await fetch(`/${file}`);
      if (response.ok) {
        element.illustration.svg = await response.text();
      } else {
        console.warn(`Illustration not found for ${element.symbol}: ${file}`);
      }
    } catch (error) {
      console.warn(`Failed to load illustration for ${element.symbol}:`, error);
    }
  }));
}
