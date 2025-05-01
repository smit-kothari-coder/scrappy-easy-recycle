import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PickupRequests from "@/components/PickupRequests";
import UpdatePrices from "@/components/UpdatePrices";
import ProfileTab from "@/components/ProfileTab";
import ScrapperOverview from "@/components/ScrapperOverview"; // ✅ Import overview component
import { useAuth } from "@/hooks/useAuth";

const ScrapperDashboard = () => {
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut(); // this is cleaner and uses Supabase
  };
  

  return (
    <Tabs value={tab} onValueChange={setTab} className="min-h-screen flex font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col justify-between p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-10">ScrapEasy</h1>
          <nav className="space-y-4">
            <button
              onClick={() => setTab("dashboard")}
              className={`w-full text-left px-4 py-2 rounded ${tab === "dashboard" ? "bg-green-900" : "hover:bg-green-800"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`w-full text-left px-4 py-2 rounded ${tab === "requests" ? "bg-green-900" : "hover:bg-green-800"}`}
            >
              Pickup Requests
            </button>
            <button
              onClick={() => setTab("prices")}
              className={`w-full text-left px-4 py-2 rounded ${tab === "prices" ? "bg-green-900" : "hover:bg-green-800"}`}
            >
              Update Prices
            </button>
            <button
              onClick={() => setTab("profile")}
              className={`w-full text-left px-4 py-2 rounded ${tab === "profile" ? "bg-green-900" : "hover:bg-green-800"}`}
            >
              Profile
            </button>
          </nav>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full mt-10 bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto space-y-8">
        <h2 className="text-4xl font-bold text-green-800">Welcome, Scrapper!</h2>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard">
          <ScrapperOverview user={user} />
        </TabsContent>

        {/* Pickup Requests */}
        <TabsContent value="requests">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Pickup Requests</h3>
            <PickupRequests />
          </section>
        </TabsContent>

        {/* Update Prices */}
        <TabsContent value="prices">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Update Prices</h3>
            <UpdatePrices />
          </section>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Profile Settings</h3>
            <ProfileTab />
          </section>
        </TabsContent>
      </main>
    </Tabs>
  );
};

export default ScrapperDashboard;


