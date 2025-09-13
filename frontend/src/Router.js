import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroAnimation from "./components/IntroAnimation";
import LandingPage from "./components/Landingpage";
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import Homepage from "./components/Homepage";
import Moviepage from "./components/Moviepage";
import WatchlistPage from "./components/Watchlistpage";
import WatchHistory from "./components/Watchhistory";
import ChangePassword from "./components/Changepasswordpage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/movie/:id" element={<Moviepage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/watch-later" element={<WatchlistPage />} />
        <Route path="/watch-history" element={<WatchHistory />} />
        <Route path="/change-password/" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}