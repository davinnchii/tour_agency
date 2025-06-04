import * as yup from 'yup';
import { useYupValidationResolver } from '../hooks/useYupValidationResolver';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { addTour } from '../features/tours/tourSlice';
import Select from 'react-select';

const countryOptions = [
    { value: "Україна", label: "Україна" },
    { value: "Польща", label: "Польща" },
    { value: "Італія", label: "Італія" },
    { value: "Іспанія", label: "Іспанія" },
    { value: "Єгипет", label: "Єгипет" },
    { value: "Туреччина", label: "Туреччина" },
  ];
  
  const schema = yup.object().shape({
    title: yup.string().required("Назва обов’язкова").max(100),
    description: yup.string().required("Опис обов’язковий").max(512),
    country: yup.object().required("Оберіть країну"),
    price: yup.number().required().min(1),
    startDate: yup
    .date()
    .required("Дата початку обов'язкова")
    .min(new Date(), "Дата не може бути в минулому"),
  
  endDate: yup
    .date()
    .required("Дата завершення обов'язкова")
    .when("startDate", (startDate, schema) =>
      schema.min(startDate, "Дата завершення має бути пізніше початку")
    ),
  
  });
  
  export const CreateTourForm = ({ onClose }) => {
    const resolver = useYupValidationResolver(schema);
    const dispatch = useDispatch();
  
    const {
      control,
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({ resolver });
  
    const onSubmit = async (data) => {
      const payload = {
        ...data,
        country: data.country.value,
        price: Number(data.price),
      };
  
      try {
        await dispatch(addTour(payload)).unwrap();
        alert("Тур створено успішно");
        reset();
        onClose();
      } catch (err) {
        console.error(err);
        alert("Помилка при створенні туру");
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Новий тур</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Назва туру"
                {...register("title")}
                className="w-full border p-2 rounded"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
  
            <div>
              <textarea
                placeholder="Опис туру"
                {...register("description")}
                className="w-full border p-2 rounded"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
  
            <div>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countryOptions}
                    placeholder="Оберіть країну"
                  />
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
  
            <div>
              <input
                type="number"
                placeholder="Ціна"
                {...register("price")}
                className="w-full border p-2 rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
  
            <div>
              <input
                type="date"
                {...register("startDate")}
                className="w-full border p-2 rounded"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
              )}
            </div>
  
            <div>
              <input
                type="date"
                {...register("endDate")}
                className="w-full border p-2 rounded"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
  
            <div className="flex justify-between pt-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Створити
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };