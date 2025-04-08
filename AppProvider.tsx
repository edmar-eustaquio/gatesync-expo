import { createContext, ReactNode, useContext, useState } from "react";
import { Platform, SafeAreaView, StatusBar } from "react-native";

type UserProps = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  contactNumber?: string;
  idNumber?: string;
  yearLevel?: string;
  course?: string;
  qrData?: string;
  image?:string;
}

const AppContext = createContext<{
  user: UserProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  setUser: () => {},
  visible: false,
  setVisible: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [visible, setVisible] = useState(false);
  return (
    <AppContext.Provider value={{ user, setUser, visible, setVisible }}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {children}
      </SafeAreaView>
    </AppContext.Provider>
  );
};
