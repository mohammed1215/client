import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const userApiEndPoints = {
  getMe: "/api/v1/users/me",
  editProfile: "/api/v1/users/me",
  uploadAvatar: "/api/v1/users/me/avatar",
};

export const authApiEndPoints = {
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  forgotPassword: "/api/v1/auth/forgot-password",
  resetPassword: "/api/v1/auth/reset-password",
  verifyEmail: "/api/v1/auth/verify-email",
};

export const workspaceEndPoints = {
  acceptInvitation: "/api/v1/workspaces/accept-invitation",
  updateOrDeleteMember: "/api/v1/workspaces/{workspaceId}/members/{userId}",
  sendInvitation: "/api/v1/workspaces/{workspaceId}/invitations",
  getWorkspaceMembers: "/api/v1/workspaces/{workspaceId}/members",
  getOrCreateWorkspace: "/api/v1/workspaces",
  updateOrDeleteWorkspace: "/api/v1/workspaces/{workspaceId}",
};

export const boardEndPoints = {
  getOrCreateBoards: "/api/v1/workspaces/{workspaceId}/boards",
};

export const columnEndPoints = {
  getOrCreateColumn: "/api/v1/boards/{boardId}/columns",
  reOrderColumn: `/api/v1/boards/{boardId}/columns/reorder`,
};

export const taskEndpoints = {
  moveTask: "/api/v1/tasks/{taskId}/move",
  AddAssigneesToTask: "/api/v1/tasks/{taskId}/assignees",
  editOrDeleteTask: "/api/v1/{taskId}",
  getTasksOfBoard: "/api/v1/boards/{boardId}/tasks",
  getTaskInfo: "/api/v1/tasks/{taskId}",
  removeAssigneeFromTask: "/api/v1/tasks/{taskId}/assignees/{userId}",
  createTaskOfBoard: "/api/v1/boards/{boardId}/tasks",
};

export const attahcmentEndPoints = {
  getOrUploadAttachment: "/api/v1/tasks/{taskId}/attachments",
};

export const commentsEndpoints = {
  getOrPostComments: "/api/v1/tasks/{taskId}/comments",
  editOrDeleteComment: "/api/v1/comments/{commentId}",
};

export const searchEndpoints = {
  search: "/api/v1/search",
};

export default {
  axiosInstance,
  userApiEndPoints,
  authApiEndPoints,
  workspaceEndPoints,
  boardEndPoints,
  columnEndPoints,
  taskEndpoints,
  attahcmentEndPoints,
  commentsEndpoints,
  searchEndpoints,
};
