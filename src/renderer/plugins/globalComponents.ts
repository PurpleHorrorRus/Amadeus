import Vue from "vue";
import { ipcRenderer } from "electron";

import LottieVuePlayer from "@lottiefiles/vue-lottie-player/dist/vue-lottie-player.umd.min.js";

Object.entries({
    LoaderIcon: () => import("~icons/loader.svg"),
    SolidButton: () => import("~/components/Global/SolidButton.vue"),
    SingleInput: () => import("~/components/Global/SingleInput.vue"),
    ToggleButton: () => import("~/components/Global/ToggleButton.vue"),
    Checkbox: () => import("~/components/Global/Checkbox.vue"),
    RangeItem: () => import("~/components/Global/RangeItem.vue"),
    FileChoosing: () => import("~/components/Global/FileChoosing.vue"),
    Dropdown: () => import("~/components/Global/Dropdown.vue"),
    Upload: () => import("~/components/Global/Upload.vue"),
    ContextMenu: () => import("~/components/Global/ContextMenu.vue"),
    Skeleton: () => import("~/components/Global/Skeleton.vue")
}).forEach(([name, component]) => Vue.component(name, component));

Vue.use(LottieVuePlayer);

export default (_context, inject) => {
    inject("isDev", process.env.NODE_ENV === "development");

    inject("ipc", {
        send: (event, content) => {
            if (content && typeof content === "object") {
                return ipcRenderer.send(event, JSON.parse(JSON.stringify(content)));
            }

            return ipcRenderer.send(event, content);
        },

        invoke: async (event, content) => {
            return await ipcRenderer.invoke(event, content);
        }
    });
};