import { readFile } from "fs/promises";
import { ok as assert } from "assert/strict";

type RawData = {
	Messages: {
		Id: number,
		TimeStamp: string,
		Sender: string,
		SenderType: 1 | 2,
		Subject: string
	}[],
	Status: number
};

export type Message = {
	id: number,
	date: Date,
	sender: string,
	subject: string
}

export type ProcessedData = {
	messages: Message[],
	messagesBySender: [string, Message[]][]
	messagesBySenderUnfiltered: [string, Message[]][]
}

export async function getData(): Promise<ProcessedData> {
	const file = await readFile("data.json")
	const rawData: RawData = JSON.parse(file.toString())
	assert(rawData.Status === 200)

	const messages: Message[] = rawData.Messages.filter(m => m.SenderType === 1 && m.Sender.match(/\((...)\)/)?.length === 2).map(m => ({
		id: m.Id,
		date: new Date(m.TimeStamp),
		sender: m.Sender.match(/\((...)\)/)![1],
		subject: m.Subject
	}))

	const messagesBySenderUnfilteredMap: Record<string, Message[]> = Object.create(null);
	for (const m of messages) {
		messagesBySenderUnfilteredMap[m.sender] =
			[...(messagesBySenderUnfilteredMap[m.sender] ?? []), m]
	}

	const messagesBySenderUnfiltered = Object.entries(messagesBySenderUnfilteredMap)

	const messagesBySender = messagesBySenderUnfiltered
		.filter(([sender, messages]) => messages.length >= 10)

	return {
		messages,
		messagesBySender,
		messagesBySenderUnfiltered
	}
}
