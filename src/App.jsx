import React from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col items-center py-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-pink-700">
          💍 Our Engagement Celebration
        </h1>
        <p className="text-gray-600 mt-2">
          Join us for a day of love, laughter, and memories ✨
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl w-full px-6">
        {/* RSVP Section */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">RSVP</h2>
            <form className="flex flex-col gap-3">
              <Input placeholder="Your Full Name" />
              <Input placeholder="Your Email" type="email" />
              <Textarea placeholder="Leave a note for us ✨" />
              <Button type="submit" className="mt-3">Submit RSVP</Button>
            </form>
          </CardContent>
        </Card>

        {/* Guestbook */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Guestbook</h2>
            <p className="text-gray-500 mb-4">
              Share your wishes, blessings, or funny memories 💌
            </p>
            <Textarea placeholder="Write your message here..." />
            <Button className="mt-3">Sign Guestbook</Button>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Photo Upload</h2>
            <p className="text-gray-500 mb-4">
              Upload your favorite moments 📸
            </p>
            <Input type="file" accept="image/*" />
            <Button className="mt-3">Upload</Button>
          </CardContent>
        </Card>

        {/* Predictions / Fun Game */}
        <Card className="shadow-xl border border-pink-100 rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Predictions</h2>
            <p className="text-gray-500 mb-4">
              Guess fun things about the day 💫
            </p>
            <Input placeholder="Your Prediction" />
            <Button className="mt-3">Submit Prediction</Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        Made with ❤️ for our special day
      </footer>
    </div>
  );
}
