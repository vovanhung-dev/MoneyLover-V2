import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {BrowserRouter as Router} from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ToastContainer} from "react-toastify";
import {LoadingProvider} from "./context/LoadingContext.tsx";
import {CategoryProvider} from "@/context/CategoryContext.tsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<LoadingProvider>
			<Router>
				<CategoryProvider>
					<ToastContainer limit={3}/>
					<App/>
				</CategoryProvider>
			</Router>
		</LoadingProvider>
	</QueryClientProvider>
);
