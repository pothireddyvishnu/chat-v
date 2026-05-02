import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { SERVER } from "./environment";
import "./Settings.css";

const API = `${SERVER}/api/user`;

function Settings({ onClose }) {
	const { user, setUser, logout } = useContext(AuthContext);
	const [tab, setTab] = useState("profile");

	return (
		<div
			className="settingsBackdrop"
			onClick={onClose}
		>
			<div
				className="settingsModal"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="settingsHeader">
					<h2>Settings</h2>
					<span
						className="material-symbols-outlined settingsClose"
						onClick={onClose}
					>
						close
					</span>
				</div>

				<div className="settingsTabs">
					<button
						className={tab === "profile" ? "active" : ""}
						onClick={() => setTab("profile")}
					>
						Profile
					</button>
					<button
						className={tab === "password" ? "active" : ""}
						onClick={() => setTab("password")}
					>
						Password
					</button>
					<button
						className={tab === "theme" ? "active" : ""}
						onClick={() => setTab("theme")}
					>
						Theme
					</button>
					<button
						className={
							tab === "danger" ? "active danger" : "danger"
						}
						onClick={() => setTab("danger")}
					>
						Danger
					</button>
				</div>

				<div className="settingsBody">
					{tab === "profile" && (
						<ProfileTab
							user={user}
							setUser={setUser}
						/>
					)}
					{tab === "password" && <PasswordTab />}
					{tab === "theme" && (
						<ThemeTab
							user={user}
							setUser={setUser}
						/>
					)}
					{tab === "danger" && (
						<DangerTab
							onClose={onClose}
							logout={logout}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function ProfileTab({ user, setUser }) {
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [msg, setMsg] = useState(null);
	const [saving, setSaving] = useState(false);

	const save = async () => {
		setMsg(null);
		setSaving(true);
		try {
			const res = await fetch(`${API}/profile`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ name, email }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Update failed");
			setUser(data.user);
			setMsg({ type: "ok", text: "Profile updated" });
		} catch (err) {
			setMsg({ type: "err", text: err.message });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="settingsForm">
			<label>Name</label>
			<input
				value={name}
				placeholder="Enter your Name"
				onChange={(e) => setName(e.target.value)}
			/>
			<label>Email</label>
			<input
				type="email"
				placeholder="Enter your eMail"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			{msg && <p className={`settingsMsg ${msg.type}`}>{msg.text}</p>}
			<button
				className="settingsSave"
				onClick={save}
				disabled={saving}
			>
				{saving ? "Saving..." : "Save"}
			</button>
		</div>
	);
}

function PasswordTab() {
	const [currentPassword, setCurrent] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [msg, setMsg] = useState(null);
	const [saving, setSaving] = useState(false);

	const save = async () => {
		setMsg(null);
		setSaving(true);
		try {
			const res = await fetch(`${API}/password`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ currentPassword, newPassword }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Update failed");
			setMsg({ type: "ok", text: "Password updated" });
			setCurrent("");
			setNewPassword("");
		} catch (err) {
			setMsg({ type: "err", text: err.message });
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="settingsForm">
			<label>Current password</label>
			<input
				type="password"
				placeholder="Enter existing password"
				value={currentPassword}
				onChange={(e) => setCurrent(e.target.value)}
			/>
			<label>New password</label>
			<input
				type="password"
				placeholder="Enter new password"
				value={newPassword}
				onChange={(e) => setNewPassword(e.target.value)}
				minLength={6}
			/>
			{msg && <p className={`settingsMsg ${msg.type}`}>{msg.text}</p>}
			<button
				className="settingsSave"
				onClick={save}
				disabled={saving || !currentPassword || !newPassword}
			>
				{saving ? "Saving..." : "Update password"}
			</button>
		</div>
	);
}

function ThemeTab({ user, setUser }) {
	const [theme, setTheme] = useState(user.theme || "dark");
	const [saving, setSaving] = useState(false);

	const apply = async (next) => {
		setTheme(next);
		setSaving(true);
		try {
			const res = await fetch(`${API}/theme`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ theme: next }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error);
			setUser({ ...user, theme: data.theme });
		} catch (err) {
			console.error(err);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="settingsForm">
			<p className="settingsHelp">
				Choose how Chat V looks. Synced to your account.
			</p>
			<div className="themeOptions">
				<button
					className={`themeOption ${theme === "dark" ? "active" : ""}`}
					onClick={() => apply("dark")}
					disabled={saving}
				>
					Dark
				</button>
				<button
					className={`themeOption ${theme === "light" ? "active" : ""}`}
					onClick={() => apply("light")}
					disabled={saving}
				>
					Light
				</button>
			</div>
		</div>
	);
}

function DangerTab({ onClose, logout }) {
	const [msg, setMsg] = useState(null);
	const [busy, setBusy] = useState(false);

	const clearHistory = async () => {
		if (!confirm("Delete all your chat history? This cannot be undone."))
			return;
		setBusy(true);
		setMsg(null);
		try {
			const res = await fetch(`${API}/threads`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed");
			setMsg({
				type: "ok",
				text: `Deleted ${data.deletedCount} threads. Reload to see changes.`,
			});
		} catch (err) {
			setMsg({ type: "err", text: err.message });
		} finally {
			setBusy(false);
		}
	};

	const deleteAccount = async () => {
		if (
			!confirm(
				"Permanently delete your account and all chat history? This cannot be undone.",
			)
		)
			return;
		setBusy(true);
		try {
			const res = await fetch(`${API}/`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed");
			}
			onClose();
			await logout();
		} catch (err) {
			setMsg({ type: "err", text: err.message });
			setBusy(false);
		}
	};

	return (
		<div className="settingsForm">
			<div className="dangerRow">
				<div>
					<strong>Clear all chat history</strong>
					<p className="settingsHelp">
						Deletes every thread on your account.
					</p>
				</div>
				<button
					className="dangerBtn"
					onClick={clearHistory}
					disabled={busy}
				>
					Clear
				</button>
			</div>
			<div className="dangerRow">
				<div>
					<strong>Delete account</strong>
					<p className="settingsHelp">
						Removes your account and all data permanently.
					</p>
				</div>
				<button
					className="dangerBtn"
					onClick={deleteAccount}
					disabled={busy}
				>
					Delete
				</button>
			</div>
			{msg && <p className={`settingsMsg ${msg.type}`}>{msg.text}</p>}
		</div>
	);
}

export default Settings;
