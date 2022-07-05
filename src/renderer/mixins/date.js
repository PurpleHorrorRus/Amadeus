import DateDiff from "date-diff";

import common from "~/plugins/common";

export default {
    methods: {
        relativeDate(date) {
            date = new Date(date);
            const now = new Date();
            const diff = new DateDiff(now, date);

            const yearsDiff = Math.floor(diff.years());
            if (yearsDiff > 0) {
                return `${common.formatTimeToDayAndMonth(date)}, ${date.getFullYear()} г.`;
            }

            const daysDiff = Math.floor(diff.days());
            switch(daysDiff) {
                case 0: {
                    return common.timestampFormat(date);
                }

                case 1: {
                    return `вчера, ${common.timestampFormat(date)}`;
                }
            }

            return `${common.formatTimeToDayAndMonth(date)}, ${common.timestampFormat(date)}`;
        }
    }
};