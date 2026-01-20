import React from 'react';
import Navbar from '../components/Navbar';

const PageA2: React.FC = () => {
    return (
        <div className="bg-rose-50 min-h-screen text-slate-700 font-sans">
            <Navbar />
            <div className="container mx-auto p-8 pt-24">
                <h1 className="text-4xl font-bold text-slate-800 mb-6">页面 A2</h1>
                <div className="bg-white rounded-lg p-8 shadow-md">
                    <p className="text-lg text-slate-600">我还没想好写什么</p>
                </div>
            </div>
        </div>
    );
};

export default PageA2;