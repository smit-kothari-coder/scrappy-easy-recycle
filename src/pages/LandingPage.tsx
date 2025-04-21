import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Recycle, Calendar, Check, Award, Star, StarOff, StarHalf, Info , Battery} from "lucide-react";
import { Box, Cpu, BookOpen } from "lucide-react";

const reviews = [
  {
    name: "Meera R.",
    rating: 5,
    text: "Super convenient to schedule waste pickups. The UI is clean and smooth!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Karan S.",
    rating: 4,
    text: "Fast pickups and friendly staff. Highly recommended for busy folks.",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg"
  },
  {
    name: "Pooja M.",
    rating: 5,
    text: "Love the rewards system! It's fun earning points for recycling.",
    avatar: "https://randomuser.me/api/portraits/women/85.jpg"
  }
];

const getStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<Star key={i} className="text-yellow-400 inline" size={20} />);
    } else {
      stars.push(<StarOff key={i} className="text-gray-300 inline" size={20} />);
    }
  }
  return stars;
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F1F0FB] to-white">
      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-scrap-green/80 to-scrap-blue/70 min-h-[380px] rounded-b-3xl shadow-lg">
        <div className="absolute inset-0 bg-black/30 rounded-b-3xl" />
        <div className="relative z-10 flex flex-col items-center max-w-xl w-full scrap-container">
          <h1 className="text-[2.5rem] md:text-5xl font-extrabold text-white drop-shadow mb-3 text-center tracking-tight">
            ♻️ Scrap<span className="text-[#9b87f5]">Easy</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-5 text-center">
            Smart Recycling Made Simple &amp; Rewarding
          </h2>
          <p className="text-lg text-white mb-8 text-center max-w-md opacity-90 font-medium">
            Your effortless and eco-friendly way to get rid of household and business scrap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/signin" className="w-full sm:w-auto">
              <Button className="scrap-btn-primary w-full flex items-center justify-center gap-2 text-lg py-5 px-8 shadow-md">
                <User size={22} /> Sign In
              </Button>
            </Link>

            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="scrap-btn-primary w-full flex items-center justify-center gap-2 text-lg py-5 px-8 shadow-md">
                <User size={22} /> Sign Up as User
              </Button>
            </Link>
            <Link to="/signup?type=scrapper" className="w-full sm:w-auto">
              <Button className="scrap-btn-secondary w-full flex items-center justify-center gap-2 text-lg py-5 px-8 shadow-md">
                <Recycle size={22} /> Sign Up as Scrapper
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Scrap Categories Section */}
      <section className="py-12 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Collect</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto px-4">
          {[
            { icon: <Recycle />, label: "Plastic" },
            { icon: <Battery />, label: "E-Waste" },
            { icon: <Box />, label: "Cardboard" },
            { icon: <Cpu />, label: "Metal" },
            { icon: <BookOpen />, label: "Paper" },
          ].map(({ icon, label }, i) => (
            <div
              key={i}
              className="p-4 bg-[#f9f9f9] rounded-xl shadow text-center flex flex-col items-center justify-center"
            >
              <div className="text-scrap-green mb-2 text-3xl">{icon}</div>
              <p className="font-semibold text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Stepwise Section */}
      <section className="w-full py-12 px-3 sm:px-0 flex flex-col items-center">
        <h2 className="scrap-heading mb-8 text-[#1A1F2C] flex items-center gap-2">
          <Info size={26} className="text-scrap-blue" /> How It Works
        </h2>
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-stretch justify-center gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
            <User size={36} className="mb-3 text-scrap-blue" />
            <span className="text-lg font-semibold mb-1">Sign Up / Log In</span>
            <p className="text-gray-600 text-center text-sm">Register as a user or scrapper.</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
            <Recycle size={36} className="mb-3 text-[#28a745]" />
            <span className="text-lg font-semibold mb-1">Choose Scrap Type</span>
            <p className="text-gray-600 text-center text-sm">Select waste materials you want to recycle.</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
            <Calendar size={36} className="mb-3 text-scrap-blue" />
            <span className="text-lg font-semibold mb-1">Schedule a Pickup</span>
            <p className="text-gray-600 text-center text-sm">Pick your preferred date &amp; time.</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
            <Check size={36} className="mb-3 text-scrap-green" />
            <span className="text-lg font-semibold mb-1">Track &amp; Confirm</span>
            <p className="text-gray-600 text-center text-sm">Get updates and confirm successful pickups.</p>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
            <Award size={36} className="mb-3 text-yellow-500" />
            <span className="text-lg font-semibold mb-1">Get Rewarded</span>
            <p className="text-gray-600 text-center text-sm">Earn points or cashback for recycling.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-12 bg-[#F1F0FB] flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-7 items-center max-w-5xl w-full justify-center px-2 sm:px-0">
          <div className="md:w-1/2 mb-5 md:mb-0">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
              alt="ScrapEasy Dashboard"
              className="rounded-xl shadow-lg w-full object-cover md:max-w-sm"
              style={{ maxHeight: 260 }}
            />
          </div>
          <div className="md:w-2/3 flex flex-col items-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1F2C] mb-4 flex items-center gap-2">
              <Info size={26} className="text-scrap-blue mb-1" />
              About the Web App
            </h2>
            <p className="text-lg text-[#292C43] max-w-xl font-medium">
              ScrapEasy is a smart waste collection and recycling platform that connects users with registered scrappers for eco-friendly scrap disposal. Our goal is to make recycling easy, efficient, and rewarding for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* User Reviews / Testimonials */}
      <section className="w-full py-12 flex flex-col items-center bg-gradient-to-br from-[#f1f0fb] from-10% via-white via-90% to-white">
        <h2 className="scrap-heading mb-8 text-[#1A1F2C] flex items-center gap-2">
          <Star className="text-yellow-400" size={26} />
          What Our Users Say
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-4xl px-3">
          {reviews.map((r, idx) => (
            <div key={r.name} className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center min-w-[210px] w-full sm:w-1/3 animate-fade-in">
              <img
                src={r.avatar}
                alt={r.name}
                className="h-14 w-14 rounded-full mb-4 border-2 border-scrap-green shadow"
                loading="lazy"
              />
              <div className="mb-2">{getStars(r.rating)}</div>
              <p className="text-gray-700 italic text-center text-sm mb-2">&quot;{r.text}&quot;</p>
              <span className="text-[.99rem] font-semibold text-scrap-blue mt-2">{r.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="scrap-container text-center max-w-[600px] mx-auto">
          <p className="text-gray-600 text-base">© 2025 ScrapEasy. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 mt-2 text-base">
            <Link to="/faq" className="text-scrap-blue hover:underline">FAQ</Link>
            <span className="text-gray-500">|</span>
            <span className="text-scrap-blue">📧 smit.kothari@aissmsioit.org</span>
            <span className="text-gray-500">|</span>
            <Link to="/business-search" className="text-scrap-blue hover:underline">Business Finder</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
