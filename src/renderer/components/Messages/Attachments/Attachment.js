import { ipcRenderer, shell } from "electron";

const availabelToOpenMediaTypes = [
    "photo",
    "video",
    "story"
];

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

    methods: {
        openMedia(data, index) {
            if (data[index].restriction || !availabelToOpenMediaTypes.includes(data[index].type)) {
                return false;
            }

            if (!data || index === undefined) {
                console.log("MEDIA: no data requirements", data, index);
                return false;
            }

            return ipcRenderer.send("openMedia", { data, index });
        },

        calculateMaxSize(images) {
            return [...images].sort((a, b) => {
                return (b.width * b.height) - (a.width * a.height);
            })[0];
        },

        openExternal(url) {
            return shell.openExternal(url);
        }
    }
};