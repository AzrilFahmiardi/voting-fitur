import React, { useState } from 'react';
import axios from 'axios';

function Register(){

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // HANDLE INPUT FORM REGISTER
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    //SUBMIT REGISTER
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
                username: response.data.username,
                email: response.data.email
            }
            setFormData({
                username: '',
                email: '',
                password: ''
            })
            alert('Registration successful!');
        } catch (error) {
            console.error('Error submitting registration form:', error);
            alert('Registration failed');
        }
    };

    return(<>
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
    </>);

}

export default Register