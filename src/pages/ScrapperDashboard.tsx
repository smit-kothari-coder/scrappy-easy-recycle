import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PickupRequests from "@/components/PickupRequests";
import ScrapperHistory from "@/components/ScrapperHistory";
import OngoingRequests from "@/components/PickupAccepted";
import UpdatePrices from "@/components/UpdatePrices";
import ProfileTab from "@/components/ProfileTab";
import ScrapperOverview from "@/components/ScrapperOverview";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";

//
const ScrapperDashboard = () => {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex font-sans relative">
      {/* Hamburger button for mobile */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-6 h-6 text-green-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-700 text-white flex flex-col justify-between p-6 shadow-lg transform transition-transform duration-300 z-40
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        <div>
          <h1 className="text-3xl font-bold mb-10">ScrapEasy</h1>
          <nav className="space-y-4">
            {["dashboard", "requests", "accepted","history" ,"prices", "profile"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    setTab(item);
                    setSidebarOpen(false); // Auto-close sidebar on selection
                  }}
                  className={`w-full text-left px-4 py-2 rounded ${
                    tab === item ? "bg-green-900" : "hover:bg-green-800"
                  }`}
                >
                  {item === "dashboard"
                    ? "Dashboard"
                    : item === "requests"
                    ? "Pickup Requests"
                    : item === "accepted"
                    ? "Ongoing Pickup Requests"
                    : item === "history"
                    ? "Scrapper's History"
                    : item === "prices"
                    ? "Update Prices"
                    : "Profile"}
                </button>
              )
            )}
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
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 p-6 pt-16 md:pt-6 space-y-8">
        <h2 className="text-4xl font-bold text-green-800">
          Welcome, Scrapper!
        </h2>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsContent value="dashboard">
            <ScrapperOverview user={user} />
          </TabsContent>
          <TabsContent value="requests">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Pickup Requests
              </h3>
              <PickupRequests />
            </section>
          </TabsContent>
          <TabsContent value="accepted">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Ongoing Pickup Requests
              </h3>
              <OngoingRequests />
            </section>
          </TabsContent>
          <TabsContent value="history">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Scrapper's History
              </h3>
              <ScrapperHistory />
            </section>
          </TabsContent>
          <TabsContent value="prices">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Update Prices
              </h3>
              <UpdatePrices />
            </section>
          </TabsContent>
          <TabsContent value="profile">
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Profile Settings
              </h3>
              <ProfileTab />
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ScrapperDashboard;
