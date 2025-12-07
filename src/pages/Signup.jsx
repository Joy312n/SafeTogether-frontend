import { useState } from "react";
import api from '../services/api';
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (otpSent || isLoading) return; // Prevent duplicate submissions
    setIsLoading(true);
    try {
      // Basic validation
      if(!form.name || !form.email || !form.password) {
        alert("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      
      await api.post("/auth/send-otp", { email: form.email });
      alert(`OTP sent to ${form.email}`);
      setOtpSent(true);
      setStep(2); // Move to OTP step
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Could not send OTP."));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/register", form);
      alert("Signup successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Registration failed."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>

        {step === 1 ? (
          /* STEP 1: User Details Form */
          <form onSubmit={handleRequestOtp} autoComplete="off"  className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold transition disabled:bg-blue-400 hover:cursor-pointer"
            >
              {isLoading ? "Sending OTP..." : "Next: Verify Email"}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to <span className="font-semibold">{form.email}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-center tracking-[0.5em] text-xl font-bold focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="000000"
                required
                maxLength={6}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold transition disabled:bg-green-400 hover:cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Verify & Sign Up"}
            </button>
            <button 
              type="button" 
              onClick={(e) => {
    e.preventDefault(); // <--- ADD THIS
    e.stopPropagation(); // <--- ADD THIS (Optional but safer)
    
    setForm({ ...form, otp: "" });
    setOtpSent(false);
    
    // Optional: Only use this if you are actually using query params
    // window.history.replaceState(null, "", window.location.href);
    
    setStep(1);
  }} 
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline mt-2 hover:cursor-pointer"
            >
              Back to details
            </button>
          </form>
        )}

        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}