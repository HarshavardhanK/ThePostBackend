
const toTimestamp = (date, time) => {

    var strDate = date + " " + time;
    var timestamp = Date.parse(strDate);
    console.log(timestamp);

}

toTimestamp('2019-10-09', '20:45')



