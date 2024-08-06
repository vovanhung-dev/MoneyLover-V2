import {useEffect} from "react";
import {android, ios} from "@/assets";
import {Card, Comment, Feature} from "@/commons";
import DefaultLayout from "@/layout/defaultLayout.tsx";
import {cardFeatures, cardFooter, cardHome} from "@/model/card.ts";
import {motion as m} from "framer-motion";
import Aos from "aos";
import "aos/dist/aos.css";
import {Link} from "react-router-dom";
import {routePath} from "@/utils";

const Home = () => {
	useEffect(() => {
		Aos.init({
			duration: 2000,
		});
	}, []);

	return (
		<DefaultLayout>
			<div className="max-w-[1200px] mx-auto">
				<m.div
					initial={{opacity: 0, y: 100}}
					animate={{opacity: 1, y: 0}}
					transition={{
						ease: "linear",
						duration: 1,
						delay: 0.4
					}}
					className="mt-72 mx-auto h-screen lg:h-[50vh] text-center">
					<div
						className="text-6xl md:text-7xl text-center font-bold text-black"
					>
						Simple way
					</div>
					<div className="mx-auto mb-10  flex-row flex-center gap-4 text-center mt-3">
						<div
							className="text-xl md:text-4xl font-normal"
						>
							to manages{" "}
						</div>
						<div
							className="text-xl md:text-4xl font-semibold text-black text-pretty"
						>
							personal finances
						</div>
					</div>
					<div
					>
						<Link to={routePath.login.path}>
							<button className=" rounded-lg bg-slate-700 hover:scale-125 duration-500 hover:bg-slate-900 text-white py-4 px-8">
								Try on browser
							</button>
						</Link>
					</div>
				</m.div>
				<div className="mx-10 mt-40">
					<div className="h-auto ">
						{cardHome?.map((el, index) => (
							<div key={el.tittle} data-aos={`fade-${index % 2 ? "left" : "right"}`}>
								<Card
									detail={el.detail}
									img={el.img}
									tittle={el.tittle}
									key={el.img}
									className={`${
										index % 2 ? " md:flex-row-reverse my-20 md:my-40" : " "
									} `}
								/>
							</div>
						))}
					</div>
					<div className="h-screen mt-40">
						<h2 className="text-center font-semibold font-sans text-4xl mb-32">
							Features our users love
						</h2>
						<div className=" grid grid-cols-2 lg:grid-cols-3 gap-y-20">
							{cardFeatures?.map((el) => (
								<div key={el.img} data-aos="zoom-in-up">
									<Feature
										detail={el.detail}
										img={el.img}
										title={el.tittle}
										key={el.img}
									/>
								</div>
							))}
						</div>
					</div>

					<div className="mt-40 h-auto">
						<h2 className="text-center font-semibold font-sans text-4xl mb-32">
							See what others have to say
						</h2>
						<div className="grid-cols-1 md:grid-cols-3 grid gap-5  max-h-[575px] items-center ">
							{cardFooter?.map((el) => (
								<div key={el.name} data-aos="flip-left">
									<Comment key={el.name} comment={el.comment} name={el.name}/>
								</div>
							))}
						</div>
					</div>
					<div className="h-auto md:mt-0 mt-[1000px]">
						<div className="shadow-2xl shadow-slate-700 mt-40 p-14  text-black rounded-2xl w-full text-center">
							<p className="text-4xl font-sans mb-10 line-clamp-1">
								Take your finances to the next levels!
							</p>
							<span>Don't hesitate, money matters.</span>
							<div className="flex gap-10 justify-center pt-10">
								<img src={ios} alt=""/>
								<img src={android} alt=""/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DefaultLayout>
	);
};

export default Home;
