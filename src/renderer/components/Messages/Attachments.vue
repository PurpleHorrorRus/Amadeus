<template>
    <div class="message-content-attachments">
        <div v-if="message.attachments.length > 0" class="message-content-attachments-list">
            <AttachmentWall
                v-if="message.attachments[0].type === 'wall'" 
                :item="message.attachments[0]"
            />

            <Gallery 
                v-if="galleryItems.length > 0"
                :data="galleryItems" 
            />

            <AttachmentSticker 
                v-if="message.attachments[0].type === 'sticker'" 
                :item="message.attachments[0]"
            />

            <AttachmentGraffiti
                v-else-if="message.attachments[0].type === 'graffiti'" 
                :item="message.attachments[0]"
            />

            <AttachmentAudioMessage
                v-else-if="message.attachments[0].type === 'audio_message'" 
                :item="message.attachments[0]"
            />

            <AttachmentStory
                v-else-if="message.attachments[0].type === 'story'" 
                :item="message.attachments[0]"
            />

            <AttachmentPoll
                v-if="pollItem"
                :item="pollItem"
            />

            <div v-if="audioItems.length > 0" class="message-content-attachments-audios">
                <AttachmentAudio
                    v-for="item of audioItems"
                    :key="item.audio.id"
                    :item="item"
                />
            </div>

            <div v-if="docItems.length > 0" class="message-content-attachments-docs">
                <AttachmentsDoc 
                    v-for="item of docItems"
                    :key="item.doc.id"
                    :item="item"
                />
            </div>
        </div>

        <AttachmentsLink v-if="linkItem" :item="linkItem" />
        <AttachmentsMap v-if="message.geo" :geo="message.geo" />
    </div>
</template>

<script>
export default {
    components: {
        AttachmentWall: () => import("~/components/Messages/Attachments/Wall"),
        Gallery: () => import("~/components/Messages/Attachments/Gallery"),
        AttachmentSticker: () => import("~/components/Messages/Attachments/Sticker"),
        AttachmentGraffiti: () => import("~/components/Messages/Attachments/Graffiti"),
        AttachmentPoll: () => import("~/components/Messages/Attachments/Poll"),
        AttachmentAudioMessage: () => import("~/components/Messages/Attachments/AudioMessage"),
        AttachmentStory: () => import("~/components/Messages/Attachments/Story"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio"),
        AttachmentsDoc: () => import("~/components/Messages/Attachments/Doc"),
        AttachmentsLink: () => import("~/components/Messages/Attachments/Link"),
        AttachmentsMap: () => import("~/components/Messages/Attachments/Map")
    },

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    computed: {
        galleryItems() {
            return this.message.attachments.filter(attachment => {
                return attachment.type === "photo" 
                    || attachment.type === "video";
            });
        },

        audioItems() {
            return this.message.attachments.filter(attachment => {
                return attachment.type === "audio";
            });
        },

        docItems() {
            return this.message.attachments.filter(attachment => {
                return attachment.type === "doc";
            });
        },

        pollItem() {
            return this.message.attachments.find(attachment => {
                return attachment.type === "poll";
            });
        },

        linkItem() {
            return this.message.attachments.find(attachment => {
                return attachment.type === "link";
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
    }
}

.message.out:not(.noBackground) .attachments-item-title {
    color: var(--text);
}
</style>