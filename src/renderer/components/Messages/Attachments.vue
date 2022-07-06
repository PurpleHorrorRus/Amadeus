<template>
    <div class="message-content-attachments">
        <div v-if="attachments.length > 0" class="message-content-attachments-list">
            <AttachmentWall
                v-if="attachments[0].type === 'wall'" 
                :item="attachments[0]"
            />

            <Gallery 
                v-if="galleryItems.length > 0"
                :data="galleryItems" 
            />

            <AttachmentSticker 
                v-if="attachments[0].type === 'sticker'" 
                :item="attachments[0]"
            />

            <AttachmentGraffiti
                v-else-if="attachments[0].type === 'graffiti'" 
                :item="attachments[0]"
            />

            <AttachmentAudioMessage
                v-else-if="attachments[0].type === 'audio_message'" 
                :item="attachments[0]"
            />

            <AttachmentStory
                v-else-if="attachments[0].type === 'story'" 
                :item="attachments[0]"
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

        <AttachmentsMap
            v-if="geo"
            :geo="geo"
        />
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
        AttachmentsMap: () => import("~/components/Messages/Attachments/Map")
    },

    props: {
        attachments: {
            type: Array,
            required: false,
            default: () => ([])
        },

        geo: {
            type: Object,
            required: false,
            default: undefined
        }
    },

    computed: {
        galleryItems() {
            return this.attachments.filter(attachment => {
                return attachment.type === "photo" 
                    || attachment.type === "video";
            });
        },

        audioItems() {
            return this.attachments.filter(attachment => {
                return attachment.type === "audio";
            });
        },

        docItems() {
            return this.attachments.filter(attachment => {
                return attachment.type === "doc";
            });
        },

        pollItem() {
            return this.attachments.find(attachment => {
                return attachment.type === "poll";
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

    .attachments-item {
        &:hover {
            cursor: pointer;

            .attachments-item-title {
                text-decoration: underline;
            }
        }

        &-title {
            margin-left: 5px;

            color: var(--secondary);
            font-size: 12px;
        }
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