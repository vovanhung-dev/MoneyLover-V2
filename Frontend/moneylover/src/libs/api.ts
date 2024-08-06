import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import {delToken, getRefreshToken, getToken} from "../utils/jwt.ts";
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";

const baseURL = `${import.meta.env.VITE_URL_SERVER}`;
const instance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use(
	async function (
		config: InternalAxiosRequestConfig<any>
	): Promise<InternalAxiosRequestConfig<any>> {
		const token = getToken();

		const refreshToken = getRefreshToken();
		if (token) {
			const result = jwtDecode(token);
			const isExpired = dayjs.unix(result?.exp ?? 0).diff(dayjs()) < 1;
			if (!isExpired) {
				config.headers["Authorization"] = "Bearer " + token;
				return config;
			}

			axios
				.post(`${baseURL}auth/refreshToken`, {
					refreshToken: refreshToken,
				})
				.then((res) => {
					config.headers["Authorization"] =
						"Bearer " + res?.data?.data?.refresh_token;
				})
				.catch((err) => {
					if (err.response.status === 401 || err.response.status === 403) {
						delToken();
						window.location.href = "/login";
					}
				});
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	function (response) {
		const {data} = response;
		return data;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		const {response} = error;
		return Promise.reject(response?.data);
	}
);

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
	const conf = config;
	return new Promise((resolve, reject) => {
		instance
			.request<any, AxiosResponse<any>>(conf)
			.then((res: AxiosResponse<any>) => {
				resolve(res as T);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export function get<T = any>(config: AxiosRequestConfig): Promise<T> {
	return request({...config, method: "GET"});
}

export function post<T = any>(config: AxiosRequestConfig): Promise<T> {
	return request({...config, method: "POST"});
}

export function patch<T = any>(config: AxiosRequestConfig): Promise<T> {
	return request({...config, method: "PATCH"});
}

export function put<T = any>(config: AxiosRequestConfig): Promise<T> {
	return request({...config, method: "put"});
}

export function del<T = any>(config: AxiosRequestConfig): Promise<T> {
	return request({...config, method: "delete"});
}

export default instance;
