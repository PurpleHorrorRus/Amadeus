<template>
    <SuggestBlock id="suggests-mention">
        <MentionUser
            v-for="user of users"
            :key="user.id"
            :user="user"
            @click.native="mention(user)"
        />
    </SuggestBlock>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import ChatUser from "~/instances/Conversations/ChatUser";

export default {
    components: {
        SuggestBlock: () => import("./Block.vue"),
        MentionUser: () => import("./Mention/User.vue")
    },

    props: {
        users: {
            type: Array,
            required: true
        }
    },

    computed: {
        ...mapState({
            message: (state: any) => state.input.message
        })
    },

    methods: {
        ...mapActions({
            setMessage: "input/SET_MESSAGE"
        }),

        mention(user: ChatUser) {
            const substringMention = this.message.substring(0, this.message.length - 1);
            this.setMessage(substringMention + `[id${user.id}|@${user.screen_name}]`);
        }
    }
};
</script>

<style lang="scss">
#suggests-mention {
    display: flex;
    flex-direction: column;
    row-gap: 5px;

    width: 100%;

    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 3px;
    }

    .sticker {
        flex: none;
    }
}
</style>