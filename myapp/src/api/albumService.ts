import axios from "axios";

export const albumService = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3002"
});

export class GeneralError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LoginError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface User {
  username: string;
  userID: string;
}

export interface InitResult {
  userID: string;
  username: string;
  friends: User[];
}

export async function init(): Promise<InitResult> {
  const res = await axios.get("/init");
  return res.data;
}

export interface LoginResult {
  friends: User[];
  userID: string;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResult> {
  const res = await albumService.post("/login", { username, password });

  return res.data;
}

export async function logout(): Promise<void> {
  const res = await albumService.get("/logout");
}

export interface Photo {
  id: string;
  url: string;
  likedBy: User[];
}

export interface GetAlbumResult {
  photos: Photo[];
}

export async function getAlbum(userID: string): Promise<GetAlbumResult> {
  const res = await albumService.get(`/getalbum/${userID}`);
  return res.data;
}

export interface UploadPhotoResult {
  url: string;
  id: string;
}

export async function uploadPhoto(photoFile: File): Promise<UploadPhotoResult> {
  let formData = new FormData();
  formData.append("photo", photoFile);
  const res = await albumService.post("/uploadphoto", formData);
  return res.data;
}

export async function deletePhoto(photoID: string) {
  const res = await albumService.delete(`/deletephoto/${photoID}`);
}

export interface UpdateLikeResult {
  likedBy: string[];
}

export async function updateLike(photoID: string): Promise<UpdateLikeResult> {
  const res = await albumService.put(`/updatelike/${photoID}`);
  return res.data;
}

export async function register(
  username: string,
  password: string
): Promise<void> {
  const res = await albumService.post("/register", { username, password });
}

export interface ListUsersResult {
  users: User[];
}

export async function listUsers(): Promise<ListUsersResult> {
  const res = await albumService.get("/users");
  return res.data;
}

export interface ToggleFriendResult {
  friends: string[];
}

export async function toggleFriend(friendID: string) {
  const res = await albumService.put(`/togglefriend/${friendID}`);
  return res.data;
}

export interface GetFriendsResult {
  friends: User[];
}

export async function getFriends(): Promise<GetFriendsResult> {
  const res = await axios.get("/friends");
  return res.data;
}
