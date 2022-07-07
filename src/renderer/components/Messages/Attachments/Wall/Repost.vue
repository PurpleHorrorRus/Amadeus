<template>
    <div class="attachments-item-repost">
        <Component 
            :is="icon" 
            class="icon attachments-item-repost-icon" 
        />
        <div v-if="loaded" class="attachments-item-repost-block">
            <img :src="profile.photo_100" class="attachments-item-repost-block-avatar">

            <div class="attachments-item-repost-block-information nowrap">
                <span 
                    class="attachments-item-repost-block-information-name nowrap clickable" 
                    @click="open"
                    v-text="profile.name"
                />

                <span 
                    class="attachments-item-repost-block-information-date" 
                    v-text="profile.date" 
                />
            </div>
        </div>

        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script>
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
        loaded: false
    }),

    async created() {
        if (this.item.from_id < 0) {
            const data = await this.client.api.groups.getById({
                group_id: Math.abs(this.item.from_id),
                fields: "photo_100",
                extended: 1
            });

            this.profile = data.groups?.[0] || data[0];
            this.profile.type = "group";
        }  else {
            const data = await this.client.api.users.get({
                user_ids: this.item.from_id,
                fields: "photo_100",
                extended: 1
            });

            const user = data.profiles?.[0] || data[0];
            user.name = `${user.first_name} ${user.last_name}`;
            this.profile = user;
            this.profile.type = "user";
        }

        this.profile.date = this.relativeDate(this.item.date * 1000);
        this.loaded = true;
    },

    methods: {
        open() {
            const url = this.profile.type === "user"
                ? `https://vk.com/id${this.profile.id}` 
                : `https://vk.com/public${this.profile.id}`;

            return this.openExternal(url);
        }
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