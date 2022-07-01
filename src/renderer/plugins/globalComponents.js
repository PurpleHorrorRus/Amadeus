import Vue from "vue";

const components = {
    LoaderIcon: () => import("~/assets/icons/loader.svg"),
    SolidButton: () => import("~/components/Global/SolidButton"),
    SingleInput: () => import("~/components/Global/SingleInput")
};

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component);
});