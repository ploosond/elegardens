'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';

export default function ContactForm() {
  const t = useTranslations('ContactPage');
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contact', formData);
      setFormStatus({
        submitted: true,
        error: false,
        message: response.data.message || t('form_success'),
      });
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.error || t('form_error');
      setFormStatus({
        submitted: true,
        error: true,
        message: errorMessage,
      });
    }
  };

  return (
    <div className='rounded-lg border border-muted bg-bg p-8 shadow-sm'>
      <h2 className='mb-6 text-2xl font-medium text-text'>
        {t('send_message_title')}
      </h2>

      {formStatus.submitted && (
        <div
          className={`mb-6 rounded-md p-4 ${
            formStatus.error
              ? 'bg-danger/10 text-danger'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {formStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-text'>
              {t('form_firstname')}
            </label>
            <input
              type='text'
              name='firstname'
              value={formData.firstname}
              onChange={handleChange}
              required
              className='w-full rounded-md border border-muted bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-text'>
              {t('form_lastname')}
            </label>
            <input
              type='text'
              name='lastname'
              value={formData.lastname}
              onChange={handleChange}
              required
              className='w-full rounded-md border border-muted bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-text'>
              {t('form_email')}
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full rounded-md border border-muted bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-text'>
              {t('form_phone')}
            </label>
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full rounded-md border border-muted bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
        </div>

        <div className='mb-6'>
          <label className='mb-1 block text-sm font-medium text-text'>
            {t('form_message')}
          </label>
          <textarea
            name='message'
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className='w-full rounded-md border border-muted bg-bg p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary'
          ></textarea>
        </div>

        <button
          type='submit'
          className='flex w-full items-center justify-center rounded-full bg-primary py-3 font-semibold text-on-dark transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer'
        >
          {t('form_submit')}
        </button>
      </form>
    </div>
  );
}
