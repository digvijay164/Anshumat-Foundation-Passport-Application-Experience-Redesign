import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { Check, ChevronRight, AlertCircle, Clock, Upload, Calendar as CalendarIcon, FileImage, ShieldCheck, Mail, Info } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Details', hint: 'Basic identifying information' },
  { id: 2, name: 'Address Details', hint: 'Where you currently reside' },
  { id: 3, name: 'Identity Info', hint: 'National ID verification' },
  { id: 4, name: 'Documents', hint: 'Upload required files' },
  { id: 5, name: 'Appointment', hint: 'Pick a physical slot' },
  { id: 6, name: 'Review & Submit', hint: 'Final verification' }
];

const ApplicationFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (id) {
      fetchApplication();
    } else {
      createApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5001/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const appData = {
        ...data,
        personalDetails: data.personalDetails || { firstName: '', lastName: '', dob: '', gender: '', placeOfBirth: '' },
        addressDetails: data.addressDetails || { street: '', city: '', state: '', zipCode: '', country: '' },
        identityInformation: data.identityInformation || { nationalIdType: '', nationalIdNumber: '' },
        documents: data.documents || []
      };
      setApplication(appData);
      setLastSaved(appData.lastSavedAt);
      
      // Smart resume logic
      if(appData.status === 'Pending Documents') setCurrentStep(4);
      else if(appData.status === 'Appointment Scheduled') setCurrentStep(5);
      else if(appData.status === 'Submitted') navigate(`/confirmation/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5001/api/applications`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate(`/application/${data._id}`, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (stepData, isDraftSave = false, finalSubmit = false) => {
    setSaving(true);
    let updatePayload = { ...stepData };
    
    if (finalSubmit) {
      updatePayload.status = 'Submitted';
    }

    try {
      const { data } = await axios.put(`http://localhost:5001/api/applications/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setLastSaved(data.lastSavedAt);
      
      if (finalSubmit) {
        navigate(`/confirmation/${id}`);
      } else if (isDraftSave) {
        // Just show saved state, optionally navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Autosave failed', error);
      alert('Network error while saving. Please ensure you have internet connection.');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = (stepData) => {
    handleSave(stepData);
    if(currentStep < STEPS.length) {
      setCurrentStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if(currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading || !application) return <div className="text-center py-20 animate-pulse text-gray-500 font-medium">Loading your draft securely...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Saving Indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Application Flow</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            ID: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{application._id.slice(-6).toUpperCase()}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm">
            {saving ? (
              <span className="flex items-center text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full font-bold border border-blue-200 shadow-sm transition-all duration-300">
                <span className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm transition-all duration-300">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                Saved {lastSaved ? new Date(lastSaved).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'just now'}
              </span>
            )}
          </div>
          <button 
            onClick={() => handleSave({}, true)} 
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 bg-white px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            Save as Draft & Exit
          </button>
        </div>
      </div>

      {/* Progress Bar (Visual Hierarchy requirement) */}
      <div className="mb-12">
        <div className="flex justify-between relative z-10 px-2 sm:px-0">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center group relative z-10 w-full" title={step.hint}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 z-20
                  ${isCompleted ? 'bg-primary text-white border-none scale-95' : 
                    isCurrent ? 'bg-white border-[3px] border-primary text-primary scale-110 shadow-md' : 
                    'bg-white border-2 border-gray-200 text-gray-400 opacity-70'}
                `}>
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="hidden sm:block text-xs font-semibold mt-3 text-center text-gray-500 w-24">
                  <span className={isCurrent ? 'text-primary' : ''}>{step.name}</span>
                </div>
                {/* Connecting Line */}
                {idx < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[3px] -z-10 transition-colors duration-500
                    ${isCompleted ? 'bg-primary' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 min-h-[450px]">
        {currentStep === 1 && (
          <PersonalDetails 
            data={application.personalDetails} 
            onNext={(data) => nextStep({ personalDetails: data })} 
          />
        )}
        {currentStep === 2 && (
          <AddressDetails 
            data={application.addressDetails} 
            onPrev={prevStep} 
            onNext={(data) => nextStep({ addressDetails: data })} 
          />
        )}
        {currentStep === 3 && (
          <IdentityInformation 
            data={application.identityInformation} 
            onPrev={prevStep} 
            onNext={(data) => nextStep({ identityInformation: data, status: 'Pending Documents' })} 
          />
        )}
        {currentStep === 4 && (
          <DocumentUpload 
            data={application.documents} 
            onPrev={prevStep} 
            onNext={(data) => nextStep({ documents: data })} 
          />
        )}
        {currentStep === 5 && (
          <AppointmentBooking 
            appId={application._id}
            existing={application.appointmentId}
            onPrev={prevStep} 
            onNext={(data) => nextStep({ appointmentId: data, status: 'Appointment Scheduled' })} 
          />
        )}
        {currentStep === 6 && (
          <ReviewSubmit 
            application={application} 
            onPrev={prevStep} 
            onSubmit={() => handleSave(null, false, true)} 
          />
        )}
      </div>
    </div>
  );
};

/* --- STEP COMPONENTS --- */

const PersonalDetails = ({ data, onNext }) => {
  const [form, setForm] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-500 mt-1">Please enter your name exactly as you want it to appear on the passport.</p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="form-label">First Name *</label>
          <input required type="text" className="form-input" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} placeholder="e.g. John" />
        </div>
        <div>
          <label className="form-label">Last Name *</label>
          <input required type="text" className="form-input" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} placeholder="e.g. Doe" />
        </div>
        <div>
          <label className="form-label">Date of Birth *</label>
          <input required type="date" className="form-input" max={new Date().toISOString().split('T')[0]} value={form.dob} onChange={e=>setForm({...form, dob: e.target.value})} />
        </div>
        <div>
          <label className="form-label">Gender *</label>
          <select required className="form-input" value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="form-label flex items-center gap-1">Place of Birth * <Info className="w-3.5 h-3.5 text-gray-400" title="City, State, or Country" /></label>
          <input required type="text" className="form-input" value={form.placeOfBirth} onChange={e=>setForm({...form, placeOfBirth: e.target.value})} placeholder="City, Country" />
        </div>
      </div>
      
      <div className="mt-10 flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" className="btn-primary py-3 px-8 text-base">
          Save & Continue <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </form>
  );
};

const AddressDetails = ({ data, onPrev, onNext }) => {
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(form); }} className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Address Details</h2>
        <p className="text-gray-500 mt-1">Provide your current residential address. Your passport process may require police verification here.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="form-label">Street Address *</label>
          <input required type="text" className="form-input" value={form.street} onChange={e=>setForm({...form, street: e.target.value})} placeholder="123 Main St, Apt 4B" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="form-label">City *</label>
            <input required type="text" className="form-input" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} placeholder="New York" />
          </div>
          <div>
            <label className="form-label">State/Province *</label>
            <input required type="text" className="form-input" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} placeholder="NY" />
          </div>
          <div>
            <label className="form-label">Zip/Postal Code *</label>
            <input required type="text" className="form-input" value={form.zipCode} onChange={e=>setForm({...form, zipCode: e.target.value})} placeholder="10001" />
          </div>
          <div>
            <label className="form-label">Country *</label>
            <input required type="text" className="form-input" value={form.country} onChange={e=>setForm({...form, country: e.target.value})} placeholder="USA" />
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="btn-secondary py-3 px-6 shadow-none">Back</button>
        <button type="submit" className="btn-primary py-3 px-8 text-base">Save & Continue <ChevronRight className="w-5 h-5 ml-1" /></button>
      </div>
    </form>
  );
};

