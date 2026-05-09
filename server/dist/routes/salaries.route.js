import express from "express";
import { ingestSalary, getSalaries, getCompanyStats, compareSalaries, getCompanies, } from "./../controllers/salaries.controller.js";
export const salaryRoutes = express.Router();
salaryRoutes.post("/ingest-salary", ingestSalary);
salaryRoutes.get("/salaries", getSalaries);
salaryRoutes.get("/companies", getCompanies);
salaryRoutes.get("/compare", compareSalaries);
salaryRoutes.get("/stats/:company", getCompanyStats);
//# sourceMappingURL=salaries.route.js.map