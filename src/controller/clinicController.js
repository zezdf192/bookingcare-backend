import clinicService from '../service/clinicService';

const createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinic(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

const getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

const getDetailClinic = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinic(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

const clinicController = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinic: getDetailClinic,
};

export default clinicController;
