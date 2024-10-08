
export const removeVietnameseTones = (str:string) => {
  str = str.replace(/à|á|ả|ã|ạ|ă|ằ|ắ|ẳ|ẵ|ặ|â|ầ|ấ|ẩ|ẫ|ậ/g, "a");
  str = str.replace(/À|Á|Ả|Ã|Ạ|Ă|Ằ|Ắ|Ẳ|Ẵ|Ặ|Â|Ầ|Ấ|Ẩ|Ẫ|Ậ/g, "A");
  str = str.replace(/è|é|ẻ|ẽ|ẹ|ê|ề|ế|ể|ễ|ệ/g, "e");
  str = str.replace(/È|É|Ẻ|Ẽ|Ẹ|Ê|Ề|Ế|Ể|Ễ|Ệ/g, "E");
  str = str.replace(/ì|í|ỉ|ĩ|ị/g, "i");
  str = str.replace(/Ì|Í|Ỉ|Ĩ|Ị/g, "I");
  str = str.replace(/ò|ó|ỏ|õ|ọ|ô|ồ|ố|ổ|ỗ|ộ|ơ|ờ|ớ|ở|ỡ|ợ/g, "o");
  str = str.replace(/Ò|Ó|Ỏ|Õ|Ọ|Ô|Ồ|Ố|Ổ|Ỗ|Ộ|Ơ|Ờ|Ớ|Ở|Ỡ|Ợ/g, "O");
  str = str.replace(/ù|ú|ủ|ũ|ụ|ư|ừ|ứ|ử|ữ|ự/g, "u");
  str = str.replace(/Ù|Ú|Ủ|Ũ|Ụ|Ư|Ừ|Ứ|Ử|Ữ|Ự/g, "U");
  str = str.replace(/ỳ|ý|ỷ|ỹ|ỵ/g, "y");
  str = str.replace(/Ỳ|Ý|Ỷ|Ỹ|Ỵ/g, "Y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/Đ/g, "D");
  // Loại bỏ các ký tự đặc biệt
  str = str.replace(/[^a-zA-Z0-9 ]/g, "");
  return str;
};