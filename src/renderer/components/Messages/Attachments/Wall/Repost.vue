<template>
    <div class="attachments-item-wall-repost">
        <RepostIcon class="icon attachments-item-wall-repost-icon" />
        <img :src="repost.photo_100" class="attachments-item-wall-repost-avatar">
        <span 
            class="attachments-item-wall-repost-name nowrap clickable" 
            @click="open" 
            v-text="repost.name"
        />
    </div>
</template>

<script>
import { shell } from "electron";

export default {
    components: {
        RepostIcon: () => import("~/assets/icons/repost.svg")
    },

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
    display: flex;
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
        width: 20px;
        height: 20px;

        border-radius: 100%;
    }

    &-name {
        font-size: 14px;
        font-weight: 400;
    }
}
</style>