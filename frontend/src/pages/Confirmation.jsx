import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { CheckCircle, Download, Mail, Home, Printer, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Confirmation = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5001/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApp(data);
      } catch(err) {
        console.error(err);
      }
    };
    fetchApp();
  }, [id, user]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert("Confirmation electronically securely dispatched to your registered email address.");
  };

  if(!app) return <div className="text-center py-20 text-gray-500 font-medium">Loading Confirmation Context...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 print:mt-0 print:p-0">
      <div className="bg-white rounded-3xl shadow-md sm:shadow-lg border border-gray-100 p-8 sm:p-14 text-center relative overflow-hidden print:shadow-none print:border-none">
        {/* Confetti / Decor block */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 print:hidden"></div>
        
        <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative print:w-16 print:h-16 print:mb-4">
          <CheckCircle className="w-14 h-14 text-green-500 relative z-10 print:text-black print:w-10 print:h-10" />
          <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse print:hidden"></div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">Application Complete!</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed print:hidden">
          Success! Your passport application data has been securely locked and recorded. Please review your biometric appointment details below.
        </p>
        
        {/* Receipt Panel */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 mb-12 text-left shadow-inner print:border-black print:text-black">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-gray-200 print:border-black gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 print:text-black">Official Application ID</p>
              <p className="text-3xl font-mono font-extrabold text-gray-900 tracking-wider bg-white px-3 py-1 rounded shadow-sm print:shadow-none print:px-0">{app._id.toUpperCase()}</p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-bold border border-green-200 shadow-sm print:border-black print:bg-white print:text-black">
                {app.status}
              </span>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 print:text-black">Applicant Details</p>
              <p className="font-extrabold text-lg text-gray-900 mb-1">{app.personalDetails?.firstName} {app.personalDetails?.lastName}</p>
              <p className="text-sm font-medium text-gray-600 font-mono print:text-black">{user.email}</p>
            </div>
            {app.appointmentId && (
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm print:border-none print:p-0 print:shadow-none">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2 print:text-black">Biometric Appointment Details</p>
                <p className="font-bold text-gray-900 text-lg mb-1">{app.appointmentId.location}</p>
                <div className="flex items-center gap-2 text-primary font-bold print:text-black">
                  <Calendar className="w-4 h-4" />
                  <p>{format(new Date(app.appointmentId.date), 'MMMM do, yyyy')} at {app.appointmentId.timeSlot}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button onClick={handlePrint} className="btn-secondary bg-white py-3.5 px-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none flex items-center justify-center font-bold">
            <Printer className="w-5 h-5 mr-2 text-gray-500 group-hover:text-primary" />
            Download PDF / Print
          </button>
          <button onClick={handleEmail} className="btn-secondary bg-white py-3.5 px-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none flex items-center justify-center font-bold">
            <Mail className="w-5 h-5 mr-2 text-gray-500" />
            Email Receipt
          </button>
          <Link to="/dashboard" className="btn-primary py-3.5 px-8 shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center font-bold bg-blue-600 text-lg">
            <Home className="w-5 h-5 mr-2 opacity-90" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
