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

// Get all tasks
export const getTasks = (boardId, cardId) =>
  API.get(
    `/boards/${boardId}/cards/${cardId}/tasks`
  );

// Create new task
export const createTask = (
  boardId,
  cardId,
  data
) =>
  API.post(
    `/boards/${boardId}/cards/${cardId}/tasks`,
    data
  );

// Get single task
export const getTaskById = (
  boardId,
  cardId,
  taskId
) =>
  API.get(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`
  );

// Update task
export const updateTask = (
  boardId,
  cardId,
  taskId,
  data
) =>
  API.put(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
    data
  );

// Delete task
export const deleteTask = (
  boardId,
  cardId,
  taskId
) =>
  API.delete(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`
  );

// Assign member
export const assignMember = (
  boardId,
  cardId,
  taskId,
  { email }
) => {
  return API.post(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
    {
      memberId: email,
    }
  );
};

// Get assigned members
export const getAssignedMembers = (
  boardId,
  cardId,
  taskId
) =>
  API.get(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`
  );

// Unassign a member
export const unassignMember = (
  boardId,
  cardId,
  taskId,
  memberId
) =>
  API.delete(
    `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`
  );
