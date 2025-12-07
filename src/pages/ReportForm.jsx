import React, { useState } from 'react';
import api from '../services/api';
import LocationPickerMap from '../components/LocationPickerMap';
import { CameraIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ReportForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const handleGetLocation = () => {
    setIsFetchingLocation(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setIsFetchingLocation(false);
      },
      (err) => {
        setLocationError('Could not get location. Please allow location access or try again.');
        setIsFetchingLocation(false);
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return setFormMessage({ type: 'error', text: 'Description is required.' });
    if (!position) return setFormMessage({ type: 'error', text: 'Location is required. Please get your location first.' });
    if (!window.confirm('Submit this hazard report?')) return;

    setSubmitting(true);
    setFormMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('description', description);
    formData.append('latitude', position.lat);
    formData.append('longitude', position.lng);
    if (image) formData.append('image', image);

    try {
      await api.post('/reports/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormMessage({ type: 'success', text: 'Report submitted successfully!' });
      setDescription('');
      removeImage();
      setPosition(null);
      e.target.reset();
    } catch (err) {
      setFormMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Report a Hazard</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formMessage.text && (
            <div className={`p-3 rounded-md text-center ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {formMessage.text}
            </div>
          )}
          
          <div>
            <label className="block text-lg font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the hazard in detail..."
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Upload Evidence</label>
            
            {!preview ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Gallery Option */}
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition">
                  <PhotoIcon className="h-8 w-8 text-gray-500 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Camera Option */}
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition">
                  <CameraIcon className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment" // Forces camera on mobile
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative mt-2 w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <img src={preview} alt="Selected evidence" className="w-full h-full object-contain" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition"
                  title="Remove image"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-700">Location</label>
            {!position && (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isFetchingLocation}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50 transition"
              >
                {isFetchingLocation ? 'Fetching Location...' : 'Get My Current Location'}
              </button>
            )}
            {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
            
            {position && (
              <div className="h-72 w-full rounded-lg overflow-hidden border-2 border-blue-500 relative">
                <LocationPickerMap position={position} setPosition={setPosition} />
              </div>
            )}
             {position && (
              <p className="text-center text-sm text-gray-600">
                Marker set. You can drag it to adjust the location.
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full py-3 px-4 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md"
          >
            {submitting ? 'Submitting...' : 'Submit Hazard Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;