import { useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from './firebase';

export interface FirebaseAuthState {
  authReady: boolean;
  user: User | null;
  isAdmin: boolean;
  isBootstrapAdmin: boolean;
  authError: string;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useFirebaseAuth(): FirebaseAuthState {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBootstrapAdmin, setIsBootstrapAdmin] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setAuthError('');

      if (!nextUser) {
        setIsAdmin(false);
        setIsBootstrapAdmin(false);
        setAuthReady(true);
        return;
      }

      const emailVerified = Boolean(nextUser.emailVerified);
      const isOwner =
        emailVerified &&
        (nextUser.email || '').toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      setIsBootstrapAdmin(isOwner);

      if (isOwner) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      if (!emailVerified) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const adminRef = doc(db, 'admins', nextUser.uid);
        const snap = await getDoc(adminRef);
        if (active) {
          setIsAdmin(snap.exists() && snap.data()?.role === 'admin');
        }
      } catch (err) {
        // Non-admins reading their own doc should succeed or return non-existent; log safely
        try {
          handleFirestoreError(err, OperationType.GET, `admins/${nextUser.uid}`);
        } catch {
          if (active) setIsAdmin(false);
        }
      } finally {
        if (active) setAuthReady(true);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      const rawMsg = err instanceof Error ? err.message : 'Google sign-in failed.';
      if (code === 'auth/unauthorized-domain' || rawMsg.includes('auth/unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setAuthError(
          `Domain "${host}" is not authorized for Firebase sign-in yet. Add "${host}" in Firebase Console → Authentication → Settings → Authorized domains (project: gen-lang-client-0658779700).`,
        );
      } else {
        setAuthError(rawMsg);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError('');
    await signOut(auth);
  }, []);

  return {
    authReady,
    user,
    isAdmin,
    isBootstrapAdmin,
    authError,
    signInWithGoogle,
    logout,
  };
}
