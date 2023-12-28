import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";


import App from "./App";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ListWork from "./pages/ListWork";
import Friends from "./pages/Friends";
import Received from "./pages/Received";
import ReceivedWork from './pages/ReceivedWork';
import Notificaions from './pages/Notifications';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <div>Not Found</div>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/dashboard/:id/:index",
                element: <ListWork />
            },
            {
                path: "/friends",
                element: <Friends />
            }, 
            {
                path: "/received",
                element: <Received />
            }, 
            {
                path: "/received/:id/:index",
                element: <ReceivedWork />
            },
            {
                path: "/notifications",
                element: <Notificaions />
            }

        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
  );
