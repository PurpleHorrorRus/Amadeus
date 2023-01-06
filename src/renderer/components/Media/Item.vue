<template>
    <div id="media-page-item" @click.right="openMenu">
        <img
            v-if="item.type === 'photo'"
            id="photo"
            class="media-page-item-frame"
            :src="item.sizes.max"
        >

        <iframe
            v-else-if="item.type === 'video'"
            id="video"
            class="media-page-item-frame"
            :src="item.player"
        />

        <MediaPageStory
            v-else-if="item.type === 'story'"
            :story="item"
        />

        <ContextMenu v-if="menu.show" :menu="menu" />
    </div>
</template>

<script lang="ts">
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        MediaPageStory: () => import("~/components/Media/Story.vue")
    },

    mixins: [GalleryMixin, MenuMixin],

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    methods: {
        setMenuItems() {
            this.menu.items = [{
                id: "share",
                label: this.$strings.MEDIA.SHARE,
                function: () => this.share()
            },

            {
                id: "copy",
                label: this.$strings.MEDIA.COPY_LINK,
                function: () => this.copy("src")
            },

            {
                id: "copy",
                label: this.$strings.MEDIA.COPY_IMAGE,
                function: () => this.copy("image")
            }];
        },

        share() {
            this.$ipc.send("share", this.item);
            return this.$parent.close();
        },

        copy(event) {
            this.$ipc.send(event, this.item.sizes.max);
        }
    }
};
</script>

<style lang="scss">
#media-page-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 10px;

    width: max-content;
    height: max-content;
    max-height: 60vh;

    .media-page-item-frame {
        display: flex;
        align-items: center;

        &#video, &#story {
            border: none;
        }

        &#video {
            width: 60vw;
            height: 60vh;
        }

        &#photo {
            width: auto;
            max-height: 80vh;
        }
    }
}
</style>