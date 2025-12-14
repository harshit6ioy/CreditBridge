import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5000/auth"
});

export default authApi;
