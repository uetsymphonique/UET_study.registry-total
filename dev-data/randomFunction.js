const rand = require('random-seed').create();
const getRandomString = (length) => {
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += str.charAt(Math.floor(Math.random() * str.length));
    }
    return randomString;
};
const getRandomNumber = (min, max) => rand.intBetween(min, max);

const generateUniqueString = (lastDigit, min, max) => {
    const timestamp = (new Date().getTime() * 2314464  + 12334524).toString().slice(lastDigit);
    const randomNum = getRandomNumber(min, max);
    return `${timestamp}${randomNum}`;
};

const createDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const mm = String(randomDate.getMonth() + 1).padStart(2, '0');
    const dd = String(randomDate.getDate()).padStart(2, '0');
    const yyyy = randomDate.getFullYear();
    return `${mm}${dd}${yyyy}`;
};

const createNameOfPerson = () => {
    const ho = ["Nguyễn", "Ngô", "Lê", "Trần", "Bùi", "Phạm", "Đinh", "Triệu"];
    const dem = ["Văn", "Thị", "Quang", "Thanh", "Phúc", "Việt", "Tiến", "Vân", "Minh", "Anh"];
    const ten = ["Linh", "Nam", "Hòa", "Khoa", "Lập", "Chi", "Hoàng", "Bảo", "Doanh", "Thư", "Thạch", "Hoa", "Lộc", "Anh", "Minh", "Đức", "Dương"];
    const randHo = Math.floor(Math.random() * ho.length);
    const randDem = Math.floor(Math.random() * dem.length);
    const randTen = Math.floor(Math.random() * ten.length);
    return `${ho[randHo]} ${dem[randDem]} ${ten[randTen]}`;
}
const createPhoneNumber = () => `0${generateUniqueString(-4,10000,99999)}`;
exports.createSSN = () => generateUniqueString(-6, 100000, 999999);
module.exports = { getRandomNumber, getRandomString, generateUniqueString, createDate, createPhoneNumber, createNameOfPerson};