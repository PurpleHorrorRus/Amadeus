<template>
    <div class="attachments-item-wall-repost">
        <RepostIcon class="icon attachments-item-wall-repost-icon" />

        <img :src="repost.photo_100" class="attachments-item-wall-repost-avatar">

        <div class="attachments-item-wall-repost-information nowrap">
            <span 
                class="attachments-item-wall-repost-information-name nowrap clickable" 
                @click="open"
                v-text="repost.name"
            />

            <span 
                class="attachments-item-wall-repost-information-date" 
                v-text="relativeDate(repost.date * 1000)" 
            />
        </div>
    </div>
</template>

<script>
import { shell } from "electron";

import DateMixin from "~/mixins/date";

export default {
    components: {
        RepostIcon: () => import("~/assets/icons/repost.svg")
    },

    mixins: [DateMixin],

    props: {
        repost: {
            type: Object,
            required: true
        }
    },

    methods: {
        open() {
            const url = this.repost.type === "user"
                ? `https://vk.com/id${this.repost.id}` 
                : `https://vk.com/public${this.repost.id}`;

            return shell.openExternal(url);
        }
    }
};
</script>

<style lang="scss">
.attachments-item-wall-repost {
    display: grid;
    grid-template-columns: 22px 40px 1fr;
    align-items: center;
    column-gap: 5px;

    cursor: default;

    &-icon {
        transform: scale(-1, 1);

        path {
            stroke: none;
        }
    }

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
</style>