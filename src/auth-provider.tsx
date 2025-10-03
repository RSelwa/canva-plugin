import { ReactNode, useEffect, useState } from "react";
import Login from "src/auth/login";
import { auth } from "utils/db";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const listenAuthState = async () => {
    await auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  };

  const logout = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    listenAuthState();
  }, []);

  return (
    <main>
      {currentUser ? (
        <>
          <button onClick={logout}>LOGOUT</button>
          {children}
        </>
      ) : (
        <Login />
      )}
    </main>
  );
};
