import { Message, getData } from "./preprocess.js"
import { fmtArr, log, msSinceMidnight, msSinceMidnightToTime } from "./util.js";

const data = await getData();

{
	const bsMessageCounts = data.messagesBySenderUnfiltered
		.map(([s, m]) => [s, m.length] as const)
		.sort(([k1, v1], [k2, v2]) => v2 - v1);
	log("Messages sent:", fmtArr(bsMessageCounts.slice(0, 10)))

	const bsAverageTimes = averageProperty(m => msSinceMidnight(m.date))
		.map(([s, avg]) => [s, msSinceMidnightToTime(avg)] as const)
	log("Average time:", fmtArr(bsAverageTimes))

	const bsAverageLengths = averageProperty(m => m.subject.length)
		.map(([s, avg]) => [s, "X".repeat(avg)] as const)
	log("Average title length:", fmtArr(bsAverageLengths))

	const bsAverageExclamations = averageProperty(m => m.subject.split("!").length - 1)
		.map(([k, v]) => [k, v.toFixed(2)] as const)
	log("Average ! per title:", fmtArr(bsAverageExclamations))

	const bsAverageQuestions = averageProperty(m => m.subject.split("?").length - 1)
		.map(([k, v]) => [k, v.toFixed(2)] as const)
	log("Average ? per title:", fmtArr(bsAverageQuestions))

	const bsAverageCapslock = averageProperty(m => {
		const nCaps = (m.subject.match(/[A-ZÅÄÖ]/g) || []).length
		const nLower = (m.subject.match(/[a-zåäö]/g) || []).length
		const share = nCaps / (nLower + nCaps)
		return share > 0.7 ? 1 : 0
	})
		.map(([k, v]) => [k, Math.floor(v * 100) + "%"] as const)
	log("Messages with the title being 70% caps:", fmtArr(bsAverageCapslock))

	//

	const topEarliest = data.messages
		.sort((m1, m2) => msSinceMidnight(m1.date) - msSinceMidnight(m2.date))
		.slice(0, 3)
		.map(m => ({
			time: msSinceMidnightToTime(msSinceMidnight(m.date)),
			sender: m.sender, subject: m.subject,
		}))
	log("Top earliest", fmtArr(topEarliest))

	const topLatest = data.messages
		.sort((m1, m2) => msSinceMidnight(m2.date) - msSinceMidnight(m1.date))
		.slice(0, 3)
		.map(m => ({
			time: msSinceMidnightToTime(msSinceMidnight(m.date)),
			sender: m.sender, subject: m.subject,
		}))
	log("Top latest", fmtArr(topLatest))

	const topShortest = data.messages
		.sort((m1, m2) => m1.subject.length - m2.subject.length)
		.slice(0, 10)
		.map(m => ({
			time: msSinceMidnightToTime(msSinceMidnight(m.date)),
			sender: m.sender, subject: m.subject,
		}))
	log("Top shortest", fmtArr(topShortest))

	const topLongest = data.messages
		.sort((m1, m2) => m2.subject.length - m1.subject.length)
		.slice(0, 5)
		.map(m => ({
			time: msSinceMidnightToTime(msSinceMidnight(m.date)),
			sender: m.sender, subject: m.subject,
		}))
	log("Top longest", fmtArr(topLongest))
}


function averageProperty(fun: (m: Message) => number) {
	return data.messagesBySender
		.map(([sender, msgs]) => {
			const arr = msgs.map(fun)
			const sum = arr.reduce((a, b) => a + b, 0)
			const avg = sum / arr.length
			return [sender, avg] as const
		})
		.sort(([k1, v1], [k2, v2]) => v2 - v1)
}
