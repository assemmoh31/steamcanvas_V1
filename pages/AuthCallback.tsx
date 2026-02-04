import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getUser } from '../services/mockApi';

interface AuthCallbackProps {
    setUser: (user: any) => void;
    setPage: (page: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ setUser, setPage }) => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);

            // Fetch user profile immediately
            getUser().then(user => {
                if (user) {
                    setUser(user);
                    setPage('dashboard');
                } else {
                    // If token is invalid
                    setPage('home');
                }
            });
        } else {
            setPage('home');
        }
    }, [setUser, setPage]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0e12]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-steam-blue" size={48} />
                <h2 className="text-xl font-bold text-white">Authenticating with Steam...</h2>
                <p className="text-gray-500">Please wait while we secure your session.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
