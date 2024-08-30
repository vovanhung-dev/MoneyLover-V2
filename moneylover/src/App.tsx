import "./App.css";
import {Route, Routes} from "react-router-dom";
import {route, routePrivate, routePublic} from "./utils";
import {Home, PageNotFound} from "./modules";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import {WalletProvider} from "@/context/WalletContext.tsx";


function App() {
	const routesPrivate: route[] = routePrivate()
	const routesPublic: route[] = routePublic()

	return (
		<Routes>
			<Route index element={<Home/>}/>
			{routesPublic.map((el) => (
				<Route key={el.name} path={el.path} element={
					<PublicRoute>
						<el.element/>
					</PublicRoute>
				}/>
			))}
			{routesPrivate.map((el) => (
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
