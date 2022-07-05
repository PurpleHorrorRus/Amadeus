<template>
    <span id="messages-player-time" v-text="time" />
</template>

<script>
import { mapState } from "vuex";

import common from "~/plugins/common";

export default {
    computed: {
        ...mapState({
            currentTime: state => state.audio.time
        }),

        time() {
            return common.fancyTimeFormat(this.currentTime);
        }
    }
};
</script>

<style lang="scss">
#messages-player-time {
    font-size: 12px;
}
</style>