<template>
    <div class="attachments-item attachments-item-wall">
        <WallRepost 
            v-if="loaded" 
            :repost="repost" 
        />

        <LoaderIcon 
            v-else 
            class="icon loader-icon spin" 
        />

        <span 
            v-if="item.wall.text"
            class="attachments-item-wall-text" 
            v-text="item.wall.text" 
        />

        <MessageAttachments
            v-if="attachments.length > 0"
            :attachments="attachments"
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        WallRepost: () => import("~/components/Messages/Attachments/Wall/Repost.vue"),
        MessageAttachments: () => import("~/components/Messages/Attachments")
    },

    mixins: [CoreMixin, AttachmentMixin],

    data: () => ({
        loaded: false,
        attachments: [],
        repost: null
    }),

    async created() {
        this.attachments = this.item.wall.copy_history?.length > 0
            ? [{ 
                wall: this.item.wall.copy_history[0],
                type: "wall"
            }] : this.item.wall.attachments || [];

        if (this.item.wall.from_id < 0) {
            const [group] = await this.client.api.groups.getById({
                group_id: Math.abs(this.item.wall.from_id),
                fields: "photo_100",
                extended: 1
            });
            
            this.repost = group;
            this.repost.type = "group";
        }  else {
            const [user] = await this.client.api.users.get({
                user_ids: this.item.wall.from_id,
                fields: "photo_100",
                extended: 1
            });
            
            user.name = `${user.first_name} ${user.last_name}`;
            this.repost = user;
            this.repost.type = "user";
        }

        this.repost.date = this.item.wall.date;
        this.loaded = true;
    }
};
</script>

<style lang="scss">
.attachments-item-wall {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    .attachments-item-wall {
        margin-left: 1vw;
    }

    &-text {
        font-size: 12px;
        font-weight: 400;

        white-space: pre-line;
        user-select: text;

        cursor: text;
    }
}
</style>