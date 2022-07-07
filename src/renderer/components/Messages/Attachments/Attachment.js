import { ipcRenderer, shell } from "electron";

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

        calculateMaxSize(images, field = "url") {
            return [...images].sort((a, b) => {
                return (b.width * b.height) - (a.width * a.height);
            })[0][field];
        },

        openExternal(url) {
            return shell.openExternal(url);
        }
    }
};