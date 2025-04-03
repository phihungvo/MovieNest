import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Kiểm tra xem có token trong localStorage khi component mount
    useEffect(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime){
            localStorage.removeItem('token');
            localStorage.removeItem('role');
          }else {
            setUser({token, role, roles: decodedToken.role || []});
          }
        }catch (error) {
          console.log('Error when decode token: ', error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
    }, []);

    const login = (userData) => setUser(userData);
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
