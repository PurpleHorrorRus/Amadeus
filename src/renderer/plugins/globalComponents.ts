import Vue from "vue";

import LottieVuePlayer from "@lottiefiles/vue-lottie-player";

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