import { describe, expect, it } from "vitest";
import { parseStorefrontCommand } from "./messages";

describe("parseStorefrontCommand", () => {
	it("accepts a valid cart:add message", () => {
		expect(
			parseStorefrontCommand({
				source: "stick-adesivos",
				type: "cart:add",
				item: {
					product_id: 10,
					variant_id: 20,
					quantity: 2,
					properties: { Tamanho: "5x5 cm" },
				},
			}),
		).toEqual({
			source: "stick-adesivos",
			type: "cart:add",
			item: {
				product_id: 10,
				variant_id: 20,
				quantity: 2,
				properties: { Tamanho: "5x5 cm" },
			},
		});
	});

	it("rejects unknown sources and invalid identifiers", () => {
		expect(
			parseStorefrontCommand({
				source: "outro-site",
				type: "cart:add",
				item: { product_id: 10, variant_id: 20, quantity: 1 },
			}),
		).toBeNull();
		expect(
			parseStorefrontCommand({
				source: "stick-adesivos",
				type: "cart:add",
				item: { product_id: 0, variant_id: 20, quantity: 1 },
			}),
		).toBeNull();
	});
});
