var express = require("express"),
    request = require("request"),
    convertFromTo = require("../functions/convertFromTo.js"),
    iosApp = require("../models/iosApp.js"),
    Keyword = require("../models/keyword.js"),
    blackKey = require("../models/blackKey.js"),
    invalidKey = require("../models/invalidKey.js"),
    RateLimiter = require('request-rate-limiter'),

    app = express();


var addKeyTo = {

    // The "appstore-keyword-ranking" api call returns slightly different keys for the keywords objects
    // such as "chance" (Stands for "traffic") instead of "ownIphoneChance"
    // In order to be able to use this function to sort keywords from this kind of API, the function checks the structure of the keyword
    // object arg, that is passed to the it.
    // API: https://www.mobileaction.co/docs/api#appstore-keyword-ranking

    // if "ownIphoneChance" is one of the object keys, that means it was transferred from the "AppStore Keyword Metadata" API
    // https://www.mobileaction.co/docs/api#appstore-keyword-metadata

    // Create a new keywords into the Keywords Collection in the DB
    keywordsCollection: function(obj, storeId) {

        if (obj.ownIphoneChance) {
            var newKey = {
                keyword: obj.keyword,
                updates: [{
                    traffic: Math.round(obj.searchVolume),
                    difficulty: Math.round(obj.ownIphoneChance),
                    competition: obj.numberOfIphoneApps
                }]
            };
        }
        else {
            var newKey = {
                keyword: obj.keyword,
                updates: [{
                    traffic: Math.round(obj.searchVolume),
                    difficulty: Math.round(obj.chance),
                    competition: obj.numberOfApps
                }]
            };
        }

        Keyword.create(newKey, function(err, keyword) {
            if (err) {
                console.log(err);
            }
            else {
                if (storeId) {
                    addKeyTo.appKeysArray(keyword, storeId);
                }
                // console.log("createKey function");
                // console.log(keyword);
            }
        });
    },

    // Create a new keywords into the blackListKeyword Collection in the DB
    blackKeysCollection: function(obj, storeId) {
        if (obj.ownIphoneChance) {
            var newKey = {
                keyword: obj.keyword,
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.ownIphoneChance),
                competition: obj.numberOfIphoneApps
            }
        }
        else {
            var newKey = {
                keyword: obj.keyword,
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.chance),
                competition: obj.numberOfApps
            }
        }

        blackKey.create(newKey, function(err, keyword) {
            if (err) {
                console.log(err);
            }
            else {
                // console.log("createBlackKey function");
                // console.log(keyword);
            }
        });
    },


    // Create a new keywords into the blackListKeyword Collection in the DB
    invalidKeysCollection: function(obj, err) {
        if (obj.ownIphoneChance) {
            var newKey = {
                keyword: obj.keyword,
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.ownIphoneChance),
                competition: obj.numberOfIphoneApps
            }
        }
        else {
            var newKey = {
                keyword: obj.keyword,
                traffic: Math.round(obj.searchVolume),
                difficulty: Math.round(obj.chance),
                competition: obj.numberOfApps
            }
        }

        invalidKey.create(newKey, function(err, keyword) {
            if (err) {
                console.log(err);
            }
            else {
                // console.log("createBlackKey function");
                // console.log(keyword);
            }
        });
    },


    // Add keyword reference to the app array "keywords"
    appKeysArray: function(keyword, storeId) {
        iosApp.findOne({ "storeId": storeId }).populate("keywords").exec(function(err, foundApp) {
            if (!err && !isKeyInArray(foundApp.keywords, keyword.keyword)) {
                foundApp.keywords.push(keyword);
                foundApp.save();
            }
            else {
                console.log("Key is already in the array");
            }
        });
    },


    mobileAction: function(mmpId, keywords, country, limit) {
        var urls = createURLs(mmpId, keywords, country, limit);
        fireRequest(urls);
    }

}

function fireRequest(urls){
    var URL = urls.pop();
    
    var limiter = new RateLimiter({
          rate: 60              // requests per interval,
                                // defaults to 60
        , interval: 60          // interval for the rate, x
                                // requests per interval,
                                // defaults to 60
        , backoffCode: 429      // back off when this status is
                                // returned, defaults to 429
        , backoffTime: 30       // back off for n seconds,
                                // defauts to rate/5
        , maxWaitingTime: 300   // return errors for requests
                                // that will have to wait for
                                // n seconds or more. defaults
                                // to 5 minutes
    });

    while(urls.length>0){
        limiter.request({headers: { 'content-type': 'application/x-www-form-urlencoded' }, url: URL, method    : 'post'})
        .then(function(response){
            if(response.statusCode != 200) urls.push(URL);
            console.log(response.statusCode);
            console.log("success");
        })
        .catch(function(err){
            //console.log(err);
            urls.push(URL);
            console.log(err);
        });
        URL = urls.pop();
    }
}

