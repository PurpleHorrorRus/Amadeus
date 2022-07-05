<template>
    <div id="messages-header-profile-information-online">
        <span 
            id="messages-header-profile-information-online-text" 
            class="small-text"
            v-text="lastSeenText" 
        />

        <PhoneIcon 
            v-if="onlineMobile" 
            class="icon" 
        />
    </div>
</template>

<script>
import common from "~/plugins/common";

export default {
    components: {
        PhoneIcon: () => import("~/assets/icons/phone.svg")
    },

    props: {
        profile: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        lastSeenText: ""
    }),

    computed: {
        onlineMobile() {
            return this.profile.online_mobile || this.profile.last_seen.platform < 6;
        }
    },

    watch: {
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
            if (!this.profile.last_seen) {
                this.lastSeenText = "";
                return false;
            }

            if (this.profile.online) {
                this.lastSeenText = "в сети";
                return true;
            }

            const date = new Date(this.profile.last_seen.time * 1000);
            const now = new Date();

            const yearsDiff = now.getFullYear() - date.getFullYear();
            if (yearsDiff > 0) {
                this.lastSeenText = `был в сети ${common.formatTimeToDayAndMonth(date)} ${date.getFullYear()} г.`;
                return true;
            }
            
            const dateDiff = date.getTime() - now.getTime();
            const daysDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));
            switch(daysDiff) {
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
#messages-header-profile-information-online {
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