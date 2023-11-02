export function log(msg: String, values: unknown) {
	console.log(msg)
	console.log("---")
	console.log(values)
	console.log("---\n")
}

export function fmtArr(arr: readonly ({})[]) {
	return arr.map(a => Object.values(a).join(" - ")).join("\n")
}

export function timeAsString(d: Date) {
	return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0")
}

export function msSinceMidnight(date: Date) {
	const midnight = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		0, 0, 0)
	return date.getTime() - midnight.getTime();
}

export function msSinceMidnightToDate(ms: number): Date {
	const d = new Date()
	d.setHours(Math.floor(ms / 1000 / 60 / 60))
	d.setMinutes(Math.floor((ms / 1000 / 60) % 60))
	d.setSeconds(Math.floor((ms / 1000) % 60))
	return d
}

export function msSinceMidnightToTime(ms: number): string {
	return [
		Math.floor(ms / 1000 / 60 / 60).toString().padStart(2, "0"),
		Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0")
	].join(":")
}