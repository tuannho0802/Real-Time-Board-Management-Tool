import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// load boards
export const getBoards = () => API.get("/boards");

// get single board data
export const getBoardById = (id) => API.get(`/boards/${id}`);

// make a new board
export const createBoard = (data) => API.post("/boards", data);

// edit board
export const updateBoard = (id, data) => API.put(`/boards/${id}`, data);

// delete board
export const deleteBoard = (id) => API.delete(`/boards/${id}`);
