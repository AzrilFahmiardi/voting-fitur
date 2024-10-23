import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './login';
import Leaderboard from './leaderboard';
import Votinguniv from './votingUniv';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Konfigurasi axios untuk mengirim kredensial
  axios.defaults.withCredentials = true;

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/check-auth', { 
        withCredentials: true 
      });
      setIsLoggedIn(response.data.isAuthenticated);
      setUser(response.data.user);
      console.log('Response from check-auth:', response.data);

      if (response.data.isAuthenticated) {
        const voteStatus = await axios.get('http://localhost:5000/check-vote-status');
        setHasVoted(voteStatus.data.hasVoted);
        console.log('has voted : ',voteStatus.data.hasVoted);
        
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/universitas-voting', {
        withCredentials: true
      });
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  // Cek status login saat aplikasi dimuat
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch universitas setelah login
  useEffect(() => {
    if (isLoggedIn) {
      fetchUniversities();
    }
    console.log('isLoggedIn changed:', isLoggedIn);
  }, [isLoggedIn]);

  const handleVoteSuccess = async () => {
    setHasVoted(true);
    await fetchUniversities();
  };


  return (
    <div className="container mx-auto px-4">
      <Leaderboard universities={universities} fetchUniversities={fetchUniversities} />
      {isLoggedIn ? (
        <>
          {hasVoted ? (
            <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
              <h2 className="text-xl text-green-800">Thank you for voting!</h2>
              <p className="text-green-600">You have already submitted your vote.</p>
            </div>
          ) : (
            <Votinguniv 
              universities={universities} 
              fetchUniversities={fetchUniversities}
              setHasVoted={setHasVoted}
              onVoteSuccess={handleVoteSuccess}
              user={user}
            />
          )}
          <button
            onClick={() => window.location.href = 'http://localhost:5000/logout'}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;