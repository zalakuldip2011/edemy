import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import {
  UserCircleIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  PencilIcon,
  CameraIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    courseUpdates: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      // ✅ SAFE: Validate prev before spreading
      const safePrev = prev && typeof prev === 'object' ? prev : {};
      return {
        ...safePrev,
        [field]: value
      };
    });
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => {
      // ✅ SAFE: Validate prev before spreading
      const safePrev = prev && typeof prev === 'object' ? prev : {};
      return {
        ...safePrev,
        [field]: value
      };
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data to show new avatar
        window.location.reload();
      } else {
        alert(data.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    try {
      setRemoving(true);
      const response = await fetch('http://localhost:5000/api/auth/remove-avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data to remove avatar
        window.location.reload();
      } else {
        alert(data.message || 'Failed to remove avatar');
      }
    } catch (error) {
      console.error('Remove avatar error:', error);
      alert('Failed to remove avatar');
    } finally {
      setRemoving(false);
    }
  };

  // Check if user has avatar
  const hasAvatar = user?.profile?.avatar && user.profile.avatar !== null && user.profile.avatar !== '';
  console.log('User avatar status:', { hasAvatar, avatar: user?.profile?.avatar });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className={`rounded-xl shadow-lg border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
            : 'bg-white border-gray-200'
        } p-8 mb-8`}>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {hasAvatar ? (
                <img 
                  src={`http://localhost:5000${user.profile.avatar}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              
              <div className="absolute bottom-0 right-0 flex gap-1">
                <label className={`p-2 rounded-full shadow-lg transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <CameraIcon className="h-4 w-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
                
                {hasAvatar && (
                  <button 
                    onClick={handleRemoveAvatar}
                    disabled={removing}
                    className={`p-2 rounded-full shadow-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-red-900/80 text-red-200 hover:bg-red-800' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } ${removing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Remove photo"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className={`text-3xl font-bold transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.fullName || user?.username || 'User Profile'}
              </h1>
              <p className={`text-lg transition-colors ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                {user?.role === 'instructor' ? 'Instructor' : 'Student'}
              </p>
              <p className={`transition-colors ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:col-span-1 rounded-xl shadow-lg border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
              : 'bg-white border-gray-200'
          } p-6 h-fit`}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? 'bg-purple-600/20 text-purple-300 border-l-4 border-purple-500'
                          : 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                        : isDarkMode
                          ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className={`rounded-xl shadow-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } p-8`}>
                <h2 className={`text-2xl font-bold mb-6 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Profile Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/50'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                      } focus:outline-none focus:ring-2`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/50'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                      } focus:outline-none focus:ring-2`}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/50'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                      } focus:outline-none focus:ring-2`}
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/50'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                      } focus:outline-none focus:ring-2`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500/50'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500'
                    } focus:outline-none focus:ring-2`}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSaveProfile}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={`rounded-xl shadow-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } p-8`}>
                <h2 className={`text-2xl font-bold mb-6 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Settings
                </h2>
                
                {/* Dark Mode Toggle */}
                <div className={`p-6 rounded-lg border transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-slate-700/30 border-slate-600/50'
                    : 'bg-gray-50 border-gray-200'
                } mb-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg transition-colors ${
                        isDarkMode ? 'bg-slate-600' : 'bg-white'
                      }`}>
                        {isDarkMode ? (
                          <MoonIcon className="h-6 w-6 text-purple-500" />
                        ) : (
                          <SunIcon className="h-6 w-6 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold transition-colors ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Dark Mode
                        </h3>
                        <p className={`text-sm transition-colors ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          Switch between light and dark themes
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        isDarkMode
                          ? 'bg-purple-600 focus:ring-offset-slate-800'
                          : 'bg-gray-200 focus:ring-offset-white'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          isDarkMode ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                {/* Other Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Time Zone
                    </h3>
                    <select className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-purple-500 focus:ring-purple-500/50'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500'
                    } focus:outline-none focus:ring-2`}>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={`rounded-xl shadow-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } p-8`}>
                <h2 className={`text-2xl font-bold mb-6 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notification Preferences
                </h2>
                
                <div className="space-y-6">
                  {Object.entries(preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-lg font-medium transition-colors ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className={`text-sm transition-colors ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          Receive notifications about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handlePreferenceChange(key, !value)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          value
                            ? 'bg-purple-600'
                            : isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                        } ${isDarkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'}`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={`rounded-xl shadow-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800/50 backdrop-blur-lg border-slate-700/50' 
                  : 'bg-white border-gray-200'
              } p-8`}>
                <h2 className={`text-2xl font-bold mb-6 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Privacy & Security
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Account Security
                    </h3>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Change Password
                    </button>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Data & Privacy
                    </h3>
                    <button className={`px-6 py-3 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}>
                      Download My Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;