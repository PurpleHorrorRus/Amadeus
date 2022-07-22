<template>
    <div id="message-page-input-edit">
        <span 
            id="message-page-input-edit-label"
            class="small-text"
            v-text="$strings.CHAT.EDITING" 
        />

        <XIcon class="icon clickable" @click="clearEdit" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

export default {
    components: {
        XIcon: () => import("~icons/x.svg")
    },

    methods: {
        ...mapActions({
            clearEdit: "input/CLEAR_EDIT"
        })
    }
};
</script>

<style lang="scss">
#message-page-input-edit {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    .icon {
        width: 14px;

        stroke: var(--small-text);
    }
}
</style>