import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSigningUp, signUp }: any = useAuthStore();

  const validateForm: any = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        formData.password
      )
    ) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return false;
    }
    if (formData.password.includes(" ")) {
      toast.error("Password cannot contain spaces");
      return false;
    }
    if (formData.email.includes(" ")) {
      toast.error("Email cannot contain spaces");
      return false;
    }
    if (formData.email.length > 50) {
      toast.error("Email cannot exceed 50 characters");
      return false;
    }
    if (formData.password.length > 50) {
      toast.error("Password cannot exceed 50 characters");
      return false;
    }
    if (formData.email.length < 5) {
      toast.error("Email must be at least 5 characters long");
      return false;
    }
    if (formData.name.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    }
    if (formData.name.length > 20) {
      toast.error("Username cannot exceed 20 characters");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await signUp(formData);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response.data.message || "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full h-10vh flex items-center justify-center mb-8">
        <p className="text-center text-4xl">Welcome to chatty!</p>
      </div>
      <div className="w-full max-w-md p-8 bg-gray-500 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.name}
              placeholder="Enter your username"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="text"
              value={formData.email}
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="flex focus:ring focus:ring-blue-200 border rounded focus:outline-none items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Enter your password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="me-3 text-sm text-blue-500 hover:underline"
              >
                {showPassword ? <Eye/> : <EyeOff/>}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isSigningUp}
            className={`w-full px-4 py-2 text-white font-semibold rounded ${
              isSubmitting || isSigningUp
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting || isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
