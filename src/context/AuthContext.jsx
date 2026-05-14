import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('librook_current_user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const getDiceBearAvatar = (name, style = 'adventurer') => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  };

  const login = (email, password) => {
    const usersStr = localStorage.getItem('librook_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      if (!foundUser.avatar) foundUser.avatar = getDiceBearAvatar(foundUser.name);
      
      setUser(foundUser);
      localStorage.setItem('librook_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (name, email, password, avatarUrl) => {
    // Parche Fuerte de Seguridad: Imposible crear contraseña menor a 6 caracteres por contexto.
    if (password.length < 6) {
      toast.error("Error de Sistema: La contraseña es demasiado corta.");
      return false;
    }

    const usersStr = localStorage.getItem('librook_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find(u => u.email === email)) {
      return false; 
    }

    const finalAvatar = avatarUrl || getDiceBearAvatar(name, 'adventurer');

    const newUser = { 
      name, 
      email, 
      password,
      avatar: finalAvatar,
      bio: 'Lector apasionado en LIBROOK.',
      preferences: [] 
    };
    
    users.push(newUser);
    localStorage.setItem('librook_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('librook_current_user', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    
    const oldName = user.name;
    const newAvatar = updatedData.name !== oldName && !updatedData.avatar 
      ? getDiceBearAvatar(updatedData.name) 
      : updatedData.avatar;
    
    const updatedUser = { 
      ...user, 
      ...updatedData, 
      avatar: updatedData.avatar || newAvatar 
    };

    setUser(updatedUser);
    localStorage.setItem('librook_current_user', JSON.stringify(updatedUser));
    
    const usersStr = localStorage.getItem('librook_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const index = users.findIndex(u => u.email === user.email);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('librook_users', JSON.stringify(users));
      }
    }

    if (oldName !== updatedUser.name) {
      const allReviewsStr = localStorage.getItem('librook_reviews');
      if (allReviewsStr) {
        const allReviews = JSON.parse(allReviewsStr);
        let modified = false;
        
        for (const bookId in allReviews) {
          allReviews[bookId] = allReviews[bookId].map(rev => {
            if (rev.user === oldName) {
              modified = true;
              return { ...rev, user: updatedUser.name };
            }
            return rev;
          });
        }
        
        if (modified) {
          localStorage.setItem('librook_reviews', JSON.stringify(allReviews));
        }
      }
    }

    toast.success("Perfil actualizado correctamente");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('librook_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, getDiceBearAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
