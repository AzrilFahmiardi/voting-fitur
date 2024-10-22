import React, { useState } from 'react';
import axios from 'axios';

function Votinguniv({ universities, fetchUniversities }) {
    const [selectedUniversities, setSelectedUniversities] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            if (selectedUniversities.length < 5) {
                setSelectedUniversities((prev) => [...prev, value]);
            } else {
                alert('You can only vote for 5 universities.');
            }
        } else {
            setSelectedUniversities((prev) => prev.filter((university) => university !== value));
        }
    };

    const handleVoteSubmit = async (event) => {
        event.preventDefault();
        if (selectedUniversities.length < 1) {
            alert('Please select at least one university to vote.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/vote', { universities: selectedUniversities });
            setSelectedUniversities([]);
            alert('Voting submitted successfully!');

            // Call fetchUniversities to refresh leaderboard
            fetchUniversities();
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Voting failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Voting Universitas</h1>
            <form onSubmit={handleVoteSubmit}>
                <h2>Pilih Universitas (maksimal 5):</h2>
                {/* Render checkbox options for universities */}
                {universities.map((university) => (
                    <div key={university.kode_univ}>
                        <input
                            type="checkbox"
                            id={`university-${university.kode_univ}`}
                            value={university.kode_univ}
                            onChange={handleCheckboxChange}
                            checked={selectedUniversities.includes(university.kode_univ)}
                        />
                        <label htmlFor={`university-${university.kode_univ}`}>
                            {university.nama}
                        </label>
                    </div>
                ))}
                <button type="submit">Submit Voting</button>
            </form>
        </div>
    );
}

export default Votinguniv;
