import { ghostcallInitcode } from "./generated/initcode.ts";

export type Hex = `0x${string}`;

export type GhostcallCall = {
	to: Hex;
	data: Hex;
};

export type GhostcallResult = {
	success: boolean;
	returnData: Hex;
};

const addressHexLength = 40;
const encodedHeaderHexLength = 4;
const maxCalldataSize = 0xffff;
const successFlagMask = 0x8000;
const returnDataLengthMask = 0x7fff;

export function encodeCalls(calls: readonly GhostcallCall[]): Hex {
	const encodedParts = [ghostcallInitcode.slice(2)];

	for (const [index, call] of calls.entries()) {
		assertAddress(call.to, `calls[${index}].to`);
		const calldata = assertHex(call.data, `calls[${index}].data`);
		const calldataSize = byteLength(calldata);

		if (calldataSize > maxCalldataSize) {
			throw new RangeError(
				`calls[${index}].data exceeds the ${maxCalldataSize}-byte calldata limit`,
			);
		}

		encodedParts.push(call.to.slice(2));
		encodedParts.push(calldataSize.toString(16).padStart(4, "0"));
		encodedParts.push(calldata.slice(2));
	}

	return `0x${encodedParts.join("")}` as Hex;
}

export function decodeResults(data: Hex): GhostcallResult[] {
	const normalizedData = assertHex(data, "data");

	if (normalizedData === "0x") {
		return [];
	}

	const results: GhostcallResult[] = [];
	const encodedData = normalizedData.slice(2);
	let cursor = 0;

	while (cursor < encodedData.length) {
		if (cursor + encodedHeaderHexLength > encodedData.length) {
			throw new TypeError("Truncated Ghostcall response header");
		}

		const header = Number.parseInt(
			encodedData.slice(cursor, cursor + encodedHeaderHexLength),
			16,
		);
		const success = (header & successFlagMask) !== 0;
		const returnDataSize = header & returnDataLengthMask;
		const nextCursor = cursor + encodedHeaderHexLength;
		const returnDataEnd = nextCursor + returnDataSize * 2;

		if (returnDataEnd > encodedData.length) {
			throw new TypeError("Truncated Ghostcall response body");
		}

		results.push({
			success,
			returnData: `0x${encodedData.slice(nextCursor, returnDataEnd)}` as Hex,
		});

		cursor = returnDataEnd;
	}

	return results;
}

function assertAddress(value: unknown, label: string): asserts value is Hex {
	const normalizedValue = assertHex(value, label);
	if (normalizedValue.length !== addressHexLength + 2) {
		throw new TypeError(`${label} must be a 20-byte hex string`);
	}
}

function assertHex(value: unknown, label: string): Hex {
	if (typeof value !== "string") {
		throw new TypeError(`${label} must be a hex string`);
	}

	if (!value.startsWith("0x")) {
		throw new TypeError(`${label} must start with 0x`);
	}

	const rawValue = value.slice(2);
	if (rawValue.length % 2 !== 0) {
		throw new TypeError(`${label} must have an even number of hex characters`);
	}

	if (!/^[0-9a-fA-F]*$/.test(rawValue)) {
		throw new TypeError(`${label} must contain only hexadecimal characters`);
	}

	return value as Hex;
}

function byteLength(value: Hex): number {
	return (value.length - 2) / 2;
}
