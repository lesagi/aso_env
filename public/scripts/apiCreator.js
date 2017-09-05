
var osField = document.getElementById("osField");
var appField = document.getElementById("appField"); 
var form = document.querySelector("form");



function configureDropDownLists(OpSysDropList,appNameDropList) {
    var android = appLists["Android"];
    var ios = appLists["iOS"];
    var appsArr = [];
    switch (OpSysDropList.value) {
        case 'Android':
            appNameDropList.options.length = 0;
            appsArr = appNamesListToArray(android);
            appsArr = appsArr.sort();
            appsArr.forEach(function(appName){
               createOption(appNameDropList, appName, appName); 
            });
            break;
        case 'iOS':
            appNameDropList.options.length = 0; 
        	appsArr = appNamesListToArray(ios);
            appsArr = appsArr.sort();
            appsArr.forEach(function(appName){
               createOption(appNameDropList, appName, appName); 
            });
            break;
            default:
                appNameDropList.options.length = 0;
            break;
    }

}

function createOption(ddl, text, value) {
    var opt = document.createElement('option');
    opt.value = value;
    opt.text = text;
    ddl.options.add(opt);
}

function buildLink(){
    
	var apiLink = document.querySelector("#apiLink");
	var appName = document.querySelector("#appNameDropList");
	var os = document.querySelector("#OpSysDropList");
	var country = document.querySelector("#countryField");
	apiLink.value= "https://api.mobileaction.co/keywords/"+ getAppId(appName.value,os.value)+"/" +country.value+ "?token=569512200f09f200010000124d9c738b39f94bfe6c86c9baa313ca28";
	
	// Edit the label to the text appear
	var apiLabel=document.querySelector("label[for=apiLink]");
	apiLabel.innerText = "API Link:"
	
	// make the well visible
	apiLink.classList.add("well");
}

function getAppId(name,os){
	return appLists[os][name];
}




// get the app list from MA (only MA, any other service provider 
// will require refactoring this code), and return the apps names
// in an array
function appNamesListToArray(list){
	var arr =[];
	for (var appName in list) {
        arr.push(appName);
    }
    return arr;
}

