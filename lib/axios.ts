import axios from 'axios';
import { API_BASE_URL } from '@/constants/env';

export const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			error.response?.status === 401 &&
			window.location.pathname !== '/login'
		) {
			// El interceptor vive fuera de React: no hay router que usar.
			// eslint-disable-next-line @next/next/no-location-assign-relative-destination
			window.location.assign('/login');
		}

		return Promise.reject(error);
	},
);
