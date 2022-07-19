<template>
    <div id="input-attachments-docs">
        <AttachmentsDoc
            v-for="(item, index) of items"
            :key="item"
            :item="item"
            @remove="removeAttachment(index)"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    components: {
        AttachmentsDoc: () => import("~/components/Messages/Input/Attachments/Items/Doc.vue")
    },

    props: {
        items: {
            type: Array,
            required: true
        }
    },

    methods: {
        ...mapActions({
            removeAttachment: "input/REMOVE_ATTACHMENT"
        })
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