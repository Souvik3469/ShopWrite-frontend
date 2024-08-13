import React, { createContext, useContext, ReactNode } from "react";
import { GetUserQuery } from "../pages/api/user";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  userLoading: boolean;
  userError: boolean;
  refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUser,
  } = GetUserQuery();

  return (
    <UserContext.Provider value={{ user, userLoading, userError, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
