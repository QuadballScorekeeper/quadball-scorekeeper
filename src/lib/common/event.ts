export type Event<
	EventType extends string = string,
	EventData extends Record<string, unknown> = Record<string, unknown>
> = {
	type: EventType;
	data: EventData;
	created: Date;
};

export type Command<
	CommandType extends string = string,
	CommandData extends Record<string, unknown> = Record<string, unknown>
> = {
	type: CommandType;
	data: CommandData;
};
