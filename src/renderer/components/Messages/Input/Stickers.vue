<template>
    <div id="stickers">
        <EmojiIcon 
            class="icon vkgram clickable" 
            @click="openMenu($event, null, true)" 
        />

        <transition name="fade">
            <ContextMenu 
                v-if="menu.show" 
                id="stickers-menu"
                :menu="menu"
            >
                <StickersBlock />
            </ContextMenu>
        </transition>
    </div>
</template>

<script lang="ts">
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        EmojiIcon: () => import("~icons/emoji.svg"),
        StickersBlock: () => import("~/components/Messages/Stickers/Block.vue")
    },

    mixins: [MenuMixin],

    methods: {
        setMenuItems() {
            this.menu.items = [];
        }
    }
};
</script>

<style lang="scss">
#stickers {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;

    &-menu {
        position: absolute;
        left: unset !important; 
        top: unset !important;

        bottom: 70px !important;
        right: 5px !important;

        height: 40vh;
    }

    .icon {
        width: 24px;
    }
}
</style>