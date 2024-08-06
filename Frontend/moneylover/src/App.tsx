import "./App.css";
import {Route, Routes} from "react-router-dom";
import {route, routePath, routePathArray} from "./utils";
import {Home, PageNotFound} from "./modules";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import {WalletProvider} from "@/context/WalletContext.tsx";


function App() {
	const routes: route[] = routePathArray()

	const {login, register, forgot} = routePath

	return (
		<Routes>
			<Route index element={<Home/>}/>
			<Route path={login.path} element={
				<PublicRoute>
					<login.element/>
				</PublicRoute>
			}/>
			<Route path={register.path} element={
				<PublicRoute>
					<register.element/>
				</PublicRoute>
			}/>
			<Route path={forgot.path} element={
				<PublicRoute>
					<forgot.element/>
				</PublicRoute>
			}/>
			{routes.map((el) => (
				<Route key={el.path} path={el.path} element={
					<WalletProvider>
						<PrivateRoute>
							<el.element/>
						</PrivateRoute>
					</WalletProvider>
				}/>
			))}
			<Route path={`*`} element={<PageNotFound/>}/>
		</Routes>
	);
}

export default App;
