<template>
    <div 
        :id="contact.id"
        v-tooltip="contact.tooltip" 
        class="modal-window-about-view-contacts-item"
        @click="open"
    >
        <Component :is="contact.icon" class="icon amadeus" />
        <span id="modal-window-about-view-contact-vk-label" v-text="contact.label" />
    </div>
</template>

<script>
import { shell } from "electron";

export default {
    props: {
        contact: {
            type: Object,
            required: true
        }
    },

    methods: {
        open() {
            shell.openExternal(this.contact.url);
        }
    }
};
</script>

<style lang="scss">
.modal-window-about-view-contacts-item {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 5px;

    span {
        transition: color .1s ease-in-out;
    }
}
</style>