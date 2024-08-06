import withSup from "@/HOC/withSup.tsx";
import {lazy} from "react";

export {default as Header} from "./Header";
export {default as Footer} from "./Footer";
export {default as HeaderUser} from "./User/Header";

export {default as BreakCrumb} from "./BreakCrumb";


const BudgetForm = withSup(lazy(() => import("@/modules/budget/component/Form")))


export {BudgetForm}