"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default function JuniorDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChatUser, setActiveChatUser] = useState(null); // State for opening chat
    const [filters, setFilters] = useState({
        college: "",
        department: "",
        domain: "",
    });

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (user) {
            fetchSeniors();
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch("http://10.221.219.27:5000/api/requests/my-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const getRequestStatus = (seniorId) => {
        const req = requests.find(r => r.senior._id === seniorId);
        return req ? req : null;
    };

    const fetchSeniors = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(filters).toString();
            const token = localStorage.getItem("token") || user?.token;

            const res = await fetch(`http://10.221.219.27:5000/api/users/seniors?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setSeniors(data);
            }
        } catch (error) {
            console.error("Failed to fetch seniors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchSeniors();
    };

    const handleRequestMentorship = async (seniorId) => {
        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch("http://10.221.219.27:5000/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ seniorId, message: "I would like to request mentorship." }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Mentorship request sent successfully!");
                fetchRequests();
            } else {
                alert(data.message || "Failed to send request");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Junior Dashboard</h1>
                        <p className="text-gray-600">Find and connect with seniors</p>
                    </div>
                    <button onClick={logout} className="text-red-600 text-sm font-medium hover:text-red-800">
                        Logout
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                            <input type="text" name="college" placeholder="Search by college" className="input-field" onChange={handleFilterChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input type="text" name="department" placeholder="Search by dept" className="input-field" onChange={handleFilterChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                            <input type="text" name="domain" placeholder="e.g. Web, DSA" className="input-field" onChange={handleFilterChange} />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
                            <Filter className="h-4 w-4 mr-2" /> Filter
                        </button>
                    </form>
                </div>

                {/* Senior List */}
                {loading ? (
                    <div>Loading seniors...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seniors.length > 0 ? (
                            seniors.map((profile) => (
                                <div key={profile._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {profile.user.name[0]}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-lg font-bold text-gray-900">{profile.user.name}</h3>
                                            <p className="text-sm text-gray-500">{profile.currentPosition}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p><span className="font-semibold">College:</span> {profile.user.college}</p>
                                        <p><span className="font-semibold">Dept:</span> {profile.user.department}</p>
                                        <p><span className="font-semibold">Expertise:</span> {profile.guidanceDomains.join(", ")}</p>
                                    </div>
                                    <div className="mt-4">
                                        {(() => {
                                            const req = getRequestStatus(profile.user._id);
                                            if (req) {
                                                if (req.status === 'pending') {
                                                    return (
                                                        <button disabled className="w-full py-2 bg-yellow-50 text-yellow-700 font-medium rounded-lg cursor-not-allowed">
                                                            Request Sent (Pending)
                                                        </button>
                                                    );
                                                } else if (req.status === 'accepted') {
                                                    return (
                                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-2">
                                                            <p className="text-green-800 font-bold text-center mb-2 text-sm">Mentorship Accepted!</p>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <a href={`tel:${req.senior.mobile}`} className="flex items-center justify-center space-x-1 bg-white text-green-700 border border-green-200 py-2 rounded hover:bg-green-50 transition">
                                                                    <span>📞 Call</span>
                                                                </a>
                                                                <button
                                                                    onClick={() => setActiveChatUser(req.senior)}
                                                                    className="flex items-center justify-center space-x-1 bg-white text-blue-700 border border-blue-200 py-2 rounded hover:bg-blue-50 transition"
                                                                >
                                                                    <span>💬 Chat (In-App)</span>
                                                                </button>
                                                                <a href={`mailto:${req.senior.email}`} className="col-span-2 flex items-center justify-center space-x-1 bg-white text-gray-700 border border-gray-200 py-2 rounded hover:bg-gray-50 transition">
                                                                    <span>✉️ Email</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    );
                                                } else if (req.status === 'rejected') {
                                                    return (
                                                        <button disabled className="w-full py-2 bg-red-50 text-red-700 font-medium rounded-lg cursor-not-allowed">
                                                            Request Rejected
                                                        </button>
                                                    );
                                                }
                                            }
                                            return (
                                                <button
                                                    onClick={() => handleRequestMentorship(profile.user._id)}
                                                    className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                                                >
                                                    Request Mentorship
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No seniors found matching your filters.
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
            <style jsx>{`
        .input-field {
          @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
        }
      `}</style>

            {activeChatUser && (
                <ChatWindow
                    otherUser={activeChatUser}
                    onClose={() => setActiveChatUser(null)}
                />
            )}
        </div>
    );
}
