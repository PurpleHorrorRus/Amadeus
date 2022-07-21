<template>
    <div id="messages-header-main-profile-information-online">
        <span 
            id="messages-header-main-profile-information-online-text" 
            class="small-text"
            v-text="lastSeenText" 
        />

        <PhoneIcon v-if="onlineMobile" class="icon" />
    </div>
</template>

<script>
import DateMixin from "~/mixins/date";

export default {
    components: {
        PhoneIcon: () => import("~icons/phone.svg")
    },

    mixins: [DateMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        lastSeenText: ""
    }),

    computed: {
        onlineMobile() {
            if (this.conversation.isChat) {
                return false;
            }

            return this.conversation.profile.online_mobile 
                || this.conversation.profile.last_seen?.platform < 6;
        }
    },

    watch: {
        "profile.users": {
            deep: true,

            handler: function() { 
                this.updateLastSeen(); 
            }
        },

        "profile.online": {
            deep: true,

            handler: function() { 
                this.updateLastSeen(); 
            }
        }
    },

    created() {
        this.updateLastSeen();
    },

    methods: {
        updateLastSeen() {
            if (this.conversation.isChat) {
                // eslint-disable-next-line max-len
                this.lastSeenText = this.$i18n(this.$strings.CHAT.STATUS.MEMBERS, "count", this.conversation.users.length);
            } else if (!this.conversation.profile.last_seen) {
                this.lastSeenText = this.$strings.CHAT.STATUS.UNDEFINED;
                return;
            } else if (this.conversation.profile.online) {
                this.lastSeenText = this.$strings.CHAT.STATUS.ONLINE;
                return;
            } else {
                this.lastSeenText = this.$i18n(
                    this.$strings.CHAT.STATUS.RELATIVE, 
                    "relativeDate", 
                    this.relativeDate(this.conversation.profile.last_seen.time)
                );
            }

            return this.lastSeenText;
        }
    }
};
</script>

<style lang="scss">
#messages-header-main-profile-information-online {
    display: flex;
    align-items: flex-start;
    column-gap: 2px;

    .icon {
        width: 13px;

        fill: var(--small-text);
        stroke: none;
    }
}
</style>