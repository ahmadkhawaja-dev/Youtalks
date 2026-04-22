import './App.css'
import ChatPage from "./pages/chat-page.tsx";
import { ToastContainer} from 'react-toastify';



function App() {

  return (
    <>
        <ToastContainer />
        <ChatPage />
    </>
  )
}

export default App
