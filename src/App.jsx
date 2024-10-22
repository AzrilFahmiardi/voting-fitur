import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './login';
import Leaderboard from './leaderboard';
import Votinguniv from './votingUniv';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [user, setUser] = useState(null);

  // Konfigurasi axios untuk mengirim kredensial
  axios.defaults.withCredentials = true;

  // Fungsi untuk memeriksa status login
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/check-auth', { 
        withCredentials: true 
      });
      setIsLoggedIn(response.data.isAuthenticated);
      setUser(response.data.user);
      console.log('Response from check-auth:', response.data);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Ambil data universitas
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


  return (
    <div className="container mx-auto px-4">
      <Leaderboard universities={universities} fetchUniversities={fetchUniversities} />
      {isLoggedIn ? (
        <>
          <Votinguniv 
            universities={universities} 
            fetchUniversities={fetchUniversities}
            user={user}
          />
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