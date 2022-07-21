export default {
    namespaced: true,

    state: () => ({
        language: "ru",
        pack: {}
    }),

    actions: {
        LOAD: async ({ state }, language = "ru") => {
            state.language = language;
            state.pack = (await import(`~/assets/langs/${language}.json`)).default;
            Object.assign(global.$nuxt.$strings, state.pack);
            return state.pack;
        }
    }    
};