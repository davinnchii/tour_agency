import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AgentDashboard from '../components/AgentDashboard';
import OperatorDashboard from '../components/OperatorDashboard';
import { logout } from '../features/auth/authSlice';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {t('dashboard.welcome')}, {user.name}!
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        {t('dashboard.logout')}
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    {t('dashboard.role')}: <span className="font-semibold">{user.role}</span>
                </p>

                {user.role === 'agent' ? (
                    <AgentDashboard />
                ) : user.role === 'operator' ? (
                    <OperatorDashboard />
                ) : (
                    <p className="text-red-600">{t('dashboard.unknownRole')}</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
