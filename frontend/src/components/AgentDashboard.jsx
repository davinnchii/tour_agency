// src/components/AgentDashboard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTours,
  setTours,
} from '../features/tours/tourSlice';
import {
  fetchSubscriptions,
  addSubscription,
  removeSubscription,
} from '../features/subscriptions/subscriptionSlice';
import { addRequest, fetchRequests, removeRequest } from '../features/requests/requestsSlice';

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const user = useSelector((state) => state.auth.user)
  const subscriptions = useSelector((state) => state.subscriptions.subscriptions);
  const { requests, loaded } = useSelector(state => state.requests);

  const [showSubs, setShowSubs] = useState(false);

  const handleFetchTours = async () => {
    try {
      const data = await dispatch(fetchTours()).unwrap();
      dispatch(setTours(data.tours));
    } catch (err) {
      console.error('Помилка отримання турів', err);
      alert('Не вдалося завантажити тури');
    }
  };

  const handleSubscribe = async (tour) => {
    const data = {
      destination: tour.country,
      price: tour.price,
      tourId: tour._id
    };
    try {
      await dispatch(addSubscription(data)).unwrap();
      await dispatch(fetchSubscriptions()).unwrap();
      alert('Підписка створена');
    } catch (err) {
      console.error('Помилка створення підписки', err);
      alert('Не вдалося створити підписку');
    }
  };

  const handleFetchRequests = async () => {
    if (showSubs) {
      setShowSubs(false);
      return;
    }

    if (!loaded) {
      try {
        await dispatch(fetchRequests()).unwrap();
      } catch (err) {
        console.error(err);
      }
    }

    setShowSubs(true);
  }

  const handleCreateRequest = async (tour) => {
    const data = {
      tour: tour._id,
      customerName: user.name,
      customerEmail: user.email,
    }

    try {
      await dispatch(addRequest(data)).unwrap();
      await dispatch(fetchRequests()).unwrap();
    } catch (err) {
      console.error('Something went wrong', err, tour)
    }
  }

  const handleDeleteRequest = async (id) => {
    try {
      await dispatch(removeRequest(id)).unwrap();
      await dispatch(fetchRequests()).unwrap;
    } catch (err) {
      console.error(err);
    }
  }

  const handleFetchSubscriptions = async () => {
    try {
      await dispatch(fetchSubscriptions()).unwrap();
      setShowSubs((prev) => !prev);
    } catch (err) {
      console.error('Помилка отримання підписок', err);
    }
  };

  const handleDeleteSubscription = async (id) => {
    console.log(id);
    try {
      await dispatch(removeSubscription(id)).unwrap();
      await dispatch(fetchSubscriptions()).unwrap();
      alert('Підписку видалено');
    } catch (err) {
      console.error('Не вдалося видалити', err);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Дії для агентів</h2>
      <div className="space-y-3 mb-6">
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" onClick={handleFetchTours}>
          Переглянути тури
        </button>
        <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition" onClick={handleFetchRequests}>
          {showSubs ? 'Сховати заявки' : 'Переглянути заявки'}
        </button>
      </div>

      {/* Перегляд турів */}
      {tours.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Доступні тури</h3>
          <ul className="space-y-2">
            {tours.map((tour) => (
              <li key={tour._id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{tour.title}</p>
                  <p className="text-sm text-gray-600">{tour.country}, {tour.price} грн</p>
                </div>
                <button
                  onClick={() => handleCreateRequest(tour)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Подати заявку
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dropdown для заявок */}
      {showSubs && (
        <div>
          <h3 className="text-lg font-bold mb-2">Ваші заявки</h3>
          {requests.length === 0 ? (
            <p>Немає заявок</p>
          ) : (
            <ul className="space-y-2">
              {requests.map((req) => (
                <li key={req._id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p><strong>Напрямок:</strong> {req.tour.country}</p>
                    <p><strong>Ціна:</strong> {req.tour.price} грн</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
