import cn from "@/utils/cn";
import {motion as m} from "framer-motion";
import {useChatStore} from "@/modules/chat/store/chatStore.ts";
import {IPrev} from "@/assets";
import {getAllMediaOfGroup, Group} from "@/modules/chat/function/chats.ts";
import {useEffect, useState} from "react";
import {Image} from "antd";

interface props {
	group: Group
}

const typeMedia = [
	"Media", "Files", "Links"
]
const Media = ({group}: props) => {
	const {setIsMediaOpen, isMediaOpen} = useChatStore()
	const [listMedia, setListMedia] = useState<string[]>([])

	useEffect(() => {
		const fetchMedia = async () => {
			const result = await getAllMediaOfGroup(group.id)
			setListMedia(result)
		}

		fetchMedia()
	}, [group]);

	return <>
		<m.div
			key={"media"}
			initial={{x: 100, opacity: 0}}
			animate={{x: 0, opacity: 1}}
			exit={{x: 100, opacity: 0}}
			transition={{duration: 0.2}}
			className={cn(`absolute z-99999 w-2/3 lg:w-1/3 h-full right-0 p-4 bg-white shadow-3`)}>
			<header className={`flex justify-start mb-3 cursor-pointer`}><IPrev className={`hover:bg-gray-300 rounded-full p-1`}
																				func={() => setIsMediaOpen(!isMediaOpen)}/></header>
			<div>
				<div className={`flex gap-3`}>
					{typeMedia.map((e) => (
						<>
							<div className={`py-2 px-3 rounded-lg cursor-pointer hover:bg-gray-300 `}>{e}</div>
						</>
					))}
				</div>
				<div className={`mt-2`}>
					<Image.PreviewGroup preview={{
						onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
					}}>
						{listMedia.map((e) => (
							<Image src={e} width={"120px"} height={"120px"} alt="" className={` object-fill rounded-lg`}/>
						))}
					</Image.PreviewGroup>
				</div>
			</div>
		</m.div>
	</>
}

export default Media