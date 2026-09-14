import { DesignationId } from "../constants/designation";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface User {

  employeeName:string,
  mobileNumber:string,
  employeeId:string,
  designationId:DesignationId,
  status:number

}
