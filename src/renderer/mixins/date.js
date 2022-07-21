import DateDiff from "date-diff";

import common from "~/plugins/common";

export default {
    methods: {
        relativeDate(messageDate) {
            const date = new Date(messageDate * 1000);
            const diff = this.dateDiff({ date: messageDate });

            const yearsDiff = Math.floor(diff.years());
            if (yearsDiff > 0) {
                return this.$i18n(this.$strings.RELATIVE_DATE.YEARS, ["dateMonthDay", "dateYear"], [
                    common.formatTimeToDayAndMonth(date, this.$strings.RELATIVE_DATE.MONTHS),
                    date.getFullYear()
                ]);
            }

            const daysDiff = Math.floor(diff.days());
            switch (daysDiff) {
                case 0: {
                    return common.timestampFormat(date);
                }

                case 1: {
                    return this.$i18n(this.$strings.RELATIVE_DATE.YESTERDAY, "dateTime", common.timestampFormat(date));
                }
            }

            return this.$i18n(this.$strings.RELATIVE_DATE.DAYS, ["dateMonthDay", "dateTime"], [
                common.formatTimeToDayAndMonth(date, this.$strings.RELATIVE_DATE.MONTHS),
                common.timestampFormat(date)
            ]);
        },

        dateDiff(message) {
            return new DateDiff(new Date(), new Date(message.date * 1000));
        }
    }
};