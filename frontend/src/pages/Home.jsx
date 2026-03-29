import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Calendar, ShieldCheck, Clock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Home = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-16 py-10">
      {/* Hero Section */}
      <section className="text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-6 border border-blue-100">
          <Clock className="w-4 h-4" />
          <span>Takes only ~10 minutes to complete</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          The New Passport <span className="text-primary">Experience</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          A seamless, transparent, and guided journey to getting your passport. We'll guide you step-by-step through forms, document checklists, and booking your physical appointment limitlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link to="/dashboard" className="btn-primary px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Start New Application
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-300">
                Login to Resume
              </Link>
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12" id="help">Application Overview & Steps</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<FileText className="w-8 h-8 text-blue-600" />}
            title="Step 1: Fill Forms"
            desc="A guided, section-by-section form with Smart Autosave to ensure you never lose your progress."
          />
          <FeatureCard 
            icon={<CheckCircle className="w-8 h-8 text-green-600" />}
            title="Step 2: Upload Docs"
            desc="Clear checklists with visual examples to ensure you upload exactly what is required."
          />
          <FeatureCard 
            icon={<Calendar className="w-8 h-8 text-purple-600" />}
            title="Step 3: Book Appt"
            desc="Pick a time slot securely to visit your local office."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-orange-600" />}
            title="Step 4: Submission"
            desc="Verify everything, submit finally, and download your confirmation receipt!"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;
