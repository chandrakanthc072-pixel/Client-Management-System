import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Trash, Phone, Mail, Calendar, Filter, Users, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const [leads, setLeads] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get('http://localhost:5002/api/leads', {
                    headers: { Authorization: token }
                });
                setLeads(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchLeads();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5002/api/leads/${id}`, {
                headers: { Authorization: token }
            });
            setLeads(leads.filter(lead => lead._id !== id));
        } catch (err) {
            alert('Error deleting lead');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`http://localhost:5002/api/leads/${id}`, 
                { status: newStatus },
                { headers: { Authorization: token } }
            );
            setLeads(leads.map(lead => lead._id === id ? res.data : lead));
        } catch (err) {
            alert('Error updating status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Converted': return 'bg-green-100 text-green-700 border-green-200';
            case 'Lost': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                            <LayoutDashboard className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Dashboard
                            </h1>
                            <p className="text-gray-500">Manage your incoming leads</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200"
                    >
                        <LogOut size={18} /> <span>Sign Out</span>
                    </button>
                </motion.div>

                <div className="glass-panel overflow-hidden border border-gray-200 shadow-xl bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-5 text-gray-500 font-semibold text-sm uppercase tracking-wider">Client</th>
                                    <th className="p-5 text-gray-500 font-semibold text-sm uppercase tracking-wider">Contact</th>
                                    <th className="p-5 text-gray-500 font-semibold text-sm uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-gray-500 font-semibold text-sm uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-gray-500 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {leads.map((lead, index) => (
                                        <motion.tr 
                                            key={lead._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="table-row-hover border-b border-gray-100 last:border-0"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {lead.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="font-semibold text-gray-900">{lead.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-gray-400" /> {lead.email}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gray-400" /> {lead.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold border outline-none cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(lead.status)}`}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Converted">Converted</option>
                                                    <option value="Lost">Lost</option>
                                                </select>
                                            </td>
                                            <td className="p-5 text-gray-500 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Delete Lead"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Users size={32} className="text-gray-400" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-900">No leads found yet</p>
                                                <p className="text-sm text-gray-500">New submissions will appear here</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
