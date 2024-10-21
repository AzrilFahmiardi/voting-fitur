import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Voting() {
    const [universities, setUniversities] = useState([]); // Data asli
    const [sortedUniversities, setSortedUniversities] = useState([]); // Data yang terurut
    const [selectedUniversities, setSelectedUniversities] = useState([]);
    const [userlogin, setUserlogin] = useState({
        username: 'guest',
        email: ''
    });

    // Ambil data universitas dari server saat komponen dimuat
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/universitas-voting');
                // Simpan data asli
                setUniversities(response.data);
                // Urutkan universitas berdasarkan jumlah voting terbanyak
                const sorted = response.data.slice().sort((a, b) => b.jumlah_voting - a.jumlah_voting); // Menggunakan slice untuk menjaga data asli
                setSortedUniversities(sorted);
                console.log('sorted : ', sorted);
                console.log('unsorted : ', response.data);
                
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };

        fetchUniversities();
    }, []);

    // Fungsi untuk menangani perubahan pada checkbox
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        console.log(`Checkbox ${value} checked: ${checked} kampus: ${value}`);
    
        if (checked) {
            if (selectedUniversities.length < 2) {
                setSelectedUniversities((prev) => [...prev, value]);
            } else {
                alert('You can only vote for 2 universities.');
            }
        } else {
            setSelectedUniversities((prev) => prev.filter((university) => university !== value));
        }
    };

    // Fungsi untuk mengirimkan voting
    const handleVoteSubmit = async (event) => {
        event.preventDefault();
        
        if (selectedUniversities.length < 1) {
            alert('Please select at least one university to vote.');
            return;
        }
    
        console.log('Selected universities for voting:', selectedUniversities); 
    
        try {
            await axios.post('http://localhost:5000/vote', { universities: selectedUniversities });
            alert('Voting submitted successfully!');
            // Segarkan data universitas
            const response = await axios.get('http://localhost:5000/universitas-voting');
            setUniversities(response.data); // Set data asli
            const sorted = response.data.slice().sort((a, b) => b.jumlah_voting - a.jumlah_voting); // Sort data setelah voting
            setSortedUniversities(sorted); // Update data terurut
            setSelectedUniversities([]); // Reset pilihan
            console.log('sorted : ', sorted);
            console.log('unsorted : ', response.data);
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('Voting failed. Please try again.');
        }
    };

    return (
        <div>
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
                            {university.nama} (Jumlah Voting: {university.jumlah_voting})
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
