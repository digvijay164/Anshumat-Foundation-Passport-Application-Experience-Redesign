import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { Plus, Clock, FileText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/applications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async () => {
    try {
      const { data } = await axios.post('http://localhost:5001/api/applications', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate(`/application/${data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Pending Documents': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Appointment Scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Submitted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-48 bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Applications</h1>
          <p className="text-gray-600 mt-1">Manage, resume drafts, and track your passport applications</p>
        </div>
        <button onClick={createApplication} className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-sm">
          <Plus className="w-5 h-5" />
          <span>New Application</span>
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No applications found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">You haven't started any passport applications yet. Click the button above to begin your journey.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map(app => (
            <div key={app._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                  {app.status === 'Draft' ? 'Draft Saved' : app.status}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {app.personalDetails?.firstName ? `${app.personalDetails.firstName} ${app.personalDetails.lastName || ''}` : 'New Application'}
                </h3>
                <p className="text-sm text-gray-500 font-mono mb-4">ID: {app._id.slice(-6).toUpperCase()}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Last saved: {format(new Date(app.lastSavedAt), 'MMM dd, h:mm a')}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 relative">
                {app.status === 'Draft' || app.status === 'Pending Documents' || app.status === 'Appointment Scheduled' ? (
                  <Link to={`/application/${app._id}`} className="text-primary font-bold flex items-center justify-between w-full hover:text-primary-hover group/link">
                    <span>Resume Draft</span>
                    <div className="p-1 rounded bg-blue-50 group-hover/link:bg-blue-100 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ) : (
                  <Link to={`/confirmation/${app._id}`} className="text-gray-700 font-bold flex items-center justify-between w-full hover:text-gray-900 group/link">
                    <span>View Receipt</span>
                    <div className="p-1 rounded bg-gray-100 group-hover/link:bg-gray-200 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
