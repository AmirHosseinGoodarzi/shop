const moment = require('jalali-moment');

exports.getDateTime = (DateTime) => {
  moment.locale('fa', {
    useGregorianParser: true,
  });
  let jalaliDateTime = moment(DateTime).format();
  jalaliDateTime = jalaliDateTime.split('T');
  const jDate = jalaliDateTime[0];
  const jTime = jalaliDateTime[1].split('+')[0];
  return { jDate, jTime };
};
