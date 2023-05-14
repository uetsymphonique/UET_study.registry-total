const randomFunction = require("./randomFunction");

const organizations = ['Hợp tác xã', 'Phòng Giáo dục và Đào tạo', 'Nhà máy', 'Xí nghiệp may', 'Tổng công ty', 'Cục Cảnh sát', 'Bộ', 'Công ty TNHH', 'Trường Đại học', 'Trường Trung cấp', 'Doanh nghiệp'];
const generateOwner = (index) => {
    const roles = ['organization', 'individual', 'individual', 'individual', 'organization'];
    const role = roles[randomFunction.getRandomNumber(0, roles.length - 1)];
    return {
        name: (role === 'organization') ? `${organizations[randomFunction.getRandomNumber(0, organizations.length-1)]} ${index}`:randomFunction.createNameOfPerson(),
        phone: randomFunction.createPhoneNumber(),
        email: `${role}${index}@gmail.com`,
        address: randomFunction.createAddress(),
        role: role
    }
}

module.exports = generateOwner;



