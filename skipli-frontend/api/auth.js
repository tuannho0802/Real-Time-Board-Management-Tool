import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const signup = async ({
  email,
  verificationCode,
}) => {
  return axios.post(`${BASE_URL}/auth/signup`, {
    email,
    verificationCode,
  });
};

export const signin = async ({
  email,
  verificationCode,
}) => {
  return axios.post(`${BASE_URL}/auth/signin`, {
    email,
    verificationCode,
  });
};
