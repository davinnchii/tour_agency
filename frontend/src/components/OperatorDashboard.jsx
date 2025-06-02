// OperatorDashboard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { addTour, removeTour } from '../features/tours/tourSlice';
import { getRequests } from '../api/requestService';

const OperatorDashboard = () => {
  const dispatch = useDispatch();

  const handleCreateTour = () => {
    const title = prompt('Назва туру:');
    const description = prompt('Опис туру:');
    const country = prompt('Країна:');
    const price = Number(prompt('Ціна:'));
    const startDate = prompt('Дата початку (YYYY-MM-DD):');
    const endDate = prompt('Дата закінчення (YYYY-MM-DD):');

    if (!title || !description || !country || !price || !startDate || !endDate) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    dispatch(addTour({ title, description, country, price, startDate, endDate }))
      .unwrap()
      .then(() => alert('Тур створено успішно'))
      .catch(() => alert('Помилка при створенні туру'));
  };

  const handleDeleteTour = () => {
    const tourId = prompt('Введіть ID туру, який хочете видалити:');
    if (!tourId) return;

    dispatch(removeTour(tourId))
      .unwrap()
      .then(() => alert('Тур видалено'))
      .catch(() => alert('Не вдалося видалити тур'));
  };

  const handleFetchSubscriptions = async () => {
    try {
      const res = await getRequests();
      alert(`Підписок: ${res.data.length}`);
      console.log('Subscriptions:', res.data);
    } catch (err) {
      console.error('Помилка отримання підписок', err);
      alert('Помилка отримання підписок');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Дії для операторів</h2>
      <button onClick={handleCreateTour} className="btn-green mb-2">Створити новий тур</button>
      <button onClick={handleDeleteTour} className="btn-green mb-2">Видалити тур</button>
      <button onClick={handleFetchSubscriptions} className="btn-green">Керувати підписками</button>
    </div>
  );
};

export default OperatorDashboard;
