import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AOS from 'aos';
import AppRoutes from './routes/AppRoutes';
import ReduxProvider from './store/ReduxProvider';
import GoogleOAuthWrapper from './providers/GoogleOAuthProvider';
import AccountNotificationProvider from './providers/AccountNotificationProvider';
import { ChatHubProvider } from './contexts/ChatHubContext';
import { GlobalChatProvider } from './providers/GlobalChatProvider';
import { ToastContainer } from 'react-toastify';
import CustomCursor from './components/CustomCursor';
import BotpressChat from './components/BotpressChat';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    useEffect(() => {
        // Initialize AOS - always initialize regardless of elements presence
        const initAOS = () => {
            AOS.init({
                duration: 1200,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
            });
        };

        // Initialize after a short delay to ensure DOM is ready
        const timer = setTimeout(() => {
            initAOS();
        }, 200);

        // Also listen for window load event
        window.addEventListener('load', () => {
            clearTimeout(timer);
            setTimeout(initAOS, 100);
        });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('load', initAOS);
        };
    }, []);

    return (
        <ReduxProvider>
            <GoogleOAuthWrapper>
                <AccountNotificationProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                    <BrowserRouter>
                        <ChatHubProvider>
                            <GlobalChatProvider>
                                <AppRoutes />
                            </GlobalChatProvider>
                        </ChatHubProvider>
                        <CustomCursor />
                        <BotpressChat />
                    </BrowserRouter>
                </AccountNotificationProvider>
            </GoogleOAuthWrapper>
        </ReduxProvider>
    );
};

export default App;
