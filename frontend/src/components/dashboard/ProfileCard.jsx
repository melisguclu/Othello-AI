import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Avatar1 from '@/assets/avatar1.png';
import Avatar2 from '@/assets/avatar2.png';
import Avatar3 from '@/assets/avatar3.jpg';

export default function ProfileCard({ user, handleLogout }) {
  const [selectedAvatar, setSelectedAvatar] = useState(Avatar1);

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
  };

  return (
    <Card className="col-span-3 shadow-sm  md:col-span-3 lg:col-span-1 sm:col-span-3 ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 text-center justify-between">
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={selectedAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>

            <div className="flex space-x-4 justify-center">
              <img
                src={Avatar1}
                alt="Avatar 1"
                className="w-12 h-12 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => handleAvatarChange(Avatar1)}
              />
              <img
                src={Avatar2}
                alt="Avatar 2"
                className="w-12 h-12 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => handleAvatarChange(Avatar2)}
              />
              <img
                src={Avatar3}
                alt="Avatar 3"
                className="w-12 h-12 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => handleAvatarChange(Avatar3)}
              />
            </div>
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
          className="w-full bottom-0 hover:bg-red-500"
          variant="secondary"
        >
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
