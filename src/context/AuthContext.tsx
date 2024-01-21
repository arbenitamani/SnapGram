import { getCurrentUser } from '@/lib/appwrite/api'
import { IUser, IcontextType } from '@/types'
import { create } from 'domain'
import {createContext, useContext, useEffect, useState} from 'react'

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IcontextType>(INITIAL_STATE);

const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthUser = async () => {

        try {
            const {$id, name, username, email, imageUrl, bio }currentAccount = await getCurrentUser();

            if(currentAccount){
                setUser(
                    {
                        id: currentAccount.$id,
                        name: currentAccount.$name,
                        username: currentAccount.username,
                        email: currentAccount.email,
                        imageUrl: currentAccount.imageUrl,
                        bio: currentAccount.bio
                    }
                )
            }
        } catch (error) {
            console.log(error);
            return false;
        }finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }
  return (
   
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext