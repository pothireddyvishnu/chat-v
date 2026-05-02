import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import "./Auth.css";

function Auth() {
	const { login, signup } = useContext(AuthContext);
	const [mode, setMode] = useState("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const isSignup = mode === "signup";

	const switchMode = () => {
		setMode(isSignup ? "login" : "signup");
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (isSignup) {
				await signup({ name, email, password });
			} else {
				await login({ email, password });
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="authPage">
			<form
				className="authCard"
				onSubmit={handleSubmit}
			>
				<h1 className="authTitle">Chat V</h1>
				<p className="authSubtitle">
					{isSignup ? "Create your account" : "Welcome back"}
				</p>

				{isSignup && (
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				)}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password (min 6 chars)"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					minLength={6}
					required
				/>

				{error && <p className="authError">{error}</p>}

				<button
					type="submit"
					className="authSubmit"
					disabled={loading}
				>
					{loading
						? "Please wait..."
						: isSignup
							? "Sign Up"
							: "Log In"}
				</button>

				<p className="authSwitch">
					{isSignup
						? "Already have an account?"
						: "Don't have an account?"}{" "}
					<span onClick={switchMode}>
						{isSignup ? "Log in" : "Sign up"}
					</span>
				</p>
			</form>
		</div>
	);
}

export default Auth;
