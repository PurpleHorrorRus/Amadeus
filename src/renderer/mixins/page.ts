export default {
    data: () => ({
        first: true
    }),

    computed: {
        pageClass() {
            return {
                first: this.first
            };
        }
    }
};