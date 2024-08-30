import LoadingComponent from "@/components/Loading";
import {Button} from "antd";
import {Link} from "react-router-dom";

const ErrorRoute = () => {
	return <>
		<div className={`h-screen`}>
			<LoadingComponent/>
			<div className="rounded-sm w-2/3 mx-auto border border-stroke bg-white shadow-3 pt-10 mt-[50px]">
				<div className={`w-2/3 mx-auto pb-10`}>
					<span className={`text-sm text-red-500  font-semibold flex-center mb-4`}>An error occurred to handle that request.Please give us a few minutes and try again</span>

					<div className={`flex gap-2 items-center`}>
						<Button type={"primary"} className={`bg-Primary`} onClick={() => location.reload()}>Try again</Button>
						<Link to={"/"}>
							<Button className={`bg-Primary text-white`}>Home</Button>
						</Link>
						<Link to={"/login"}>
							<Button type={"primary"} className={`bg-Primary text-white`}>Login</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</>
}

export default ErrorRoute
