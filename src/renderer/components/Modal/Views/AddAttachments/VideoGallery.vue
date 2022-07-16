<template>
    <div id="video-gallery">
        <Upload 
            v-if="search.query.length === 0"
            :uploading="uploading" 
            @choose="uploadVideo" 
        />

        <SingleInput 
            id="video-gallery-search" 
            placeholder="Поиск видеозаписей" 
            @input="search.query = $event"
        />

        <ToggleButton 
            text="Безопасный поиск" 
            :value="search.safe"
            @change="search.safe = !search.safe"
        />

        <div v-if="!load" id="video-gallery-loaded">
            <VideoResults 
                v-if="search.items.length > 0"
                id="video-gallery-search-results"
                ref="search"
                :items="search.items"
                label="Результаты поиска"
            />

            <VideoResults 
                v-else-if="items.length > 0"
                id="video-gallery-my"
                ref="my"
                :items="items"
                label="Мои видеозаписи"
            />
        </div>

        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { debounce } from "lodash";

import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        Upload: () => import("~/components/Modal/Views/AddAttachments/Components/Upload"),
        VideoResults: () => import("~/components/Modal/Views/AddAttachments/Components/Video/Results")
    },

    mixins: [ScrollMixin],

    data: () => ({
        load: true,
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
        ...mapState({
            client: state => state.vk.client,
            user: state => state.vk.user
        }),
        
        canScroll() {
            if (this.search.query > 0) {
                return this.search.items.length < this.search.count;
            }

            return this.items.length < this.count;
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
        this.search.debounce = debounce(async () => {
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
            upload: "vk/uploader/UPLOAD",
            addAttachment: "input/ADD_ATTACHMENT",

            setBusy: "modal/SET_BUSY",
            close: "modal/CLOSE"
        }),

        async fetch(offset = 0) {
            if (this.items.length === 0) {
                this.load = true;

                const list = await this.client.api.video.get({
                    owner_id: this.user.id,
                    offset: 0,
                    count: 100
                });

                this.items = this.formatItems(list.items);
                this.count = list.count;
                this.load = false;

                this.$nextTick(async () => {
                    const element = await this.awaitElement("my");
                    this.registerScroll(element.$refs.list, async () => {
                        if (this.loadMore) return false;

                        this.loadMore = true;
                        await this.fetch(this.items.length);
                        this.loadMore = false;
                    }, percent => percent > 80);
                });

                return this.items;
            }

            const list = await this.client.api.video.get({
                owner_id: this.user.id,
                offset,
                count: 100
            });

            this.items = [...this.items, ...this.formatItems(list.items)];
            return this.items;
        },

        async searchVideos() {
            if (this.search.items.length === 0) {
                this.load = true;

                const list = await this.client.api.video.search({
                    q: this.search.query,
                    offset: this.search.items.length,
                    adult: Number(!this.search.safe),
                    search_own: 1,
                    hd: 1,
                    count: 100
                });

                this.search.items = this.formatItems(list.items);
                this.search.count = list.count;
                this.load = false;

                this.$nextTick(async () => {
                    const element = await this.awaitElement("search");
                    this.registerScroll(element.$refs.list, async () => {
                        if (this.loadMore) return false;

                        this.loadMore = true;
                        await this.searchVideos(this.search.items.length);
                        this.loadMore = false;
                    }, percent => percent > 80);
                });

                return this.search.items;
            }

            const list = await this.client.api.video.search({
                q: this.search.query,
                offset: this.search.items.length,
                adult: Number(!this.search.safe),
                search_own: 1,
                hd: 1,
                count: 100
            });

            this.search.items = [...this.search.items, ...this.formatItems(list.items)];
            return this.search.items;
        },

        formatItems(items) {
            return items.map(item => {
                return {
                    type: "video",
                    video: item,
                    selected: false
                };
            });
        },

        async uploadVideo(file) {
            this.uploading = true;
            this.setBusy(true);

            const uploaded = await this.upload({
                type: "video",
                path: file
            });

            const video = await this.client.api.video.get({
                owner_id: uploaded.video.owner_id,
                videos: `${uploaded.video.owner_id}_${uploaded.video.video_id}`
            });

            this.addAttachment({
                type: "video",
                video: video.items[0]
            });

            this.setBusy(false);
            this.close();
        }
    }
};
</script>

<style lang="scss">
#video-gallery {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;

    &-search {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .upload {
        height: 120px;
    }
}
</style>