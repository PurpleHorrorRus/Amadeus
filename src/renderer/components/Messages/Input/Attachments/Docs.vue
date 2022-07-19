<template>
    <div id="input-attachments-docs">
        <AttachmentsDoc
            v-for="item of items"
            :key="item"
            :item="item"
        />
    </div>
</template>

<script>
export default {
    components: {
        AttachmentsDoc: () => import("~/components/Messages/Input/Attachments/Items/Doc.vue")
    },

    props: {
        items: {
            type: Array,
            required: true
        }
    }
};
</script>

<style lang="scss">
#input-attachments-docs {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    width: 100%;

    padding: 5px;
}
</style>