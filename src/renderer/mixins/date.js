import DateDiff from "date-diff";

import common from "~/plugins/common";

export default {
    methods: {
        relativeDate(messageDate) {
            const date = new Date(messageDate * 1000);
            const diff = this.dateDiff({ date: messageDate });

            const yearsDiff = Math.floor(diff.years());
            if (yearsDiff > 0) {
                return `${common.formatTimeToDayAndMonth(date)}, ${date.getFullYear()} г.`;
            }

            const daysDiff = Math.floor(diff.days());
            switch (daysDiff) {
                case 0: {
                    return common.timestampFormat(date);
                }

                case 1: {
                    return `вчера, ${common.timestampFormat(date)}`;
                }
            }

            return `${common.formatTimeToDayAndMonth(date)}, ${common.timestampFormat(date)}`;
        },

        dateDiff(message) {
            return new DateDiff(new Date(), new Date(message.date * 1000));
        }
    }
};