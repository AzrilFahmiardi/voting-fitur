import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Voting() {
    const [universities, setUniversities] = useState([]);
    const [sortedUniversities, setSortedUniversities] = useState([]);
    const [selectedUniversities, setSelectedUniversities] = useState([]);
   

    // FETCH KETIKA KOMPONEN DIBUAT
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/universitas-voting');
                setUniversities(response.data);
                const sorted = response.data.slice().sort((a, b) => b.jumlah_voting - a.jumlah_voting);
                setSortedUniversities(sorted);
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };

        fetchUniversities();
    }, []);

    // HANDLE CHECKBOX
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

    // SUBMIT VOTING
    const handleVoteSubmit = async (event) => {
        event.preventDefault();
        
        if (selectedUniversities.length < 1) {
            alert('Please select at least one university to vote.');
            return;
        }    
        try {
            await axios.post('http://localhost:5000/vote', { universities: selectedUniversities });
            
            // MEMPERBARUI LEADERBOARD
            const response = await axios.get('http://localhost:5000/universitas-voting');
            const sorted = response.data.slice().sort((a, b) => b.jumlah_voting - a.jumlah_voting);
            setSortedUniversities(sorted); 
            setSelectedUniversities([]);
            alert('Voting submitted successfully!');
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Voting failed. Please try again.');
        }
    };

    return (
        <div>
            <hr />
            <h1>LEADERBOARD KAMPUS</h1>
            <ul>
                {sortedUniversities.map((university) => (
                    <li key={university.kode_univ}>{university.kode_univ}: {university.nama} --- {university.jumlah_voting}</li>
                ))}
            </ul>
            
            <hr />
            <h1>Voting Universitas</h1>
            <form onSubmit={handleVoteSubmit}>
                <h2>Pilih Universitas (maksimal 2):</h2>
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
            <hr />
        </div>
    );
}

export default Voting;