<template>
    <div class="attachments-item-doc-gif-playing">
        <nuxt-img
            :src="item.url"
            class="attachments-item-doc-gif-playing-image"
        />

        <div v-if="canAdd" class="attachments-item-doc-gif-playing-add" @click.stop="add">
            <AddIcon v-if="!item.added" class="icon amadeus" />
            <CheckIcon v-else class="icon amadeus" />
        </div>
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";

export default {
    components: {
        AddIcon: () => import("~icons/add.svg"),
        CheckIcon: () => import("~icons/check.svg")
    },

    mixins: [CoreMixin],

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    computed: {
        canAdd() {
            return this.item.owner_id !== this.user.id;
        }
    },

    methods: {
        async add() {
            if (!this.added) {
                const gif = await this.client.api.docs.add({
                    access_key: this.item.access_key,
                    doc_id: this.item.id,
                    owner_id: this.item.owner_id
                });

                return this.item.add(gif);
            }

            await this.client.api.docs.delete({
                doc_id: this.addedGif,
                owner_id: this.user.id
            });

            return this.item.remove();
        }
    }
};
</script>

<style lang="scss">
.attachments-item-doc-gif-playing {
    position: relative;

    width: 100%;

    &-image {
        width: 100%;

        border-radius: 8px;
    }

    &-add {
        position: absolute;
        top: 3px; right: 3px;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 20px;
        height: 20px;

        background-color: var(--secondary);
        border-radius: 4px;

        .icon {
            width: 16px;
        }
    }
}
</style>