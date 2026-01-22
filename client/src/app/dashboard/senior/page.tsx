"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User as UserIcon, Briefcase, Linkedin, Check, X, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default function SeniorDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChatUser, setActiveChatUser] = useState(null);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch("http://10.221.219.27:5000/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            console.error(error);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            const token = localStorage.getItem("token") || user?.token;
            const res = await fetch(`http://10.221.219.27:5000/api/requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchRequests(); // Refresh list
                alert(`Request ${status} successfully`);
            } else {
                alert("Failed to update request");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchRequests();
        }
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Senior Dashboard</h1>
                        <p className="text-gray-600">Manage your profile and requests</p>
                    </div>
                    <button onClick={logout} className="text-red-600 text-sm font-medium hover:text-red-800">
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div>Loading profile...</div>
                ) : profile ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
                            <div className="flex flex-col items-center">
                                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mb-4">
                                    {profile.name[0]}
                                </div>
                                <h2 className="text-xl font-bold">{profile.name}</h2>
                                <p className="text-gray-500">{profile.email}</p>

                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        {profile.profile?.currentPosition || "Position not set"}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        {profile.college} ({profile.profile?.passingYear})
                                    </div>
                                    {profile.profile?.linkedin && (
                                        <a href={profile.profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn Profile
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Requests / Stats Area */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="text-lg font-bold mb-4">Mentorship Status</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <span className="block text-2xl font-bold text-blue-600">
                                        {requests.filter(r => r.status === 'pending').length}
                                    </span>
                                    <span className="text-sm text-gray-600">Pending Requests</span>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <span className="block text-2xl font-bold text-green-600">
                                        {requests.filter(r => r.status === 'accepted').length}
                                    </span>
                                    <span className="text-sm text-gray-600">Active Mentees</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mt-8 mb-4">Incoming Requests</h3>
                            {requests.length === 0 ? (
                                <div className="text-gray-500 text-sm italic border-dashed border-2 border-gray-200 rounded-lg p-8 text-center">
                                    No new mentorship requests yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((req) => (
                                        <div key={req._id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-100">
                                            <div>
                                                <p className="font-bold text-gray-900">{req.junior.name}</p>
                                                <p className="text-sm text-gray-600">{req.junior.college} • {req.junior.department}</p>
                                                {req.message && <p className="text-sm text-gray-500 mt-1">"{req.message}"</p>}
                                                <div className="mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            {req.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, 'accepted')}
                                                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
                                                        title="Accept"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                            {req.status === 'accepted' && (
                                                <button
                                                    onClick={() => setActiveChatUser(req.junior)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                                    title="Chat"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>Failed to load profile.</div>
                )}
            </div>
            <Footer />
            {activeChatUser && (
                <ChatWindow
                    otherUser={activeChatUser}
                    onClose={() => setActiveChatUser(null)}
                />
            )}
        </div>
    );
}