var appLists = { iOS: 
  { 'PayPal - Send and request money safely': 359792,
     'Yelp - Nearby Restaurants, Shopping & Services': 367074,
     'Shazam - Discover music, artists, videos & lyrics': 361633,
     'theScore – Sports Scores & News': 357890,
     'Yahoo Sports - Teams, Scores, News & Highlights': 358222,
     LinkedIn: 348300,
     'Deezer Music: toute la musique que vous aimez': 334564,
     'Spotify: Listen To & Stream Music for Free': 352137,
     Wikipedia: 357301,
     Starbucks: 364695,
     easyMarkets: 357927,
     Venmo: 359795,
     Solitaire: 358235,
     Netflix: 361361,
     'Red Bull TV: Watch Live Sports & Entertainment': 357443,
     '随身译(iHandy Translator)': 347373,
     'Spider Solitaire Free by MobilityWare': 350618,
     'Gett – הזמנת מונית בלחיצת כפתור (GetTaxi)': 360517,
     'Google 翻译': 347372,
     'Bleacher Report: Sports news, scores, & highlights': 358220,
     'Gmail – E-Mail von Google: sicher und schnell': 352186,
     'Expedia Hotels, Flights & Vacation Package Deals': 349753,
     'VPAR - Golf GPS, Scorecards & Stats': 342202,
     'Saavn Music & Radio': 344484,
     'Gett - Car Service & Rideshare': 362001,
     'DoubleDown Casino & Slots  – Vegas Slot Machines!': 368173,
     Lifecake: 349552,
     'Jigsaw Puzzle': 379151,
     'Any.do: To-Do List, Calendar, Reminders & Tasks': 343726,
     'Subway Surfers': 363596,
     'Xoom Money Transfer': 352755,
     'Bingo Blitz: Play Free Bingo & Slots Games': 333374,
     'MyPermissions - Privacy Cleaner': 356261,
     'NBC Sports': 358223,
     'Candy Crush Saga': 368243,
     'Slot Bonanza: Play the Best Vegas Casino Machines!': 342894,
     'A&E': 351327,
     'Google Maps - Navigation & Transport': 352140,
     'PicsArt Photo Studio: Picture Editor Collage Maker': 356145,
     'Pearl\'s Peril - Hidden Object Adventures': 379169,
     'Caesars Slots – Free Slot Machine Games': 344530,
     'Via - Affordable Ride-sharing in NYC, DC & Chicago': 342902,
     'CBS Sports Fantasy Football, Baseball & Basketball': 358221,
     'eToro - Social Trading': 342903,
     'Google Express: Shopping, Deals, Fast Delivery': 356985,
     'War Commander: Rogue Assault': 338725,
     'Panda Pop': 375114,
     'Cookie Jam': 368251,
     'IMAN - Your Makeup Advisor for Beautiful Results': 342916,
     'Wyndham Rewards – Book Hotels, Earn Rewards': 352682,
     'Forex & CFD трейдинг с iFOREX': 355767,
     'Jigsaw Puzzle Bug - Amazing HD Jigsaw Puzzles': 368259,
     'Shapr: Connect with people, meetups & networking': 349704,
     'StockX - Buy & Sell Sneakers': 347927,
     'Call of Duty®: Heroes': 352626,
     'Google Calendar: make the most of every day': 341126,
     TIDAL: 352182,
     'McDonald\'s': 364702,
     'Amazon Alexa': 354031,
     'Mezi - Your Assistant for Travel, Flights & Hotels': 339942,
     'Amazing France Wallpapers - Background Photo Paris': 323721,
     'Jigsaw Puzzle Daily': 366425,
     'Hidden Pictures by Highlights Magazine': 344227,
     'Genies & Gems': 375135,
     'Cookie Jam Blast': 375131,
     'MyFiziq: Compare body measurements & weight loss': 339940,
     'Meditation music and relaxing sounds by MindMetro': 344478,
     'Dunkin’ Donuts': 342917,
     'Tesla Tubes - Logic Puzzle Game to Match & Connect': 342650,
     'Reddit: The Official App': 341540,
     'Takl - On demand home services': 371845,
     'Woka Woka: Marble Blast & Ball Shooter Puzzle Game': 342651,
     'Ruler - Accurate Ruler': 381304,
     'Any To Do : Errands List , Task Scheduler , Checklist': 343725,
     Colu: 365017,
     'Fundbox - Get Paid Instantly': 348029,
     'Bookee: Sports Betting & Accas App – Bet & Win!': 365182,
     'Cake Blast - Distinct Flavors': 323722,
     'SPENT - Expenses made simple with cashback': 337302,
     'DIRECTV NOW': 351582,
     'Chip - Monitor, save money & increase your budget': 342609,
     'Free Amazing Super Angry Rat The Best Arcade Game': 323720,
     'Free Music - Music Play.er and Songs Stream.er': 365789,
     'Selfie Battle: Take Selfies, Win, Meet New People': 374358,
     CeliHack: 351506,
     'Free Music Spotify- Offline Music_Playlist Mаnager': 365459,
     'Current: All-In-One Music & Video Curation Player': 365456,
     MrOwl: 358786,
     'The Google Assistant -- get help anytime, anywhere': 360020,
     'Мой Женский Календарь': 362841 },
  Android: 
  { 'Karaoke Sing & Record': 343704,
     'Bingo Showdown: Free Card Game': 341698,
     'Deezer: Music&Song Streaming': 365918,
     'Gett - Car Service & Rideshare': 360516,
     'theScore: Sports Scores & News': 357892,
     'Red Bull TV': 357444,
     Wikipedia: 358762,
     'Call of Duty®: Heroes': 352627,
     'Google Photos': 348293,
     'Expedia Hotels, Flights & Cars': 349872,
     'Genies & Gems': 375136,
     PayPal: 359794,
     'Cookie Jam': 375133,
     MrOwl: 362139,
     'Bleacher Report': 358229,
     'Trading 212 Forex & Stocks': 357934,
     'Bingo Blitz: Bingo+Slots Games': 316311,
     'Youtuberer by Cyril': 345474,
     'Lifecake - Baby Photo Timeline': 350118,
     'eToro - Social Trading': 376572,
     easyMarkets: 357893,
     'Deezer - Songs & Music Player': 332486,
     'Caesars Slots Spin Casino Game': 324053,
     'Bubble Genius - Popping Game!': 332997,
     'NBC Sports': 358234,
     'Shop2o - Winter Is Coming': 345484,
     'Takl - On-Demand Home Services': 378852,
     'Google Translate': 342814,
     'SPENT - Expenses with cashback': 342647,
     'CBS Sports Scores, News, Stats': 358231,
     LinkedIn: 348305,
     'Colu - Local Digital Wallet': 365018,
     Venmo: 359796,
     'Panda Pop': 375134,
     'Dunkin’ Donuts': 342919,
     'StockX - Buy & Sell Sneakers': 348435,
     'Cookie Jam Blast': 375132,
     'Hidden Pictures Puzzles': 344228,
     'Reddit: The Official App': 346988,
     'War Commander: Rogue Assault': 338726,
     'Samsung Marshmallow': 378560,
     'Spotify Music': 334701,
     'Email Exchange + by MailWise': 378466,
     'VPAR Golf GPS & Scorecard': 342211,
     'Xoom Money Transfer': 352756,
     'DFNDR: Antivirus, Booster & Cleaner': 367582,
     'Payments, Wallet & Recharge': 348562,
     'Forex & CFD Trading by iFOREX': 355320,
     'PicsArt Photo Studio & Collage': 356146,
     Solitaire: 355260,
     'Yahoo Sports': 358232 } }