export default function getFormattedTime(time: number): string {
    const sec = parseInt(`${time % 60}`);
    const min = parseInt(`${(time - sec) / 60}`);
    const sec_str = sec < 10 ? `0${sec}` : `${sec}`;
    const min_str = min < 10 ? `0${min}` : min;
    return `${min_str}:${sec_str}`
}