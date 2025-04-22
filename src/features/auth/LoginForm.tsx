import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserLogin } from '../../types/user.type.tsx';

const LoginForm = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<UserLogin>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (err) {
            console.log(err);

            setError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 shadow rounded">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

            <div className="mb-3">
                <label className="block mb-1" htmlFor="email">
                    Email
                </label>
                <input
                    className="w-full border px-3 py-2 rounded"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    className="w-full border px-3 py-2 rounded"
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            >
                Log In
            </button>
        </form>
    );
};

export default LoginForm;
