<template>
    <div class="inline-doc">
        <InlineDocPreview :item="item" />

        <div class="inline-doc-information nowrap">
            <span class="inline-doc-information-title nowrap" v-text="item.title" />
            <div class="inline-doc-information-meta">
                <span class="inline-doc-information-meta-size" v-text="size" />
                <span class="inline-doc-information-meta-date" v-text="relativeDate(item.date)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";
import DateMixin from "~/mixins/date";

export default {
    components: {
        InlineDocPreview: () => import("./Preview.vue")
    },

    mixins: [DocMixin, DateMixin]
};
</script>

<style lang="scss">
.inline-doc {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 10px;

    width: 100%;

    padding: 5px 0px 5px 5px;

    border-bottom: 1px solid var(--border);

    cursor: pointer;

    &-information {
        display: flex;
        flex-direction: column;
        row-gap: 5px;

        &-title {
            color: var(--secondary);
        }

        &-meta {
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
                color: var(--small-text);
                font-size: 12px;
            }

            &-date {
                &::before {
                    content: "•";
                    margin: 0px 5px;
                }
            }
        }
    }
}
</style>