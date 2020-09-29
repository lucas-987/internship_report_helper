import { Router } from "https://deno.land/x/oak/mod.ts";
import { getAllInternship, getInternship, createInternship, updateIntership, deleteInternship } from './controllers/InternshipController.ts';

const router = new Router();

router.get('/internship_report_helper/internship', getAllInternship)
    .get('/internship_report_helper/internship:id', getInternship)
    .post('/internship_report_helper/internship', createInternship)
    .put('/internship_report_helper/internship:id', updateIntership)
    .delete('/internship_report_helper/internship:id', deleteInternship);

export {router};