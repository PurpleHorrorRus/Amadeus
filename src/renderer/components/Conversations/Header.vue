<template>
    <div id="conversations-header">
        <SingleInput 
            placeholder="Поиск" 
            @input="search = $event" 
        />

        <DotsHorizontal 
            class="icon vkgram clickable" 
            @click="openMenu(null, $event, false)" 
        />

        <ContextMenu v-if="menu.show" :position="menu.position">
            <ContextMenuItem label="Важные сообщения" @click.native="openImportant" />
            <ContextMenuItem label="Настройки" />
            <ContextMenuItem label="О приложении" />
        </ContextMenu>
    </div>
</template>

<script>
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        DotsHorizontal: () => import("~/assets/icons/dots-horizontal.svg")
    },

    mixins: [MenuMixin],

    data: () => ({
        search: ""
    }),

    methods: {
        openImportant() {
            return this.$router.replace("/important").catch(() => {});
        }
    }
};
</script>

<style lang="scss">
#conversations-header {
    display: grid;
    grid-template-columns: 1fr 30px;
    align-items: center;
    column-gap: 10px;

    padding: 5px;

    .single-input {
        height: 30px;

        font-size: 12px;
    }
}
</style>