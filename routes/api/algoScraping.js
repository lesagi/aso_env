const express = require("express");
const rp = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

router.get('/', async function (req, res) {
  const messages = await getMessages();
  res.json(messages);
});

const getMessages = async () => {
  return rp("https://www.cs.bgu.ac.il/~algo201/Main")
  .then(html => {
    const $ = cheerio.load(html);
    const dateMsgToDate = msg => {
      const dateStr = msg.match(new RegExp(/\d.*\d/gim))[0];
      const dayDateStr = dateStr.split(new RegExp(/\s/gim));
      const dayDateBits = dayDateStr[0].split("/");
      const newDayDateFormat = [dayDateBits[1],dayDateBits[0],dayDateBits[2]].join("/");
      return new Date(Date.parse(`${newDayDateFormat} ${dayDateStr[1]}`));
    }
    
    const currTime = new Date(Date.now()-60000*5); // fifteen minutes ago
    let ids = $('.messageboard', html).toArray().map(curr => curr['attribs']['id']);
    let messages = ids.map((id, i) => {
      let title = $('.subject', `#${id}`).text();
      let body = $('.body', `#${id}`).text();
      let date = dateMsgToDate($('.date', `#${id}`).text());
      if(currTime.getTime() <= date.getTime()){
        return {
          "index": i+1,
          "title": title.trim(),
          "body": body.trim()
        }
      } else return {};
    });
    return messages.filter(curr => Object.keys(curr).length !== 0);
        
  })
  .catch(err => console.log(err));
}

module.exports = router;