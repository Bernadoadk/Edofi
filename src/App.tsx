import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./screens/HomePage";
import { EventsPage } from "./screens/EventsPage/EventsPage";
import { MyEventsPage } from "./screens/MyEventsPage/MyEventsPage";
import { AboutPage } from "./screens/AboutPage/AboutPage";
import { ContactPage } from "./screens/ContactPage/ContactPage";
import { CreateEventPage } from "./screens/CreateEventPage/CreateEventPage";
import { SettingsPage } from "./screens/SettingsPage/SettingsPage";
import { EventDetailsPage } from "./screens/EventDetailsPage/EventDetailsPage";
import { EventMapPage } from "./screens/EventMapPage";
import { SignUpScreen, SignInScreen } from "./screens/AuthScreen/index";
import { AuthProvider } from "./contexts/AuthContext";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/map" element={<EventMapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/signin" element={<SignInScreen />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};