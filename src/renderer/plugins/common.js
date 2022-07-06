const monthsShort = [
    "января", "февраля", 
    "марта", "апреля", "мая", 
    "июня", "июля", "августа", 
    "сентября", "октября", "ноября", 
    "декабря"
];

class Common {
    static formatTimeToDayAndMonth(time) {
        const day = time.getDate();
        const month = monthsShort[time.getMonth()];
        return `${day} ${month}`;
    }

    static formatDuration(time) {
        if (time === null) {
            return null;
        }

        return {
            hours: ~~(time / 3600),
            mins: ~~((time % 3600) / 60),
            seconds: ~~time % 60
        };
    }

    static fancyTimeFormat(time) {
        if (!time) {
            return "0:00";
        }

        let ret = "";
        const { hours, mins, seconds } = Common.formatDuration(time);
        if (hours) ret += `${hours}:${mins < 10 ? "0" : ""}`;
        return ret + `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    static timestampFormat(time) {
        if (!time) {
            return "00:00";
        }

        let hours = time.getHours();
        if (hours < 10) hours = `0${hours}`;

        let mins = time.getMinutes();
        if (mins < 10) mins = `0${mins}`;

        return `${hours}:${mins}`;
    }

    static getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static wait(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));    
    }

    static arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) arr.push(undefined);
        }

        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    }
}

export default Common;