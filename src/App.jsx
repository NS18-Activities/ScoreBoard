import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../public/180daraga.png";
import xlogo from "../public/xlogo.png";

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.180daraga.com/api/event/quizGame");
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReveal = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isRevealed: !user.isRevealed } : user
      )
    );
  };

  const topThree = users.slice(0, 3);
  const restOfUsers = users.slice(3);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  const getCardColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-b from-yellow-400 to-yellow-600'; // Gold
      case 2:
        return 'bg-gradient-to-b from-gray-300 to-gray-500'; // Silver
      case 3:
        return 'bg-gradient-to-b from-yellow-700 to-yellow-900'; // Bronze
      default:
        return 'bg-gray-700';
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-10">{error}</div>;

  return (
    <div className="min-h-screen font-sans text-white p-4 flex flex-col items-center">
      <img src={logo} alt="" className='w-32 h-32 absolute top-1 left-1' />
      <img src={xlogo} alt="" className='w-32 h-32 mx-auto absolute top-2 right-1' />

      <div className="w-full max-w-4xl p-8 bg-[#222] rounded-3xl shadow-2xl space-y-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center">
          ⚡ NewStage 18 Scoreboard ⚡
        </h1>

        {/* Top 3 Scoreboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((user, index) => (
            <div
              key={user.id}
              onClick={() => handleReveal(user.id)}
              className={`relative p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${getCardColor(index + 1)}`}
            >
              <div className="absolute top-1 left-1 text-3xl">
                {getRankIcon(index + 1)}
              </div>
              <div className="text-center mt-2">
                <div
                  className={`text-2xl font-bold mb-1 ${!user.isRevealed ? 'blur-sm' : ''} transition-all duration-300`}
                >
                  {user.name}
                </div>
                <div
                  className={`text-lg font-medium ${!user.isRevealed ? 'blur-sm' : ''} transition-all duration-300`}
                >
                  {user.phone.slice(0, 3) + '****' + user.phone.slice(-3)}
                </div>
                <div className="text-4xl font-extrabold mt-4 text-white">
                  {user.score}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table for the Rest of the Users */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-700 bg-opacity-70 rounded-xl">
            <thead>
              <tr className="bg-gray-600 text-left text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Score</th>
              </tr>
            </thead>
            <tbody className="text-gray-200 text-sm font-light divide-y divide-gray-600">
              {restOfUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-600 hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="py-3 px-6 whitespace-nowrap">{index + 4}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">
                    {user.phone.slice(0, 3) + '****' + user.phone.slice(-3)}
                  </td>
                  <td className="py-3 px-6">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
