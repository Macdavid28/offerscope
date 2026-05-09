import express from "express";
import type { Router } from "express";
import {
  ingestSalary,
  getSalaries,
  getCompanyStats,
  compareSalaries,
  getCompanies,
} from "./../controllers/salaries.controller";
export const salaryRoutes: Router = express.Router();

salaryRoutes.post("/ingest-salary", ingestSalary);
salaryRoutes.get("/salaries", getSalaries);
salaryRoutes.get("/companies", getCompanies);
salaryRoutes.get("/compare", compareSalaries);
salaryRoutes.get("/stats/:company", getCompanyStats);
