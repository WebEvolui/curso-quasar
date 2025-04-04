import { defineBoot } from "#q-app/wrappers";
import axios, { type AxiosInstance } from "axios";
import { Cookies } from "quasar";

declare module "vue" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const token = Cookies.get("token_adm_minierp") || "";

const api = axios.create({ baseURL: process.env.API_URL || "" });
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["Content-Type"] = "application/json";
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default defineBoot(({ router, app }) => {
  api.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        router.push({ name: "login" });
      }
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
