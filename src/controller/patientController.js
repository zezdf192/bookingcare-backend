import { createPatientService, verifyPatientService } from '../service/patientService';

export const handleCreatePatient = async (req, res) => {
    try {
        let data = await createPatientService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

export const handleVerifyPatient = async (req, res) => {
    try {
        let data = await verifyPatientService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
