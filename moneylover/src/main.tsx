import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {BrowserRouter as Router} from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ToastContainer} from "react-toastify";
import {LoadingProvider} from "./context/LoadingContext.tsx";
import {CategoryFetchProvider} from "@/context/CategoryContext.tsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<LoadingProvider>
			<Router>
				<ToastContainer limit={3}/>
				<CategoryFetchProvider>
					<App/>
				</CategoryFetchProvider>
			</Router>
		</LoadingProvider>
	</QueryClientProvider>
);
