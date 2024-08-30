import {Cancel} from "@/assets";
import {Group} from "@/modules/chat/function/chats.ts";
import {useState} from "react";
import CollapseInforChat from "@/modules/chat/common/collapseInforChat.tsx";
import {convertTimeStampToDate} from "@/utils/day.ts";
import dayjs from "dayjs";
import {motion as m} from "framer-motion";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import cn from "@/utils/cn";


interface props {
	group?: Group
}


const InformationRight: React.FC<props> = ({group}) => {

	const [clickCollapse, setClickCollapse] = useState<number[]>([0])
	const {isInformationOpen, setIsInformationOpen, setIsMediaOpen, isMediaOpen} = useChatStore()

	const media = [
		{
			icon: "",
			title: "Media",
			func: () => setIsMediaOpen(!isMediaOpen)
		},
		{
			icon: "",
			title: "Files",
			func: () => setIsMediaOpen(!isMediaOpen)
		},
		{
			icon: "",
			title: "Links",
			func: () => setIsMediaOpen(!isMediaOpen)
		}
	]

	const cardInfo = [
		{
			label: "Chat members",
			children: <>
				{group?.members?.map((e) => (
					<div className={`flex gap-4 rounded-lg p-2 cursor-pointer hover:bg-gray-300`}>
						<div className={`size-12 bg-black rounded-full`}></div>
						<div className={`flex flex-col gap-2`}>
							<span className={`font-semibold text-lg line-clamp-1`}>{e?.user?.username}</span>
							<span
								className={`text-sm text-bodydark2 line-clamp-1`}>Add in {dayjs(convertTimeStampToDate(e?.createdAd)).format('MMMM D, YYYY, h:mm A')}</span>
						</div>

					</div>
				))}
			</>
		},
		{
			label: "Media",
			children: <>
				{media.map((e) => (
					<div onClick={e.func} className={`flex gap-4 rounded-lg p-2 cursor-pointer hover:bg-gray-300`}>
						<div className={`size-12 bg-black rounded-full`}></div>
						<div>
							<span>{e.title}</span>
						</div>
					</div>
				))}
			</>
		}
	]

	const clickShowCollapse = (e: number) => {
		if (clickCollapse.includes(e)) {
			const result = clickCollapse.filter((i) => i != e)
			setClickCollapse(result)
		} else {
			setClickCollapse(prev => [...prev, e])
		}
	}

	return <>
		<m.div
			key={"information"}
			initial={{x: 100, opacity: 0}}
			animate={{x: 0, opacity: 1}}
			exit={{x: 100, opacity: 0}}
			transition={{duration: 0.2}}
			className={cn(`absolute w-2/3 lg:w-1/3 shadow-3 h-full right-0 p-4 bg-white`)}>
			<header className={`flex justify-end cursor-pointer`}><Cancel className={`hover:bg-gray-300 p-1 rounded-full`}
																		  func={() => setIsInformationOpen(!isInformationOpen)}/></header>
			<div className={`flex flex-col gap-6`}>
				<div className={`flex-center flex-col`}>
					<div className={`size-30 rounded-full bg-black`}></div>
					<span className={`text-lg mt-2 font-semibold`}>{group?.name}</span>
				</div>
				{cardInfo.map((e, i) => (
					<CollapseInforChat label={e.label} showCollapse={() => clickShowCollapse(i)}
									   clickCollapse={clickCollapse.includes(i)}>
						{e.children}
					</CollapseInforChat>
				))}
			</div>
		</m.div>
	</>
}

export default InformationRight