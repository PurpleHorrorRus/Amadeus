<template>
    <div id="photo-gallery">
        <LoaderIcon v-if="load" class="icon loader-icon spin" />

        <div v-else-if="current.id === -1" id="photo-gallery-albums">
            <PhotoAlbum 
                v-for="album of albums.items"
                :key="album.id"
                :album="album"
                @click.native="changeAlbum(album)"
            />
        </div>

        <div v-else-if="data.length > 0" id="photo-gallery-items">
            <span id="photo-gallery-items-title" v-text="current.title" />

            <div id="photo-gallery-items-list" ref="list">
                <SelectableItem 
                    v-for="item of data"
                    :key="item.photo.id"
                    :component="PhotoComponent"
                    :item="item"
                    @select="$emit('select', item)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

import PhotoComponent from "~/components/Messages/Attachments/Gallery/Photo";

import ScrollMixin from "~/mixins/scroll";

const ids = {
    "-6": "profile",
    "-7": "wall",
    "-8": "saved"
};

export default {
    components: {
        PhotoAlbum: () => import("~/components/Modal/Views/AddAttachments/Components/Photo/Album"),
        SelectableItem: () => import("~/components/Modal/Views/AddAttachments/Components/Item")
    },

    mixins: [ScrollMixin],

    data: () => ({
        PhotoComponent,

        current: {
            id: -1
        },

        load: true,
        loadMore: false,
        albums: [],

        data: [],
        count: 0
    }),

    computed: {
        ...mapState({
            client: state => state.vk.client,
            user: state => state.vk.user.id
        }),

        canScroll() {
            return this.data.length < this.count;
        }
    },

    async created() {
        this.albums = await this.client.api.photos.getAlbums({
            owner_id: this.user.id,
            need_system: 1,
            need_covers: 1
        });

        this.load = false;
    },

    methods: {
        async fetch(album) {
            const list = await this.client.api.photos.get({
                owner_id: album.owner_id,
                album_id: ids[album.id] || album.id,
                offset: this.data.length,
                count: 100,
                rev: 1
            });

            if (!this.count) {
                this.count = list.count;
            }
            
            return list.items.map(item => {
                return {
                    type: "photo",
                    photo: item,
                    selected: false
                };
            });
        },

        async changeAlbum(album) {
            this.load = true;
            this.data = await this.fetch(album);
            this.current = album;
            this.load = false;

            this.$nextTick(() => {
                if (this.data.length > 0) {
                    this.registerScroll(this.$refs.list, async () => {
                        if (this.loadMore) return false;
                        this.loadMore = true;
                        this.data = [...this.data, ...await this.fetch(this.current)];
                        this.loadMore = false;
                    }, percent => percent > 80);
                }
            });

            return true;
        }
    }
};
</script>

<style lang="scss">
#photo-gallery {
    &-albums {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    &-items {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        max-height: 70vh;

        &-title {
            margin: 5px 15px;

            font-size: 12px;
        }

        &-list {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;

            overflow-x: hidden;
            overflow-y: auto;
        }
    }
}
</style>