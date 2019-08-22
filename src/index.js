var express = require("express"),
    app = express();
    
import Bottleneck from "bottleneck";
 

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 333
});

const makeRequests = {};

import "isomorphic-fetch";

makeRequests.sendData = (urls) => {
    urls.forEach(async url => {
      try {
          const response = await limiter.schedule(() => fetch(url, {
          'method': 'POST',
          'headers': {
              'content-type': 'application/x-www-form-urlencoded',
              'charset': 'utf-8',
          }
      }));
          if(response.ok){
              const jsonResponse = await response.json();
              if(!jsonResponse.success){
                  console.log(url);
              }
                
          }
          
          else {

            throw new Error("Something went wrong")
        };
          const counts = limiter.counts();
          console.log(counts);
      } catch(error) {
          console.log(error);
      }
    });
}

module.exports = makeRequests;
