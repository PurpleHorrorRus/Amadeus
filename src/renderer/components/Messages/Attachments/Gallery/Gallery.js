export default {
    props: {
        item: {
            type: Object,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    computed: {
        itemStyle() {
            return {
                gridArea: `item-${this.index + 1}`
            };
        }
    },
    
    methods: {
        calculateMaxSize(images) {
            return [...images].sort((a, b) => {
                return (b.width * b.height) - (a.width * a.height);
            })[0].url;
        }
    }
};