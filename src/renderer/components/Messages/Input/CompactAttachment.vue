<template>
    <div class="compact-attachment nowrap">
        <span
            v-if="!hideName"
            class="compact-attachment-name nowrap"
            v-text="profile.name"
        />

        <span
            v-if="text"
            class="compact-attachment-text nowrap"
            v-text="text"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import ProfileMixin from "~/mixins/profile";

export default {
    mixins: [ProfileMixin],

    props: {
        message: {
            type: Object,
            required: true
        },

        hideName: {
            type: Boolean,
            required: false,
            default: false
        },

        text: {
            type: String,
            required: false,
            default: "compact-attachment-text"
        }
    },

    data: () => ({
        profile: null
    }),

    computed: {
        ...mapState({
            current: (state: any) => state.vk.messages.current,
            user: (state: any) => state.vk.user
        })
    },

    created() {
        if (this.current?.isChat) {
            this.profile = this.current.users.find(user => {
                return user.id === this.message.from_id;
            });

            return this.profile;
        }

        this.profile = this.message.from_id !== this.user.id
            ? this.current
            : this.user;
    }
};
</script>

<style lang="scss">
.message.out {
    .compact-attachment {
        border-left: 4px solid var(--contrast);
    }
}

.compact-attachment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    padding: 5px 10px;

    border-left: 4px solid var(--secondary);

    cursor: pointer;

    &-attachments, &-name, &-text {
        color: var(--contrast);
    }

    &-attachments, &-text {
        font-size: 12px;
    }
}
</style>