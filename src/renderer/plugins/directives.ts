import Vue from "vue";

import { directive as clickaway } from "vue-clickaway";
import ScrollOutside from "vue-scroll-outside";

Vue.directive("click-away", clickaway);
Vue.directive("scroll-outside", ScrollOutside);