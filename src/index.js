var express = require("express"),
    app = express();
    
import Bottleneck from "bottleneck";
 
// ECMAScript 2015
import regeneratorRuntime from "regenerator-runtime";

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
                console.log(jsonResponse);
              if(!jsonResponse.success){
                  console.log(url);
              }
                
          }
          
          else throw new Error("Something went wrong");
          const counts = limiter.counts();
          console.log(counts);
      } catch(error) {
          console.log(error);
      }
    });
}

// makeRequests.sendData = (urls) => {
//     urls.forEach(async url => {
//         console.log(url);
//       try {
//           const response = await fetch(url, {
//           'method': 'POST',
//           'headers': {
//               'content-type': 'application/x-www-form-urlencoded',
//               'charset': 'utf-8'
//           }
//       });
//           if(response.ok){
//               console.log(response);
//           }
//           throw new Error("Something went wrong");
//       } catch(error) {
//           console.log(error);
//       }
//     });
// }

module.exports = makeRequests;


// https://api.mobileaction.co/keywords/351506/US?keywords=hello,what,is,this&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28
