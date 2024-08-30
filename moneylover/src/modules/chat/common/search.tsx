import {Cancel, IImage} from "@/assets";
import {useState} from "react";
import cn from "@/utils/cn";
import {Button} from "antd";
import {motion as m} from "framer-motion";


interface props {
	handleSendMessage: (image: File[]) => void
	setNewMessage: (e: string) => void
	message: string
}

interface FileData {
	file: File;
	previewUrl: string;
}

const Search = ({handleSendMessage, setNewMessage, message}: props) => {
	const [images, setImages] = useState<FileData[]>([])
	const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileArray: FileData[] = Array.from(files).map(file => ({
				file,
				previewUrl: URL.createObjectURL(file),
			}));
			setImages((prev) => [...prev, ...fileArray]);
		}
	}

	const handleRemoveFile = (index: number) => {
		const updatedFiles = images.filter((_, i) => i !== index);
		setImages(updatedFiles);
	};

	const sendMessage = () => {
		setImages([])
		handleSendMessage(images.map((e) => e.file));
	}


	return <>
		<div className={`absolute w-full bottom-0 py-4 bg-white border-l border-bodydark`}>
			<div className="relative flex items-center px-4 ">
				{images?.length === 0 &&
                    <m.div
                        key={images.length}
                        initial={{x: 20}}
                        animate={{x: 0}}
                        transition={{duration: 0.3}}
                        className={`mr-6 hover:scale-105`}>
                        <label className={`cursor-pointer`} htmlFor="file-input">
                            <IImage color={`#5BC0EB`}/>
                        </label>
                        <input onChange={handleChangeImg} multiple className={`hidden`} id="file-input" type="file"/>
                    </m.div>}
				{
					images?.length > 0 &&
                    <div
                        className={`absolute z-99999 w-full bg-white rounded-t-2xl border-l border-b-none  flex items-center gap-4 top-[-95px] pl-10 left-0 `}>
                        <div className={`hover:scale-105 bg-gray-200 p-3 rounded-lg`}>
                            <label className={`cursor-pointer`} htmlFor="file-input">
                                <IImage color={`#5BC0EB`} width={30} height={30}/>
                            </label>
                            <input onChange={handleChangeImg} className={`hidden`} multiple id="file-input" type="file"/>
                        </div>

						{images?.map(({previewUrl}, index) => {
							return (
								<div className={`size-20 relative my-2 bg-gray-300 rounded-lg flex-center`}>
									<img key={index}
										 src={previewUrl}
										 alt={`preview-${index}`}
										 className={`size-13 object-cover`}
									/>
									<div onClick={() => handleRemoveFile(index)}
										 className={`size-5 rounded-full bg-gray-400 absolute -top-2 -right-2 flex-center hover:scale-105 duration-200 cursor-pointer`}>
										<Cancel
											width={15}
											height={15}/>
									</div>
								</div>
							)
						})}
                    </div>
				}

				<input
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							sendMessage()
						}
					}}
					id="Send" value={message} onChange={(e) => setNewMessage(e.target.value)}
					className={cn(`block w-full py-4  ps-6 text-sm text-gray-900 border rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 border-blue-200`
						, {"rounded-t-none rounded-b-2xl border-t-none": images.length > 0})}
					placeholder="Typing your message..." required/>
				<Button disabled={!message.trim() && images.length === 0} onClick={() => sendMessage()} type={"primary"}
						className="text-white absolute end-7 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-4 py-2">Send
				</Button>
			</div>
		</div>
	</>
}

export default Search