function createURLs(mmpId, keywords, country, limit){
    var urls = [];
    if (keywords) { // If the input is not empty, than it will try to convert the csv string to array
        var keywords = keywords.split(',');
        var convertedArr = convertFromTo.arrToSubArrays(keywords, limit); // break apart the big arr to two-dimensional array
        while(convertedArr.length>0){
            var words = convertedArr.pop();
            var URL = "https://api.mobileaction.co/keywords/" + mmpId + "/" + country + "?keywords=" + words.toString() + "&token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
            urls.push(URL);
        }
    }
    
    return urls;
}

// Make sure that the keyword is not already existed in the array
function isKeyInArray(arr, keyword) {
    var isFound = false;
    arr.forEach(function(el) {
        if (el.keyword === keyword) {
            isFound = true;
        }
    });
    return isFound;
}


var keywords2 = "financial short,financial silver,financial size,financial smallcap,financial smi,financial soy,financial soybeans,financial spot,financial spread,financial spreads,financial standard,financial stock,financial stocks,financial stoxx,financial stoxx50,financial sugar,financial support,financial szse,financial ta,financial ta100,financial ta125,financial ta35,financial tadawul,financial t-bond,financial t-bonds,financial tech,financial tech100,financial ticker,financial tickers,financial tool,financial tools,financial top,financial trade,financial traded,financial trades,financial trading,financial trust,financial trusted,financial trusts,financial valuation,financial valuations,financial value,financial values,financial volatility,financial volume,financial wallet,financial wallets,financial wheat,financial wig,financial wig20,financial work,financial WTI Oil,financials 100,financials 1000,financials 225,financials 500,financials account,financials accounts,financials aex,financials analysed,financials analysis,financials analyst,financials analysts,financials asx200,financials atx,financials auto manufacturing,financials basics,financials bear,financials bearish,financials bel,financials bel20,financials biotech,financials bist,financials bist100,financials bonus,financials bonuses,financials bovespa,financials bse,financials bull,financials bullish,financials cac40,financials cap,financials certified,financials chart,financials china 150,financials chip,financials classic,financials client,financials clients,financials comparison,financials comparisons,financials crude,financials customer,financials data,financials deal,financials dealing,financials deals,financials dealt,financials deposit,financials direct,financials dow,financials dowjones,financials electronic,financials esma,financials etf,financials etfs,financials exchange,financials exchanges,financials fair,financials fee,financials fees,financials fintech,financials forecast,financials forecasts,financials foreign,financials ftse100,financials fund,financials fundementals,financials funds,financials futures,financials ger30,financials global,financials hang seng,financials hedge,financials hedging,financials hnx30,financials house,financials ibex,financials ibex35,financials idx,financials index,financials instant,financials interest,financials international,financials invested,financials investing,financials investment,financials investments,financials invests,financials karachi,financials karachi100,financials kospi,financials libor,financials list,financials lists,financials margin,financials market,financials markets,financials moex,financials moodys,financials multiple,financials mutual,financials national,financials natural,financials negative,financials nifty,financials nifty50,financials nikkei225,financials omxc,financials omxc20,financials omxs,financials omxs30,financials online,financials platform,financials platforms,financials portfolio,financials portfolios,financials premium,financials prime,financials proof,financials psei,financials psi,financials psi20,financials puchase,financials purchased,financials purchasing,financials quote,financials quotes,financials ratings,financials regulation,financials regulations,financials reliable,financials revenue,financials rtsi,financials s&p,financials s&p500,financials set,financials size,financials smallcap,financials smi,financials standard,financials stock,financials stocks,financials stoxx,financials stoxx50,financials support,financials szse,financials ta,financials ta100,financials ta125,financials ta35,financials tadawul,financials tech100,financials ticker,financials tickers,financials tool,financials tools,financials top,financials traded,financials trades,financials trading,financials trust,financials trusted,financials trusts,financials valuation,financials valuations,financials value,financials values,financials volatility,financials volume,financials wallet,financials wallets,financials wig,financials wig20,financials work,fintech 100,fintech 1000,fintech 225,fintech 500,fintech aapl,fintech account,fintech accounts,fintech adt,fintech aex,fintech algorithm,fintech aluminium,fintech amd,fintech amlp,fintech analyse,fintech analysed,fintech analysis,fintech analyst,fintech analysts,fintech ask,fintech asset,fintech assets,fintech asx200,fintech atx,fintech aud,fintech auto manufacturing,fintech avgo,fintech baba,fintech bac,fintech banks,fintech basics,fintech bcc,fintech bch,fintech bear,fintech bearish,fintech bel,fintech bel20,fintech bid,fintech biotech,fintech bist,fintech bist100,fintech bitcoin,fintech bitcoins,fintech bond,fintech bonds,fintech bonus,fintech bonuses,fintech bovespa,fintech brent oil,fintech broker,fintech brokers,fintech bse,fintech bull,fintech bullish,fintech buy,fintech cac,fintech cac40,fintech cad,fintech call,fintech cap,fintech capital,fintech cash,fintech certified,fintech cfd,fintech cfds,fintech chart,fintech chf,fintech china 150,fintech chip,fintech chk,fintech classic,fintech client,fintech clients,fintech cmcsa,fintech coal,fintech cocoa,fintech coffee,fintech commission,fintech comparison,fintech comparisons,fintech contract,fintech contracts,fintech copper,fintech corn,fintech cotton,fintech crude,fintech crypto,fintech cryptocurrencies,fintech cryptocurrency,fintech csco,fintech currencies,fintech currency,fintech customer,fintech cx,fintech dash,fintech data,fintech dax,fintech deal,fintech dealer,fintech dealers,fintech dealing,fintech deals,fintech dealt,fintech debt,fintech deposit,fintech derivative,fintech derivatives,fintech direct,fintech dividend,fintech dividends,fintech doge,fintech dollar,fintech dollars,fintech dow,fintech dow30,fintech dowjones,fintech dxr,fintech earn,fintech eep,fintech electronic,fintech emerging,fintech enb,fintech epd,fintech equities,fintech equity,fintech ese,fintech esma,fintech etc,fintech etf,fintech etfs,fintech eth,fintech ethereum,fintech ethereums,fintech etp,fintech eur,fintech euro,fintech euros,fintech exchange,fintech exchanges,fintech f,fintech fair,fintech fb,fintech fee,fintech fees,fintech feye,fintech finance,fintech finances,fintech financial,fintech financials,fintech forecast,fintech forecasts,fintech foreign,fintech forex,fintech forward,fintech forwards,fintech ftse,fintech ftse100,fintech fund,fintech fundementals,fintech funds,fintech future,fintech futures,fintech gasoline,fintech gbp,fintech ge,fintech ger30,fintech gis,fintech global,fintech gold,fintech hang seng,fintech hedge,fintech hedging,fintech hkd,fintech hnx30,fintech house,fintech ibex,fintech ibex35,fintech idx,fintech index,fintech indices,fintech instant,fintech intc,fintech interest,fintech international,fintech invest,fintech invested,fintech investing,fintech investment,fintech investments,fintech invests,fintech jd,fintech jpm,fintech karachi,fintech karachi100,fintech kbsf,fintech kmi,fintech kospi,fintech leverage,fintech leverages,fintech libor,fintech list,fintech lists,fintech long,fintech lse,fintech margin,fintech market,fintech markets,fintech Materials,fintech matif,fintech merchant,fintech merchants,fintech mmp,fintech moex,fintech money,fintech moodys,fintech msft,fintech mu,fintech multiple,fintech mutual,fintech nasdaq,fintech national,fintech natural,fintech natural gas,fintech negative,fintech nflx,fintech nifty,fintech nifty50,fintech nikkei,fintech nikkei225,fintech nok,fintech nvda,fintech nyse,fintech oil,fintech omxc,fintech omxc20,fintech omxs,fintech omxs30,fintech online,fintech options,fintech palladium,fintech peso,fintech pesos,fintech platform,fintech platforms,fintech platinum,fintech portfolio,fintech portfolios,fintech premium,fintech prime,fintech profit,fintech profits,fintech proof,fintech psei,fintech psi,fintech psi20,fintech puchase,fintech purchased,fintech purchasing,fintech put,fintech quote,fintech quotes,fintech rate,fintech rates,fintech ratings,fintech real estate,fintech regulate,fintech regulation,fintech regulations,fintech reliable,fintech revenue,fintech rice,fintech ripple,fintech ripples,fintech risk,fintech risks,fintech rspp,fintech rtsi,fintech ruble,fintech rubles,fintech rupee,fintech rupees,fintech russell,fintech s&p,fintech s&p500,fintech set,fintech share,fintech shares,fintech short,fintech silver,fintech size,fintech sldb,fintech smallcap,fintech smi,fintech smrt,fintech snap,fintech soy,fintech soybeans,fintech split,fintech splits,fintech spot,fintech spread,fintech spreads,fintech sq,fintech standard,fintech stellar,fintech sterling,fintech stock,fintech stocks,fintech stoxx,fintech stoxx50,fintech sugar,fintech support,fintech szse,fintech ta,fintech ta100,fintech ta125,fintech ta35,fintech tadawul,fintech t-bond,fintech t-bonds,fintech tech,fintech tech100,fintech ticker,fintech tickers,fintech tool,fintech tools,fintech top,fintech trade,fintech traded,fintech trades,fintech trading,fintech trust,fintech trusted,fintech trusts,fintech tsla,fintech twtr,fintech usd,fintech vale,fintech valuation,fintech valuations,fintech value,fintech values,fintech volatility,fintech volume,fintech wallet,fintech wallets,fintech wheat,fintech wig,fintech wig20,fintech wmb,fintech work,fintech WTI Oil,fintech xrp,fintech yen,fintech yens,fintech zar,forecast 100,forecast 1000,forecast 225,forecast 500,forecast aapl,forecast account,forecast accounts,forecast adt,forecast aex,forecast algorithm,forecast aluminium,forecast amd,forecast amlp,forecast analyse,forecast analysed,forecast analysis,forecast analyst,forecast analysts,forecast ask,forecast asset,forecast assets,forecast asx200,forecast atx,forecast aud,forecast auto manufacturing,forecast avgo,forecast baba,forecast bac,forecast banks,forecast basics,forecast bcc,forecast bch,forecast bear,forecast bearish,forecast bel,forecast bel20,forecast bid,forecast biotech,forecast bist,forecast bist100,forecast bitcoin,forecast bitcoins,forecast bond,forecast bonds,forecast bonus,forecast bonuses,forecast bovespa,forecast brent oil,forecast broker,forecast brokers,forecast bse,forecast bull,forecast bullish,forecast buy,forecast cac,forecast cac40,forecast cad,forecast call,forecast cap,forecast capital,forecast cash,forecast certified,forecast cfd,forecast cfds,forecast chart,forecast chf,forecast china 150,forecast chip,forecast chk,forecast classic,forecast client,forecast clients,forecast cmcsa,forecast coal,forecast cocoa,forecast coffee,forecast commission,forecast comparison,forecast comparisons,forecast contract,forecast contracts,forecast copper,forecast corn,forecast cotton,forecast crude,forecast crypto,forecast cryptocurrencies,forecast cryptocurrency,forecast csco,forecast currencies,forecast currency,forecast customer,forecast cx,forecast dash,forecast data,forecast dax,forecast deal,forecast dealer,forecast dealers,forecast dealing,forecast deals,forecast dealt,forecast debt,forecast deposit,forecast derivative,forecast derivatives,forecast direct,forecast dividend,forecast dividends,forecast doge,forecast dollar,forecast dollars,forecast dow,forecast dow30,forecast dowjones,forecast dxr,forecast earn,forecast eep,forecast electronic,forecast emerging,forecast enb,forecast epd,forecast equities,forecast equity,forecast ese,forecast esma,forecast etc,forecast etf,forecast etfs,forecast eth,forecast ethereum,forecast ethereums,forecast etp,forecast eur,forecast euro,forecast euros,forecast exchange,forecast exchanges,forecast f,forecast fair,forecast fb,forecast fee,forecast fees,forecast feye,forecast finance,forecast finances,forecast financial,forecast financials,forecast fintech,forecast forecasts,forecast foreign,forecast forex,forecast forward,forecast forwards,forecast ftse,forecast ftse100,forecast fund,forecast fundementals,forecast funds,forecast future,forecast futures,forecast gasoline,forecast gbp,forecast ge,forecast ger30,forecast gis,forecast global,forecast gold,forecast hang seng,forecast hedge,forecast hedging,forecast hkd,forecast hnx30,forecast house,forecast ibex,forecast ibex35,forecast idx,forecast index,forecast indices,forecast instant,forecast intc,forecast interest,forecast international,forecast invest,forecast invested,forecast investing,forecast investment,forecast investments,forecast invests,forecast jd,forecast jpm,forecast karachi,forecast karachi100,forecast kbsf,forecast kmi,forecast kospi,forecast leverage,forecast leverages,forecast libor,forecast list,forecast lists,forecast long,forecast lse,forecast margin,forecast market,forecast markets,forecast Materials,forecast matif,forecast merchant,forecast merchants,forecast mmp,forecast moex,forecast money,forecast moodys,forecast msft,forecast mu,forecast multiple,forecast mutual,forecast nasdaq,forecast national,forecast natural,forecast natural gas,forecast negative,forecast nflx,forecast nifty,forecast nifty50,forecast nikkei,forecast nikkei225,forecast nok,forecast nvda,forecast nyse,forecast oil,forecast omxc,forecast omxc20,forecast omxs,forecast omxs30,forecast online,forecast options,forecast palladium,forecast peso,forecast pesos,forecast platform,forecast platforms,forecast platinum,forecast portfolio,forecast portfolios,forecast premium,forecast prime,forecast profit,forecast profits,forecast proof,forecast psei,forecast psi,forecast psi20,forecast puchase,forecast purchased,forecast purchasing,forecast put,forecast quote,forecast quotes,forecast rate,forecast rates,forecast ratings,forecast real estate,forecast regulate,forecast regulation,forecast regulations,forecast reliable,forecast revenue,forecast rice,forecast ripple,forecast ripples,forecast risk,forecast risks,forecast rspp,forecast rtsi,forecast ruble,forecast rubles,forecast rupee,forecast rupees,forecast russell,forecast s&p,forecast s&p500,forecast set,forecast share,forecast shares,forecast short,forecast silver,forecast size,forecast sldb,forecast smallcap,forecast smi,forecast smrt,forecast snap,forecast soy,forecast soybeans,forecast split,forecast splits,forecast spot,forecast spread,forecast spreads,forecast sq,forecast standard,forecast stellar,forecast sterling,forecast stock,forecast stocks,forecast stoxx,forecast stoxx50,forecast sugar,forecast support,forecast szse,forecast ta,forecast ta100,forecast ta125,forecast ta35,forecast tadawul,forecast t-bond,forecast t-bonds,forecast tech,forecast tech100,forecast ticker,forecast tickers,forecast tool,forecast tools,forecast top,forecast trade,forecast traded,forecast trades,forecast trading,forecast trust,forecast trusted,forecast trusts,forecast tsla,forecast twtr,forecast usd,forecast vale,forecast valuation,forecast valuations,forecast value,forecast values,forecast volatility,forecast volume,forecast wallet,forecast wallets,forecast wheat,forecast wig,forecast wig20,forecast wmb,forecast work,forecast WTI Oil,forecast xrp,forecast yen,forecast yens,forecast zar,forecasts 100,forecasts 1000,forecasts 225,forecasts 500,forecasts aapl,forecasts account,forecasts accounts,forecasts adt,forecasts aex";

