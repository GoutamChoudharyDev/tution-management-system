import { createRoot } from 'react-dom/client'
import App from './App'
import "./index.css"
import AuthProvider from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <App />
        </AuthProvider>
    </BrowserRouter>
)