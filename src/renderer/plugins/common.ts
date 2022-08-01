// eslint-disable-next-line max-len
const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

class Common {
    static formatTimeToDayAndMonth(time: Date, months: string[]): string {
        const day = time.getDate();
        const month = months[time.getMonth()];
        return `${day} ${month}`;
    }

    static formatDuration(time: number) {
        if (time === null) {
            return null;
        }

        return {
            hours: ~~(time / 3600),
            mins: ~~((time % 3600) / 60),
            seconds: ~~time % 60
        };
    }

    static fancyTimeFormat(time?: number): string {
        if (!time) {
            return "0:00";
        }

        let ret = "";
        const { hours, mins, seconds } = Common.formatDuration(time);
        if (hours) ret += `${hours}:${mins < 10 ? "0" : ""}`;
        return ret + `${mins}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    static timestampFormat(time?: Date): string {
        if (!time) {
            return "00:00";
        }

        let hours: number | string = time.getHours();
        if (hours < 10) hours = `0${hours}`;

        let mins: number | string = time.getMinutes();
        if (mins < 10) mins = `0${mins}`;

        return `${hours}:${mins}`;
    }

    static getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static wait(timeout): Promise<any> {
        return new Promise(resolve => {
            return setTimeout(resolve, timeout);
        });
    }

    static async repeat(handler: () => void, timeout: number): Promise<void> {
        const interval = setInterval(handler, 0);
        await Common.wait(timeout);
        clearInterval(interval);
    }

    static arrayMove(arr: any[], oldIndex: number, newIndex: number): any[] {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) arr.push(undefined);
        }

        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    }

    static checkLinks(text: string) {
        return Array.from(
            text.matchAll(linkRegex),
            ([_, match]) => match
        );
    }
}

export default Common;