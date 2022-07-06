import Vue from "vue";

import { directive as clickaway } from "vue-clickaway";
Vue.directive("click-away", clickaway);

import ScrollOutside from "vue-scroll-outside";
Vue.directive("scroll-outside", ScrollOutside);