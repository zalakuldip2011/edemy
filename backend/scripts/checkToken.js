/**
 * Quick Diagnostic: Check JWT Token
 * 
 * This helps debug authentication issues
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('='.repeat(60));
console.log('JWT TOKEN DIAGNOSTIC');
console.log('='.repeat(60));

// Check if JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is NOT set in .env file!');
  console.log('\nAdd this to your .env file:');
  console.log('JWT_SECRET=your-secret-key-here-make-it-long-and-random');
  process.exit(1);
}

console.log('✅ JWT_SECRET is set');
console.log('   Length:', process.env.JWT_SECRET.length, 'characters');

// If token provided as argument, decode it
const token = process.argv[2];

if (token) {
  console.log('\n📝 Decoding provided token...');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token is VALID');
    console.log('\nDecoded payload:');
    console.log('   User ID:', decoded.id);
    console.log('   Email:', decoded.email);
    console.log('   Username:', decoded.username);
    console.log('   Role:', decoded.role);
    console.log('   Issued At:', new Date(decoded.iat * 1000).toLocaleString());
    console.log('   Expires At:', new Date(decoded.exp * 1000).toLocaleString());
    
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      console.log('   ⚠️  Token has EXPIRED');
    } else {
      const remaining = Math.floor((decoded.exp - now) / 3600);
      console.log(`   ✅ Token valid for ${remaining} more hours`);
    }
  } catch (error) {
    console.error('❌ Token is INVALID');
    console.error('   Error:', error.message);
  }
} else {
  console.log('\n💡 Usage:');
  console.log('   node backend/scripts/checkToken.js <your-jwt-token>');
  console.log('\n   To get your token:');
  console.log('   1. Open browser DevTools (F12)');
  console.log('   2. Go to Console tab');
  console.log('   3. Type: localStorage.getItem("token")');
  console.log('   4. Copy the token and run this script with it');
}

console.log('\n' + '='.repeat(60));
