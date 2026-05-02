export const IS_PROD = import.meta.env.PROD;

export const SERVER = IS_PROD
	? import.meta.env.VITE_API_URL
	: "http://localhost:8080";
