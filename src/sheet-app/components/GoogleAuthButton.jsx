import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '971496737518-r6ghl3vudfup2jlalm5d8pdq4ej904om.apps.googleusercontent.com';
// const AUTH_API = 'https://api.ashishdev.com/api/auth';
 const AUTH_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/auth';
const GOOGLE_SCRIPT_ID = 'google-identity-services';

const loadGoogleScript = () => {
  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
  if (existingScript) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

function GoogleAuthButton({ setAuth, setError, setLoading, navigate, text = 'signin_with' }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadGoogleScript()
      .then(() => {
        if (isMounted) setReady(true);
      })
      .catch(() => {
        if (isMounted) setError('Google sign-in could not load. Please try again.');
      });

    return () => {
      isMounted = false;
    };
  }, [setError]);

  useEffect(() => {
    if (!ready || !window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        if (!credential) {
          setError('Google did not return a login credential.');
          return;
        }

        setError('');
        setLoading(true);
        try {
          const response = await axios.post(`${AUTH_API}/google`, { credential });

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          setAuth({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token
          });

          navigate('/sheet');
        } catch (err) {
          const message = err.response?.data?.message || 'Google authentication failed. Please try again.';
          setError(message);
        } finally {
          setLoading(false);
        }
      }
    });

    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'filled_black',
      size: 'large',
      shape: 'rectangular',
      width: buttonRef.current.offsetWidth || 360,
      text
    });
  }, [navigate, ready, setAuth, setError, setLoading, text]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-700/80 bg-slate-900/60">
      <div ref={buttonRef} className="flex min-h-[42px] w-full items-center justify-center" />
    </div>
  );
}

export default GoogleAuthButton;
