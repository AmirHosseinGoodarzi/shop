module.exports = (str) => {
  let slugStr = str;
  slugStr = slugStr.replace(/^\s+|\s+$/g, '');
  slugStr = slugStr.toLowerCase();
  //persian support
  slugStr = slugStr
    .replace(/[!@#$%^&*()]/g, '')
    .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return slugStr;
};
