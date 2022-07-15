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

import common from "~/plugins/common";

export default {
    components: {
        PhoneIcon: () => import("~/assets/icons/phone.svg")
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
                this.lastSeenText = `${this.conversation.users.length} участников`;
                return false;
            }

            if (!this.conversation.profile.last_seen) {
                this.lastSeenText = "был в сети давно";
                return false;
            }

            if (this.conversation.profile.online) {
                this.lastSeenText = "онлайн";
                return true;
            }

            const date = new Date(this.conversation.profile.last_seen.time * 1000);
            const diff = this.dateDiff({ date: this.conversation.profile.last_seen.time });

            if (Math.floor(diff.years()) > 0) {
                this.lastSeenText = `был в сети ${common.formatTimeToDayAndMonth(date)} ${date.getFullYear()} г.`;
                return true;
            }

            switch (Math.round(diff.days())) {
                case 0: {
                    this.lastSeenText = `был в сети в ${common.timestampFormat(date)}`;
                    return true;
                }

                case 1: {
                    this.lastSeenText = `был в сети вчера в ${common.timestampFormat(date)}`;
                    return true;
                }
            }

            this.lastSeenText = `был в сети ${common.formatTimeToDayAndMonth(date)} ${common.timestampFormat(date)}`;
            return true;
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