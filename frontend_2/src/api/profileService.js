import axios from "./axiosInstance";

export const getProfile = (userId) =>
  axios.get(`api/users/${userId}/profile`).then(res => res.data);
