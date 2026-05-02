import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { SERVER } from "./environment";
import vLogo from "./assets/vLogo.png";

function Sidebar() {
	const {
		allThreads,
		setAllThreads,
		currThreadId,
		setNewChat,
		setReply,
		setCurrThreadId,
		setPrevChats,
		reply,
		isSidebarOpen,
		setIsSidebarOpen,
		createNewChat,
	} = useContext(MyContext);

	const getAllThreads = async () => {
		try {
			const response = await fetch(`${SERVER}/api/thread`, {
				credentials: "include",
			});
			const res = await response.json();
			const filteredData = res.map((thread) => ({
				threadId: thread.threadId,
				title: thread.title,
			}));
			setAllThreads(filteredData);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		getAllThreads();
	}, [currThreadId, reply]);

	const closeSidebarOnSmallScreens = () => {
		if (window.matchMedia("(max-width: 1024px)").matches) {
			setIsSidebarOpen(false);
		}
	};

	const changeThread = async (newThreadId) => {
		setCurrThreadId(newThreadId);
		try {
			const response = await fetch(
				`${SERVER}/api/thread/${newThreadId}`,
				{ credentials: "include" },
			);
			const res = await response.json();
			setPrevChats(res);
			setNewChat(false);
			setReply(null);
			closeSidebarOnSmallScreens();
		} catch (err) {
			console.error(err);
		}
	};

	const deleteThread = async (threadId) => {
		try {
			const response = await fetch(`${SERVER}/api/thread/${threadId}`, {
				method: "DELETE",
				credentials: "include",
			});
			await response.json();
			setAllThreads((prev) =>
				prev.filter((thread) => thread.threadId !== threadId),
			);
			if (threadId === currThreadId) {
				createNewChat();
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			{isSidebarOpen && (
				<div
					className="sidebarBackdrop"
					onClick={() => setIsSidebarOpen(false)}
				></div>
			)}
			<section className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
				<span
					className="material-symbols-outlined sidebarClose"
					onClick={() => setIsSidebarOpen(false)}
				>
					close
				</span>

				<button onClick={createNewChat}>
					<img
						src={vLogo}
						alt="V Logo"
						className="logo"
					></img>
					<h4>New Chat</h4>
					<span className="material-symbols-outlined">
						edit_square
					</span>
				</button>

				<ul className="history">
					{allThreads?.map((thread, idx) => (
						<li
							key={idx}
							onClick={(e) => changeThread(thread.threadId)}
							className={
								thread.threadId === currThreadId
									? "highlighted"
									: ""
							}
						>
							{thread.title}
							<span
								className="material-symbols-outlined delete"
								onClick={(e) => {
									e.stopPropagation();
									deleteThread(thread.threadId);
								}}
							>
								delete
							</span>
						</li>
					))}
				</ul>

				<div className="sign">
					<p>
						By{" "}
						<span style={{ color: "#007AFF", fontWeight: "bold" }}>
							Vishnu
						</span>
						<span style={{ opacity: 0.6 }}>
							{" "}
							| Chat powered by{" "}
						</span>
						<span style={{ color: "#4285F4", fontWeight: "bold" }}>
							Gemini
						</span>
					</p>
				</div>
			</section>
		</>
	);
}

export default Sidebar;
