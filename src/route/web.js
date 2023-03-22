import express from 'express';
import { getHomePage } from '../controller/homeController';
import {
    handleGetTopDoctors,
    handleGetAllDoctors,
    handlePostDetailDoctors,
    handleGetDetailDoctorByID,
    handleGetMarkdown,
    handlePutMarkdownDoctor,
    handleCreateBulkSchedule,
    handleGetScheduleByDate,
    handleGetExtraInforDoctorById,
    handleGetListPatient,
    handleSendRemedy,
} from '../controller/doctorController';
import {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUsers,
    handleDeleteUsers,
    handleEditUsers,
    handleGetAllCode,
} from '../controller/userController';

import { handleCreatePatient, handleVerifyPatient } from '../controller/patientController';

import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';

const router = express.Router();

const initWebRoute = (app) => {
    router.get('/', getHomePage);

    router.post('/api/v1/login', handleLogin);

    router.get('/api/v1/get-all-users', handleGetAllUsers);

    router.post('/api/v1/create-new-user', handleCreateNewUsers);

    router.put('/api/v1/edit-user', handleEditUsers);

    router.delete('/api/v1/delete-user', handleDeleteUsers);

    // Booking care

    router.get('/api/get-allcode', handleGetAllCode);

    router.get('/api/get-top-doctors', handleGetTopDoctors);

    router.get('/api/get-all-doctors', handleGetAllDoctors);

    router.post('/api/post-detail-doctors', handlePostDetailDoctors);

    router.get('/api/get-detail-doctor-by-id', handleGetDetailDoctorByID);

    router.get('/api/get-markdown', handleGetMarkdown);

    router.put('/api/put/markdown-doctor', handlePutMarkdownDoctor);

    router.post('/api/create-bulk-schedule', handleCreateBulkSchedule);

    router.get('/api/get-schedule-by-date', handleGetScheduleByDate);

    router.get('/api/get-extra-infor-doctor-by-id', handleGetExtraInforDoctorById);

    router.post('/api/create-patient', handleCreatePatient);

    router.post('/api/verify-patient', handleVerifyPatient);

    router.get('/api/get-list-patient', handleGetListPatient);

    //specialty
    router.post('/api/create-specialty', specialtyController.createSpecialty);

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);

    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty);

    //Clinic
    router.post('/api/create-clinic', clinicController.createClinic);

    router.get('/api/get-all-clinic', clinicController.getAllClinic);

    router.get('/api/get-detail-clinic', clinicController.getDetailClinic);

    //remedy
    router.post('/api/send-remedy', handleSendRemedy);

    return app.use('/', router);
};

export default initWebRoute;
