<template>
    <div id="modal-view-add-attachments" class="modal-view">
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

<script>
import { mapActions } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin],

    data: () => ({
        categories: [{
            id: "photos",
            label: "Фотографии"
        },
        
        {
            id: "videos",
            label: "Видеозаписи"
        },
        
        {
            id: "docs",
            label: "Документы"
        }],

        current: "photos",
        selected: []
    }),

    computed: {
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
                case "photos": return () => import("~/components/Modal/Views/AddAttachments/PhotoGallery");
                case "videos": return () => import("~/components/Modal/Views/AddAttachments/VideoGallery");
                case "docs": return () => import("~/components/Modal/Views/AddAttachments/DocsGallery");
            }

            return () => import("~/components/Modal/Views/AddAttachments/PhotoGallery");
        },

        attachLabel() {
            return `Прикрепить ${this.selected.length} вложений`;
        }
    },

    created() {
        this.current = this.modal.target || "photos";
    },

    methods: {
        ...mapActions({
            setAttachments: "input/SET_ATTACHMENTS",
            close: "modal/CLOSE"
        }),

        changeCategory(index) {
            this.current = this.categories[index].id;
            return true;
        },

        select(item) {
            item.selected = !item.selected;

            if (!item.selected) {
                const selectedIndex = this.selected.findIndex(selected => {
                    return selected.id === item.id;
                });

                return this.selected.splice(selectedIndex, 1);
            }

            return this.selected.push(item);
        },

        attach() {
            this.setAttachments(this.selected);
            this.close();
        }
    }
};
</script>

<style lang="scss">
#modal-view-add-attachments {
    row-gap: 20px !important;

    width: 60vw;

    padding: 5px;

    &-buttons {
        justify-self: flex-end;
        align-self: flex-end;
    }

    .toggle-button {
        width: 100%;
    }
}
</style>