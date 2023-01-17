<template>
    <div class="message-content-attachments">
        <div v-if="message.attachments.length > 0" class="message-content-attachments-list">
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

            <AttachmentMiniApp
                v-else-if="attachment.type === 'mini_app'"
                :item="attachment"
            />

            <AttachmentWall v-if="wallItem" :item="wallItem" />
            <AttachmentPoll v-if="pollItem" :item="pollItem" />
            <AttachmentsLink v-if="linkItem" :item="linkItem" />

            <div v-if="docItems.length > 0" class="message-content-attachments-docs">
                <AttachmentsDoc
                    v-for="item of docItems"
                    :key="item.id"
                    :item="item"
                />
            </div>
        </div>

        <div v-if="audioItems.length > 0" class="message-content-attachments-audios">
            <AttachmentAudio
                v-for="item of audioItems"
                :key="item.id"
                :item="item"
            />
        </div>

        <AttachmentsMap v-if="message.geo" :geo="message.geo" />
    </div>
</template>

<script lang="ts">
import { MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";

export default {
    components: {
        Gallery: () => import("./Attachments/Gallery.vue"),
        AttachmentSticker: () => import("./Attachments/Sticker.vue"),
        AttachmentPlaylist: () => import("./Attachments/AudioPlaylist.vue"),
        AttachmentGraffiti: () => import("./Attachments/Graffiti.vue"),
        AttachmentPoll: () => import("./Attachments/Poll.vue"),
        AttachmentAudioMessage: () => import("./Attachments/AudioMessage.vue"),
        AttachmentStory: () => import("./Attachments/Story.vue"),
        AttachmentGift: () => import("./Attachments/Gift.vue"),
        AttachmentMiniApp: () => import("./Attachments/MiniApp.vue"),
        AttachmentAudio: () => import("./Attachments/Audio.vue"),
        AttachmentWall: () => import("./Attachments/Wall.vue"),
        AttachmentsDoc: () => import("./Attachments/Doc.vue"),
        AttachmentsLink: () => import("./Attachments/Link.vue"),
        AttachmentsMap: () => import("./Attachments/Map.vue")
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
        linkItem: null,
        wallItem: null
    }),

    computed: {
        attachment(): MessagesMessageAttachment {
            return this.message.attachments[0];
        }
    },

    watch: {
        message: {
            deep: true,

            handler: function() {
                return this.updateAttachments();
            }
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
            this.wallItem = this.find("wall");
        },

        filter(type) {
            if (!this.message.attachments) {
                return [];
            }

            const isArray = Array.isArray(type);

            return this.message.attachments.filter(attachment => {
                return isArray
                    ? type.includes(attachment?.type)
                    : attachment?.type === type;
            });
        },

        find(type) {
            return this.message.attachments?.find(attachment => {
                return attachment?.type === type;
            });
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

        height: max-content;

        padding: 10px;

        background: var(--backdrop);
        border-radius: 6px;
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