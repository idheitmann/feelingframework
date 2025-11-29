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
  
  return { elements, groups, compounds };
}
