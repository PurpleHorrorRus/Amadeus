<template>
    <div id="modal-view-update" class="modal-view">
        <span id="modal-view-update-name" v-text="updater.name" />
        <span id="modal-view-update-notes" v-html="updater.notes" />

        <div id="modal-view-update-buttons">
            <SolidButton
                v-if="!updater.active"
                label="Обновить"
                @click.stop.native="update"
            />

            <span
                v-else
                id="modal-view-update-buttons-progress"
                v-text="progressText"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            updater: (state: any) => state.updater
        }),

        progressText() {
            return `${this.updater.progress}%`;
        }
    },

    methods: {
        ...mapActions({
            update: "updater/INSTALL"
        })
    }
};
</script>

<style lang="scss">
#modal-view-update {
    display: grid !important;
    grid-template-rows: 40px 1fr 20px;
    grid-template-columns: 1fr;

    &-name {
        font-size: 18px;
        font-weight: bold;
    }

    &-notes {
        padding: 10px;

        border: 1px solid var(--primary);
        border-radius: 8px;
        background: var(--backdrop);

        font-size: 12px;
        user-select: text;

        h1,
        h2,
        h3,
        h4 {
            margin-top: 5px;
        }

        p,
        ul {
            margin-bottom: 10px;
        }

        li {
            margin-left: -15px;
        }
    }

    &-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        height: 100%;

        .solid-button {
            background: none;
        }

        &-progress {
            font-size: 11px;
        }
    }
}
</style>