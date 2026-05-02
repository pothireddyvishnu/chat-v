import { useContext, useEffect, useState } from "react";
import "./App.css";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import Sidebar from "./Sidebar";
import Auth from "./Auth";
import { AuthContext, AuthProvider } from "./AuthContext";
import { v1 as uuidv1 } from "uuid";
import hljsDarkUrl from "highlight.js/styles/github-dark.css?url";
import hljsLightUrl from "highlight.js/styles/github.css?url";

function ensureHljsLink(id, href) {
	let link = document.getElementById(id);
	if (!link) {
		link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}
	return link;
}

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
		const isLight = theme === "light";
		document.documentElement.classList.toggle("theme-light", isLight);
		const darkLink = ensureHljsLink("hljs-theme-dark", hljsDarkUrl);
		const lightLink = ensureHljsLink("hljs-theme-light", hljsLightUrl);
		darkLink.disabled = isLight;
		lightLink.disabled = !isLight;
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
