<template>
    <div class="message-content-attachments">
        <div v-if="message.attachments.length > 0" class="message-content-attachments-list">
            <AttachmentWall
                v-if="attachment.type === 'wall'"
                :item="attachment"
            />

            <Gallery
                v-if="galleryItems.length > 0"
                :data="galleryItems"
            />

            <AttachmentSticker
                v-if="attachment.type === 'sticker'"
                :item="attachment"
            />

            <AttachmentPlaylist
                v-if="attachment.type === 'audio_playlist'"
                :item="attachment"
            />

            <AttachmentGraffiti
                v-else-if="attachment.type === 'graffiti'"
                :item="attachment"
            />

            <AttachmentAudioMessage
                v-else-if="attachment.type === 'audio_message'"
                :item="attachment"
            />

            <AttachmentStory
                v-else-if="attachment.type === 'story'"
                :item="attachment"
            />

            <AttachmentGift
                v-else-if="attachment.type === 'gift'"
                :item="attachment"
            />

            <AttachmentPoll v-if="pollItem" :item="pollItem" />
            <AttachmentsLink v-if="linkItem" :item="linkItem" />

            <div v-if="audioItems.length > 0" class="message-content-attachments-audios">
                <AttachmentAudio
                    v-for="item of audioItems"
                    :key="item.id"
                    :item="item"
                />
            </div>

            <div v-if="docItems.length > 0" class="message-content-attachments-docs">
                <AttachmentsDoc
                    v-for="item of docItems"
                    :key="item.id"
                    :item="item"
                />
            </div>
        </div>

        <AttachmentsMap v-if="message.geo" :geo="message.geo" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        AttachmentWall: () => import("~/components/Messages/Attachments/Wall.vue"),
        Gallery: () => import("~/components/Messages/Attachments/Gallery.vue"),
        AttachmentSticker: () => import("~/components/Messages/Attachments/Sticker.vue"),
        AttachmentPlaylist: () => import("~/components/Messages/Attachments/AudioPlaylist.vue"),
        AttachmentGraffiti: () => import("~/components/Messages/Attachments/Graffiti.vue"),
        AttachmentPoll: () => import("~/components/Messages/Attachments/Poll.vue"),
        AttachmentAudioMessage: () => import("~/components/Messages/Attachments/AudioMessage.vue"),
        AttachmentStory: () => import("~/components/Messages/Attachments/Story.vue"),
        AttachmentGift: () => import("~/components/Messages/Attachments/Gift.vue"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio.vue"),
        AttachmentsDoc: () => import("~/components/Messages/Attachments/Doc.vue"),
        AttachmentsLink: () => import("~/components/Messages/Attachments/Link.vue"),
        AttachmentsMap: () => import("~/components/Messages/Attachments/Map.vue")
    },

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        galleryItems: [],
        docItems: [],
        audioItems: [],

        pollItem: null,
        linkItem: null
    }),

    computed: {
        attachment() {
            return this.message.attachments[0];
        }
    },

    watch: {
        message: {
            deep: true,

            handler: function() { this.updateAttachments(); }
        }
    },

    created() {
        this.updateAttachments();
    },

    methods: {
        updateAttachments() {
            this.galleryItems = this.filter(["photo", "video"]);
            this.docItems = this.filter("doc");
            this.audioItems = this.filter("audio");

            this.pollItem = this.find("poll");
            this.linkItem = this.find("link");
        },

        filter(type) {
            if (!this.message.attachments) {
                return [];
            }

            const isArray = Array.isArray(type);
            return this.message.attachments.filter(attachment => {
                return isArray
                    ? type.includes(attachment.type)
                    : attachment.type === type;
            });
        },

        find(type) {
            return this.message.attachment?.find(attachment => {
                return attachment.type === type;
            }) || null;
        }
    }
};
</script>

<style lang="scss">
.message-content-attachments {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    width: 100%;

    .attachments-item {
        &:hover {
            cursor: pointer;

            .attachments-item-title {
                text-decoration: underline;
            }
        }

        &-title {
            display: block;

            width: fit-content;

            padding: 10px;

            background: var(--backdrop);
            border-radius: 24px;

            color: var(--contrast) !important;
            font-size: 12px;
        }
    }

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    &-audios {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }

    &-docs {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
}

.message.out:not(.noBackground) {
    .attachments-item-title {
        color: var(--text);
    }
}

.message.noBackground {
    .attachments-item-title, .message-content-info-date {
        color: var(--text);
    }
}
</style>