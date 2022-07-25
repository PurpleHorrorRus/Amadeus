<template>
    <div class="attachments-item-playlist-main-information nowrap">
        <span
            class="attachments-item-playlist-main-information-title nowrap"
            v-text="item.title"
        />

        <div class="attachments-item-playlist-main-information-meta nowrap">
            <span
                class="attachments-item-playlist-main-information-meta-listens small-text nowrap"
                v-text="listensText"
            />

            <span
                class="attachments-item-playlist-main-information-meta-followers small-text nowrap"
                v-text="followersText"
            />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },

    computed: {
        listensText() {
            return `${this.item.listens} прослушиваний`;
        },

        followersText() {
            return `${this.item.followers} фолловеров`;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-playlist-main-information {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    &-title {
        font-size: 18px;
        font-weight: bold;
    }

    &-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 5px;

        &-followers {
            &::before {
                content: "•";
                margin: 0px 5px 0px 0px;
            }
        }
    }
}
</style>