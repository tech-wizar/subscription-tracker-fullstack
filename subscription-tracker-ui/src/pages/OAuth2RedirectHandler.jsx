import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    // These are "hooks" from the react-router-dom library
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // This code runs automatically as soon as this component is displayed
    useEffect(() => {
        // Get the 'token' from the URL's query parameters (e.g., ?token=...)
        const token = searchParams.get('token');

        if (token) {
            // This is the key step: we save the token in the browser's local storage.
            // Local storage persists even after the browser tab is closed.
            localStorage.setItem('accessToken', token);
            
            // Redirect the user to the main dashboard page.
            navigate('/dashboard'); // <-- THIS LINE IS NOW CORRECT
        } else {
            // If for some reason there's no token, send them back to the login page.
            navigate('/login');
        }
    }, [searchParams, navigate]);

    // This component doesn't need to show anything to the user,
    // as it redirects almost instantly. We just show a loading message.
    return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;