<template>
    <div id="stickers">
        <EmojiIcon 
            class="icon amadeus clickable" 
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
#default-layout {
    &:not(.extended) #stickers-menu {
        width: 80vw;
    }

    &.extended #stickers-menu {
        width: 50vw;
    }
}

#stickers {
    display: flex;
    justify-content: center;

    height: 100%;

    &-menu {
        position: absolute;
        left: unset !important; 
        top: unset !important;

        bottom: 70px !important;
        right: 5px !important;

        height: 50vh;
    }

    .icon {
        width: 24px;
    }
}
</style>