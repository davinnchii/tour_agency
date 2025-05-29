import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import axios from 'axios';
import { API_URL } from '../utils/const';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'agent'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            dispatch(loginSuccess(res.data));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Помилка реєстрації');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Імʼя</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border rounded-md"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded-md"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-md"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Роль</label>
                        <select
                            name="role"
                            className="w-full px-4 py-2 border rounded-md"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="agent">Турагент</option>
                            <option value="operator">Туроператор</option>
                        </select>
                    </div>

                    {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Зареєструватися
                    </button>
                    <p className="text-sm mt-4 text-center">
                        Вже маєте акаунт?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Увійти
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
