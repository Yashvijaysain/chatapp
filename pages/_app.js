import "../styles/globals.css";
import { ChatAppProvider } from "../context/ChatAppContext";

export default function App({ Component, pageProps }) {
  return (
    <ChatAppProvider>
      <Component {...pageProps} />
    </ChatAppProvider>
  );
}
