import { ipcRenderer } from "electron";

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },

    methods: {
        openMedia(data, index) {
            return ipcRenderer.send("openMedia", { data, index });
        },

        calculateMaxSize(images) {
            return [...images].sort((a, b) => {
                return (b.width * b.height) - (a.width * a.height);
            })[0].url;
        }
    }
};