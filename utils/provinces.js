const pcvn = require('pc-vn');
const areas = [
    //Tay Bac Bo
    ['Tỉnh Điện Biên', 'Tỉnh Hoà Bình', 'Tỉnh Lai Châu', 'Tỉnh Lào Cai', 'Tỉnh Sơn La', 'Tỉnh Yên Bái'],
    //Dong Nam Bo
    ['Tỉnh Bắc Giang', 'Tỉnh Bắc Kạn', 'Tỉnh Cao Bằng', 'Tỉnh Hà Giang', 'Tỉnh Lạng Sơn', 'Tỉnh Phú Thọ', 'Tỉnh Quảng Ninh', 'Tỉnh Thái Nguyên', 'Tỉnh Tuyên Quang'],
    //Dong bang Song Hong
    ['Tỉnh Bắc Ninh', 'Tỉnh Hà Nam', 'Thành phố Hà Nội', 'Tỉnh Hải Dương', 'Thành phố Hải Phòng', 'Tỉnh Hưng Yên', 'Tỉnh Nam Định', 'Tỉnh Ninh Bình', 'Tỉnh Thái Bình', 'Tỉnh Vĩnh Phúc'], //Dong bang song hong
    //Bac Trung Bo
    ['Tỉnh Hà Tĩnh', 'Tỉnh Nghệ An', 'Tỉnh Quảng Bình', 'Tỉnh Quảng Trị', 'Tỉnh Thanh Hóa', 'Tỉnh Thừa Thiên Huế'],//Bac Trung Bo
    //Duyen hai Nam Trung Bo
    ['Tỉnh Bình Định', 'Tỉnh Bình Thuận', 'Thành phố Đà Nẵng', 'Tỉnh Khánh Hòa', 'Tỉnh Ninh Thuận', 'Tỉnh Phú Yên', 'Tỉnh Quảng Nam', 'Tỉnh Quảng Ngãi'],
    //Tay Nguyen
    ['Tỉnh Đắk Lắk', 'Tỉnh Đắk Nông', 'Tỉnh Gia Lai', 'Tỉnh Kon Tum', 'Tỉnh Lâm Đồng'],
    //Dong Nam Bo
    ['Tỉnh Bà Rịa - Vũng Tàu', 'Tỉnh Bình Dương', 'Tỉnh Bình Phước', 'Tỉnh Đồng Nai', 'Thành phố Hồ Chí Minh', 'Tỉnh Tây Ninh'], // Dong Nam Bo
    //Dong bang Song Cuu Long
    ['Tỉnh An Giang', 'Tỉnh Bạc Liêu', 'Tỉnh Bến Tre', 'Tỉnh Cà Mau', 'Thành phố Cần Thơ', 'Tỉnh Đồng Tháp', 'Tỉnh Hậu Giang', 'Tỉnh Kiên Giang', 'Tỉnh Long An', 'Tỉnh Sóc Trăng', 'Tỉnh Tiền Giang', 'Tỉnh Trà Vinh', 'Tỉnh Vĩnh Long']
];
const mappingProvinceToArea = (province) => {
    if (areas[0].includes(province)) return "Tây Bắc Bộ";
    if (areas[1].includes(province)) return "Đông Bắc Bộ";
    if (areas[2].includes(province)) return "Đồng bằng Sông Hồng";
    if (areas[3].includes(province)) return "Bắc Trung Bộ";
    if (areas[4].includes(province)) return "Duyên hải Nam Trung Bộ";
    if (areas[5].includes(province)) return "Tây Nguyên";
    if (areas[6].includes(province)) return "Đông Nam Bộ";
    if (areas[7].includes(province)) return "Đồng bằng Sông Cửu Long";
}
const mappingProvinceToSide = (province) => {
    if (areas[0].includes(province)) return "Miền Bắc";
    if (areas[1].includes(province)) return "Miền Bắc";
    if (areas[2].includes(province)) return "Miền Bắc";
    if (areas[3].includes(province)) return "Miền Trung";
    if (areas[4].includes(province)) return "Miền Trung";
    if (areas[5].includes(province)) return "Miền Trung";
    if (areas[6].includes(province)) return "Miền Nam";
    if (areas[7].includes(province)) return "Miền Nam";
}
const getProvinceNames = () => {
    let ret = [];
    pcvn.getProvinces()
        .forEach((province) => {
            ret.push(province.name);
        });
    return ret;
}
const getAreas = () => {
    return ["Tây Bắc Bộ",
        "Đông Bắc Bộ",
        "Đồng bằng Sông Hồng",
        "Bắc Trung Bộ",
        "Duyên hải Nam Trung Bộ",
        "Tây Nguyên",
        "Đông Nam Bộ",
        "Đồng bằng Sông Cửu Long"];
}
const getSides = () => {
    return ["Miền Bắc", "Miền Trung", "Miền Nam"];
}
const getAddressNames = () => {
    let ret = [];
    pcvn.getWards()
        .forEach((address) => {
            ret.push(address.full_name);
        });
    return ret;
}
const getAreasOfSide = (side) => {
    if (side === "Miền Bắc") return ["Tây Bắc Bộ", "Đông Bắc Bộ", "Đồng bằng Sông Hồng"];
    if (side === "Miền Trung") return ["Bắc Trung Bộ", "Duyên hải Nam Trung Bộ", "Tây Nguyên"];
    if (side === "Miền Nam") return ["Đông Nam Bộ", "Đồng bằng Sông Cửu Long"];
}
const getProvincesOfArea = (area) => {
    if(area === "Tây Bắc Bộ") return areas[0];
    if(area === "Đông Bắc Bộ") return areas[1];
    if(area === "Đồng bằng Sông Hồng") return areas[2];
    if(area === "Bắc Trung Bộ") return areas[3];
    if(area === "Duyên hải Nam Trung Bộ") return areas[4];
    if(area === "Tây Nguyên") return areas[5];
    if(area === "Đông Nam Bộ") return areas[6];
    if(area === "Đồng bằng Sông Cửu Long") return areas[7];
}
module.exports = {
    getProvinceNames,
    mappingProvinceToArea,
    mappingProvinceToSide,
    getAreas,
    getSides,
    getAddressNames,
    getAreasOfSide,
    getProvincesOfArea,
}