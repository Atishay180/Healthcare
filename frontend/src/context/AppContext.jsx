import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);

    const [token, setToken] = useState(
        localStorage.getItem('token') ?
            localStorage.getItem('token') :
            false
    );
    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

            data.success ? setDoctors(data.doctors) : toast.error(data.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message || "Something went wrong");
        }
    }

    const getUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } })

            if (data.success) {
                setUserData(data.userData);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message || "Something went wrong");
        }
    }


    const value = {
        doctors, currencySymbol,
        token, setToken,
        backendUrl, 
        userData, setUserData,
        getUserProfileData
    }

    useEffect(() => {
        getDoctorsData();
    }, [])

    useEffect(() => {
        if (token) {
            getUserProfileData()
        } else {
            setUserData(false);
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
