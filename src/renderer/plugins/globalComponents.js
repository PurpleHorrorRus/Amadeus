import Vue from "vue";

const components = {
    LoaderIcon: () => import("~/assets/icons/loader.svg"),
    SolidButton: () => import("~/components/Global/SolidButton"),
    SingleInput: () => import("~/components/Global/SingleInput"),
    Skeleton: () => import("~/components/Global/Skeleton")
};

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component);
});