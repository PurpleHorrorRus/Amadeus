<template>
    <div
        id="modal-view-add-attachments"
        class="modal-view"
        :class="addAttachmentsClass"
    >
        <Dropdown
            :selected="currentIndex"
            :options="categoriesNames"
            @change="changeCategory"
        />

        <Component :is="renderComponent" @select="select" />

        <div v-if="selected.length > 0" id="modal-view-add-attachments-buttons">
            <SolidButton :label="attachLabel" @click.native="attach" />
        </div>
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import Attachment from "~/instances/Messages/Attachment";

import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    data: () => ({
        categories: [],

        current: "photos" as string,
        selected: [] as Attachment[]
    }),

    computed: {
        addAttachmentsClass() {
            return {
                attach: this.selected.length > 0
            };
        },

        currentIndex() {
            return this.categories.findIndex(category => {
                return category.id === this.current;
            });
        },

        categoriesNames() {
            return this.categories.map(category => {
                return category.label;
            });
        },

        renderComponent() {
            switch (this.current) {
                case "photos": return () => import("~/components/Modal/Views/AddAttachments/PhotoGallery.vue");
                case "videos": return () => import("~/components/Modal/Views/AddAttachments/VideoGallery.vue");
                case "docs": return () => import("~/components/Modal/Views/AddAttachments/DocsGallery.vue");
            }

            return () => import("~/components/Modal/Views/AddAttachments/PhotoGallery.vue");
        },

        attachLabel() {
            return this.$i18n(this.$strings.CHAT.ADD_ATTACHMENT.ATTACH, "count", this.selected.length);
        }
    },

    created() {
        this.categories = [{
            id: "photos",
            label: this.$strings.CHAT.ADD_ATTACHMENT.CATEGORIES.PHOTO
        },

        {
            id: "videos",
            label: this.$strings.CHAT.ADD_ATTACHMENT.CATEGORIES.VIDEO
        },

        {
            id: "docs",
            label: this.$strings.CHAT.ADD_ATTACHMENT.CATEGORIES.DOCS
        }];

        this.current = this.modal.target || "photos";
    },

    methods: {
        ...mapActions({
            addAttachment: "input/ADD_ATTACHMENT",
            close: "modal/CLOSE"
        }),

        changeCategory(index: number) {
            this.current = this.categories[index].id;
            return true;
        },

        select(item) {
            item.selected = !item.selected;

            if (!item.selected) {
                const selectedIndex: number = this.selected.findIndex(selected => {
                    return selected.id === item.id;
                });

                return this.selected.splice(selectedIndex, 1);
            }

            return this.selected.push(item);
        },

        attach() {
            this.selected.map(selected => {
                return selected.attachment;
            }).forEach(attachment => {
                this.addAttachment(attachment);
            });

            this.close();
        }
    }
};
</script>

<style lang="scss">
#modal-view-add-attachments {
    display: grid !important;
    grid-template-rows: 40px auto;
    grid-template-areas: "switcher"
                        "container";
    row-gap: 10px !important;

    width: 80vw;

    overflow: hidden;

    &.attach {
        grid-template-rows: 40px auto 40px !important;
        grid-template-areas: "switcher"
                            "container"
                            "attach";
    }

    &-buttons {
        grid-area: attach;

        display: flex;
        justify-content: center;
        align-items: center;
        justify-self: flex-end;
        align-self: flex-end;

        height: 100%;
    }

    .toggle-button {
        width: 100%;
    }
}
</style>