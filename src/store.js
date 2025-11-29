/**
 * Simple State Store
 * Manages application state and notifies subscribers of changes.
 */
class Store {
    constructor() {
        this.state = {
            elements: [],
            groups: [],
            compounds: [],
            selectedElementId: null, // ID (number) of the currently selected element
            selectedCompoundId: null,
            loading: true,
            error: null
        };
        this.listeners = new Set();
    }

    /**
     * Subscribe to state changes.
     * @param {Function} listener - Callback function receiving the new state
     * @returns {Function} - Unsubscribe function
     */
    subscribe(listener) {
        this.listeners.add(listener);
        // Immediately call with current state
        listener(this.state);
        return () => this.listeners.delete(listener);
    }

    /**
     * Notify all listeners of state changes.
     */
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Update state and notify listeners.
     * @param {Object} partialState - New state properties to merge
     */
    setState(partialState) {
        this.state = { ...this.state, ...partialState };
        this.notify();
    }

    // Actions

    setInitialData({ elements, groups, compounds }) {
        this.setState({
            elements,
            groups,
            compounds: compounds || [],
            loading: false
        });
    }

    selectElement(elementNumber) {
        this.setState({ selectedElementId: elementNumber });
    }

    clearSelection() {
        this.setState({ selectedElementId: null });
    }

    setError(error) {
        this.setState({ error, loading: false });
    }
}

export const store = new Store();
