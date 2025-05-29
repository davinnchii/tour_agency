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

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const subscriptions = useSelector((state) => state.subscriptions.subscriptions);

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
        <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition" onClick={handleFetchSubscriptions}>
          {showSubs ? 'Сховати заявки' : 'Переглянути заявки'}
        </button>
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition" onClick={async () => {
          const destination = prompt('Куди?');
          const price = prompt('Макс. ціна?');
          if (destination && price) {
            await handleSubscribe({ country: destination, price: Number(price) });
          }
        }}>
          Створити заявку вручну
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
                  onClick={() => handleSubscribe(tour)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Підписатися
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
          {subscriptions.length === 0 ? (
            <p>Немає заявок</p>
          ) : (
            <ul className="space-y-2">
              {subscriptions.map((sub) => (
                <li key={sub._id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p><strong>Напрямок:</strong> {sub.destination}</p>
                    <p><strong>Ціна:</strong> {sub.price} грн</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubscription(sub._id)}
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
