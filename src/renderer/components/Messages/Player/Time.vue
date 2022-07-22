<template>
    <span id="messages-player-time" v-text="time" />
</template>

<script lang="ts">
import { mapState } from "vuex";

import common from "~/plugins/common";

export default {
    computed: {
        ...mapState({
            currentTime: (state: any) => state.audio.time
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