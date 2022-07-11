<template>
    <div id="chat-page-messages-list">
        <MessagesChunk
            v-for="(chunk, index) of chunks"
            :key="index" 
            :chunk="chunk"
        />

        <ContextMenu v-if="menu.show" :position="menu.position">
            <MessageMenu :message="menu.target" @click.native="closeMenu" />
        </ContextMenu>
    </div>
</template>

<script>
import MenuMixin from "~/mixins/menu";

export default {
    components: {
        MessagesChunk: () => import("~/components/Messages/Chunk"),
        MessageMenu: () => import("~/components/Menu/Views/Chat")
    },

    mixins: [MenuMixin],

    props: {
        messages: {
            type: Array,
            required: true
        }
    },

    computed: {
        chunks() {
            const chunks = [];
            let current = [];

            for (const message of this.messages) {
                if (current.length === 0) {
                    current.push(message);
                    continue;
                } 
                
                if (current[current.length - 1].from_id !== message.from_id) {
                    chunks.push(current);
                    current = [message];
                } else current.push(message);
            }

            if (current.length > 0) {
                chunks.push(current);
            }

            return chunks;
        }
    }
};
</script>

<style lang="scss">
#chat-page-messages-list {
    position: absolute;
    inset: 0px;

    display: flex;
    flex-direction: column;
    row-gap: 10px;

    width: 100%;
    height: 100%;

    padding: 10px;

    overflow-y: auto;
}
</style>