var keywords = "forecast portfolio,forecast portfolios,forecast premium,forecast prime,forecast profit,forecast profits,forecast proof,forecast psei,forecast psi,forecast psi20,forecast puchase,forecast purchased,forecast purchasing,forecast put,forecast quote,forecast quotes,forecast rate,forecast rates,forecast ratings,forecast real estate,forecast regulate,forecast regulation,forecast regulations,forecast reliable,forecast revenue,forecast rice,forecast ripple,forecast ripples,forecast risk,forecast risks,forecast rspp,forecast rtsi,forecast ruble,forecast rubles,forecast rupee,forecast rupees,forecast russell,forecast s&p,forecast s&p500,forecast set,forecast share,forecast shares,forecast short,forecast silver,forecast size,forecast sldb,forecast smallcap,forecast smi,forecast smrt,forecast snap,forecast soy,forecast soybeans,forecast split,forecast splits,forecast spot,forecast spread,forecast spreads,forecast sq,forecast standard,forecast stellar,forecast sterling,forecast stock,forecast stocks,forecast stoxx,forecast stoxx50,forecast sugar,forecast support,forecast szse,forecast ta,forecast ta100,forecast ta125,forecast ta35,forecast tadawul,forecast t-bond,forecast t-bonds,forecast tech,forecast tech100,forecast ticker,forecast tickers,forecast tool,forecast tools,forecast top,forecast trade,forecast traded,forecast trades,forecast trading,forecast trust,forecast trusted,forecast trusts,forecast tsla,forecast twtr,forecast usd,forecast vale,forecast valuation,forecast valuations,forecast value,forecast values,forecast volatility,forecast volume,forecast wallet,forecast wallets,forecast wheat,forecast wig,forecast wig20,forecast wmb,forecast work,forecast WTI Oil,forecast xrp,forecast yen,forecast yens,forecast zar,forecasts 100,forecasts 1000,forecasts 225,forecasts 500,forecasts aapl,forecasts account,forecasts accounts,forecasts adt,forecasts aex";


module.exports = addKeyTo;
