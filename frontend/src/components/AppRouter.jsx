import React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import { publicRoutes } from "../routes";

const AppRouter = () => { 
    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map(({ path, Component }) => 
                    <Route key={path} path={path} element={<Component />} />
                )}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;