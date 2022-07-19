<template>
    <div id="docs-gallery">
        <div id="docs-gallery-search">
            <SingleInput 
                placeholder="Поиск документов" 
                @input="search.query = $event"
            />
        </div>

        <div v-if="!load" id="docs-gallery-list" ref="list">
            <div v-if="search.query" id="docs-gallery-list-search">
                <InlineDoc 
                    v-for="item of search.items"
                    :key="item.id"
                    :item="item"
                    @click.native="attach(item)"
                />
            </div>

            <div v-else id="docs-gallery-list-my">
                <InlineDoc 
                    v-for="item of items"
                    :key="item.id"
                    :item="item"
                    @click.native="attach(item)"
                />
            </div>
        </div>

        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import lodash from "lodash";

import { DocsDoc } from "vk-io/lib/api/schemas/objects";
import { DocsGetParams } from "vk-io/lib/api/schemas/params";
import { DocsGetResponse, DocsSearchResponse } from "vk-io/lib/api/schemas/responses";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

import Doc from "~/instances/Messages/Attachments/Doc";
import AttachmentGenerator from "~/instances/Messages/Attachments/Generator";

const fields: DocsGetParams = {
    count: 100
};

export default {
    components: {
        InlineDoc: () => import("./Components/Doc/Inline.vue")
    },

    mixins: [CoreMixin, ScrollMixin],

    data: () => ({
        load: true as boolean,
        
        items: [] as Doc[],
        count: 0 as number,

        search: {
            query: "" as string,
            items: [] as Doc[],
            count: 0 as number,
            debounce: null
        }
    }),

    computed: {
        canScroll() {
            if (this.search.query) {
                return this.search.items.length < this.search.count;
            }

            return this.items.length < this.count;
        }
    },

    watch: {
        "search.query": {
            handler(query) {
                if (!this.load) {
                    this.load = true;
                    this.search.items = [];
                    this.search.count = 0;
                }
                
                query.length > 0
                    ? this.search.debounce()
                    : this.fetch();
            }
        }
    },

    async created() {
        this.search.debounce = lodash.debounce(() => this.searchDocs(), 400);
        await this.fetch();
    },

    methods: {
        ...mapActions({
            addAttachment: "input/ADD_ATTACHMENT",
            close: "modal/CLOSE"
        }),

        async fetch() {
            const docs: DocsGetResponse = await this.client.api.docs.get({
                owner_id: this.user.id,
                ...fields
            });

            this.items = this.formatResults(docs.items);
            this.count = docs.count;

            this.load = false;

            this.registerScroll("list", async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;
                await this.fetchMore();
                this.loadMore = false;
            }, percent => percent > 80);
        },

        async fetchMore() {
            const docs: DocsGetResponse = await this.client.api.docs.get({
                owner_id: this.user.id,
                offset: this.items.length,
                ...fields
            });

            this.items = [...this.items, ...this.formatResults(docs.items)];
        },

        async searchDocs() {
            const docs: DocsSearchResponse = await this.client.api.docs.search({
                q: this.search.query,
                search_own: 1,
                ...fields
            });

            this.search.items = this.formatResults(docs.items);
            this.search.count = docs.count;
            this.load = false;

            this.registerScroll("list", async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;
                await this.searchMore();
                this.loadMore = false;
            }, percent => percent > 80);
        },

        async searchMore() {
            const docs: DocsSearchResponse = await this.client.api.docs.search({
                q: this.search.query,
                offset: this.search.items.length,
                search_own: 1,
                ...fields
            });

            this.search.items = [...this.search.items, ...this.formatResults(docs.items)];
        },

        formatResults(items: DocsDoc[]) {
            return items.map(doc => {
                return AttachmentGenerator.generate({
                    type: "doc",
                    doc
                });
            });
        },

        attach(item: Doc) {
            this.addAttachment(item);
            this.close();
        }
    }
};
</script>

<style lang="scss">
#docs-gallery {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px 1fr;
    grid-template-areas: "search"
                        "list";
    row-gap: 20px;

    &-search {
        grid-area: search;
    }

    &-list {
        grid-area: list;

        display: flex;
        row-gap: 10px;
        flex-wrap: wrap;

        height: 70vh;

        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>