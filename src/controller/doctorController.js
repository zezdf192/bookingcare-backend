import {
    getTopDoctorDervice,
    getAllDoctorService,
    postDetailDoctorsService,
    getDetailDoctorByIDService,
    getMarkdownService,
    putMarkdownDoctorService,
    createBulkScheduleService,
    getScheduleByDateService,
    getExtraInforDoctorByIdService,
    getListPatientService,
    sendRemedyService,
} from '../service/doctorService';

export const handleGetTopDoctors = async (req, res) => {
    try {
        let limit = req.query.limit;
        if (!req.query.limit) {
            limit = 10;
        }

        console.log('check limit', limit);

        let response = await getTopDoctorDervice(+limit);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetAllDoctors = async (req, res) => {
    try {
        let response = await getAllDoctorService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handlePostDetailDoctors = async (req, res) => {
    try {
        let response = await postDetailDoctorsService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetDetailDoctorByID = async (req, res) => {
    try {
        let infor = await getDetailDoctorByIDService(req.query.id);

        return res.status(200).json(infor);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetMarkdown = async (req, res) => {
    try {
        let markdown = await getMarkdownService(req.query.id);
        return res.status(200).json(markdown);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handlePutMarkdownDoctor = async (req, res) => {
    try {
        let markdown = await putMarkdownDoctorService(req.body);
        return res.status(200).json(markdown);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleCreateBulkSchedule = async (req, res) => {
    try {
        let data = await createBulkScheduleService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetScheduleByDate = async (req, res) => {
    try {
        let data = await getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetExtraInforDoctorById = async (req, res) => {
    try {
        let data = await getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleGetListPatient = async (req, res) => {
    try {
        let data = await getListPatientService(req.query.doctorId, req.query.date);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleSendRemedy = async (req, res) => {
    try {
        let data = await sendRemedyService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
