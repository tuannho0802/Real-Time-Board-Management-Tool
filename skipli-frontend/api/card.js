import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get all cards
export const getCards = (boardId) =>
  API.get(`/boards/${boardId}/cards`);

// get single card
export const getCardById = (boardId, id) =>
  API.get(`/boards/${boardId}/cards/${id}`);

//create new card
export const createCard = (boardId, data) =>
  API.post(`/boards/${boardId}/cards`, data);

// edit card
export const updateCard = (boardId, id, data) =>
  API.put(
    `/boards/${boardId}/cards/${id}`,
    data
  );

// delete card
export const deleteCard = (boardId, id) =>
  API.delete(`/boards/${boardId}/cards/${id}`);