const IdentityInformation = ({ data, onPrev, onNext }) => {
  const [form, setForm] = useState(data);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(form); }} className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Identity Verification</h2>
        <p className="text-gray-500 mt-1">Select the primary national ID you will provide.</p>
      </div>
      
      <div className="space-y-6 max-w-lg">
        <div>
          <label className="form-label">National ID Type *</label>
          <select required className="form-input py-3" value={form.nationalIdType} onChange={e=>setForm({...form, nationalIdType: e.target.value})}>
            <option value="">-- Select ID Type --</option>
            <option value="Aadhaar">Aadhaar Card</option>
            <option value="PAN">PAN Card</option>
            <option value="SSN">SSN</option>
            <option value="StateID">State ID / Driving License</option>
          </select>
          <div className="flex bg-blue-50 text-blue-800 text-sm p-3 rounded-lg mt-3">
            <Info className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
            <p>You will need to upload a scanned PDF or clear photo of this specific document in the next step. Ensure it matches your legal name above.</p>
          </div>
        </div>
        <div>
          <label className="form-label">ID Number *</label>
          <input required type="text" className="form-input uppercase tracking-wider py-3" placeholder="XXXX-XXXX-XXXX" value={form.nationalIdNumber} onChange={e=>setForm({...form, nationalIdNumber: e.target.value})} />
        </div>
      </div>
      
      <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="btn-secondary py-3 px-6 shadow-none">Back</button>
        <button type="submit" className="btn-primary py-3 px-8 text-base">Save & Continue <ChevronRight className="w-5 h-5 ml-1" /></button>
      </div>
    </form>
  );
};

