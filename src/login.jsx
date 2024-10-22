import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Votinguniv from './votingUniv';
import Leaderboard from './leaderboard';

function Login() {
    const [userlogin, setUserlogin] = useState({
        username: 'guest',
        email: ''
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [islogin, setIslogin] = useState(0);
    const [universities, setUniversities] = useState([]);
    const [sortedUniversities, setSortedUniversities] = useState([])

    // FETCH UNIVERSITAS UNTUK LEADERBOARD DAN VOTING
    const fetchUniversities = async () => {
        try {
            const response = await axios.get('http://localhost:5000/universitas-voting');
            setUniversities(response.data)
            const sorted = response.data.slice().sort((a, b) => b.jumlah_voting - a.jumlah_voting);
            setSortedUniversities(sorted);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    };

    useEffect(() => {
        // Fetch universities on initial load
        fetchUniversities();
    }, []);

    // HANDLE INPUT FORM LOGIN
    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    // SUBMIT LOGIN
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            const data = {
                username: response.data.username,
                email: response.data.email
            };
            setUserlogin(data);
            setLoginData({
                email: '',
                password: ''
            });
            alert('Login successful!');
            setIslogin(1);
        } catch (error) {
            if (error.response) {
                console.error('Error response from server:', error.response.data);
                alert(error.response.data.message || 'Login failed');
            } else {
                console.error('Error submitting login form:', error);
                alert('Login failed');
            }
        }
    };

    return (
        <>
            <hr />
            <h1>USER LOGIN : {userlogin.username}</h1>
            <hr />
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            <Leaderboard universities={sortedUniversities} />

            {islogin === 1 && <Votinguniv universities={universities} fetchUniversities={fetchUniversities} />}
        </>
    );
}

export default Login;
