// AgentDashboard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../features/tours/tourSlice';
import { createSubscription } from '../api/tourService'; // для підписок поки без редукса

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const tours = useSelector(state => state.tours.tours);
  const loading = useSelector(state => state.tours.loading);

  const handleFetchTours = () => {
    dispatch(fetchTours());
  };

  const handleCreateSubscription = async () => {
    const destination = prompt('Куди хочете тур?');
    const price = Number(prompt('Максимальна ціна?'));
    if (!destination || !price) return;

    try {
      const res = await createSubscription({ destination, price });
      alert('Запит створено');
      console.log(res.data);
    } catch (err) {
      console.error('Помилка створення запиту', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Дії для агентів</h2>
      <button onClick={handleFetchTours} className="btn-primary mb-2">Переглянути тури</button>
      {loading && <p>Завантаження турів...</p>}
      <ul>
        {tours.map(tour => (
          <li key={tour._id}>{tour.title} — {tour.price} грн</li>
        ))}
      </ul>
      <button onClick={handleCreateSubscription} className="btn-primary mt-4">Створити запит</button>
    </div>
  );
};

export default AgentDashboard;
