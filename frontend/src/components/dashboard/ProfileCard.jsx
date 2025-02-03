import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfileCard({ user, handleLogout }) {
  return (
    <Card className=" col-span-1 shadow-lg ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 text-center justify-between ">
        {user ? (
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
          className="w-full bottom-0"
          variant="secondary"
        >
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
