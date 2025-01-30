import React from 'react';
import { useFormik } from 'formik';
import { toastError, axiosPost, toastValidate } from '../utils/function';

export default function DeleteAccount({ onCancel, iban }) {
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axiosPost('/account_close', {
            "iban": iban,
            "password": values.password,
        })
        if(response.Error) {
            toastError(response.Error);
        }

        if(response.message) {
            toastValidate(response.message);
            onCancel();
        }


      } catch (error) {
        toastError('Erreur lors de la suppression du compte');
        console.error(error);
      }
    },
  });

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <p className="text-lg font-medium text-gray-900">Cloturer un compte</p>
            <p className="mt-2 text-sm text-gray-500">
              Vous êtes sur le point de supprimer un compte. Le solde de votre compte sera transféré au compte principal.
            </p>
            <form>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mots de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                className="mb-3 block w-full px-3 py-2 text-sm leading-tight text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <button
                type="submit"
                className="mb-4 mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
                onClick={formik.handleSubmit}
              >
                Confimer
              </button>
            </form>

            <button
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:w-auto"
              onClick={onCancel}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
