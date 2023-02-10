<template>
    <div
        class="attachments-item attachments-item-sticker"
        @mouseenter="turnAnimation(true)"
        @mouseleave="turnAnimation(false)"
    >
        <StarIcon
            v-if="canFavorite"
            :class="stickerFavoriteClass"
            class="icon amadeus star attachments-item-sticker__favorite"
            @click.stop="favorite"
        />

        <lottie-vue-player
            v-if="item.animated"
            ref="player"
            :src="sticker"
            class="attachments-item-sticker-animated-video"
            loop
        />

        <img
            v-else
            :key="config.appearance.stickersTheme"
            :src="sticker"
            class="attachments-item-sticker__image"
        >
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        StarIcon: () => import("~icons/star.svg")
    },

    mixins: [CoreMixin, AttachmentMixin],

    props: {
        canFavorite: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        ...mapState({
            favoriteStickers: (state: any) => state.vk.messages.stickers.favorite.stickers
        }),

        sticker() {
            return this.config.appearance.stickersTheme === 1
                ? this.item.dark
                : this.item.light;
        },

        isFavorite() {
            return this.canFavorite && this.favoriteStickers.some(sticker => {
                return sticker.id === this.item.id;
            });
        },

        stickerFavoriteClass() {
            return {
                filled: this.isFavorite
            };
        }
    },

    methods: {
        turnAnimation(sequence) {
            if (!this.item.animated) {
                return false;
            }

            return sequence
                ? this.$refs.player.togglePlayPause()
                : this.$refs.player.stop();
        },

        async favorite() {
            if (!this.isFavorite) {
                this.favoriteStickers.unshift(this.item);

                return await this.client.api.store.addStickersToFavorite({
                    sticker_ids: this.item.id
                });
            }

            const stickerIndex = this.favoriteStickers.findIndex(sticker => {
                return sticker.id === this.item.id;
            });

            this.favoriteStickers.splice(stickerIndex, 1);

            return await this.client.api.store.removeStickersFromFavorite({
                sticker_ids: this.item.id
            });
        }
    }
};
</script>

<style lang="scss">
.attachments-item-sticker {
    position: relative;

    min-width: 170px;
    max-width: 320px;
    width: 20vw;

    &:hover {
        cursor: default;

        .attachments-item-sticker__favorite {
            opacity: 1;
        }
    }

    &__favorite {
        position: absolute;
        top: 5px; right: 5px;

        opacity: 0;
    }

    &-animated {
        &-video .lf-spinner {
            display: none;
        }
    }

    &__image, &-animated-preview, &-animated-video {
        width: 100%;

        background: none;
    }
}
</style>