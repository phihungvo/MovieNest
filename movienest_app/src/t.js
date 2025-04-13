// // src/components/auth/OAuth2RedirectHandler.js
// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { message } from 'antd';
// import { jwtDecode } from 'jwt-decode';
// import { useAuth } from '~/routes/AuthContext';

// const OAuth2RedirectHandler = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   useEffect(() => {
//     // Get token from URL parameters
//     const getUrlParameter = (name) => {
//       const searchParams = new URLSearchParams(location.search);
//       return searchParams.get(name);
//     };

//     const token = getUrlParameter('token');
//     const error = getUrlParameter('error');

//     if (token) {
//       // Store token in localStorage
//       localStorage.setItem('token', token);
      
//       try {
//         // Decode the token to get user info
//         const decodedToken = jwtDecode(token);
//         console.log('Decoded Token:', decodedToken);
        
//         const roles = decodedToken.roles || [];
//         const isAdmin = roles.includes('ADMIN');
        
//         localStorage.setItem('role', isAdmin ? 'admin' : 'user');
        
//         // Update auth context
//         login({
//           token,
//           role: isAdmin ? 'admin' : 'user',
//           roles
//         });
        
//         message.success('Đăng nhập thành công!');
        
//         // Redirect based on role
//         if (isAdmin) {
//           navigate('/admin/movie');
//         } else {
//           navigate('/');
//         }
//       } catch (err) {
//         console.error('Error processing token:', err);
//         message.error('Authentication failed');
//         navigate('/login');
//       }
//     } else if (error) {
//       message.error(error || 'OAuth authentication failed');
//       navigate('/login');
//     } else {
//       navigate('/login');
//     }
//   }, [location, navigate, login]);

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <div>Processing authentication...</div>
//     </div>
//   );
// };

// export default OAuth2RedirectHandler;