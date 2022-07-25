import Vue from "vue";

export default (_context, inject) => {
    const i18n = (string: string, find?: string | string[], replace?: string | string[]): string => {
        if (find && replace) {
            if (Array.isArray(find)) {
                find.forEach((part, index) => {
                    const toReplace: string = Array.isArray(replace) ? replace[index] : replace;
                    string = string.replaceAll(`{{ ${part} }}`, toReplace);
                });
            } else {
                const toReplace: string = Array.isArray(replace) ? replace[0] : replace;
                string = string.replaceAll(`{{ ${find} }}`, toReplace);
            }
        }

        return string;
    };

    const strings = Vue.observable({});
    inject("strings", strings);
    inject("i18n", i18n);
};