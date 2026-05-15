import { Routes, Route } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import LandingPage from "@/pages/LandingPage";
import SearchPage from "@/pages/SearchPage";
import SoundPage from "@/pages/SoundPage";
import MixerPage from "@/pages/MixerPage";
import UploadPage from "@/pages/UploadPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public — all screens accessible per §9.2 MVP */}
        <Route index element={<LandingPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="sound/:id" element={<SoundPage />} />
        <Route path="mixer" element={<MixerPage />} />
        <Route path="upload" element={<UploadPage />} />

        {/* Auth (optional, per §9.2 — post-MVP prep) */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
