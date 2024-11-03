import { useState, useEffect } from 'react';
import axios from 'axios';
import VotingPage from './votingPage';
import Login from './login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home({ user }) {
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">LANDING PAGE</h1>
        <p className="mb-4">Selamat datang di BATAM CAMPUS EXPO 2025</p>
        
        {user ? (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Welcome, {user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-300">Home</Link>
        </li>
        <li>
          <Link to="/voting" className="hover:text-gray-300">Voting Page</Link>
        </li>
      </ul>
    </nav>
  );
}

function Layout({ isLoggedIn, user, hasVoted }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route 
            path="/voting" 
            element={
              <VotingPage 
                isLoggedIn={isLoggedIn}
                user={user}
                hasVoted={hasVoted}
              />
            } 
          />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <p className="text-center">© 2024 Batam Campex 2025</p>
      </footer>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/check-auth', { 
        withCredentials: true 
      });
      
      setIsLoggedIn(response.data.isAuthenticated);
      setUser(response.data.user);
      
      if (response.data.isAuthenticated) {
        try {
          const voteStatus = await axios.get('http://localhost:5000/check-vote-status', {
            withCredentials: true
          });
          setHasVoted(voteStatus.data.hasVoted);
        } catch (voteError) {
          console.error('Error checking vote status:', voteError);
          setHasVoted(false);
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
      setHasVoted(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <BrowserRouter>
      <Layout 
        isLoggedIn={isLoggedIn}
        user={user}
        hasVoted={hasVoted}
      />
    </BrowserRouter>
  );
}

export default App;