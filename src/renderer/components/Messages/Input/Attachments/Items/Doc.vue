<template>
    <div class="input-attachments-doc">
        <DocPreview :item="item" />
        <span
            class="input-attachments-doc nowrap"
            v-text="item.title"
        />

        <XIcon
            class="icon amadeus clickable"
            @click="$emit('remove')"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        XIcon: () => import("~icons/x.svg"),
        DocPreview: () => import("~/components/Modal/Views/AddAttachments/Components/Doc/Preview.vue")
    },

    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.input-attachments-doc {
    display: grid;
    grid-template-columns: max-content 1fr 30px;
    align-items: center;
    column-gap: 10px;

    width: 100%;

    .remove {
        justify-self: flex-end;
    }
}
</style>