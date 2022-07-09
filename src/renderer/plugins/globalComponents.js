import Vue from "vue";

import LottieVuePlayer from "@lottiefiles/vue-lottie-player";

const components = {
    LoaderIcon: () => import("~/assets/icons/loader.svg"),
    SolidButton: () => import("~/components/Global/SolidButton"),
    SingleInput: () => import("~/components/Global/SingleInput"),
    ToggleButton: () => import("~/components/Global/ToggleButton"),
    RangeItem: () => import("~/components/Global/RangeItem"),
    FileChoosing: () => import("~/components/Global/FileChoosing"),
    Dropdown: () => import("~/components/Global/Dropdown"),
    ContextMenu: () => import("~/components/Global/ContextMenu"),
    ContextMenuItem: () => import("~/components/Menu/Item"),
    Skeleton: () => import("~/components/Global/Skeleton")
};

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component);
});

Vue.use(LottieVuePlayer);