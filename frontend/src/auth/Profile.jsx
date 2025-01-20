import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [recentGames, setRecentGames] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Mock data
  // const personalStats = {
  //   totalGames: 50,
  //   wins: 30,
  //   losses: 20,
  //   winRate: '60%',
  // };

  const [personalStats, setPersonalStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winRate: '0.00%',
  });

  const userLevel = {
    level: 5,
    progress: 70, // percentage
  };

  // const chartData = [
  //   { month: 'January', played: 10, won: 6 },
  //   { month: 'February', played: 15, won: 9 },
  //   { month: 'March', played: 8, won: 5 },
  // ];

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        if (user) {
          console.log('User is logged in:', user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchRecentGames = async () => {
      if (!user) {
        setLoadingGames(false);
        return;
      }
      try {
        setLoadingGames(true);
        const response = await axios.get(`/games/user/${user.id}`);
        console.log('Recent games:', response.data.games);
        // Son 5 oyunu al
        const limitedGames = response.data.games.slice(0, 5);
        setRecentGames(limitedGames);
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
        const response = await axios.get(`/games/statistics/${user.id}`);
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
        const response = await axios.get(
          `/games/statistics/monthly/${user.id}`
        );
        setChartData(response.data.statistics);
      } catch (error) {
        console.error('Error fetching monthly statistics:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchMonthlyStatistics();
    fetchStatistics();
    fetchUserData();
    fetchRecentGames();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-100">
      {/* User Information Card */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {loadingUser ? (
            <p>Loading user information...</p>
          ) : user ? (
            <div>
              <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No user information available.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </CardFooter>
      </Card>

      {/* Recent Games Card */}
      <Card className="shadow-lg col-span-2">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Recent Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingGames ? (
            <p>Loading recent games...</p>
          ) : recentGames.length > 0 ? (
            <div className="divide-y divide-gray-300">
              {recentGames.map((game) => (
                <div
                  key={game._id}
                  className="grid grid-cols-4 items-center py-2 text-center"
                >
                  <span className="font-medium text-start">{game.mode}</span>
                  <span className="font-medium">{game.aiType}</span>
                  <span
                    className={`font-semibold ${game.result === 'win' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {game.result}
                  </span>
                  <span className="text-gray-500 text-sm text-end">
                    {new Date(game.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No recent games found.</p>
          )}
        </CardContent>
      </Card>

      {/* Personal Statistics Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Personal Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loadingStats ? (
            <p>Loading statistics...</p>
          ) : (
            <>
              <p>Total Games: {personalStats.totalGames}</p>
              <p>Wins: {personalStats.wins}</p>
              <p>Losses: {personalStats.losses}</p>
              <p>Win Rate: {personalStats.winRate}%</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Game Statistics Chart Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Game Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loadingChart ? (
            <p>Loading game statistics...</p>
          ) : (
            <BarChart
              width={300}
              height={250}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="played" fill="#2563eb" />
              <Bar dataKey="won" fill="#16a34a" />
            </BarChart>
          )}
        </CardContent>
      </Card>

      {/* User Level Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            User Level
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Level: {userLevel.level}</p>
          <Progress value={userLevel.progress} className="h-4" />
          <p>{userLevel.progress}% to next level</p>
        </CardContent>
      </Card>
    </div>
  );
}
