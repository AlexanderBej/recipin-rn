import { onAuthStateChanged } from "firebase/auth";

import { ensureUserProfile } from "@/api/services/index";
import { AppDispatch } from "@/store/index";
import {
  setAuthLoading,
  userSignedIn,
  userSignedOut,
} from "../store/auth-store/auth.slice";
import {
  fetchMyFavorites,
  fetchMyRecipeCardsPage,
  resetMine,
  startBootLoading,
} from "../store/recipes-store/recipes.slice";
import { auth } from "./firebase";

export const initApp = (dispatch: AppDispatch) => {
  dispatch(setAuthLoading());

  const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      dispatch(userSignedOut());
      return;
    }
    await ensureUserProfile(fbUser);
    // clear list on every auth change
    dispatch(resetMine());
    dispatch(startBootLoading());
    console.log(fbUser);

    dispatch(fetchMyRecipeCardsPage({ uid: fbUser?.uid ?? "" }));
    dispatch(fetchMyFavorites(fbUser?.uid ?? ""));

    dispatch(
      userSignedIn({
        uid: fbUser.uid,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        email: fbUser.email,
        createdAt: fbUser.metadata.creationTime ?? "",
      })
    );
  });

  return () => {
    try {
      unsubAuth();
    } catch {}
  };
};
