function zeroPad(n: number) {
    return n.toString().padStart(2, '0')
}

export function formatTime(milliseconds: number) {
    const seconds = zeroPad(Math.floor(milliseconds / 1000) % 60);
    const minutes = zeroPad(Math.floor(milliseconds / 1000 / 60));

    return `${minutes}:${seconds}`;
}