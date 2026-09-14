import { getScriptParam } from "@tiendanube/nube-sdk-helper";
import { Iframe, Text } from "@tiendanube/nube-sdk-jsx";
import type {
	Cart,
	JsonObject,
	NubeComponent,
	NubeSDK,
	SecurityURL,
} from "@tiendanube/nube-sdk-types";
import { MESSAGE_SOURCE, parseStorefrontCommand } from "./messages";

const IFRAME_ID = "stick-adesivos-storefront";
const DEFAULT_FRONTEND_URL =
	"https://stickadesivos.vercel.app";

function getFrontendURL(): SecurityURL | null {
	const configuredURL = getScriptParam("frontend_url") || DEFAULT_FRONTEND_URL;

	try {
		const url = new URL(configuredURL);
		if (url.protocol !== "https:") return null;
		return url.toString() as SecurityURL;
	} catch {
		return null;
	}
}

function publicCart(cart: Cart): JsonObject {
	return {
		items: cart.items.map((item) => ({
			product_id: item.product_id,
			variant_id: item.variant_id,
			quantity: item.quantity,
		})),
	};
}

export function App(nube: NubeSDK) {
	const frontendURL = getFrontendURL();
	if (!frontendURL) {
		nube.render(
			"before_main_content",
			<Text color="#5f6570">
				Integração Stick Adesivos aguardando a URL HTTPS do frontend.
			</Text>,
		);
		return;
	}

	const browser = nube.getBrowserAPIs();
	const reply = (target: NubeComponent, message: JsonObject) =>
		browser.postMessageToIframe(target, message);

	const frame: NubeComponent = (
		<Iframe
			id={IFRAME_ID}
			src={frontendURL}
			width="100%"
			height={900}
			autoresize
			style={{ width: "100%" }}
			onMessage={({ value }) => {
				if (!value) return;
				if (value.type === "resize") return;
				const command = parseStorefrontCommand(value);
				if (!command) {
					reply(frame, {
						source: MESSAGE_SOURCE,
						type: "cart:error",
						message: "Mensagem inválida.",
					});
					return;
				}

				if (command.type === "cart:open") {
					nube.send("cart:open");
					return;
				}

				nube.send(command.type, () => ({ cart: { items: [command.item] } }));
			}}
		/>
	);

	nube.render("before_main_content", frame);
	nube.on("cart:update", ({ cart }) => {
		reply(frame, {
			source: MESSAGE_SOURCE,
			type: "cart:update",
			cart: publicCart(cart),
		});
	});
	nube.on("cart:add:fail", () => {
		reply(frame, {
			source: MESSAGE_SOURCE,
			type: "cart:error",
			message: "Não foi possível adicionar o produto.",
		});
	});
	nube.on("cart:remove:fail", () => {
		reply(frame, {
			source: MESSAGE_SOURCE,
			type: "cart:error",
			message: "Não foi possível atualizar o carrinho.",
		});
	});
}
