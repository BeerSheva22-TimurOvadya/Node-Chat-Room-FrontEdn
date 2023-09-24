import AuthService from "../service/AuthService";
import AuthServiceJwt from "../service/AuthServiceJwt";
import EmployeesService from "../service/EmployeesService";
import EmployeesServiceRest from "../service/EmployeesServiceRest";

export const authService: AuthService =
 new AuthServiceJwt('http://localhost:8080/users/login');
 export const employeesService: EmployeesService =
  new EmployeesServiceRest("localhost:8080/employees");