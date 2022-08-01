<template>
    <div id="video-gallery">
        <Upload
            v-if="search.query.length === 0"
            :uploading="uploading"
            :properties="videoUploadProperties"
            @choose="upload"
        />

        <SingleInput
            id="video-gallery-search"
            :placeholder="$strings.CHAT.ADD_ATTACHMENT.SEARCH.VIDEO"
            @input="search.query = $event"
        />

        <ToggleButton
            v-if="search.query.length > 0"
            :text="$strings.CHAT.ADD_ATTACHMENT.VIDEO.SAFE"
            :value="search.safe"
            @change="search.safe = !search.safe"
        />

        <div v-if="!load" id="video-gallery-loaded">
            <VideoResults
                v-if="search.items.length > 0"
                id="video-gallery-search-results"
                ref="search"
                :items="search.items"
                :label="$strings.CHAT.ADD_ATTACHMENT.VIDEO.RESULTS"
            />

            <VideoResults
                v-else-if="items.length > 0"
                id="video-gallery-my"
                ref="my"
                :items="items"
                :label="$strings.CHAT.ADD_ATTACHMENT.VIDEO.MY"
            />
        </div>

        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import lodash from "lodash";
import Promise from "bluebird";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

import Video from "~/instances/Messages/Attachments/Video";

const fields = {
    count: 100
};

const searchFields = {
    search_own: 1,
    hd: 1,
    count: 100
};

export default {
    components: {
        VideoResults: () => import("./Components/Video/Results.vue")
    },

    mixins: [CoreMixin, ScrollMixin],

    data: () => ({
        load: true,
        loadMore: false,
        uploading: false,

        items: [],
        count: 0,

        search: {
            query: "",
            safe: true,
            debounce: null,

            items: [],
            count: 0
        }
    }),

    computed: {
        canScroll() {
            if (this.search.query > 0) {
                return this.search.items.length < this.search.count;
            }

            return this.items.length < this.count;
        },

        videoUploadProperties() {
            return {
                properties: ["openFile", "multiSelections"],
                filters: [{
                    name: "AVI, MP4, 3GP, MPEG, MOV, MP3, FLV, WMV, MKV",
                    extensions: ["avi", "mp4", "3gp", "mpeg", "mov", "flv", "wmv", "mkv"]
                }]
            };
        }
    },

    watch: {
        "search.query": {
            handler: function() {
                this.search.debounce();
            }
        },

        "search.safe": {
            handler: function() {
                this.search.debounce();
            }
        }
    },

    async created() {
        this.search.debounce = lodash.debounce(async () => {
            this.search.items = [];
            this.search.count = 0;

            if (this.search.query.length >= 3) {
                return await this.searchVideos();
            }
        }, 1000);

        return await this.fetch(0);
    },

    methods: {
        ...mapActions({
            uploadVideo: "vk/uploader/UPLOAD_VIDEO",
            addAttachment: "input/ADD_ATTACHMENT",

            setBusy: "modal/SET_BUSY",
            close: "modal/CLOSE"
        }),

        async fetch() {
            const list = await this.client.api.video.get({
                owner_id: this.user.id,
                offset: 0,
                ...fields
            });

            this.items = this.formatItems(list.items);
            this.count = list.count;
            this.load = false;

            const element = await this.awaitElement("my");
            this.registerScroll(element.$refs.list, async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;

                const more = await this.fetchMore();
                this.items = [
                    ...this.items,
                    ...this.formatItems(more.items)
                ];

                this.loadMore = false;
            }, percent => percent > 80);
        },

        async fetchMore() {
            return await this.client.api.video.get({
                owner_id: this.user.id,
                offset: this.items.length,
                ...searchFields
            });
        },

        async searchVideos() {
            this.load = true;

            const list = await this.client.api.video.search({
                q: this.search.query,
                offset: 0,
                adult: Number(!this.search.safe),
                ...searchFields
            });

            this.search.items = this.formatItems(list.items);
            this.search.count = list.count;
            this.load = false;

            const element = await this.awaitElement("search");
            this.registerScroll(element.$refs.list, async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;

                const more = await this.searchMore();
                this.search.items = [
                    ...this.search.items,
                    ...this.formatItems(more.items)
                ];

                this.loadMore = false;
            }, percent => percent > 80);
        },

        async searchMore() {
            return await this.client.api.video.search({
                q: this.search.query,
                offset: this.search.items.length,
                adult: Number(!this.search.safe),
                ...fields
            });
        },

        formatItems(items) {
            return items.map(item => {
                return {
                    selected: false,
                    attachment: new Video(item)
                };
            });
        },

        async upload(files: string[]) {
            this.uploading = true;
            this.setBusy(true);

            await Promise.each(files, async file => {
                return await this.uploadVideo(file);
            });

            this.setBusy(false);
            this.close();
        }
    }
};
</script>

<style lang="scss">
#video-gallery {
    grid-area: container;

    display: grid;
    grid-template-rows: 80px 40px 1fr;
    grid-template-areas: "upload"
                        "search"
                        "gallery";
    align-items: center;
    row-gap: 10px;

    overflow: hidden;

    &-search {
        grid-area: search;

        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    &-loaded {
        grid-area: gallery;

        height: 100%;

        overflow-y: hidden;
    }
}
</style>