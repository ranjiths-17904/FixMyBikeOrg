import api from './api';

export const signupUser = async (userData) => {
  const res = await api.post('api/auth/signup', userData);
  return res.data;
};

