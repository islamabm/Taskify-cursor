import React, { useEffect, useState } from 'react';

import ToastComponent from '../cmps/helpers/ToastComponent';
import { toastService } from '../services/toast.service';
import LoginForm from '../cmps/LoginForm';
import { useNavigate } from 'react-router-dom';
import { routeService } from '../services/route.service';
import { useForm } from '../cmps/CustomHooks/useForm';
import transition from "../transition"
import LoginHeaderAndLogo from '../cmps/login/LoginHeaderAndLogo';
import LoginImageSection from '../cmps/login/LoginImageSection';
import { loginService } from '../services/login.service';
import { storageService } from '../services/storage.service';
import { ButtonComponent } from '../cmps/helpers/ButtonComponent';
import { utilService } from '../services/util.service';
import { onMessageListener, requestFirebaseToken } from '../services/firebase';

// test
function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);
    const [fields, handleChange] = useForm({ username: '', password: '' });

    const navigate = useNavigate();

    useEffect(() => {
        // Request Firebase Token
        requestFirebaseToken().then((currentToken) => {
            if (currentToken) {
                console.log("currentToken", currentToken)

                // console.log("Firebase token: ", currentToken); // Log the current token
                setCurrentToken(currentToken);
            } else {
                toastService.showToast(setToastProps, "No token available. Request permission to generate one.", "destructive");
                // console.warn("No token available. Request permission to generate one.");
            }
        }).catch((err) => {
            console.error("Error retrieving Firebase token: ", err);
        });

        // Listen for Firebase messages
        // onMessageListener()
        //     .then((payload) => {
        //         if (payload.fcmOptions && payload.fcmOptions.link) {
        //             try {
        //                 console.log("Firebase message payload: ", payload);
        //             } catch (error) {
        //                 console.error("Error processing Firebase message payload: ", error);
        //             }
        //         }
        //     })
        //     .catch((err) => console.error("Error listening to messages: ", err));
    }, []);


    const handleSubmit = async () => {
        setIsLoading(true);

        if (currentToken === null) {
            toastService.showToast(setToastProps, "No token available. Request permission to generate one.", "destructive");
            return;
        }
        if (fields.username !== "" && fields.password !== "") {

            const ipAddress = await utilService.getIpAddress();
            const loginData = {
                "pwdHash": fields.password,
                "phone1": fields.username,
                "ipAddress": ipAddress,
                "fcmToken": currentToken
            }
            try {
                const res = await loginService.checkLogin(loginData);


                if (res.status === 201) {
                    storageService.store('fullName_TASKIFY', res.data.fullName);
                    storageService.store('fullName_TASKIFY', res.data.fullName, true);
                    storageService.store('TOKEN_TASKIFY', res.data.access_token);
                    storageService.store('TOKEN_TASKIFY', res.data.access_token, true);
                    storageService.store('USERTYPEID_TASKIFY', res.data.userTypeID);
                    storageService.store('USERTYPEID_TASKIFY', res.data.userTypeID, true);
                    navigate(routeService.TASKS);
                } else if (res.data.statusCode === 404) {
                    toastService.showToast(setToastProps, `Error: ${res.data.message}`, "destructive");
                }
                else {
                    toastService.showToast(setToastProps, `Error: ${res.data.message}`, "destructive");
                }
            } catch (error) {
                toastService.showToast(setToastProps, `Login failed: user not found`, "destructive");
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            toastService.showToast(setToastProps, "Please enter your username and password.", "destructive");
        }
    };



    return (


        <div className="min-h-screen flex">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-background p-8">
                <LoginHeaderAndLogo logoSrc="https://haatdaas.lan-wan.net/daas/images/drLogo.png" logoName="Taskify" />
                <LoginForm
                    username={fields.username}
                    password={fields.password}
                    onChange={handleChange}
                />
                <ButtonComponent buttonText="Login" buttonTextWhenLoading="Wait ..." isLoading={isLoading} showButtonTextWhenLoading={true} onClick={handleSubmit} />

            </div>
            <LoginImageSection imageSrc="https://haatdaas.lan-wan.net/partnerMsg/images/download%20(17).jpg" />
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </div>
    );
}


export default transition(Login)