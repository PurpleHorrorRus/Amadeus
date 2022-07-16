<template>
    <div id="docs-gallery">
        <div id="docs-gallery-list">
            <SelectableItem 
                v-for="item of items"
                :key="item.id"
                :component="DocComponent"
                :item="item"
                @select="$emit('select', item)"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

import DocComponent from "~/components/Modal/Views/AddAttachments/Components/Doc/Component";

export default {
    data: () => ({
        DocComponent,

        items: [],
        count: 0,

        search: {
            items: [],
            count: 0
        }
    }),

    computed: {
        ...mapState({
            client: state => state.vk.client
        })
    },

    methods: {

    }
};
</script>

<style lang="scss">

</style>