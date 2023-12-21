import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";


import App from "./App";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ListWork from "./pages/ListWork";
import Friends from "./pages/Friends";

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
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
  );
