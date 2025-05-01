import axios from "axios";

const BASE_URL = "https://be-hooppass.vercel.app/api";

export default axios.create({
  baseURL: BASE_URL,
});
