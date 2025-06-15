
"use client";
import { useState } from 'react';
import { createUser } from '../../firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '../Components/FormInput';
import FormButton from '../Components/FormButton';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await createUser(email, password, name);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your habit tracker account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-2">
          <FormInput
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
            className="mb-2"
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            className="mb-2"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            className="mb-2"
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
            className="mb-4"
          />

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded mb-4">
              {error}
            </div>
          )}

          <FormButton
            label={loading ? 'Creating account...' : 'Create Account'}
            onClick={() => {}}
            disabled={loading}
            className={`w-full text-white font-medium cursor-pointer ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          />
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}