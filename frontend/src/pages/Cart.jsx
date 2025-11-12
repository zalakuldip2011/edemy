import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { 
  ShoppingCartIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  TagIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cart = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [removing, setRemoving] = useState({});
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(data.data.cart);
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      setRemoving(prev => ({ ...prev, [courseId]: true }));
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      alert('Failed to remove course from cart');
    } finally {
      setRemoving(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    
    try {
      setClearing(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      alert('Failed to clear cart');
    } finally {
      setClearing(false);
    }
  };

  const handleCheckout = () => {
    // TODO: Navigate to checkout page
    alert('Checkout functionality coming soon!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const cartItems = cart?.items || [];
  const hasItems = cartItems.length > 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors ${
        isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <ShoppingCartIcon className="h-8 w-8 text-blue-500" />
            Shopping Cart
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in cart
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearCart}
                  disabled={clearing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                  } ${clearing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {clearing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-5 w-5" />
                      Clear Cart
                    </>
                  )}
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`p-6 rounded-xl shadow-lg transition-all ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Course Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.course?.thumbnail || '/api/placeholder/200/120'}
                        alt={item.course?.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/courses/${item.course?._id}`}
                        className={`font-semibold text-lg hover:text-blue-500 transition-colors block mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.course?.title}
                      </Link>
                      <p className={`text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        by {item.course?.instructor?.profile?.firstName} {item.course?.instructor?.profile?.lastName}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          Level: {item.course?.level}
                        </span>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {item.course?.duration}
                        </span>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="text-2xl font-bold text-blue-500">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.course?._id)}
                        disabled={removing[item.course?._id]}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                        } ${removing[item.course?._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {removing[item.course?._id] ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent" />
                        ) : (
                          <XMarkIcon className="h-5 w-5" />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`sticky top-6 p-6 rounded-xl shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Subtotal
                    </span>
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${cart?.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Tax
                    </span>
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      $0.00
                    </span>
                  </div>
                  <div className={`border-t pt-4 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between">
                      <span className={`text-lg font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-500">
                        ${cart?.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CreditCardIcon className="h-6 w-6 inline mr-2" />
                  Proceed to Checkout
                </button>

                {/* Promo Code */}
                <div className={`mt-6 p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-800' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Have a promo code?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <>
            <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-300'
            }`}>
              <ShoppingCartIcon className={`h-20 w-20 mx-auto mb-6 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h2 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Cart is Empty
              </h2>
              <p className={`text-lg mb-8 max-w-md mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Looks like you haven't added any courses to your cart yet. Browse our courses and start learning today!
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                Browse Courses
              </Link>
            </div>
          </>
        )}

        {/* Features Section - Only show when cart is empty */}
        {!hasItems && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className={`p-6 rounded-xl text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <ShieldCheckIcon className={`h-10 w-10 mx-auto mb-4 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Secure Checkout
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your payment information is safe and encrypted
              </p>
            </div>

            <div className={`p-6 rounded-xl text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <CreditCardIcon className={`h-10 w-10 mx-auto mb-4 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Multiple Payment Options
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pay with credit card, PayPal, or other methods
              </p>
            </div>

            <div className={`p-6 rounded-xl text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <TagIcon className={`h-10 w-10 mx-auto mb-4 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                30-Day Money Back
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Not satisfied? Get a full refund within 30 days
              </p>
            </div>
          </div>
        )}

        {/* Promo Banner - Only show when cart is empty */}
        {!hasItems && (
          <div className={`mt-12 p-8 rounded-xl bg-gradient-to-r ${
            isDarkMode 
              ? 'from-blue-900/50 to-purple-900/50' 
              : 'from-blue-50 to-purple-50'
          } border ${isDarkMode ? 'border-blue-800' : 'border-blue-200'}`}>
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🎉 Special Offer!
              </h3>
              <p className={`text-lg mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Get 20% off on your first course purchase
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Use code: <span className="font-mono font-bold text-blue-500">WELCOME20</span> at checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
