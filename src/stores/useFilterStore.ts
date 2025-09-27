import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
    state: () => ({
        tags: [],
        features: [],
        layouts: [],
        keys: null,
        board: null,
        converter: null,
        raw: null,
    }),
    getters: {
        count: (state) => {
            return (
                state.tags.length +
                state.features.length +
                state.layouts.length +
                (state.keys ? 1 : 0) +
                (state.board ? 1 : 0) +
                (state.converter ? 1 : 0) +
                (state.raw ? 1 : 0)
            );
        },
    },
});
