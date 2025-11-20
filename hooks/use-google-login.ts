import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';

import { ensureUserProfile } from '@/api/services/auth.service';
import { auth } from '@/providers/firebase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID!,  // 👈 iOS client ONLY
  });

  // Optional: see what redirect URI is actually used
  useEffect(() => {
    if (request) {
      console.log('Google redirect URI:', request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    const finish = async () => {
      if (response?.type !== 'success') return;

      const idToken = response.authentication?.idToken;
      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      const userCred = await signInWithCredential(auth, credential);

      await ensureUserProfile(userCred.user);
    };

    finish();
  }, [response]);

  return {
    request,
    signIn: () => promptAsync(),  // 👈 no options, no useProxy
  };
}
