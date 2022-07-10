<template>
    <div id="message-page-input-edit">
        <span 
            id="message-page-input-edit-label"
            class="small-text"
            v-text="'Редактирование сообщения'" 
        />

        <XIcon class="icon clickable" @click="clearEdit" />
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    components: {
        XIcon: () => import("~/assets/icons/x.svg")
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

    .icon {
        width: 14px;

        stroke: var(--small-text);
    }
}
</style>