import { useContext, useEffect, useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import Sidebar from "./Sidebar";
import Auth from "./Auth";
import { AuthContext, AuthProvider } from "./AuthContext";
import { v1 as uuidv1 } from "uuid";

function getInitialSidebarState() {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(min-width: 1025px)").matches;
}

function ChatApp() {
	const [prompt, setPrompt] = useState("");
	const [reply, setReply] = useState(null);
	const [currThreadId, setCurrThreadId] = useState(uuidv1());
	const [prevChats, setPrevChats] = useState([]);
	const [newChat, setNewChat] = useState(true);
	const [allThreads, setAllThreads] = useState([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);

	const createNewChat = () => {
		setNewChat(true);
		setPrompt("");
		setReply(null);
		setCurrThreadId(uuidv1());
		setPrevChats([]);
		if (window.matchMedia("(max-width: 1024px)").matches) {
			setIsSidebarOpen(false);
		}
	};

	const providerValues = {
		prompt,
		setPrompt,
		reply,
		setReply,
		currThreadId,
		setCurrThreadId,
		newChat,
		setNewChat,
		prevChats,
		setPrevChats,
		allThreads,
		setAllThreads,
		isSidebarOpen,
		setIsSidebarOpen,
		createNewChat,
	};
	return (
		<div className="app">
			<MyContext.Provider value={providerValues}>
				<Sidebar />
				<ChatWindow />
			</MyContext.Provider>
		</div>
	);
}

function AuthGate() {
	const { user, loading } = useContext(AuthContext);

	useEffect(() => {
		const theme = user?.theme || "dark";
		document.documentElement.classList.toggle(
			"theme-light",
			theme === "light",
		);
	}, [user?.theme]);

	if (loading) {
		return <div className="appLoading">Loading...</div>;
	}
	return user ? <ChatApp /> : <Auth />;
}

function App() {
	return (
		<AuthProvider>
			<AuthGate />
		</AuthProvider>
	);
}

export default App;
