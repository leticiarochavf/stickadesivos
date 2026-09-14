import type { JsonObject } from "@tiendanube/nube-sdk-types";

export const MESSAGE_SOURCE = "stick-adesivos";

export type CartItemCommand = {
	product_id: number;
	variant_id: number;
	quantity: number;
	properties?: Record<string, string | number | boolean>;
};

export type StorefrontCommand =
	| { source: typeof MESSAGE_SOURCE; type: "cart:add"; item: CartItemCommand }
	| {
			source: typeof MESSAGE_SOURCE;
			type: "cart:remove";
			item: CartItemCommand;
	  }
	| { source: typeof MESSAGE_SOURCE; type: "cart:open" };

const isPositiveInteger = (value: unknown): value is number =>
	typeof value === "number" && Number.isSafeInteger(value) && value > 0;

function parseProperties(
	value: unknown,
): Record<string, string | number | boolean> | undefined {
	if (value === undefined) return undefined;
	if (!value || typeof value !== "object" || Array.isArray(value))
		return undefined;

	const entries = Object.entries(value).filter(
		(entry): entry is [string, string | number | boolean] =>
			entry[0].length > 0 &&
			["string", "number", "boolean"].includes(typeof entry[1]),
	);
	return Object.fromEntries(entries);
}

function parseItem(value: unknown): CartItemCommand | null {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const item = value as Record<string, unknown>;
	if (
		!isPositiveInteger(item.product_id) ||
		!isPositiveInteger(item.variant_id) ||
		!isPositiveInteger(item.quantity)
	) {
		return null;
	}

	return {
		product_id: item.product_id,
		variant_id: item.variant_id,
		quantity: item.quantity,
		...(item.properties === undefined
			? {}
			: { properties: parseProperties(item.properties) ?? {} }),
	};
}

export function parseStorefrontCommand(
	value: JsonObject,
): StorefrontCommand | null {
	if (value.source !== MESSAGE_SOURCE || typeof value.type !== "string")
		return null;
	if (value.type === "cart:open") {
		return { source: MESSAGE_SOURCE, type: "cart:open" };
	}
	if (value.type !== "cart:add" && value.type !== "cart:remove") return null;

	const item = parseItem(value.item);
	if (!item) return null;
	return { source: MESSAGE_SOURCE, type: value.type, item };
}
