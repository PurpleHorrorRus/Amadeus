<template>
    <div class="attachments-item-doc-file" @click.stop="openExternal(item.url)">
        <DocPreview :item="item" />

        <div class="attachments-item-doc-file-information nowrap">
            <span class="attachments-item-doc-file-information-title nowrap" v-text="item.title" />
            <div class="attachments-item-doc-file-information-meta">
                <span class="attachments-item-doc-file-information-meta-size" v-text="size" />
            </div>
        </div>
    </div>
</template>

<script>
import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";

export default {
    components: {
        DocPreview: () => import("~/components/Modal/Views/AddAttachments/Components/Doc/Preview.vue")
    },

    mixins: [DocMixin]
};
</script>

<style lang="scss">
.attachments-item-doc-file {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    column-gap: 10px;

    &-information {
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-title {
            font-size: 14px;
        }

        &-meta {
            span {
                font-size: 11px;
            }
        }
    }
}
</style>