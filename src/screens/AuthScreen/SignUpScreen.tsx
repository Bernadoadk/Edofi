import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import apiService from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export const SignUpScreen = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      };

      const response = await apiService.signup(userData);
      
      // Login the user and redirect to home page on successful signup
      if (response.data?.user && response.data?.token) {
        login(response.data.user, response.data.token);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-assignment-1white flex items-center justify-center px-4">
      <div className="w-full max-w-[500px]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <img
            src="/src/assets/Fiwè.png"
            alt="Fiwè Logo"
            className="h-16 w-auto"
          />
        </div>

        <Card className="border border-[#e0e0e0] rounded-[20px] shadow-lg">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h1 className="font-['Montserrat',Helvetica] font-bold text-assignment-1dark-bluish-grey text-4xl mb-2">
                Create Account
              </h1>
              <p className="font-['Open_Sans',Helvetica] font-normal text-assignment-1dark-grey text-lg">
                Join Fiwè to discover amazing events
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                  required
                />
              </div>

              <div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-14 px-4 border border-[#d0d0d0] rounded-[10px] font-['Open_Sans',Helvetica] text-lg focus:border-assignment-1dark-navy-blue focus-visible:ring-0"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 text-assignment-1white rounded-[10px] font-['Montserrat',Helvetica] font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
                <span className="px-4 font-['Open_Sans',Helvetica] text-assignment-1dark-grey">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-[#e0e0e0]"></div>
              </div>

              <div className="flex gap-4 justify-center mb-6">
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border border-[#e0e0e0] p-0"
                >
                  <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border border-[#e0e0e0] p-0"
                >
                  <img src="/facebook-icon.svg" alt="Facebook" className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-12 rounded-full border border-[#e0e0e0] p-0"
                >
                  <img src="/apple-icon.svg" alt="Apple" className="w-6 h-6" />
                </Button>
              </div>

              <p className="font-['Open_Sans',Helvetica] text-assignment-1dark-grey">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-assignment-1dark-navy-blue font-semibold hover:underline"
                >
                  Sign In
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};