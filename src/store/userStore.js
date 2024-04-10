import { create } from "zustand";
import { Hub } from "aws-amplify/utils";
import { getCurrentUser, signOut } from "aws-amplify/auth";

const useUserStore = create((set) => ({
  user: "",
  authenticated: false,
  setUser: async () => {
    try {
      const { username } = await getCurrentUser();
      set({ user: username });
    } catch (err) {
      console.log(err);
    }
  },
  isAuth: async () => {
    await Hub.listen("auth", ({ payload }) => {
      if (payload.event == "signedIn") {
        set({ authenticated: true });
      }
    });
  },
  signOut: async () => {
    await signOut().then(() => {
      set({ user: "" });
    });
    /* .catch((e) => {
        console.log(e);
      }); */
  },
}));

export default useUserStore;
