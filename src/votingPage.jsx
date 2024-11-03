import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './login';
import Leaderboard from './leaderboard';
import Votinguniv from './votingUniv';

function VotingPage({ isLoggedIn, user, hasVoted: initialHasVoted }) {
    const [universities, setUniversities] = useState([]);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);

    axios.defaults.withCredentials = true;

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

    useEffect(() => {
        if (isLoggedIn) {
            fetchUniversities();
        }
        console.log('isLoggedIn changed:', isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        setHasVoted(initialHasVoted);
    }, [initialHasVoted]);

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
                            onVoteSuccess={handleVoteSuccess}
                            user={user}
                        />
                    )}
                </>
            ) : (
                <div className="mt-8 p-4 bg-yellow-100 rounded-lg text-center">
                    <h1 className="text-xl text-yellow-800">LOGIN FIRST TO VOTE</h1>
                    <Login />
                </div>
            )}
        </div>
    );
}

export default VotingPage;