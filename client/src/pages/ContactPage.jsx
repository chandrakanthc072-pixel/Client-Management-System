import React, { useState } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' }); // message -> notes usually
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('http://localhost:5000/api/leads', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                // treating initial message as a note could be good, but schema has notes array.
                // For simplicity, we might just drop it or add to notes if backend supports.
                // Let's assume sending just basic info for now.
            });
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 transform transition-all hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Get in Touch</h2>
                {status === 'success' && (
                    <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        Message sent successfully! We'll be in touch soon.
                    </div>
                )}
                {status === 'error' && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        Something went wrong. Please try again.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? 'Sending...' : (
                            <>
                                Send Request <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
