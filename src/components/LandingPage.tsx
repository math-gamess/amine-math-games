import React from 'react';
import { 
  CheckCircle2, 
  Star, 
  Download, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Calculator, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  Mail,
  Lock,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const Testimonial = ({ name, role, content }: { name: string, role: string, content: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-slate-600 italic mb-6 flex-grow">"{content}"</p>
    <div>
      <p className="font-bold text-slate-900">{name}</p>
      <p className="text-sm text-slate-500">{role}</p>
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-2 text-slate-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function LandingPage() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* SEO Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Little Genius Spark</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#math" className="hover:text-indigo-600 transition-colors">Math Focus</a>
            <a href="#plr" className="hover:text-indigo-600 transition-colors">Resell Rights</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Admin</Link>
          </nav>
          <a href="#pricing" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Access
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Star className="w-4 h-4 fill-yellow-600" />
                <span>5-Star Rated Educational Resource</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Ignite Their Potential with <span className="text-indigo-600">15,000+</span> Activities
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                The ultimate digital bundle for Parents, Teachers, and Entrepreneurs. 
                Featuring <span className="font-semibold text-slate-900">Math Games for Kids</span>, 
                <span className="font-semibold text-slate-900">Printable Preschool Activities</span>, and a 
                <span className="font-semibold text-slate-900">Homeschool Planner 2026</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#pricing" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download the Bundle Now
                </a>
                <div className="flex items-center justify-center gap-4 px-6 py-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-8 h-8 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-500">Joined by 2,500+ educators</span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Math Focus Section */}
        <section id="math" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Master Early Math Through <span className="text-indigo-600">Playful Discovery</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  We believe math shouldn't be a chore. Our "Math Focus" collection simplifies complex concepts into bite-sized, engaging games that kids actually want to play.
                </p>
                <ul className="space-y-4">
                  {[
                    "Interactive Logic Puzzles for critical thinking",
                    "Visual Literacy & Phonics worksheets",
                    "Step-by-step Math Games for early learners",
                    "Engaging Kindergarten-ready curriculum"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-emerald-100 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <Calculator className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="font-bold mb-2">Number Sense</h3>
                    <p className="text-sm text-slate-500">Foundational counting and quantity recognition.</p>
                  </div>
                  <div className="bg-indigo-600 p-6 rounded-3xl text-white">
                    <BookOpen className="w-10 h-10 mb-4" />
                    <h3 className="font-bold mb-2">Literacy</h3>
                    <p className="text-sm text-indigo-100">Phonics and vocabulary building blocks.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-500 p-6 rounded-3xl text-white">
                    <Calendar className="w-10 h-10 mb-4" />
                    <h3 className="font-bold mb-2">2026 Planner</h3>
                    <p className="text-sm text-emerald-50/80">Bonus: Fully editable Canva teaching template.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <Zap className="w-10 h-10 text-yellow-500 mb-4" />
                    <h3 className="font-bold mb-2">Logic Puzzles</h3>
                    <p className="text-sm text-slate-500">Problem-solving skills for tiny geniuses.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLR Section */}
        <section id="plr" className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Buy Once, <span className="text-indigo-400">Sell Forever</span></h2>
              <p className="text-xl text-slate-400">
                Unlock unrestricted Master Resell Rights (MRR). Launch your own digital product store in minutes with high-quality content you didn't have to create.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "100% Profit",
                  desc: "Keep every single penny from every sale. No royalties, no hidden fees."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8" />,
                  title: "Unrestricted PLR",
                  desc: "Edit, rebrand, and customize the content to match your brand identity."
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Instant Launch",
                  desc: "Skip months of product development. Download and start selling today."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                  <div className="text-indigo-400 mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] -z-0" />
        </section>

        {/* Social Proof */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">What Educators Are Saying</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Testimonial 
                name="Sarah Jenkins" 
                role="Homeschooling Mom" 
                content="This bundle saved me 10 hours a week in lesson planning. The math games are my son's favorite part of the day!" 
              />
              <Testimonial 
                name="Marcus Thorne" 
                role="Digital Entrepreneur" 
                content="The MRR rights are a game-changer. I rebranded the bundle and made my investment back in the first 48 hours." 
              />
              <Testimonial 
                name="Elena Rodriguez" 
                role="Preschool Teacher" 
                content="The quality of the printable activities is outstanding. My classroom has never been more engaged with logic puzzles." 
              />
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-indigo-600 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Spark Genius?</h2>
                <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  Get the full 15,000+ activity bundle, the 2026 Homeschool Planner, and full Resell Rights for one low price.
                </p>
                <div className="inline-block bg-white text-slate-900 p-8 rounded-3xl shadow-2xl mb-10">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Limited Time Offer</p>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl text-slate-400 line-through">$197</span>
                    <span className="text-6xl font-black text-indigo-600">$47</span>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <Download className="w-6 h-6" />
                    Get Instant Access
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-8 opacity-80">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Stripe & PayPal Accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <FAQItem 
                question="What exactly is included in the bundle?" 
                answer="You get over 15,000 digital files including math games, logic puzzles, literacy worksheets, and coloring pages. Plus, the 2025-2026 Homeschool Teaching Planner as an editable Canva template." 
              />
              <FAQItem 
                question="How do the Resell Rights (MRR) work?" 
                answer="With Master Resell Rights, you can sell the product to others as your own. You keep 100% of the profits. You can also grant your customers the right to resell it too!" 
              />
              <FAQItem 
                question="Is the Homeschool Planner easy to edit?" 
                answer="Yes! It's built in Canva. You'll receive a link that opens directly in your Canva account (free or pro) where you can change colors, fonts, and layouts in seconds." 
              />
              <FAQItem 
                question="How do I receive my files?" 
                answer="Immediately after purchase, you'll receive an email with a secure download link. All files are organized in folders for easy access." 
              />
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
              <p className="text-slate-600">Drop us a message and our team will get back to you within 24 hours.</p>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="How can we help?"></textarea>
              </div>
              <button 
                disabled={formStatus !== 'idle'}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {formStatus === 'idle' && <><Mail className="w-5 h-5" /> Send Message</>}
                {formStatus === 'sending' && "Sending..."}
                {formStatus === 'success' && "Message Sent Successfully!"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Little Genius Spark</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Affiliates</a>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Little Genius Spark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
