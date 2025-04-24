import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SolutionFormModal = ({
  isOpen,
  onClose,
  category
}: {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await (supabase as any)
      .from('solution_forms')
      .insert([{ name: formData.name, email: formData.email, message: formData.message, category }]);



    setLoading(false);

    if (error) {
      console.error('Supabase Insert Error:', error); // helps debugging in browser console
      alert('Error submitting form: ' + (error.message || 'Unknown error'));
    } else {
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-fade-in">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-lg space-y-5"
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Inquiry – <span className="text-green-700">{category}</span>
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            onChange={handleChange}
            value={formData.message}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-red-500 hover:text-red-600 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
