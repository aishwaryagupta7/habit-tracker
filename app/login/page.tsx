// app/login/page.tsx
"use client";
import { useState } from 'react';
import { signInUser } from '../../firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '../Components/FormInput';
import FormButton from '../Components/FormButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInUser(email, password);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#D9DCDB] to-[#83A2DB] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your habit tracker</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-2">
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
            className="mb-4"
          />

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded mb-4">
              {error}
            </div>
          )}

          <FormButton
            label={loading ? 'Signing in...' : 'Sign In'}
            onClick={() => {}}
            disabled={loading}
            className={`w-full text-white font-semibold ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#1163fc] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          />
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}