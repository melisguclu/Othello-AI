import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import RecentGamesCard from '../components/dashboard/RecentGamesCard';
import ProfileCard from '../components/dashboard/ProfileCard';
import GameChartCard from '../components/dashboard/GameChartCard';
import StatisticsCard from '../components/dashboard/StatisticsCard';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [recentGames, setRecentGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  const [personalStats, setPersonalStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: '0.00%',
    aiStats: {},
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  useEffect(() => {
    // console.log('User:', user);

    if (!user) {
      return;
    }

    const fetchRecentGames = async () => {
      if (!user) {
        setLoadingGames(false);
        return;
      }
      try {
        setLoadingGames(true);
        const response = await api.get(`/games/user/${user._id}`);
        // console.log('Recent games:', response.data.games);
        const lastFiveGames = response.data.games.slice(0, 5);
        setRecentGames(lastFiveGames);
      } catch (error) {
        console.error('Error fetching recent games:', error);
      } finally {
        setLoadingGames(false);
      }
    };

    const fetchStatistics = async () => {
      if (!user) return;

      try {
        setLoadingStats(true);
        const response = await api.get(`/games/statistics/${user._id}`);
        setPersonalStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchMonthlyStatistics = async () => {
      if (!user) return;

      try {
        setLoadingChart(true);
        const response = await api.get(`/games/statistics/monthly/${user._id}`);
        setChartData(response.data.statistics);
      } catch (error) {
        console.error('Error fetching monthly statistics:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchMonthlyStatistics();
    fetchStatistics();
    fetchRecentGames();
  }, [user]);

  return (
    <div className="grid grid-cols-1 gap-8 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3 bg-gray-100">
      <ProfileCard user={user} handleLogout={handleLogout} />
      <RecentGamesCard recentGames={recentGames} loadingGames={loadingGames} />
      <div className="grid grid-cols-4 col-span-3 md:grid-cols-4 gap-4 items-stretch">
        <div className="w-full col-span-4 md:col-span-4 lg:col-span-2 flex flex-col">
          <StatisticsCard
            personalStats={personalStats}
            loadingStats={loadingStats}
          />
        </div>
        <div className="w-full md:col-span-4 lg:col-span-2 col-span-4 flex flex-col">
          <GameChartCard chartData={chartData} loadingChart={loadingChart} />
        </div>
      </div>
    </div>
  );
}
