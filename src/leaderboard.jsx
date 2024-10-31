import React, { useEffect } from 'react';

function Leaderboard({ universities, fetchUniversities }) {
    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);

    const sortedUniversities = [...universities].sort((a, b) => b.jumlah_voting - a.jumlah_voting);

    return (
        <div>
            <h1>LEADERBOARD KAMPUS</h1>
            <ol>
                {sortedUniversities.map((university) => (
                    <li key={university.kode_univ}>
                        {university.kode_univ}: {university.nama} --- {university.jumlah_voting}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default Leaderboard;
