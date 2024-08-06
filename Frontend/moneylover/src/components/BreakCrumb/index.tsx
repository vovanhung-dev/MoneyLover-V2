import {Link} from 'react-router-dom';
import {capitalizeFirstLetter, routePath} from "@/utils";

interface BreadcrumbProps {
	pageName: string;
}

const Breadcrumb = ({pageName}: BreadcrumbProps) => {
	return (
		<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<h2 className="text-title-md2 font-semibold text-black">
				{capitalizeFirstLetter(pageName)}
			</h2>

			<nav>
				<ol className="flex items-center gap-2">
					<li>
						<Link className="font-medium hover:bg-bodydark1 py-2 px-4 duration-700 rounded-lg" to={routePath.dashboard.path}>
							Dashboard /
						</Link>
					</li>
					<li className="font-medium text-primary">{capitalizeFirstLetter(pageName)}</li>
				</ol>
			</nav>
		</div>
	);
};
export default Breadcrumb;