<template>
    <div class="attachments-item-repost">
        <Component :is="icon" class="icon attachments-item-repost-icon" />

        <div v-if="loaded" class="attachments-item-repost-block">
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

        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script>
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import DateMixin from "~/mixins/date";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

import RepostIcon from "~/assets/icons/repost.svg";

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
        profile: {},
        date: new Date(),
        loaded: false
    }),

    async created() {
        this.profile = await this.getProfile(this.item.from_id);
        this.date = this.relativeDate(this.item.date);
        this.loaded = true;
    },

    methods: {
        ...mapActions({
            getProfile: "vk/GET_PROFILE"
        })
    }
};
</script>

<style lang="scss">
.attachments-item-repost {
    display: grid;
    grid-template-columns: 22px 1fr;
    align-items: center;
    column-gap: 5px;

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
        column-gap: 5px;

        &-avatar {
            width: 40px;
            height: 40px;

            border-radius: 100%;
        }

        &-information {
            line-height: 13px;

            &-name {
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