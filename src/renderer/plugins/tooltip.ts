import Vue from "vue";
import VTooltip from "v-tooltip";

Vue.use(VTooltip, {
    defaultPlacement: "top",
    defaultBoundariesElement: "body",
    defaultContainer: "body"
});