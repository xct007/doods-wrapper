import cheerio from "cheerio";

import { URL } from "url";

export function get_iframe_url(html) {
	const $ = cheerio.load(html);
	const iframe = $("#os_player iframe");
	const src = iframe.attr("src");
	return src;
}

export function get_base_url(url) {
	const { origin } = new URL(url);
	return origin;
}
function random_str() {
	let a = "";
	const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const n = t.length;
	for (let o = 0; o < 10; o++) {
		a += t.charAt(Math.floor(Math.random() * n));
	}
	a += t.charAt(Math.floor(Math.random() * n));
	return a;
}

export function get_token(html) {
	const $ = cheerio.load(html);
	const scripts = $("script");
	for (let i = 0; i < scripts.length; i++) {
		const script = scripts[i];
		const text = $(script).html();
		if (text.includes("data:text/vtt;base64")) {
			const expiry = Date.now();
			const hash = text.split("hash=")[1].split("&")[0];
			const token = text.split("token=")[1].split("&")[0];
			return {
				path: join_url_parts("pass_md5", hash, token),
				expiry,
				token,
				char: random_str(),
			};
		}
	}
}
export function join_url_parts(...parts) {
	return parts.join("/");
}
