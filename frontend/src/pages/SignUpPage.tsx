import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser, isSigningUp, signUp }: any = useAuthStore();

  const validateForm: any = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");
    try {
      await signUp(formData);
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-500 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              placeholder="Enter your username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Enter your password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mt-1 text-sm text-blue-500 hover:underline"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white font-semibold rounded ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
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
