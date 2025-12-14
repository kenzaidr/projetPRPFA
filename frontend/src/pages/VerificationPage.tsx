import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Scan, Calendar, FileText, ShieldCheck, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

type DocumentStatus = 'empty' | 'scanning' | 'verified' | 'error';

interface DocumentUploadProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onStatusChange: (status: DocumentStatus) => void;
  required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ title, description, icon, onStatusChange }) => {
  const [status, setStatus] = useState<DocumentStatus>('empty');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setStatus('scanning');
      onStatusChange('scanning');

      // Simulate scanning process
      setTimeout(() => {
        setStatus('verified');
        onStatusChange('verified');
      }, 2500);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      onClick={status !== 'verified' ? handleClick : undefined}
      className={`relative border-2 border-dashed rounded-2xl p-5 transition-all duration-300 group cursor-pointer overflow-hidden bg-white
        ${status === 'empty' 
          ? 'border-gray-200 hover:border-morocco-green hover:bg-gradient-to-br hover:from-green-50/50 hover:to-white hover:shadow-md' 
          : ''}
        ${status === 'scanning' 
          ? 'border-morocco-green bg-gradient-to-br from-green-50/30 to-white shadow-md' 
          : ''}
        ${status === 'verified' 
          ? 'border-morocco-green bg-white shadow-lg ring-2 ring-morocco-green/20 cursor-default' 
          : ''}
      `}
    >
      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*,.pdf"
        onChange={handleFileSelect}
      />

      {/* Scanning Animation Overlay */}
      {status === 'scanning' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-morocco-green/10 to-transparent animate-[shimmer_2s_infinite]"></div>
      )}

      {/* Success Badge */}
      {status === 'verified' && (
        <div className="absolute top-3 right-3 w-8 h-8 bg-morocco-green rounded-full flex items-center justify-center shadow-lg z-20">
          <CheckCircle2 size={20} className="text-white" />
        </div>
      )}

      <div className="flex items-start gap-4 relative z-10">
        {/* Icon Container */}
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm
          ${status === 'empty' 
            ? 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-morocco-green/10 group-hover:to-morocco-green/5 group-hover:text-morocco-green' 
            : ''}
          ${status === 'scanning' 
            ? 'bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 text-morocco-green animate-pulse shadow-md' 
            : ''}
          ${status === 'verified' 
            ? 'bg-gradient-to-br from-morocco-green to-morocco-green/80 text-white shadow-lg' 
            : ''}
        `}>
          {status === 'verified' ? <CheckCircle size={28} /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className={`font-bold text-base leading-tight ${status === 'verified' ? 'text-morocco-green' : 'text-gray-900'}`}>
              {title}
            </h4>
          </div>
          
          <p className={`text-xs leading-relaxed mb-2 ${
            status === 'scanning' 
              ? 'text-morocco-green font-medium' 
              : status === 'verified'
              ? 'text-gray-600'
              : 'text-gray-500'
          }`}>
            {status === 'scanning' 
              ? 'Scanning and verifying document...' 
              : status === 'verified' 
              ? `✓ Verified: ${fileName}` 
              : description}
          </p>

          {status === 'empty' && (
            <div className="flex items-center gap-2 text-xs font-semibold text-morocco-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-8px] group-hover:translate-x-0">
              <Upload size={14} />
              <span>Click to upload document</span>
            </div>
          )}

          {status === 'scanning' && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-morocco-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-morocco-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-morocco-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [licenseFront, setLicenseFront] = useState<DocumentStatus>('empty');
  const [licenseBack, setLicenseBack] = useState<DocumentStatus>('empty');
  const [insurance, setInsurance] = useState<DocumentStatus>('empty');
  const [expiryDate, setExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const verifiedCount = [licenseFront, licenseBack, insurance].filter(s => s === 'verified').length;
  const allVerified = licenseFront === 'verified' && licenseBack === 'verified' && insurance === 'verified' && expiryDate !== '';
  const progress = ((verifiedCount + (expiryDate ? 1 : 0)) / 4) * 100;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white to-morocco-green/5 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 moroccan-pattern pointer-events-none opacity-[0.03]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-green/10 to-morocco-red/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-red/10 to-morocco-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 max-w-md w-full">
          {/* Success Icon */}
          <div className="w-28 h-28 bg-gradient-to-br from-morocco-green to-morocco-green/80 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-morocco-green/30 animate-float">
            <ShieldCheck size={56} className="text-white" />
          </div>

          {/* Success Content */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
              Documents Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you for submitting your documents. Our compliance team is now verifying your license and insurance information. You will receive a notification via SMS once your account has been approved.
            </p>
            
            {/* Info Box */}
            <div className="bg-gradient-to-r from-morocco-green/10 to-morocco-green/5 rounded-xl p-4 mb-6 border border-morocco-green/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-morocco-green shrink-0 mt-0.5" size={20} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">What's Next?</p>
                  <p className="text-xs text-gray-600">
                    Verification typically takes 24-48 hours. You'll be able to start accepting rides once approved.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/driver')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white font-bold rounded-xl hover:shadow-xl hover:shadow-morocco-green/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-morocco-green/30 flex items-center justify-center gap-2"
            >
              <span>Return to Dashboard</span>
              <ArrowLeft size={18} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-morocco-sand/40 via-white via-morocco-green/5 to-morocco-red/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 moroccan-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-red/15 to-morocco-green/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-morocco-green/15 to-morocco-gold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Header */}
      <header className="relative z-20 w-full p-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-morocco-red via-morocco-green to-morocco-gold rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-morocco-red/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
            G
          </div>
          <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold bg-clip-text text-transparent">
            Grab Morocco
          </span>
        </Link>

        <Link 
          to="/driver" 
          className="flex items-center gap-2 text-gray-600 hover:text-morocco-green transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        
        {/* Progress Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Document Verification</h2>
                <p className="text-sm text-gray-600">Complete all steps to activate your driver account</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-morocco-red to-morocco-green bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mt-4 text-xs text-gray-600">
              <span className={licenseFront === 'verified' && licenseBack === 'verified' ? 'text-morocco-green font-semibold' : ''}>
                License {licenseFront === 'verified' && licenseBack === 'verified' ? '✓' : ''}
              </span>
              <span className={insurance === 'verified' ? 'text-morocco-green font-semibold' : ''}>
                Insurance {insurance === 'verified' ? '✓' : ''}
              </span>
              <span className={expiryDate ? 'text-morocco-green font-semibold' : ''}>
                Expiry Date {expiryDate ? '✓' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50">
          {/* Gradient Top Border */}
          <div className="h-1 bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-gold"></div>
          
          <div className="p-6 md:p-8 space-y-8">
              
              {/* Section 1: Driver License */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 flex items-center justify-center text-morocco-green font-bold text-lg shadow-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Driver's License</h3>
                    <p className="text-xs text-gray-500">Upload both sides of your license</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <DocumentUpload 
                    title="Front Side" 
                    description="Upload a clear photo of the front of your license showing your photo and details."
                    icon={<FileText size={24} />}
                    onStatusChange={setLicenseFront}
                  />
                  <DocumentUpload 
                    title="Back Side" 
                    description="Upload a clear photo of the back of your license showing the expiration date."
                    icon={<FileText size={24} />}
                    onStatusChange={setLicenseBack}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Section 2: Insurance */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-morocco-green/20 to-morocco-green/10 flex items-center justify-center text-morocco-green font-bold text-lg shadow-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Vehicle Insurance</h3>
                    <p className="text-xs text-gray-500">Provide your insurance certificate</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <DocumentUpload 
                    title="Insurance Certificate" 
                    description="Upload your valid insurance green card or certificate (PDF or image)."
                    icon={<ShieldCheck size={24} />}
                    onStatusChange={setInsurance}
                  />
                  
                  {/* Expiry Date Input */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 hover:border-morocco-green/50 transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-morocco-green" />
                      Insurance Expiry Date
                    </label>
                    <div className="relative max-w-md">
                      <input 
                        type="date" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-morocco-green/50 focus:border-morocco-green outline-none transition-all bg-white text-gray-900 font-medium"
                      />
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Must be valid for at least 3 months from today
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!allVerified || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group
                    ${allVerified 
                      ? 'bg-gradient-to-r from-morocco-red via-morocco-green to-morocco-red text-white hover:shadow-xl hover:shadow-morocco-green/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        <span>Submit Documents for Approval</span>
                      </>
                    )}
                  </span>
                  {allVerified && (
                    <div className="absolute inset-0 bg-gradient-to-r from-morocco-green via-morocco-red to-morocco-green bg-[length:200%_100%] animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                </button>
              </div>

          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-xs mt-6 pb-4">
          <ShieldCheck size={14} className="inline mr-1" />
          All information is encrypted and securely stored. We verify documents manually within 24-48 hours.
        </p>
      </main>
    </div>
  );
};

export default VerificationPage;
