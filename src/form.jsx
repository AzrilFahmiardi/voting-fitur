import React, { useState } from 'react';
import axios from 'axios';

function MyForm() {
    const [userlogin, setUserlogin] = useState({
        username: 'guest',
        email: ''
    });
  
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Fungsi untuk menangani perubahan pada input form register
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Fungsi untuk menangani perubahan pada input form login
    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    // Fungsi untuk submit form register
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            const data = {
                username: response.data[0].username,
                email: response.data[0].email
            }
            setUserlogin(data);
            console.log('buat usasate', data);
            alert('Registration successful!');
        } catch (error) {
            console.error('Error submitting registration form:', error);
            alert('Registration failed');
        }
    };

    // Fungsi untuk submit form login
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
            console.log('Data user login:', data);
            alert('Login successful!');
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
        <div>
            <h1>{userlogin.username}</h1>
            {/* Form Registrasi */}
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>

            {/* Form Login */}
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
        </div>
    );
}

export default MyForm;
