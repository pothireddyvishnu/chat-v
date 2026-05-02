import { createContext, useEffect, useState } from "react";
import { SERVER } from "./environment";

export const AuthContext = createContext(null);

const API = `${SERVER}/api/auth`;

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMe();
	}, []);

	const fetchMe = async () => {
		try {
			const res = await fetch(`${API}/me`, { credentials: "include" });
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (err) {
			console.error(err);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	const signup = async ({ name, email, password }) => {
		const res = await fetch(`${API}/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ name, email, password }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || "Signup failed");
		setUser(data.user);
		return data.user;
	};

	const login = async ({ email, password }) => {
		const res = await fetch(`${API}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || "Login failed");
		setUser(data.user);
		return data.user;
	};

	const logout = async () => {
		try {
			await fetch(`${API}/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (err) {
			console.error(err);
		}
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, setUser, loading, signup, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
