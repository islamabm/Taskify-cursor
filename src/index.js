import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { Provider } from 'react-redux';
// import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from "./cmps/ThemeProvider"
// import { I18nextProvider } from 'react-i18next';
// import i18next from 'i18next';  // Make sure to import i18next

const queryClient = new QueryClient();
// i18next.init({
//     interpolation: { escapeValue: false },  // React aeady does escaping
//     lng: "en",
//     resources: {
//         en: {
//             global: global_en
//         },

//         he: {
//             global: global_he
//         },
//     },

// })
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme-taskify">
            {/* <I18nextProvider i18n={i18next}> */}

            {/* <Provider store={store}> */}
            <App />
            {/* </Provider> */}
            {/* </I18nextProvider> */}
        </ThemeProvider>

        {/* <ReactQueryDevtools /> */}
    </QueryClientProvider >

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
