import { PROJECT_STATUS } from "../constants";


export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS]