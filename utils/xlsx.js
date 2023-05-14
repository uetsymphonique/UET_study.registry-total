const xlsx = require('xlsx');

const xlsxToJson = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(worksheet);

}

module.exports = xlsxToJson;
// xlsxToJson('./../uploads/xlsx/cars.xlsx');