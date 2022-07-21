<template>
    <div id="media-page-bottom">
        <span id="media-page-bottom-current" v-text="currentText" />

        <div id="media-page-bottom-buttons">
            <MediaPageButton 
                v-for="button of buttons"
                :key="button.id"
                :icon="button.icon"
                :tooltip="button.tooltip"
                @click.native="button.action"
            />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    components: {
        MediaPageButton: () => import("~/components/Media/Button")
    },

    data: () => ({
        buttons: []
    }),

    computed: {
        currentText() {
            return `${this.$parent.media.index + 1} / ${this.$parent.media.data.length}`;
        }
    },

    created() {
        this.buttons = [{
            id: "share",
            icon: () => import("~icons/reply.svg"),
            tooltip: this.$strings.TOOLTIP.SHARE,
            action: this.$parent.share
        }];
    }
};
</script>

<style lang="scss">
#media-page-bottom {
    position: absolute;
    left: 0px; bottom: 0px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 80px;

    padding: 0px 2%;

    background: var(--backdrop);

    &-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
    }
}
</style>