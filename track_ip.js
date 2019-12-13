var geoip = require('geoip-lite');
 
var ip = "66.214.70.147";
var geo = geoip.lookup(ip);
 
console.log(geoip.pretty(geo));

/*
{ range: [ 3479298048, 3479300095 ],
  country: 'US',
  region: 'TX', // Up to 3 alphanumeric variable length characters as ISO 3166-2 code
                // For US states this is the 2 letter state
                // For the United Kingdom this could be ENG as a country like “England
                // FIPS 10-4 subcountry code
  eu: '0',  // 1 if the country is a member state of the European Union, 0 otherwise.
  timezone: 'America/Chicago',
  city: 'San Antonio',
  ll: [ 29.4969, -98.4032 ],  // The latitude and longitude of the city
  metro: 641,  // Metro code
  area: 1000 } // The approximate accuracy radius (km), around the latitude and longitude
*/