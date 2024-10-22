import React from 'react';

function Leaderboard({ universities }) {
    return (
        <div>
            <h1>LEADERBOARD KAMPUS</h1>
            <ul>
                {universities.map((university) => (
                    <li key={university.kode_univ}>
                        {university.kode_univ}: {university.nama} --- {university.jumlah_voting}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;
