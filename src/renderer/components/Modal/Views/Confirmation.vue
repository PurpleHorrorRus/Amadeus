<template>
    <div id="modal-view-confirmation" class="modal-view">
        <span id="modal-view-confirmation-text" v-text="modal.confirmation.text" />

        <div v-if="modal.confirmation.options.length > 0" id="modal-view-confirmation-options">
            <Checkbox 
                v-for="option of modal.confirmation.options"
                :key="option.id"
                class="checkbox"
                :label="option.text"
                @switch="option.checked = $event"
            />
        </div>
        
        <div id="modal-view-confirmation-buttons">
            <SolidButton label="Отмена" @click.native="close" />
            <SolidButton label="Подтвердить" @click.native="modal.confirmation.accept" />
        </div>
    </div>
</template>

<script lang="ts">
import ModalMixin from "~/mixins/modal";

export default {
    mixins: [ModalMixin]
};
</script>

<style lang="scss">
#modal-view-confirmation {
    row-gap: 20px !important;

    padding: 10px;

    &-text {
        font-size: 14px;
    }

    &-buttons {
        display: flex;
        align-items: center;
        align-self: flex-end;
        column-gap: 5px;

        .solid-button {
            background: none;

            transition: background .1s ease;

            &:hover {
                background: var(--item-hover);
            }
        }
    }
}
</style>