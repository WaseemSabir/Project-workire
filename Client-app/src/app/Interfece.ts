import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

// This includes interfaces and commonly used global functions
export interface Filters {
    search : string,
    country : string,
    company : string,
    category : string,
    days : number,
    page : number
};

export interface SeoObject {
  header : string,
  description : string,
  show : boolean
}

export interface SeoPaths {
  isJobs: boolean,
  isPosition: boolean,
  isCountry: boolean,
  isCompany : boolean,
  isCategory : boolean,
  isTrending: boolean
}

export interface SearchPayload {
  search : string,
  country : string,
  company : string,
  category : string,
  days : number,
  page : number
};

export interface Job {
    slug : string
};

export interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

// Helper Global Functions

// Converts two letter like PK to full country name like Pakistan
export function two_letter_to_full(two_letter : string) {
    let json_big : any = {"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"}
    return json_big[two_letter];
}


// url parse for Job Company Logo
export function urlParseCommon(str : string,comp : string) : string { 
    if(str.includes("default.jpg"))
    {
      return environment.APIEndpoint + "/mediaimage/" + (comp[0].toUpperCase() + ".png")
    }
    else if(str.includes("http"))
    {
      str = str.replace("/mediaimage/",'')
      str = str.replace("%3A",':/')
      return str;
    }
    else if(str.includes('/mediaimage'))
    {
      return environment.APIEndpoint + str;
    }
    else
    {
      return environment.APIEndpoint + str;
    }
}

export function toProperCase(str : string) {
  return str.replace(/\w\S*/g, function(txt : string){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Determine payload values by route
export function getPayloadByRoute(route : string, payload : string, variable : string) : SearchPayload {
  if(payload)
  {
    return payloadToValues(payload);
  }
  else if(route.includes('Job-by-position'))
  {
    let payload_temp = valuesToPayload(variable,'','','',0,1)
    return payloadToValues(payload_temp);
  }
  else if(route.includes('Job-country'))
  {
    let payload_temp = valuesToPayload('',variable,'','',0,1)
    return payloadToValues(payload_temp);
  }
  else if(route.includes('Job-company'))
  {
    let payload_temp = valuesToPayload('','','',variable,0,1)
    return payloadToValues(payload_temp);
  }
  else if(route.includes('trending-search'))
  {
    let arr = variable.toLocaleLowerCase().split('-in-')
    let search : string = arr[0].replace('-Jobs','').replace('-jobs','')
    search = search.replace('Jobs','').replace('jobs','')
    search = toProperCase(search.replace(/-/g,' '))
    let country : string = toProperCase(arr[1])
    let temp : string = ""
    for (let i : number =0; i<country.length; i++) {
      if(i==0 || country[i-1]!=='-') {
        temp += country[i]
        continue
      } else {
        temp += country[i].toUpperCase()
      }
    }
    let payload_temp = valuesToPayload(search,temp,'','',0,1)
    return payloadToValues(payload_temp);
  }
  else if(route.includes('Job-category'))
  {
    let payload_temp = valuesToPayload('','',variable,'',0,1)
    return payloadToValues(payload_temp);
  }

  return payloadToValues("");
}

export function payloadToValues(payload : string) : SearchPayload
{
  let search : string = "" , country : string = "", category : string = "", company : string = ""
  let days = 0
  let page = 1

  let splited = payload.split("&")
  
  splited.forEach((each : any)=>{
    if(each.includes("search:")) search = each.replace("search:","")
    else if(each.includes("country:")) country = each.replace("country:","")
    else if(each.includes("category:")) category = each.replace("category:","")
    else if(each.includes("company:")) company = each.replace("company:","")
    else if(each.includes("days:")){ 
      if(Number(each.replace("days:",""))) days = Number(each.replace("days:",""))
    }
    else if(each.includes("page:")){ 
      if(Number(each.replace("page:",""))) page = Number(each.replace("page:",""))
    }
  })
  if(page<1)
  {
    page = 1;
  }
  let values : SearchPayload = {
    search : search,
    country : country,
    company : company,
    category : category,
    days : days,
    page : page
  };
  return values
}

export function valuesToPayload(search : string, country : string, category : string, company : string,daysAgo : number, page: number)
{
  let payload = ""
  if (search.length) payload +=`search:${search}&`
  if (country.length) payload +=`country:${country}&`
  if (category.length) payload +=`category:${category}&`
  if (company.length) payload +=`company:${company}&`
  payload +=`days:${daysAgo}&`
  if(page<1)
  {
    page = 1;
  }
  payload +=`page:${page}`
  return payload
}

export function getMonthAndYear() {
  let date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
}


export function pathMatcher(route : string, payload : string) : SeoPaths {
  let isJobs: boolean = false, isPosition: boolean = false, isCountry: boolean = false, isCompany : boolean = false, isCategory : boolean = false, isTrending: boolean = false;
  
  if(payload || route=='/Jobs')
  {
    isJobs = true;
  }
  else if(route.includes('Job-by-position'))
  {
    isPosition = true;
  }
  else if(route.includes('Job-country'))
  {
    isCountry = true;
  }
  else if(route.includes('Job-company'))
  {
    isCompany = true;
  }
  else if(route.includes('trending-search'))
  {
    isTrending = true;
  }
  else if(route.includes('Job-category'))
  {
    isCategory = true;
  }

  return {
    isJobs: isJobs,
    isPosition: isPosition,
    isCountry: isCountry,
    isCompany : isCompany,
    isCategory : isCategory,
    isTrending: isTrending
  }
}

export function getHeaderFromRoute(route : string, payload : string, variable : string, count : number, values : SearchPayload) {
  let paths = pathMatcher(route, payload);
  let header = '';
  if(paths.isJobs) {
    header = ' Jobs ';
    header = (values.search.length==0) ? (header) : (values.search + header) 
    header = (values.country.length!=0) ? (header + "in " + values.country.split(',').join(' , ')) : header
  }
  else if(paths.isCountry) {
    header = "Jobs in " + values.country;
  }
  else {
    let cleaned_var : string = toProperCase(variable.replace(/-/g,' '))
    header = variable.toLowerCase().includes('jobs') ? cleaned_var : cleaned_var+ ' Jobs'
  }
  header = count.toString() + '+ ' + header
  return header;
}
