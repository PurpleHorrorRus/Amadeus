import Vue from "vue";
import VuePlyr from "vue-plyr/dist/vue-plyr.ssr.js";

const controls = `
<div class="plyr__controls">
    <div class="plyr__progress">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
    </div>
</div>
`;

Vue.use(VuePlyr, {
    plyr: {
        controls,
        keyboard: { focused: false, global: false },
        tooltips: { seek: false },
        autoplay: false,
        disableContextMenu: true
    }
});