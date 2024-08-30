import withSup from "@/HOC/withSup.tsx";
import {lazy} from "react";

export {default as TableTransaction} from "./Table/Transaction.tsx";

const FilterFormTransaction = withSup(lazy(() => import("./Form/FilterForm.tsx")))

const FormTransaction = withSup(lazy(() => import("./Form/AddForm.tsx")))


export {FormTransaction, FilterFormTransaction}