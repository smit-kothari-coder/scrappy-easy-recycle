import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  Recycle,
  Calendar,
  Check,
  Award,
  Star,
  StarOff,
  Info,
  Battery,
  Box,
  Cpu,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { SolutionFormModal } from "@/components/SolutionFormModal";

const reviews = [
  {
    name: "Meera R.",
    rating: 5,
    text: "Super convenient to schedule waste pickups. The UI is clean and smooth!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Karan S.",
    rating: 4,
    text: "Fast pickups and friendly staff. Highly recommended for busy folks.",
    avatar: "https://randomuser.me/api/portraits/men/74.jpg",
  },
  {
    name: "Pooja M.",
    rating: 5,
    text: "Love the rewards system! It's fun earning points for recycling.",
    avatar: "https://randomuser.me/api/portraits/women/85.jpg",
  },
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
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSolutionClick = (solution: string) => {
    setSelectedSolution(solution);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSolution(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F1F0FB] to-white">
      {/* Hero Section */}
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

      {/* Scrap Categories */}
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
            <div key={i} className="p-4 bg-[#f9f9f9] rounded-xl shadow text-center flex flex-col items-center justify-center">
              <div className="text-scrap-green mb-2 text-3xl">{icon}</div>
              <p className="font-semibold text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions by Industry */}
      <section className="py-12 bg-green-50 w-full">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-green-700 font-medium mb-2 italic">Industries We Serve</p>
          <h2 className="text-4xl font-extrabold mb-8 text-gray-800">Solutions by Industry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => handleSolutionClick("Residential Apartments")} className="cursor-pointer bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src="/images/residential.jpg" alt="Residential Apartments" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Residential Apartments</h3>
                <p className="text-gray-600 text-sm">Arrange Recyclable waste collection Drives after every 3 months</p>
              </div>
            </div>

            <div onClick={() => handleSolutionClick("IT Companies/Bank Offices")} className="cursor-pointer bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src="/images/it-companies.jpg" alt="IT Companies/Bank Offices" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">IT Companies/Bank Offices</h3>
                <p className="text-gray-600 text-sm">Old Monitors, CPUs, Printers, Telephone, Servers, UPS and more</p>
              </div>
            </div>

            <div onClick={() => handleSolutionClick("Schools & Colleges")} className="cursor-pointer bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img src="/images/institue.jpg" alt="Educational Scrap Collection" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Schools & Colleges</h3>
                <p className="text-gray-600 text-sm">Organize student-led scrap collection drives and campus audits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Modal */}
      <SolutionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedSolution}
      />

      {/* How It Works */}
      <section className="w-full py-12 px-3 sm:px-0 flex flex-col items-center">
        <h2 className="scrap-heading mb-8 text-[#1A1F2C] flex items-center gap-2">
          <Info size={26} className="text-scrap-blue" /> How It Works
        </h2>
        <div className="max-w-4xl w-full flex flex-col md:flex-row items-stretch justify-center gap-6">
          {[
            { icon: <User size={36} className="mb-3 text-scrap-blue" />, title: "Sign Up / Log In", desc: "Register as a user or scrapper." },
            { icon: <Recycle size={36} className="mb-3 text-[#28a745]" />, title: "Choose Scrap Type", desc: "Select waste materials you want to recycle." },
            { icon: <Calendar size={36} className="mb-3 text-scrap-blue" />, title: "Schedule a Pickup", desc: "Pick your preferred date & time." },
            { icon: <Check size={36} className="mb-3 text-scrap-green" />, title: "Track & Confirm", desc: "Get updates and confirm successful pickups." },
            { icon: <Award size={36} className="mb-3 text-yellow-500" />, title: "Get Rewarded", desc: "Earn points or cashback for recycling." },
          ].map((step, i) => (
            <div key={i} className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[200px] animate-fade-in">
              {step.icon}
              <span className="text-lg font-semibold mb-1">{step.title}</span>
              <p className="text-gray-600 text-center text-sm">{step.desc}</p>
            </div>
          ))}
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
