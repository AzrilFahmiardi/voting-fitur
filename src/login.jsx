import React from 'react';

function Login() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="mt-8 text-center">
            <h2 className="text-2xl mb-4">Login to Vote</h2>
            <button
                onClick={handleGoogleLogin}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center justify-center mx-auto"
            >
                <img 
                    src="/google-icon.png" 
                    alt="Google" 
                    className="w-6 h-6 mr-2"
                />
                Login with Google
            </button>
        </div>
    );
}

export default Login;