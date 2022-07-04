const monthsShort = [
    "января", "февраля", 
    "марта", "апреля", "мая", 
    "июня", "июля", "августа", 
    "сентября", "октября", "ноября", 
    "декабря"];

class Common {
    static formatTimeToDayAndMonth(time) {
        const day = time.getDate();
        const month = monthsShort[time.getMonth()];
        return `${day} ${month}`;
    }

    static fancyTimeFormat(time) {
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
    
    static arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) arr.push(undefined);
        }

        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    }

    static wait(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));    
    }
}

export default Common;