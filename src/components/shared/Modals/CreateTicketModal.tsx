import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface CreateTicketModalProps {
  onClose: () => void;
  onSubmit: (data: { description: string }) => void;
}

interface FormValues {
  description: string;
}

const CreateTicketModal: FC<CreateTicketModalProps> = ({ onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmitForm: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-[#0e0e0e] p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-white text-xl font-bold mb-4">Задать вопрос</h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Описание проблемы или вопроса</label>
            <textarea
              {...register('description', { required: 'Описание обязательно' })}
              className="mt-1 p-2 block w-full border rounded-md bg-[#0e0e0e] text-white"
              rows={4}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white transition-all duration-500 px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="bg-white text-black transition-all duration-500 px-4 py-2 rounded-md hover:bg-black hover:text-white"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
