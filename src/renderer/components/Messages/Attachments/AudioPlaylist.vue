<template>
    <div class="attachments-item attachments-item-playlist">
        <nuxt-img
            :src="item.cover"
            class="attachments-item-playlist-cover"
        />

        <div class="attachments-item-playlist-main">
            <PlaylistInformation :item="item" />
            <PlaylistActions :item="item" />
        </div>
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        PlaylistInformation: () => import("./AudioPlaylist/Information.vue"),
        PlaylistActions: () => import("./AudioPlaylist/Actions.vue")
    },

    mixins: [AttachmentMixin]
};
</script>

<style lang="scss">
@media screen and (max-width: 990px) {
    .attachments-item-playlist {
        grid-template-columns: 1fr !important;
        grid-template-rows: auto !important;
        grid-template-areas: "cover"
                            "information" !important;

        width: 200px;
    }
}

.attachments-item-playlist {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-template-rows: 120px;
    grid-template-areas: "cover information";

    height: max-content;

    background: var(--backdrop);
    border: 1px solid var(--backdrop);
    border-radius: 8px;

    &-cover {
        width: 100%;
        height: 100%;

        border-right: 1px solid var(--border);
        border-radius: 8px 0px 0px 8px;
    }

    &-main {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;

        padding: 10px;
    }
}
</style>