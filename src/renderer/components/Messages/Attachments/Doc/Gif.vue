<template>
    <div class="attachments-item-doc-gif" @click="turnPlaying">
        <div v-if="!playing" class="attachments-item-doc-gif-preview">
            <div class="attachments-item-doc-gif-preview-size">
                <span class="attachments-item-doc-gif-preview-size-label" v-text="size" />
            </div>

            <img :src="preview.src" class="attachments-item-doc-gif-preview-image">
        </div>

        <div v-else class="attachments-item-doc-gif-playing">
            <img :src="item.doc.url" class="attachments-item-doc-gif-playing-image">

            <div class="attachments-item-doc-gif-playing-add" @click.stop="add">
                <AddIcon v-if="!added" class="icon vkgram" />
                <CheckIcon v-else class="icon vkgram" />
            </div>
        </div>
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";

export default {
    components: {
        AddIcon: () => import("~/assets/icons/add.svg"),
        CheckIcon: () => import("~/assets/icons/check.svg")
    },

    mixins: [CoreMixin, DocMixin],

    data: () => ({
        added: false,
        addedGif: null,
        playing: false,
        preview: ""
    }),

    created() {
        this.preview = this.calculateMaxSize(this.item.doc.preview.photo.sizes);
    },

    methods: {
        turnPlaying() {
            this.playing = !this.playing;
        },

        async add() {
            if (!this.added) {
                this.addedGif = await this.client.api.docs.add({
                    access_key: this.item.doc.access_key,
                    doc_id: this.item.doc.id,
                    owner_id: this.item.doc.owner_id
                });
            } else {
                await this.client.api.docs.delete({
                    doc_id: this.addedGif,
                    owner_id: this.user.id
                });

                this.addedGif = null;
            }

            this.added = !this.added;
            return this.added;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-doc-gif {
    width: max-content;
    height: max-content;
    
    &-preview {
        position: relative;

        width: 100%;
        height: 13vh;

        &-image {
            width: 100%;
            height: 100%;

            border-radius: 8px;
        }

        &-size {
            position: absolute;
            top: 5px; left: 5px;
            
            display: flex;
            justify-content: center;
            align-items: center;

            padding: 5px;

            background: #00000080;
            border-radius: 4px;

            &-label {
                font-size: 11px;
            }
        }
    }

    &-playing {
        position: relative;

        width: 35vw;

        &-image {
            width: 100%;
        }

        &-add {
            position: absolute;
            top: 10px; right: 10px;

            display: flex;
            justify-content: center;
            align-items: center;

            width: 20px;
            height: 20px;

            background: var(--secondary);
            border-radius: 4px;

            .icon {
                width: 16px;
            }
        }
    }
}
</style>