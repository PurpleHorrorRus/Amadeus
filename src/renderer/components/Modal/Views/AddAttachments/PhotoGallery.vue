<template>
    <div id="photo-gallery">
        <Upload 
            :uploading="uploading"
            :properties="uploadProperties"
            @choose="uploadPhoto" 
        />

        <LoaderIcon 
            v-if="load" 
            class="icon loader-icon spin" 
        />

        <PhotoAlbums
            v-else-if="current.id === -1" 
            :items="albums.items"
        />

        <PhotoItems 
            v-else-if="data.length > 0"
            :items="data" 
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import Promise from "bluebird";

import { PhotosPhoto, PhotosPhotoAlbum } from "vk-io/lib/api/schemas/objects";

import Photo from "~/instances/Messages/Attachments/Photo";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

const ids = {
    "-6": "profile",
    "-7": "wall",
    "-8": "saved"
};

export default {
    components: {
        PhotoAlbums: () => import("~/components/Modal/Views/AddAttachments/Components/Photo/Albums.vue"),
        PhotoItems: () => import("~/components/Modal/Views/AddAttachments/Components/Photo/Items.vue")
    },

    mixins: [CoreMixin, ScrollMixin],

    data: () => ({
        current: {
            id: -1
        },

        load: true as boolean,
        loadMore: false as boolean,
        albums: [] as PhotosPhotoAlbum[],

        uploading: false as boolean,

        data: [] as PhotosPhoto[],
        count: 0 as number
    }),

    computed: {
        uploadProperties() {
            return {
                properties: ["openFile", "multiSelections"],
                filters: [{
                    name: ".jpg, .jpeg, .png",
                    extensions: ["jpg", "jpeg", "png"]
                }]
            };
        },

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
        ...mapActions({
            addPhotoPath: "input/ADD_PHOTO_PATH",
            close: "modal/CLOSE"
        }),

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
                    attachment: new Photo(item),
                    selected: false
                };
            });
        },

        async changeAlbum(album) {
            this.data = [];

            this.load = true;
            this.data = await this.fetch(album);
            this.current = album;
            this.load = false;

            this.registerScroll("list", async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;

                const more = await this.fetch(this.current);
                this.data = [...this.data, ...more];

                this.loadMore = false;
            }, percent => percent > 80);

            return true;
        },

        async uploadPhoto(files: string[]) {
            this.uploading = true;

            await Promise.each(files, async file => {
                return await this.addPhotoPath({
                    file,
                    temp: false
                });
            });

            this.close();
        }
    }
};
</script>

<style lang="scss">
#photo-gallery {
    display: grid;
    grid-template-rows: 80px 1fr;
    row-gap: 10px;
}
</style>