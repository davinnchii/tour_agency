// src/components/AgentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTours } from "../features/tours/tourSlice";
import {
  fetchSubscriptions,
  addSubscription,
  removeSubscription,
} from "../features/subscriptions/subscriptionSlice";
import {
  addRequest,
  fetchRequests,
  removeRequest,
} from "../features/requests/requestsSlice";
import { getOperators } from "../features/users/userSlice";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours.tours);
  const user = useSelector((state) => state.auth.user);
  const { operators, loading } = useSelector((state) => state.operators);
  const subscriptions = useSelector(
    (state) => state.subscriptions.subscriptions
  );
  const { requests, loaded } = useSelector((state) => state.requests);

  const [showSubs, setShowSubs] = useState(false);

  useEffect(() => {
    dispatch(getOperators()).unwrap();
    dispatch(fetchTours()).unwrap();
    dispatch(fetchSubscriptions()).unwrap();
  }, [dispatch]);

  const handleSubscribe = async (operator) => {
    const data = {
      operatorId: operator._id
    };
    try {
      await dispatch(addSubscription(data)).unwrap();
      await dispatch(fetchSubscriptions()).unwrap();
      alert("Підписка створена");
    } catch (err) {
      console.error("Помилка створення підписки", err);
      alert("Не вдалося створити підписку");
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
  };

  const handleCreateRequest = async (tour) => {
    const data = {
      tour: tour._id,
      customerName: user.name,
      customerEmail: user.email,
    };

    try {
      await dispatch(addRequest(data)).unwrap();
      await dispatch(fetchRequests()).unwrap();
      alert('Заявку додано');
    } catch (err) {
      console.error(err);
      alert('Сталася помилка при подачі завки')
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await dispatch(removeRequest(id)).unwrap();
      await dispatch(fetchRequests()).unwrap;
      alert('Заявку відкликано');
    } catch (err) {
      console.error(err);
      alert('Сталося помилка при відкликані заявки')
    }
  };

  const handleDeleteSubscription = async (id) => {
    console.log(id);
    try {
      await dispatch(removeSubscription(id)).unwrap();
      await dispatch(fetchSubscriptions()).unwrap();
      alert("Підписку видалено");
    } catch (err) {
      console.error("Не вдалося видалити", err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Список туроператорів:</h3>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {operators.map((op) => {
            const isSubscribed = subscriptions.some(
              (sub) => sub.operator && sub.operator._id === op._id
            );

            return (
              <div
                key={op._id}
                className="border rounded-xl p-4 shadow-md flex justify-between items-center bg-white"
              >
                <div>
                  <h4 className="font-bold text-lg">{op.name}</h4>
                  <p className="text-sm text-gray-600">{op.email}</p>
                </div>
                <div>
                  {isSubscribed ? (
                    <button
                      onClick={() => {
                        const sub = subscriptions.find(
                          (s) => s.operator && s.operator._id === op._id
                        );
                        if (sub) handleDeleteSubscription(sub._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Відписатись
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(op)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Підписатись
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="space-y-3 mb-6">
        <button
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
          onClick={handleFetchRequests}
        >
          {showSubs ? "Сховати заявки" : "Переглянути заявки"}
        </button>
      </div>

      {/* Перегляд турів */}
      {tours.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Доступні тури</h3>
          <ul className="space-y-2">
            {tours.map((tour) => (
              <li
                key={tour._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{tour.title}</p>
                  <p className="text-sm text-gray-600">
                    {tour.country}, {tour.price} грн
                  </p>
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
                <li
                  key={req._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Напрямок:</strong> {req.tour.country}
                    </p>
                    <p>
                      <strong>Ціна:</strong> {req.tour.price} грн
                    </p>
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
