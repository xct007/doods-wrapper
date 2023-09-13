/**
 * @name Doods
 * @description Doodstream API for NodeJS
 * @version 1.0.0
 * @license MIT
 */

import Instance from "./utils.js";
import { get_iframe_url, get_token, get_base_url } from "./parser.js";

/**
 * @name doods
 * @description Fetches the url and returns the stream
 * @param {string} url The url to fetch
 * @param {object} opts The options to pass to axios
 * @returns {Promise<{ error?: boolean, message?: string, url?: string, meta?: { token: string, expiry: number, char: string }, download?: () => Promise<AxiosResponse<any>> }>}
 * @example
 * import Doods from "module-name";
 * import fs from "fs";
 *
 * Doods("https://doods.pro/d/3jauj7g67kga", {
 *    responseType: "stream",
 * }).then((res) => {
 *    if (res.error) {
 *       console.log(res.message);
 *   } else {
 *      res.download().then((data) => {
 *          data.data.pipe(fs.createWriteStream("test.mp4"));
 *      });
 *   }
 * });
 */
export default async function doods(url, opts = {}) {
	return fetch_url(url, opts).catch((err) => {
		return {
			error: true,
			message: err,
		};
	});
}

async function fetch_url(url, opts = {}) {
	const { data, error } = await Instance.get(url);
	if (error) {
		throw new Error("Error fetching url");
	}
	const iframe_url = get_iframe_url(data);
	if (!iframe_url) {
		const base_url = get_base_url(url).endsWith("/")
			? get_base_url(url)
			: get_base_url(url) + "/";
		const { path, token, expiry, char } = get_token(data);
		const _url = await pass_hash(base_url + path, { Referer: url });
		if (!_url) {
			throw new Error("Error fetching url");
		}
		return {
			url: _url,
			meta: {
				token,
				expiry,
				char,
			},
			download: () =>
				download(_url + char + "?" + new URLSearchParams({ token, expiry }), opts),
		};
	}
	const base_url = get_base_url(url);
	return doods(base_url + iframe_url, { ...opts });
}

async function pass_hash(url, opts = {}) {
	const { data, error } = await Instance.get(url, opts);
	if (error) {
		throw new Error("Error fetching url");
	}
	return data;
}

async function download(url, opts = {}) {
	return Instance.get(url, {
		...opts,
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/89.0.4389.90 Safari/537.36",
			Referer: "https://doodstream.com/",
		},
	});
}
