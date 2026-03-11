import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">Little Genius Spark</div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
          Get Access
        </button>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wide">
          ⭐ 5-Star Rated Educational Resource
        </span>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Ignite Their Potential <br />
          <span className="text-blue-600">with 15,000+ Activities</span>
        </h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          The ultimate digital bundle for Parents, Teachers, and Entrepreneurs. 
          Master early math through engaging, printable, and interactive fun.
        </p>
        <div className="mt-10">
          <button className="bg-yellow-400 text-slate-900 px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all transform hover:-translate-y-1">
            Get Access Now
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">15k+ Activities</h3>
            <p className="text-slate-500">Comprehensive math curriculum covering all early childhood levels.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-4xl mb-4">🖨️</div>
            <h3 className="text-xl font-bold mb-2">Printable PDFs</h3>
            <p className="text-slate-500">High-quality worksheets ready to print and use at home or school.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
            <p className="text-slate-500">Engaging digital games that make learning math feel like play.</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-blue-600 text-white text-center">
        <h2 className="text-2xl font-bold">Trusted by 5,000+ Parents & Educators Worldwide</h2>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-400 border-t border-slate-200">
        <p>© 2026 Little Genius Spark. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
