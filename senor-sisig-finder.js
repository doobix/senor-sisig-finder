const request = require('request');
const cheerio = require('cheerio');

let result = 'Sorry, there are no locations for Señor Sisig today.';

const date = new Date();
const utcDate = new Date(date.toUTCString());
utcDate.setHours(utcDate.getHours()-8);
const pacificTime = new Date(utcDate);
const day = pacificTime.getDate();
const month = pacificTime.getMonth() + 1;
const year = pacificTime.getFullYear();
const senorSisigDate = `${year}-${('0'+month).slice(-2)}-${('0'+day).slice(-2)}`;
const results = [];

request('http://www.senorsisig.com/', function(err, resp, html) {
  if (!err) {
    const $ = cheerio.load(html);
    const locations = $('#loc-wrap').find(`section[data-wcal-date=${senorSisigDate}]`);

    result = `Señor Sisig is in ${locations.length} locations today.\n`;

    if (locations.length) {
      locations.each(function(i, el) {
        let location = $(this).find('h5').text();
        location = location.replace(/&/g, 'and');

        const time = $(this).find('.time span');
        const startTime = time.html();
        const endTime = time.next().html();
        results.push({
          location: location,
          time: `${startTime} to ${endTime}`,
        });
      });

      results.forEach(function(obj) {
        result += `${obj.location}: ${obj.time}\n`
      });
    }
  }

  console.log(result);
  return result;
});
