<template>
    <div id="profile-attachments">
        <Dropdown
            :options="typeNames"
            :selected="0"
            @change="update"
        />

        <div v-if="!loading" id="profile-attachments-list">
            <ProfileAttachment
                v-for="(item, index) of attachments"
                :key="index"
                :item="item"
                :index="index"
            />
        </div>

        <LoaderIcon
            v-else
            class="icon loader-icon spin"
        />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

import AttachmentGenerator from "~/instances/Messages/Attachments/Generator";

export default {
    components: {
        ProfileAttachment: () => import("~/components/Messages/Profile/Attachments/Attachment.vue")
    },

    mixins: [CoreMixin, ScrollMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        loading: true,
        loadMore: false,

        type: {},

        types: [],

        attachments: [],
        nextFrom: ""
    }),

    computed: {
        typeNames() {
            return this.types.map(type => type.title);
        },

        canScroll() {
            return !this.loadMore
                && this.nextFrom;
        }
    },

    created() {
        this.types = [
            {
                id: "photo",
                title: this.$strings.CHAT.PROFILE.ATTACHMENTS.IMAGES
            },

            {
                id: "video",
                title: this.$strings.CHAT.PROFILE.ATTACHMENTS.VIDEO
            },

            {
                id: "doc",
                title: this.$strings.CHAT.PROFILE.ATTACHMENTS.DOCS
            }
        ];

        this.update(0);
    },

    methods: {
        async fetch() {
            const attachments = await this.client.api.messages.getHistoryAttachments({
                peer_id: this.conversation.id,
                media_type: this.type.id,
                count: 100,
                start_from: this.nextFrom
            });

            this.nextFrom = attachments.next_from;

            const attachmentsList = attachments.items.map(item => {
                return item.attachment;
            });

            return AttachmentGenerator.generateList(attachmentsList);
        },

        async update(index) {
            this.loading = true;
            this.type = this.types[index];
            this.nextFrom = "";

            this.attachments = await this.fetch();

            this.registerScroll(this.$parent.$el, async () => {
                this.loadMore = true;
                const more = await this.fetch();
                this.attachments = this.attachments.concat(more);
                this.loadMore = false;
            }, percent => percent >= 80);

            this.loading = false;
        }
    }
};
</script>

<style lang="scss">
#profile-attachments {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1vh;

        overflow: hidden;
    }

    .loader-icon {
        align-self: center;
    }
}

</style>