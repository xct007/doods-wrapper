import axios from "axios";
import { Agent } from "https";

const Instance = axios.create({});

Instance.interceptors.response.use((response) => {
	if (response.status !== 200) {
		return { error: true, data: response.data };
	}
	return { error: false, data: response.data };
});

Instance.interceptors.request.use((config) => {
	config.headers["Referer"] = config.url;
	config.headers["User-Agent"] = "okhttp/4.9.0";
	config.httpsAgent = new Agent({
		keepAlive: true,
	});
	return config;
});

export default Instance;