const DocumentUpload = ({ data, onPrev, onNext }) => {
  const [documents, setDocuments] = useState(data);
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore(s => s.user);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if(!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
      });
      const newDoc = { type, url: res.data.url, status: 'Uploaded' };
      setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
    } catch(err) {
      alert("Upload failed. Make sure you are uploading a valid image or PDF.");
    } finally {
      setUploading(false);
    }
  };

  const docConfig = [
    { type: 'Proof of Identity', help: 'The ID selected in the previous step (e.g. Aadhaar, SSN). Front & Back if applicable.' },
    { type: 'Proof of Address', help: 'Utility bill, bank statement, or registered rent agreement.' },
    { type: 'Recent Photograph', help: 'White background, looking straight, no glasses.' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Required Documents</h2>
        <p className="text-gray-600">Please upload clear, legible copies. Max size per file: 5MB.</p>
      </div>
      
      <div className="space-y-5 mb-8">
        {docConfig.map(doc => {
          const status = documents.find(d => d.type === doc.type)?.status || 'Pending';
          return (
            <div key={doc.type} className={`border p-4 rounded-xl flex sm:items-center flex-col sm:flex-row gap-4 justify-between transition-colors ${status === 'Uploaded' ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-blue-300'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full mt-1 sm:mt-0 shadow-sm ${status === 'Uploaded' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {status === 'Uploaded' ? <Check className="w-6 h-6" /> : <FileImage className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{doc.type}</h4>
                  <p className="text-sm text-gray-500 my-1 max-w-md line-clamp-2">{doc.help}</p>
                  <p className={`text-xs font-semibold uppercase tracking-wide mt-2 ${status === 'Uploaded' ? 'text-green-600' : 'text-gray-400'}`}>
                    {status === 'Uploaded' ? 'Successfully Attached' : 'Awaiting Upload'}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <label className={`cursor-pointer w-full text-center block sm:inline-block btn-secondary bg-white py-2 px-6 shadow-sm border border-gray-300 hover:bg-gray-50 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleUpload(e, doc.type)} />
                  {status === 'Uploaded' ? 'Replace file' : 'Browse Files'}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="btn-secondary py-3 px-6 shadow-none">Back</button>
        <button 
          onClick={() => onNext(documents)} 
          disabled={documents.length < 3}
          className="btn-primary py-3 px-8 text-base disabled:opacity-50 disabled:cursor-not-allowed group"
          title={documents.length < 3 ? "Upload all 3 documents to continue" : ""}
        >
          {documents.length < 3 ? 'Upload All Docs to Proceed' : 'Save & Continue'}
          {documents.length === 3 && <ChevronRight className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </div>
  );
};

const AppointmentBooking = ({ appId, existing, onPrev, onNext }) => {
  const [slots, setSlots] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('New York Passport Office');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if(selectedDate && selectedLocation) {
      axios.get(`http://localhost:5001/api/appointments/available?date=${selectedDate}&location=${selectedLocation}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => {
        setSlots(res.data);
        setSelectedTime('');
      });
    }
  }, [selectedDate, selectedLocation, user]);

  const handleBook = async () => {
    if(!selectedDate || !selectedTime) return alert("Select Date and Time");
    setBooking(true);
    try {
      const { data } = await axios.post('http://localhost:5001/api/appointments/book', {
        applicationId: appId,
        location: selectedLocation,
        date: selectedDate,
        timeSlot: selectedTime
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onNext(data._id);
    } catch(err) {
      alert(err.response?.data?.message || 'Booking failed. Try a different slot.');
    } finally {
      setBooking(false);
    }
  };

  if(existing) {
    return (
      <div className="text-center py-12 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm ring-1 ring-gray-100">
          <CalendarIcon className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold mb-3 text-gray-900">Appointment Locked!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">Your biometric appointment is securely reserved. Head to the final review page to confirm everything.</p>
        <div className="mt-8 flex justify-between border-t border-gray-100 pt-8 w-full">
          <button type="button" onClick={onPrev} className="btn-secondary py-3 px-6 shadow-none">Back</button>
          <button onClick={() => onNext(existing)} className="btn-primary py-3 px-8 text-base">Proceed to Final Review <ChevronRight className="w-5 h-5 ml-1" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Book an Appointment</h2>
        <p className="text-gray-600">Select an office and find a timeslot that works for you.</p>
      </div>

      <div className="space-y-8 max-w-xl">
        <div>
          <label className="form-label font-bold text-gray-900">1. Select Passport Office</label>
          <select className="form-input mt-2 py-3 bg-gray-50 border-gray-300 shadow-sm" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            <option>New York Passport Office</option>
            <option>Los Angeles Passport Center</option>
            <option>Chicago Regional Office</option>
            <option>Houston Passport Agency</option>
          </select>
        </div>
        
        <div>
          <label className="form-label font-bold text-gray-900">2. Pick a Date</label>
          <input type="date" className="form-input mt-2 py-3 font-mono shadow-sm" min={new Date().toISOString().split('T')[0]} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        
        {selectedDate && (
          <div className="animate-in fade-in duration-300">
            <label className="form-label font-bold text-gray-900 mb-3 block">3. Select Time</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all ${selectedTime === slot ? 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-2' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-blue-50 hover:text-primary'}`}
                >
                  {slot}
                </button>
              ))}
              {slots.length === 0 && <p className="col-span-3 text-red-500 text-sm p-4 bg-red-50 rounded">No availability for this date. Check another date.</p>}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-12 flex justify-between pt-6 border-t border-gray-100">
        <button type="button" onClick={onPrev} className="btn-secondary py-3 px-6 shadow-none">Back</button>
        <button 
          onClick={handleBook}
          disabled={!selectedDate || !selectedTime || booking}
          className="btn-primary py-3 px-8 text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {booking ? 'Locking Slot...' : 'Confirm Booking'} <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

const ReviewSubmit = ({ application, onPrev, onSubmit }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          Final Review
        </h2>
        <p className="text-gray-600">Please verify all your details before final submission.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Applicant Overview</h4>
          <p className="text-gray-900 font-bold text-xl mb-1">{application.personalDetails?.firstName} {application.personalDetails?.lastName}</p>
          <p className="text-gray-600 font-medium">DOB: {application.personalDetails?.dob} • Gender: {application.personalDetails?.gender}</p>
          <div className="mt-4 pt-4 border-t border-gray-200 border-dashed">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</h4>
            <p className="text-gray-800">{application.addressDetails?.street}, {application.addressDetails?.city}</p>
            <p className="text-gray-800">{application.addressDetails?.state} - {application.addressDetails?.zipCode}, {application.addressDetails?.country}</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 p-5 rounded-2xl bg-white shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Identity Info</h4>
            <p className="text-gray-900 font-bold mb-1">{application.identityInformation?.nationalIdType}</p>
            <p className="text-gray-600 font-mono tracking-wide">{application.identityInformation?.nationalIdNumber}</p>
            
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">Documents Attached</h4>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <p className="text-gray-900 font-medium text-sm">{application.documents?.length || 0} / 3 Uploaded</p>
            </div>
          </div>
          
          <div className="border border-green-200 bg-green-50 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-3">Appointment Booked</h4>
            <p className="text-green-900 font-bold leading-tight mb-2">Slot confirmed! Exact details provided on success screen.</p>
            <CalendarIcon className="w-16 h-16 text-green-600/10 absolute -bottom-2 -right-2" />
          </div>
        </div>
      </div>

      <div className="mt-10 bg-orange-50/50 border border-orange-100 p-5 rounded-xl">
        <label className="flex items-start gap-4 cursor-pointer group">
          <input type="checkbox" required className="mt-1 w-6 h-6 text-primary border-gray-300 rounded focus:ring-primary shadow-sm" />
          <span className="text-sm font-medium text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
            I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that submitting false or misleading information is a punishable offense under national law.
          </span>
        </label>
      </div>

      <div className="mt-10 flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrev} className="btn-secondary py-3.5 px-6 shadow-none font-bold">Back to Review</button>
        <button onClick={onSubmit} className="btn-primary py-3.5 px-10 text-lg font-bold shadow-md hover:shadow-xl hover:bg-blue-700 focus:ring-opacity-50 transition-all bg-blue-600">
          Confirm & Submit Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationFlow;
