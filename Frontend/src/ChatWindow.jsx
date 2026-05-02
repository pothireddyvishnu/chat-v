import { useState, useContext, useEffect } from "react";
import Chat from "./Chat";
import Settings from "./Settings";
import "./ChatWindow.css";
import { MyContext } from "./MyContext";
import { AuthContext } from "./AuthContext";
import { SERVER } from "./environment";
import { HashLoader } from "react-spinners";

function ChatWindow() {
	const {
		prompt,
		setPrompt,
		reply,
		setReply,
		currThreadId,
		prevChats,
		setPrevChats,
		setNewChat,
		setIsSidebarOpen,
		createNewChat,
	} = useContext(MyContext);
	const { logout } = useContext(AuthContext);

	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [showSettings, setShowSettings] = useState(false);

	const getReply = async () => {
		setLoading(true);
		setNewChat(false);

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				message: prompt,
				threadId: currThreadId,
			}),
		};
		try {
			const response = await fetch(`${SERVER}/api/chat`, options);
			const res = await response.json();
			setReply(res.reply);
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (prompt && reply) {
			setPrevChats((prevChats) => [
				...prevChats,
				{
					role: "user",
					content: prompt,
				},
				{
					role: "assistant",
					content: reply,
				},
			]);
		}
		setPrompt("");
	}, [reply]);

	const handleProfileClick = () => {
		setIsOpen(!isOpen);
	};

	const openSettings = () => {
		setShowSettings(true);
		setIsOpen(false);
	};

	const handleLogout = async () => {
		setIsOpen(false);
		await logout();
	};

	return (
		<>
			<div className="chatWindow">
				<div className="navbar">
					<span
						className="material-symbols-outlined hamburger"
						onClick={() => setIsSidebarOpen((open) => !open)}
					>
						menu
					</span>
					<span
						className="title"
						onClick={createNewChat}
					>
						Chat V
					</span>
					<div
						className="userIconDiv"
						onClick={handleProfileClick}
					>
						<span className="material-symbols-rounded userIcon">
							person
						</span>
					</div>
				</div>

				{isOpen && (
					<div className="dropDown">
						<div
							className="dropDownItem"
							onClick={openSettings}
						>
							Settings
						</div>
						<div
							className="dropDownItem"
							onClick={handleLogout}
						>
							Log Out
						</div>
					</div>
				)}

				<Chat></Chat>
				<HashLoader
					color="white"
					loading={loading}
				/>

				<div className="chatInput">
					<div className="inputBox">
						<input
							placeholder="Ask V"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" ? getReply() : ""
							}
						></input>
						<div
							id="submit"
							onClick={getReply}
						>
							<span className="material-symbols-rounded">
								send
							</span>
						</div>
					</div>
					<p className="info">
						AI can make mistakes, so double-check it
					</p>
				</div>
			</div>

			{showSettings && (
				<Settings onClose={() => setShowSettings(false)} />
			)}
		</>
	);
}

export default ChatWindow;
