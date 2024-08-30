import {lazy} from "react";
import withSup from "@/HOC/withSup.tsx";

const AllFriend = withSup(lazy(() => import("./AllFriend.tsx")))
const RequestFriend = withSup(lazy(() => import("./RequestFriend.tsx")))
const SearchAdd = withSup(lazy(() => import("./SearchAdd.tsx")))

export {SearchAdd, AllFriend, RequestFriend}