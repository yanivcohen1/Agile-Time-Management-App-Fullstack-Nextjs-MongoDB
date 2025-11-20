const ACCESS_KEY = "todo-app.access";
const REFRESH_KEY = "todo-app.refresh";

const isBrowser = () => typeof window !== "undefined";

export const tokenStorage = {
  getAccessToken: () => (isBrowser() ? window.localStorage.getItem(ACCESS_KEY) : null),
  setAccessToken: (token: string) => {
    if (isBrowser()) {
      window.localStorage.setItem(ACCESS_KEY, token);
    }
  },
  getRefreshToken: () => (isBrowser() ? window.localStorage.getItem(REFRESH_KEY) : null),
  setRefreshToken: (token: string) => {
    if (isBrowser()) {
      window.localStorage.setItem(REFRESH_KEY, token);
    }
  },
  clear: () => {
    if (isBrowser()) {
      window.localStorage.removeItem(ACCESS_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
    }
  }
};
