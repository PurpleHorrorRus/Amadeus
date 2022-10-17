<template>
    <div class="attachments-item-repost">
        <Component :is="icon" class="icon attachments-item-repost-icon" />

        <div class="attachments-item-repost-block">
            <img :src="profile.photo_100" class="attachments-item-repost-block-avatar">

            <div class="attachments-item-repost-block-information nowrap">
                <span
                    class="attachments-item-repost-block-information-name nowrap clickable"
                    @click.stop="() => profile.openExternal()"
                    v-text="profile.name"
                />

                <span class="attachments-item-repost-block-information-date" v-text="date" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import DateMixin from "~/mixins/date";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

import RepostIcon from "~icons/repost.svg";

export default {
    mixins: [CoreMixin, DateMixin, AttachmentMixin],

    props: {
        item: {
            type: Object,
            required: true
        },

        icon: {
            type: Object,
            required: false,
            default: RepostIcon
        }
    },

    data: () => ({
        date: new Date()
    }),

    computed: {
        ...mapState({
            profiles: (state: any) => state.vk.messages.profiles
        }),

        profile() {
            return this.profiles[Math.abs(this.item.from_id)];
        }
    },

    async created() {
        this.date = this.relativeDate(this.item.date);
    }
};
</script>

<style lang="scss">
.attachments-item-repost {
    display: grid;
    grid-template-columns: 22px 1fr;
    align-items: center;
    column-gap: 10px;

    cursor: default;

    &-icon {
        transform: scale(-1, 1);

        path {
            stroke: none;
        }
    }

    &-block {
        display: grid;
        grid-template-columns: 40px 1fr;
        align-items: center;
        column-gap: 10px;

        &-avatar {
            width: 40px;
            height: 40px;

            border-radius: 100%;
        }

        &-information {
            line-height: 13px;

            &-name {
                color: var(--contrast);
                font-size: 14px;
            }

            &-date {
                display: flex;
                flex-direction: column;
                justify-content: center;

                color: #ffffff;
                font-size: 12px;
            }
        }
    }
}
</style>