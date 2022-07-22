<template>
    <div id="general-page" class="page">
        <span id="general-page-label" v-text="$strings.CHOOSE_DIALOG" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    mounted() {
        this.setCurrent(null);
    },

    methods: {
        ...mapActions({
            setCurrent: "vk/messages/SET_CURRENT"
        })
    }
};
</script>

<style lang="scss">
#general-page {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>