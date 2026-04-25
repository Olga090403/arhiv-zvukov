import { Routes, Route } from "react-router-dom";
import RootLayout from "@/components/layout/RootLayout";
import LandingPage from "@/pages/LandingPage";
import SearchPage from "@/pages/SearchPage";
import SoundPage from "@/pages/SoundPage";
import MixerPage from "@/pages/MixerPage";
import UploadPage from "@/pages/UploadPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="sound/:id" element={<SoundPage />} />
        <Route path="mixer" element={<MixerPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
    </Routes>
  );
}
