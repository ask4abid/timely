// Timely - Professional World Clock Application

class SimpleTimelyApp {
    constructor() {
        this.cache = new Map();
        this.updateInterval = null;
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.addedCities = new Set();
        this.favoriteCities = new Set(); // Favorite cities for time.is style section
        
        this.config = null;
        this.loadConfiguration();
        
        this.apis = {
            time: {
                worldtime: 'http://worldtimeapi.org/api/timezone/',
                browser: true
            },
            location: {
                ipapi: 'http://ip-api.com/json/',
                ipinfo: 'https://ipinfo.io/json'
            },
            countries: {
                restcountries: 'https://restcountries.com/v3.1/all',
                worldtimeapi_timezones: 'http://worldtimeapi.org/api/timezone'
            }
        };
        
        this.countryTimezones = {
            'Abuja': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Accra': { timezone: 'Africa/Accra', flag: '🇬🇭', country: 'Ghana' },
            'Addis Ababa': { timezone: 'Africa/Addis_Ababa', flag: '🇪🇹', country: 'Ethiopia' },
            'Algiers': { timezone: 'Africa/Algiers', flag: '🇩🇿', country: 'Algeria' },
            'Antananarivo': { timezone: 'Indian/Antananarivo', flag: '🇲🇬', country: 'Madagascar' },
            'Asmara': { timezone: 'Africa/Asmara', flag: '🇪🇷', country: 'Eritrea' },
            'Bamako': { timezone: 'Africa/Bamako', flag: '🇲🇱', country: 'Mali' },
            'Bangui': { timezone: 'Africa/Bangui', flag: '🇨🇫', country: 'Central African Republic' },
            'Banjul': { timezone: 'Africa/Banjul', flag: '🇬🇲', country: 'Gambia' },
            'Bissau': { timezone: 'Africa/Bissau', flag: '🇬🇼', country: 'Guinea-Bissau' },
            'Blantyre': { timezone: 'Africa/Blantyre', flag: '🇲🇼', country: 'Malawi' },
            'Brazzaville': { timezone: 'Africa/Brazzaville', flag: '🇨🇬', country: 'Republic of the Congo' },
            'Bujumbura': { timezone: 'Africa/Bujumbura', flag: '🇧🇮', country: 'Burundi' },
            'Cairo': { timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Egypt' },
            'Cape Town': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Casablanca': { timezone: 'Africa/Casablanca', flag: '🇲🇦', country: 'Morocco' },
            'Conakry': { timezone: 'Africa/Conakry', flag: '🇬🇳', country: 'Guinea' },
            'Dakar': { timezone: 'Africa/Dakar', flag: '🇸🇳', country: 'Senegal' },
            'Dar es Salaam': { timezone: 'Africa/Dar_es_Salaam', flag: '🇹🇿', country: 'Tanzania' },
            'Djibouti': { timezone: 'Africa/Djibouti', flag: '🇩🇯', country: 'Djibouti' },
            'Freetown': { timezone: 'Africa/Freetown', flag: '🇸🇱', country: 'Sierra Leone' },
            'Gaborone': { timezone: 'Africa/Gaborone', flag: '🇧🇼', country: 'Botswana' },
            'Harare': { timezone: 'Africa/Harare', flag: '🇿🇼', country: 'Zimbabwe' },
            'Johannesburg': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Kampala': { timezone: 'Africa/Kampala', flag: '🇺🇬', country: 'Uganda' },
            'Khartoum': { timezone: 'Africa/Khartoum', flag: '🇸🇩', country: 'Sudan' },
            'Kigali': { timezone: 'Africa/Kigali', flag: '🇷🇼', country: 'Rwanda' },
            'Kinshasa': { timezone: 'Africa/Kinshasa', flag: '🇨🇩', country: 'Democratic Republic of the Congo' },
            'Lagos': { timezone: 'Africa/Lagos', flag: '🇳🇬', country: 'Nigeria' },
            'Libreville': { timezone: 'Africa/Libreville', flag: '🇬🇦', country: 'Gabon' },
            'Lilongwe': { timezone: 'Africa/Blantyre', flag: '🇲🇼', country: 'Malawi' },
            'Lomé': { timezone: 'Africa/Lome', flag: '🇹🇬', country: 'Togo' },
            'Luanda': { timezone: 'Africa/Luanda', flag: '🇦🇴', country: 'Angola' },
            'Lusaka': { timezone: 'Africa/Lusaka', flag: '🇿🇲', country: 'Zambia' },
            'Malabo': { timezone: 'Africa/Malabo', flag: '🇬🇶', country: 'Equatorial Guinea' },
            'Maputo': { timezone: 'Africa/Maputo', flag: '🇲🇿', country: 'Mozambique' },
            'Maseru': { timezone: 'Africa/Maseru', flag: '🇱🇸', country: 'Lesotho' },
            'Mbabane': { timezone: 'Africa/Mbabane', flag: '🇸🇿', country: 'Eswatini' },
            'Mogadishu': { timezone: 'Africa/Mogadishu', flag: '🇸🇴', country: 'Somalia' },
            'Monrovia': { timezone: 'Africa/Monrovia', flag: '🇱🇷', country: 'Liberia' },
            'Moroni': { timezone: 'Indian/Comoro', flag: '🇰🇲', country: 'Comoros' },
            'Nairobi': { timezone: 'Africa/Nairobi', flag: '🇰🇪', country: 'Kenya' },
            'Ndjamena': { timezone: 'Africa/Ndjamena', flag: '🇹🇩', country: 'Chad' },
            'Niamey': { timezone: 'Africa/Niamey', flag: '🇳🇪', country: 'Niger' },
            'Nouakchott': { timezone: 'Africa/Nouakchott', flag: '🇲🇷', country: 'Mauritania' },
            'Ouagadougou': { timezone: 'Africa/Ouagadougou', flag: '🇧🇫', country: 'Burkina Faso' },
            'Port Louis': { timezone: 'Indian/Mauritius', flag: '🇲🇺', country: 'Mauritius' },
            'Porto-Novo': { timezone: 'Africa/Porto-Novo', flag: '🇧🇯', country: 'Benin' },
            'Praia': { timezone: 'Atlantic/Cape_Verde', flag: '🇨🇻', country: 'Cape Verde' },
            'Pretoria': { timezone: 'Africa/Johannesburg', flag: '🇿🇦', country: 'South Africa' },
            'Rabat': { timezone: 'Africa/Casablanca', flag: '🇲🇦', country: 'Morocco' },
            'São Tomé': { timezone: 'Africa/Sao_Tome', flag: '🇸🇹', country: 'São Tomé and Príncipe' },
            'Tripoli': { timezone: 'Africa/Tripoli', flag: '🇱🇾', country: 'Libya' },
            'Tunis': { timezone: 'Africa/Tunis', flag: '🇹🇳', country: 'Tunisia' },
            'Victoria': { timezone: 'Indian/Mahe', flag: '🇸🇨', country: 'Seychelles' },
            'Windhoek': { timezone: 'Africa/Windhoek', flag: '🇳🇦', country: 'Namibia' },
            'Yaoundé': { timezone: 'Africa/Douala', flag: '🇨🇲', country: 'Cameroon' },

            'Abu Dhabi': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'United Arab Emirates' },
            'Almaty': { timezone: 'Asia/Almaty', flag: '🇰🇿', country: 'Kazakhstan' },
            'Amman': { timezone: 'Asia/Amman', flag: '🇯🇴', country: 'Jordan' },
            'Ankara': { timezone: 'Europe/Istanbul', flag: '🇹🇷', country: 'Turkey' },
            'Ashgabat': { timezone: 'Asia/Ashgabat', flag: '🇹🇲', country: 'Turkmenistan' },
            'Astana': { timezone: 'Asia/Almaty', flag: '🇰🇿', country: 'Kazakhstan' },
            'Baghdad': { timezone: 'Asia/Baghdad', flag: '🇮🇶', country: 'Iraq' },
            'Baku': { timezone: 'Asia/Baku', flag: '🇦🇿', country: 'Azerbaijan' },
            'Bandar Seri Begawan': { timezone: 'Asia/Brunei', flag: '🇧🇳', country: 'Brunei' },
            'Bangkok': { timezone: 'Asia/Bangkok', flag: '🇹🇭', country: 'Thailand' },
            'Beijing': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'Beirut': { timezone: 'Asia/Beirut', flag: '🇱🇧', country: 'Lebanon' },
            'Bishkek': { timezone: 'Asia/Bishkek', flag: '🇰🇬', country: 'Kyrgyzstan' },
            'Colombo': { timezone: 'Asia/Colombo', flag: '🇱🇰', country: 'Sri Lanka' },
            'Damascus': { timezone: 'Asia/Damascus', flag: '🇸🇾', country: 'Syria' },
            'Delhi': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Dhaka': { timezone: 'Asia/Dhaka', flag: '🇧🇩', country: 'Bangladesh' },
            'Doha': { timezone: 'Asia/Qatar', flag: '🇶🇦', country: 'Qatar' },
            'Dubai': { timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'United Arab Emirates' },
            'Dushanbe': { timezone: 'Asia/Dushanbe', flag: '🇹🇯', country: 'Tajikistan' },
            'Hong Kong': { timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Hong Kong' },
            'Islamabad': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Istanbul': { timezone: 'Europe/Istanbul', flag: '🇹🇷', country: 'Turkey' },
            'Jakarta': { timezone: 'Asia/Jakarta', flag: '🇮🇩', country: 'Indonesia' },
            'Jerusalem': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Kabul': { timezone: 'Asia/Kabul', flag: '🇦🇫', country: 'Afghanistan' },
            'Karachi': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Kathmandu': { timezone: 'Asia/Kathmandu', flag: '🇳🇵', country: 'Nepal' },
            'Kuala Lumpur': { timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', country: 'Malaysia' },
            'Kuwait City': { timezone: 'Asia/Kuwait', flag: '🇰🇼', country: 'Kuwait' },
            'Lahore': { timezone: 'Asia/Karachi', flag: '🇵🇰', country: 'Pakistan' },
            'Macau': { timezone: 'Asia/Macau', flag: '🇲🇴', country: 'Macau' },
            'Malé': { timezone: 'Indian/Maldives', flag: '🇲🇻', country: 'Maldives' },
            'Manama': { timezone: 'Asia/Bahrain', flag: '🇧🇭', country: 'Bahrain' },
            'Manila': { timezone: 'Asia/Manila', flag: '🇵🇭', country: 'Philippines' },
            'Mumbai': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Muscat': { timezone: 'Asia/Muscat', flag: '🇴🇲', country: 'Oman' },
            'Naypyidaw': { timezone: 'Asia/Yangon', flag: '🇲🇲', country: 'Myanmar' },
            'New Delhi': { timezone: 'Asia/Kolkata', flag: '🇮🇳', country: 'India' },
            'Phnom Penh': { timezone: 'Asia/Phnom_Penh', flag: '🇰🇭', country: 'Cambodia' },
            'Pyongyang': { timezone: 'Asia/Pyongyang', flag: '🇰🇵', country: 'North Korea' },
            'Riyadh': { timezone: 'Asia/Riyadh', flag: '🇸🇦', country: 'Saudi Arabia' },
            'Sanaa': { timezone: 'Asia/Aden', flag: '🇾🇪', country: 'Yemen' },
            'Seoul': { timezone: 'Asia/Seoul', flag: '🇰🇷', country: 'South Korea' },
            'Shanghai': { timezone: 'Asia/Shanghai', flag: '🇨🇳', country: 'China' },
            'Singapore': { timezone: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapore' },
            'Taipei': { timezone: 'Asia/Taipei', flag: '🇹🇼', country: 'Taiwan' },
            'Tashkent': { timezone: 'Asia/Tashkent', flag: '🇺🇿', country: 'Uzbekistan' },
            'Tbilisi': { timezone: 'Asia/Tbilisi', flag: '🇬🇪', country: 'Georgia' },
            'Tehran': { timezone: 'Asia/Tehran', flag: '🇮🇷', country: 'Iran' },
            'Tel Aviv': { timezone: 'Asia/Jerusalem', flag: '🇮🇱', country: 'Israel' },
            'Thimphu': { timezone: 'Asia/Thimphu', flag: '🇧🇹', country: 'Bhutan' },
            'Tokyo': { timezone: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japan' },
            'Ulaanbaatar': { timezone: 'Asia/Ulaanbaatar', flag: '🇲🇳', country: 'Mongolia' },
            'Vientiane': { timezone: 'Asia/Vientiane', flag: '🇱🇦', country: 'Laos' },
            'Yerevan': { timezone: 'Asia/Yerevan', flag: '🇦🇲', country: 'Armenia' },

            'Amsterdam': { timezone: 'Europe/Amsterdam', flag: '🇳🇱', country: 'Netherlands' },
            'Andorra la Vella': { timezone: 'Europe/Andorra', flag: '🇦🇩', country: 'Andorra' },
            'Athens': { timezone: 'Europe/Athens', flag: '🇬🇷', country: 'Greece' },
            'Belgrade': { timezone: 'Europe/Belgrade', flag: '🇷🇸', country: 'Serbia' },
            'Berlin': { timezone: 'Europe/Berlin', flag: '🇩🇪', country: 'Germany' },
            'Bern': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },
            'Bratislava': { timezone: 'Europe/Bratislava', flag: '🇸🇰', country: 'Slovakia' },
            'Brussels': { timezone: 'Europe/Brussels', flag: '🇧🇪', country: 'Belgium' },
            'Bucharest': { timezone: 'Europe/Bucharest', flag: '🇷🇴', country: 'Romania' },
            'Budapest': { timezone: 'Europe/Budapest', flag: '🇭🇺', country: 'Hungary' },
            'Chisinau': { timezone: 'Europe/Chisinau', flag: '🇲🇩', country: 'Moldova' },
            'Copenhagen': { timezone: 'Europe/Copenhagen', flag: '🇩🇰', country: 'Denmark' },
            'Dublin': { timezone: 'Europe/Dublin', flag: '🇮🇪', country: 'Ireland' },
            'Helsinki': { timezone: 'Europe/Helsinki', flag: '🇫🇮', country: 'Finland' },
            'Kiev': { timezone: 'Europe/Kiev', flag: '🇺🇦', country: 'Ukraine' },
            'Lisbon': { timezone: 'Europe/Lisbon', flag: '🇵🇹', country: 'Portugal' },
            'Ljubljana': { timezone: 'Europe/Ljubljana', flag: '🇸🇮', country: 'Slovenia' },
            'London': { timezone: 'Europe/London', flag: '🇬🇧', country: 'United Kingdom' },
            'Luxembourg': { timezone: 'Europe/Luxembourg', flag: '🇱🇺', country: 'Luxembourg' },
            'Madrid': { timezone: 'Europe/Madrid', flag: '🇪🇸', country: 'Spain' },
            'Minsk': { timezone: 'Europe/Minsk', flag: '🇧🇾', country: 'Belarus' },
            'Monaco': { timezone: 'Europe/Monaco', flag: '🇲🇨', country: 'Monaco' },
            'Moscow': { timezone: 'Europe/Moscow', flag: '🇷🇺', country: 'Russia' },
            'Oslo': { timezone: 'Europe/Oslo', flag: '🇳🇴', country: 'Norway' },
            'Paris': { timezone: 'Europe/Paris', flag: '🇫🇷', country: 'France' },
            'Podgorica': { timezone: 'Europe/Podgorica', flag: '🇲🇪', country: 'Montenegro' },
            'Prague': { timezone: 'Europe/Prague', flag: '🇨🇿', country: 'Czech Republic' },
            'Reykjavik': { timezone: 'Atlantic/Reykjavik', flag: '🇮🇸', country: 'Iceland' },
            'Riga': { timezone: 'Europe/Riga', flag: '🇱🇻', country: 'Latvia' },
            'Rome': { timezone: 'Europe/Rome', flag: '🇮🇹', country: 'Italy' },
            'San Marino': { timezone: 'Europe/San_Marino', flag: '🇸🇲', country: 'San Marino' },
            'Sarajevo': { timezone: 'Europe/Sarajevo', flag: '🇧🇦', country: 'Bosnia and Herzegovina' },
            'Skopje': { timezone: 'Europe/Skopje', flag: '🇲🇰', country: 'North Macedonia' },
            'Sofia': { timezone: 'Europe/Sofia', flag: '🇧🇬', country: 'Bulgaria' },
            'Stockholm': { timezone: 'Europe/Stockholm', flag: '🇸🇪', country: 'Sweden' },
            'Tallinn': { timezone: 'Europe/Tallinn', flag: '🇪🇪', country: 'Estonia' },
            'Tirana': { timezone: 'Europe/Tirane', flag: '🇦🇱', country: 'Albania' },
            'Vaduz': { timezone: 'Europe/Vaduz', flag: '🇱🇮', country: 'Liechtenstein' },
            'Valletta': { timezone: 'Europe/Malta', flag: '🇲🇹', country: 'Malta' },
            'Vatican City': { timezone: 'Europe/Vatican', flag: '🇻🇦', country: 'Vatican City' },
            'Vienna': { timezone: 'Europe/Vienna', flag: '🇦🇹', country: 'Austria' },
            'Vilnius': { timezone: 'Europe/Vilnius', flag: '🇱🇹', country: 'Lithuania' },
            'Warsaw': { timezone: 'Europe/Warsaw', flag: '🇵🇱', country: 'Poland' },
            'Zagreb': { timezone: 'Europe/Zagreb', flag: '🇭🇷', country: 'Croatia' },
            'Zurich': { timezone: 'Europe/Zurich', flag: '🇨🇭', country: 'Switzerland' },

            'Belize City': { timezone: 'America/Belize', flag: '🇧🇿', country: 'Belize' },
            'Chicago': { timezone: 'America/Chicago', flag: '🇺🇸', country: 'United States' },
            'Denver': { timezone: 'America/Denver', flag: '🇺🇸', country: 'United States' },
            'Guatemala City': { timezone: 'America/Guatemala', flag: '🇬🇹', country: 'Guatemala' },
            'Havana': { timezone: 'America/Havana', flag: '🇨🇺', country: 'Cuba' },
            'Kingston': { timezone: 'America/Jamaica', flag: '🇯🇲', country: 'Jamaica' },
            'Los Angeles': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            'Managua': { timezone: 'America/Managua', flag: '🇳🇮', country: 'Nicaragua' },
            'Mexico City': { timezone: 'America/Mexico_City', flag: '🇲🇽', country: 'Mexico' },
            'Miami': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Montreal': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'New York': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },
            'Ottawa': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'Panama City': { timezone: 'America/Panama', flag: '🇵🇦', country: 'Panama' },
            'Phoenix': { timezone: 'America/Phoenix', flag: '🇺🇸', country: 'United States' },
            'San José': { timezone: 'America/Costa_Rica', flag: '🇨🇷', country: 'Costa Rica' },
            'San Salvador': { timezone: 'America/El_Salvador', flag: '🇸🇻', country: 'El Salvador' },
            'Santo Domingo': { timezone: 'America/Santo_Domingo', flag: '🇩🇴', country: 'Dominican Republic' },
            'Seattle': { timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'United States' },
            'Tegucigalpa': { timezone: 'America/Tegucigalpa', flag: '🇭🇳', country: 'Honduras' },
            'Toronto': { timezone: 'America/Toronto', flag: '🇨🇦', country: 'Canada' },
            'Vancouver': { timezone: 'America/Vancouver', flag: '🇨🇦', country: 'Canada' },
            'Washington DC': { timezone: 'America/New_York', flag: '🇺🇸', country: 'United States' },

            'Asunción': { timezone: 'America/Asuncion', flag: '🇵🇾', country: 'Paraguay' },
            'Bogotá': { timezone: 'America/Bogota', flag: '🇨🇴', country: 'Colombia' },
            'Brasília': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Buenos Aires': { timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', country: 'Argentina' },
            'Caracas': { timezone: 'America/Caracas', flag: '🇻🇪', country: 'Venezuela' },
            'Cayenne': { timezone: 'America/Cayenne', flag: '🇬🇫', country: 'French Guiana' },
            'Georgetown': { timezone: 'America/Guyana', flag: '🇬🇾', country: 'Guyana' },
            'La Paz': { timezone: 'America/La_Paz', flag: '🇧🇴', country: 'Bolivia' },
            'Lima': { timezone: 'America/Lima', flag: '🇵🇪', country: 'Peru' },
            'Montevideo': { timezone: 'America/Montevideo', flag: '🇺🇾', country: 'Uruguay' },
            'Paramaribo': { timezone: 'America/Paramaribo', flag: '🇸🇷', country: 'Suriname' },
            'Quito': { timezone: 'America/Guayaquil', flag: '🇪🇨', country: 'Ecuador' },
            'Rio de Janeiro': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Santiago': { timezone: 'America/Santiago', flag: '🇨🇱', country: 'Chile' },
            'São Paulo': { timezone: 'America/Sao_Paulo', flag: '🇧🇷', country: 'Brazil' },
            'Sucre': { timezone: 'America/La_Paz', flag: '🇧🇴', country: 'Bolivia' },

            'Adelaide': { timezone: 'Australia/Adelaide', flag: '🇦🇺', country: 'Australia' },
            'Apia': { timezone: 'Pacific/Apia', flag: '🇼🇸', country: 'Samoa' },
            'Auckland': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Brisbane': { timezone: 'Australia/Brisbane', flag: '🇦🇺', country: 'Australia' },
            'Canberra': { timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
            'Funafuti': { timezone: 'Pacific/Funafuti', flag: '🇹🇻', country: 'Tuvalu' },
            'Honiara': { timezone: 'Pacific/Guadalcanal', flag: '🇸🇧', country: 'Solomon Islands' },
            'Melbourne': { timezone: 'Australia/Melbourne', flag: '🇦🇺', country: 'Australia' },
            'Nuku\'alofa': { timezone: 'Pacific/Tongatapu', flag: '🇹🇴', country: 'Tonga' },
            'Ngerulmud': { timezone: 'Pacific/Palau', flag: '🇵🇼', country: 'Palau' },
            'Palikir': { timezone: 'Pacific/Pohnpei', flag: '🇫🇲', country: 'Micronesia' },
            'Port Moresby': { timezone: 'Pacific/Port_Moresby', flag: '🇵🇬', country: 'Papua New Guinea' },
            'Port Vila': { timezone: 'Pacific/Efate', flag: '🇻🇺', country: 'Vanuatu' },
            'Perth': { timezone: 'Australia/Perth', flag: '🇦🇺', country: 'Australia' },
            'Suva': { timezone: 'Pacific/Fiji', flag: '🇫🇯', country: 'Fiji' },
            'Sydney': { timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Australia' },
            'Tarawa': { timezone: 'Pacific/Tarawa', flag: '🇰🇮', country: 'Kiribati' },
            'Wellington': { timezone: 'Pacific/Auckland', flag: '🇳🇿', country: 'New Zealand' },
            'Yaren': { timezone: 'Pacific/Nauru', flag: '🇳🇷', country: 'Nauru' },

            // ADDITIONAL TERRITORIES & ISLANDS
            'Honolulu': { timezone: 'Pacific/Honolulu', flag: '🇺🇸', country: 'Hawaii, USA' },
            'Guam': { timezone: 'Pacific/Guam', flag: '🇬🇺', country: 'Guam' },
            'Nuuk': { timezone: 'America/Godthab', flag: '🇬🇱', country: 'Greenland' },
            'Douglas': { timezone: 'Europe/Isle_of_Man', flag: '🇮🇲', country: 'Isle of Man' },
            'Saint Helier': { timezone: 'Europe/Jersey', flag: '🇯🇪', country: 'Jersey' },
            'Saint Peter Port': { timezone: 'Europe/Guernsey', flag: '🇬🇬', country: 'Guernsey' },
            'Hamilton': { timezone: 'Atlantic/Bermuda', flag: '🇧🇲', country: 'Bermuda' },
            'Road Town': { timezone: 'America/Tortola', flag: '🇻🇬', country: 'British Virgin Islands' },
            'Charlotte Amalie': { timezone: 'America/St_Thomas', flag: '🇻🇮', country: 'US Virgin Islands' },
            'Fort-de-France': { timezone: 'America/Martinique', flag: '🇲🇶', country: 'Martinique' },
            'Pointe-à-Pitre': { timezone: 'America/Guadeloupe', flag: '🇬🇵', country: 'Guadeloupe' },
            'Willemstad': { timezone: 'America/Curacao', flag: '🇨🇼', country: 'Curaçao' },
            'Oranjestad': { timezone: 'America/Aruba', flag: '🇦🇼', country: 'Aruba' },
            'Philipsburg': { timezone: 'America/Lower_Princes', flag: '🇸🇽', country: 'Sint Maarten' },
            'Gustavia': { timezone: 'America/St_Barthelemy', flag: '🇧🇱', country: 'Saint Barthélemy' },
            'Marigot': { timezone: 'America/Marigot', flag: '🇲🇫', country: 'Saint Martin' }
        };
        
        // Popular cities to show by default (like time.is) - Now editable!
        this.popularCities = ['Tokyo', 'Beijing', 'Paris', 'London', 'New York', 'Los Angeles'];
        
        this.clockStyle = 'digital'; // 'digital', 'analog', 'both'
        this.timeFormat = localStorage.getItem('timely-time-format') || '24h'; // '12h', '24h'
        
        this.searchSuggestions = [];
        this.isSearching = false;
        this.isEditingPopular = false;
        this.clockStyle = 'digital'; // Initialize clock style
        this.currentPrimaryCity = 'Local Time';
        this.currentPrimaryTimezone = this.userTimezone;
        this.activeSection = 'popular';
        this.locationPickerOpen = false;
        this.globalSearchOpen = false;
        
        this.globalCountries = [];
        this.globalTimezones = [];
        this.isLoadingGlobalData = false;
        
        // Enhanced pagination properties for Advanced Features layout
        this.clocksPerPage = 8; // Optimized for 4x2 grid on desktop, responsive on mobile
        this.currentPage = 1;
        this.totalPages = 1;
        
        // Layout mode properties
        this.layoutMode = 'grid'; // 'grid' or 'compact'
        this.layoutDropdownOpen = false;
        this.loadLayoutPreference();
        
        this.loadSavedPrimaryLocation();
    }
    
    async loadConfiguration() {
        try {
            if (typeof CONFIG !== 'undefined') {
                this.config = CONFIG;
                console.log('✅ Configuration loaded successfully');
            } else {
                console.warn('⚠️ Configuration not found, using defaults');
                this.config = {
                    UI: {
                        DEFAULT_COUNTRY: 'unknown'
                    },
                    setDefaultCountry: function(country) {
                        this.UI.DEFAULT_COUNTRY = country.toLowerCase();
                        if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('timely-default-country', country.toLowerCase());
                        }
                    },
                    getDefaultCountry: function() {
                        if (typeof localStorage !== 'undefined') {
                            const savedCountry = localStorage.getItem('timely-default-country');
                            if (savedCountry) return savedCountry;
                        }
                        return this.UI.DEFAULT_COUNTRY || 'unknown';
                    }
                };
            }
        } catch (error) {
            console.error('❌ Error loading configuration:', error);
        }
    }
    
    debugDefaultCountry() {
        console.log('🔍 Default Country Debug Info:');
        console.log('Current config:', this.config);
        
        if (this.config) {
            console.log('Config default country:', this.config.UI?.DEFAULT_COUNTRY);
            if (typeof this.config.getDefaultCountry === 'function') {
                console.log('Current default country:', this.config.getDefaultCountry());
            }
        }
        
        const savedCountry = localStorage.getItem('timely-default-country');
        console.log('Saved country in localStorage:', savedCountry);
        
        const currentCity = this.currentPrimaryCity;
        if (currentCity && currentCity !== 'Local Time') {
            const countryCode = this.getCountryCodeFromCity(currentCity);
            console.log(`Country code for ${currentCity}:`, countryCode);
        }
    }
    
    getCountryCodeFromCity(cityName) {
        const cityData = this.countryTimezones[cityName];
        if (!cityData) return 'unknown';
        
        const countryMap = {
            'United States': 'united-states',
            'United Kingdom': 'united-kingdom',
            'Pakistan': 'pakistan',
            'India': 'india',
            'China': 'china',
            'Japan': 'japan',
            'Germany': 'germany',
            'France': 'france',
            'United Arab Emirates': 'uae',
            'Saudi Arabia': 'saudi-arabia',
            'Australia': 'australia',
            'Canada': 'canada',
            'Brazil': 'brazil',
            'Russia': 'russia',
            'South Korea': 'south-korea',
            'Singapore': 'singapore',
            'Thailand': 'thailand',
            'Indonesia': 'indonesia',
            'Malaysia': 'malaysia',
            'Philippines': 'philippines',
            'Bangladesh': 'bangladesh',
            'Sri Lanka': 'sri-lanka',
            'Turkey': 'turkey',
            'Italy': 'italy',
            'Spain': 'spain',
            'Netherlands': 'netherlands',
            'Switzerland': 'switzerland',
            'Sweden': 'sweden',
            'Norway': 'norway',
            'Egypt': 'egypt',
            'Nigeria': 'nigeria',
            'South Africa': 'south-africa',
            'Kenya': 'kenya',
            'Morocco': 'morocco',
            'Mexico': 'mexico',
            'Argentina': 'argentina',
            'Chile': 'chile',
            'Colombia': 'colombia',
            'Peru': 'peru',
            'Venezuela': 'venezuela',
            'New Zealand': 'new-zealand'
        };
        
        return countryMap[cityData.country] || cityData.country.toLowerCase().replace(/\s+/g, '-');
    }
    
    loadSavedPrimaryLocation() {
        try {
            console.log('🔄 Loading saved primary location...');
            const savedCity = localStorage.getItem('timely-primary-city');
            const savedTimezone = localStorage.getItem('timely-primary-timezone');
            
            console.log('📁 Found in localStorage:', { savedCity, savedTimezone });
            
            if (savedCity && savedTimezone) {
                if (this.countryTimezones[savedCity]) {
                    this.currentPrimaryCity = savedCity;
                    this.currentPrimaryTimezone = savedTimezone;
                    console.log(`📍 Loaded saved primary location: ${savedCity} (${savedTimezone})`);
                } else {
                    console.warn(`⚠️ Saved city "${savedCity}" not found in database, using default`);
                    localStorage.removeItem('timely-primary-city');
                    localStorage.removeItem('timely-primary-timezone');
                }
            } else {
                console.log('📍 No saved location found, will use auto-detection');
            }
        } catch (error) {
            console.warn('⚠️ Error loading saved primary location:', error);
        }
    }
    
    async loadGlobalCountriesData() {
        if (this.isLoadingGlobalData || this.globalCountries.length > 0) {
            return this.globalCountries;
        }
        
        this.isLoadingGlobalData = true;
        console.log('🌍 Loading global countries data...');
        
        try {
            const countriesResponse = await fetch(this.apis.countries.restcountries);
            if (countriesResponse.ok) {
                const countriesData = await countriesResponse.json();
                
                const timezonesResponse = await fetch(this.apis.countries.worldtimeapi_timezones);
                const availableTimezones = timezonesResponse.ok ? await timezonesResponse.json() : [];
                
                this.globalCountries = countriesData.map(country => {
                    const countryTimezones = country.timezones || [];
                    const validTimezones = countryTimezones.filter(tz => 
                        availableTimezones.includes(tz) || tz.startsWith('UTC')
                    );
                    
                    return {
                        name: country.name.common,
                        officialName: country.name.official,
                        code: country.cca2,
                        flag: country.flag,
                        flagEmoji: this.getFlagEmoji(country.cca2),
                        capital: country.capital ? country.capital[0] : country.name.common,
                        timezones: validTimezones,
                        primaryTimezone: validTimezones[0] || 'UTC',
                        region: country.region,
                        subregion: country.subregion
                    };
                }).filter(country => country.timezones.length > 0);
                
                this.globalTimezones = availableTimezones;
                console.log(`✅ Loaded ${this.globalCountries.length} countries with timezones`);
                
                return this.globalCountries;
            }
        } catch (error) {
            console.warn('⚠️ Failed to load global countries data:', error);
        }
        
        this.isLoadingGlobalData = false;
        return this.globalCountries;
    }
    
    getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🌍';
        
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        
        return String.fromCodePoint(...codePoints);
    }
    
    searchGlobalLocations(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(normalizedQuery) || 
                cityData.country.toLowerCase().includes(normalizedQuery)) {
                results.push({
                    type: 'city',
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    source: 'local'
                });
            }
            if (results.length >= 20) break;
        }
        
        if (this.globalCountries.length > 0) {
            for (const country of this.globalCountries) {
                if (country.name.toLowerCase().includes(normalizedQuery) ||
                    country.capital.toLowerCase().includes(normalizedQuery)) {
                    
                    results.push({
                        type: 'country',
                        name: country.capital,
                        country: country.name,
                        timezone: country.primaryTimezone,
                        flag: country.flagEmoji,
                        source: 'api',
                        allTimezones: country.timezones
                    });
                }
                if (results.length >= 50) break;
            }
        }
        
        return results;
    }
    
    async detectUserLocation() {
        try {
            console.log('🌍 Detecting location using open-source APIs...');
            
            try {
                const response = await fetch(this.apis.location.ipapi);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success' && data.timezone) {
                        console.log(`📍 Location detected: ${data.city}, ${data.country} (${data.timezone})`);
                        return {
                            city: data.city,
                            country: data.country,
                            timezone: data.timezone,
                            countryCode: data.countryCode
                        };
                    }
                }
            } catch (error) {
                console.warn('⚠️ ip-api.com failed, trying backup...');
            }
            
            // Fallback to ipinfo.io
            try {
                const response = await fetch(this.apis.location.ipinfo);
                if (response.ok) {
                    const data = await response.json();
                    if (data.timezone) {
                        console.log(`📍 Location detected: ${data.city}, ${data.country} (${data.timezone})`);
                        return {
                            city: data.city,
                            country: data.country,
                            timezone: data.timezone,
                            countryCode: data.country
                        };
                    }
                }
            } catch (error) {
                console.warn('⚠️ ipinfo.io failed, using browser timezone');
            }
            
            // Ultimate fallback: browser timezone
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log(`🌐 Using browser timezone: ${timezone}`);
            return { timezone, city: 'Local Time', country: 'Local' };
            
        } catch (error) {
            console.error('❌ Location detection failed:', error);
            return { timezone: this.userTimezone, city: 'Local Time', country: 'Local' };
        }
    }
    
    // Get accurate time using WorldTimeAPI (open source)
    async getAccurateTime(timezone) {
        try {
            const response = await fetch(`${this.apis.time.worldtime}${timezone}`);
            if (response.ok) {
                const data = await response.json();
                return new Date(data.datetime);
            }
        } catch (error) {
            console.warn('⚠️ WorldTimeAPI unavailable, using browser time');
        }
        
        return new Date();
    }
    
    async init() {
        try {
            console.log('🕐 Initializing Enhanced Timely with Open Source APIs...');
            
            await this.loadConfiguration();
            
            this.initializeTheme();
            
            // Auto-detect user location (only if no saved location)
            if (this.currentPrimaryCity === 'Local Time') {
                const location = await this.detectUserLocation();
                if (location.city !== 'Local Time') {
                    this.userTimezone = location.timezone;
                    console.log(`🎯 Auto-detected timezone: ${location.timezone}`);
                    
                    // Try to find a matching city in our database for auto-detected location
                    const matchedCity = this.getCityFromTimezone(location.timezone);
                    if (this.countryTimezones[matchedCity]) {
                        this.currentPrimaryCity = matchedCity;
                        this.currentPrimaryTimezone = location.timezone;
                        console.log(`🏙️ Matched city: ${matchedCity}`);
                        
                        // Update default country based on auto-detected location
                        const countryCode = this.getCountryCodeFromCity(matchedCity);
                        if (this.config && typeof this.config.setDefaultCountry === 'function') {
                            this.config.setDefaultCountry(countryCode);
                            console.log(`🌍 Auto-detected default country: ${countryCode}`);
                        } else {
                            localStorage.setItem('timely-default-country', countryCode);
                            console.log(`🌍 Saved auto-detected country to localStorage: ${countryCode}`);
                        }
                    }
                }
            } else {
                console.log(`✅ Using saved primary location: ${this.currentPrimaryCity}`);
            }
            
            this.updatePrimaryTime();
            
            this.updateDigitalClock();
            
            this.renderPopularCities();
            
            this.initializeSearch();
            
            this.initializeHeaderSearch();
            
            this.initializeModernInterface();
            
            // Initialize layout UI
            this.updateLayoutUI();
            
            // Initialize favorite clocks
            this.loadFavoriteCities();
            this.renderFavoriteClocks();
            
            this.updateInterval = setInterval(() => {
                this.updatePrimaryTime();
                this.updateDigitalClock();
                this.updatePopularCities();
                this.updateWorldCities();
                this.updateTimeDifferenceGrid();
                this.renderFavoriteClocks(); // Update favorite clocks every second
            }, 1000);
            
            console.log('✅ Enhanced Timely initialized with open-source APIs!');
            
            // Initialize UI elements
            this.initializeFormatButton();
            
            this.debugDefaultCountry();
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
        }
    }
    
    initializeFormatButton() {
        const formatText = document.getElementById('formatText');
        if (formatText) {
            formatText.textContent = this.timeFormat === '12h' ? '12H' : '24H';
        }
    }
    
    initializeFormatButton() {
        const formatText = document.getElementById('formatText');
        if (formatText) {
            formatText.textContent = this.timeFormat === '12h' ? '12H' : '24H';
        }
    }

    updatePrimaryTime() {
        try {
            const displayTimezone = this.currentPrimaryTimezone || this.userTimezone;
            const displayCity = this.currentPrimaryCity || this.getCityFromTimezone(this.userTimezone);
            
            // Debug logging to track what's happening
            if (!this.currentPrimaryCity) {
                console.warn('⚠️ currentPrimaryCity is null/undefined, falling back to auto-detect');
            }
            
            const timeEl = document.getElementById('primaryTime');
            const dateEl = document.getElementById('primaryDate');
            const locationTitleEl = document.getElementById('locationTitle');
            const locationSubtitleEl = document.getElementById('locationSubtitle');
            const sunTimesEl = document.getElementById('sunInfo');
            
            const locationFlagEl = document.getElementById('locationFlag');
            const locationNameEl = document.getElementById('locationName');
            const locationCountryEl = document.getElementById('locationCountry');
            
            if (timeEl) {
                const time = this.getTimeForTimezone(displayTimezone);
                timeEl.textContent = time;
            }
            
            if (dateEl) {
                const date = this.getDateForTimezone(displayTimezone);
                const weekNumber = this.getWeekNumber(new Date());
                dateEl.textContent = `${date}, week ${weekNumber}`;
            }
            
            if (locationTitleEl) {
                locationTitleEl.textContent = `Time in ${displayCity} now`;
            }
            
            if (locationSubtitleEl) {
                locationSubtitleEl.textContent = this.getTimezoneInfo(displayTimezone);
            }
            
            const locationInfo = this.countryTimezones[displayCity];
            
            if (locationInfo) {
                if (locationFlagEl) {
                    locationFlagEl.textContent = locationInfo.flag;
                }
                if (locationNameEl) {
                    locationNameEl.textContent = displayCity;
                }
                if (locationCountryEl) {
                    locationCountryEl.textContent = locationInfo.country;
                }
            } else {
                if (locationFlagEl) {
                    locationFlagEl.textContent = '🌍';
                }
                if (locationNameEl) {
                    locationNameEl.textContent = displayCity;
                }
                if (locationCountryEl) {
                    locationCountryEl.textContent = 'Unknown';
                }
            }
            
            if (sunTimesEl) {
                // Calculate approximate sunrise/sunset (simplified)
                const sunrise = "06:30";
                const sunset = "18:45";
                const dayLength = "12h 15m";
                sunTimesEl.textContent = `↑ ${sunrise} ↓ ${sunset} (${dayLength})`;
            }
            
            this.updateTimeDifferenceGrid();
            
            this.updateCountryInfo();
            
            if (this.activeSection === 'popular') {
                this.updateCityTiles();
            }
            
        } catch (error) {
            console.error('Failed to update primary time:', error);
        }
    }
    
    updateCityTiles() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;
        
        const timeElements = grid.querySelectorAll('.city-time');
        const dateElements = grid.querySelectorAll('.city-date');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city && timeElements[index] && dateElements[index]) {
                timeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                dateElements[index].textContent = this.getDateForTimezone(city.timezone);
            }
        });
    }
    
    updateDigitalClock() {
        try {
            const displayTimezone = this.currentPrimaryTimezone || this.userTimezone;
            const displayCity = this.currentPrimaryCity || this.getCityFromTimezone(this.userTimezone);
            
            const digitalTimeEl = document.getElementById('digitalTime');
            const digitalDateEl = document.getElementById('digitalDate');
            const digitalLocationEl = document.getElementById('digitalClockLocation');
            const digitalTimezoneEl = document.getElementById('digitalTimezone');
            
            if (digitalTimeEl) {
                const time = this.getTimeForTimezone(displayTimezone);
                digitalTimeEl.textContent = time;
            }
            
            if (digitalDateEl) {
                const date = new Date().toLocaleDateString('en-US', {
                    timeZone: displayTimezone,
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                digitalDateEl.textContent = date;
            }
            
            if (digitalLocationEl) {
                digitalLocationEl.textContent = displayCity;
            }
            
            if (digitalTimezoneEl) {
                const timezoneInfo = this.getTimezoneInfo(displayTimezone);
                digitalTimezoneEl.textContent = timezoneInfo;
            }
        } catch (error) {
            console.error('Failed to update digital clock:', error);
        }
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('timely-theme') || 'light';
        this.currentTheme = savedTheme;
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon();
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        localStorage.setItem('timely-theme', this.currentTheme);
        
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    updateTimeDifferenceGrid() {
        const gridEl = document.getElementById('timeDiffGrid');
        if (!gridEl) return;
        
        const popularCitiesForDiff = [
            'Los Angeles', 'Chicago', 'New York', 'Toronto', 'London', 
            'Paris', 'Dubai', 'Mumbai', 'Shanghai', 'Tokyo', 'Sydney'
        ];
        
        const html = popularCitiesForDiff.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const timeDiff = this.calculateTimeDifference(city.timezone);
            
            let utcOffset = '';
            let diffDisplay = timeDiff;
            
            if (window.utcSystem) {
                const utcOffsetValue = window.utcSystem.formatUTCOffset(
                    window.utcSystem.calculateUTCOffset(city.timezone)
                );
                utcOffset = ` UTC${utcOffsetValue}`;
            }
            
            if (timeDiff === "0") {
                diffDisplay = "Same time";
            } else if (timeDiff.startsWith("+")) {
                diffDisplay = `${timeDiff} hours ahead`;
            } else if (timeDiff.startsWith("-")) {
                diffDisplay = `${Math.abs(parseInt(timeDiff))} hours behind`;
            }
            
            return `
                <div class="time-diff-item">
                    <span class="diff-city">${city.flag} ${cityName}</span>
                    <span class="diff-time">${diffDisplay}</span>
                    <span class="diff-utc">${utcOffset}</span>
                </div>
            `;
        }).join('');
        
        gridEl.innerHTML = html;
    }

    // UTC Info display removed - function disabled
    displayUTCInfo() {
        // UTC section removed from UI - this function is now disabled
        return;
    }
    
    calculateTimeDifference(targetTimezone) {
        try {
            if (window.utcSystem) {
                const targetOffset = window.utcSystem.calculateUTCOffset(targetTimezone);
                const localOffset = window.utcSystem.calculateUTCOffset(this.currentPrimaryTimezone || this.userTimezone);
                const difference = targetOffset - localOffset;
                
                // Format as integer without decimal places (as requested)
                if (difference === 0) {
                    return "0";
                } else if (difference > 0) {
                    return `+${difference}`;
                } else {
                    return `${difference}`; // Already has minus sign
                }
            }
            
            const now = new Date();
            const userTime = new Date(now.toLocaleString("en-US", {timeZone: this.currentPrimaryTimezone || this.userTimezone}));
            const targetTime = new Date(now.toLocaleString("en-US", {timeZone: targetTimezone}));
            
            const diffMs = targetTime.getTime() - userTime.getTime();
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            
            if (diffHours === 0) {
                return "0";
            } else if (diffHours > 0) {
                return `+${diffHours}`;
            } else {
                return `${diffHours}`; // Already has minus sign
            }
        } catch (error) {
            console.warn('Error calculating time difference:', error);
            return "0";
        }
    }
    
    updateCountryInfo() {
        const sectionEl = document.getElementById('countryInfoSection');
        if (!sectionEl) return;
        
        const cityName = this.getCityFromTimezone(this.currentPrimaryTimezone || this.userTimezone);
        const countryData = this.getCountryDataForCity(cityName);
        
        if (!countryData) {
            sectionEl.style.display = 'none';
            return;
        }
        
        const utcOffset = this.getUTCOffset(this.currentPrimaryTimezone || this.userTimezone);
        
        sectionEl.style.display = 'block';
        sectionEl.innerHTML = `
            <h2>Time zone info for ${cityName}</h2>
            <div class="country-details">
                <div class="country-detail-item">
                    <span class="detail-label">UTC</span>
                    <span class="detail-value">${utcOffset}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Time Zone</span>
                    <span class="detail-value">${this.currentPrimaryTimezone || this.userTimezone}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${countryData.flag} ${countryData.country}</span>
                </div>
                <div class="country-detail-item">
                    <span class="detail-label">Continent</span>
                    <span class="detail-value">${this.getContinentFromTimezone(this.currentPrimaryTimezone || this.userTimezone)}</span>
                </div>
            </div>
        `;
    }
    
    getCountryDataForCity(cityName) {
        return this.countryTimezones[cityName] || null;
    }
    
    getUTCOffset(timezone) {
        try {
            const now = new Date();
            const utcTime = new Date(now.toLocaleString("en-US", {timeZone: "UTC"}));
            const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
            
            const offsetMs = localTime.getTime() - utcTime.getTime();
            const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
            
            // Return clean digit format with plus/minus signs
            if (offsetHours === 0) {
                return "0";
            } else if (offsetHours > 0) {
                return `+${offsetHours}`;
            } else {
                return `${offsetHours}`; // Already has minus sign
            }
        } catch (error) {
            console.warn('Error calculating UTC offset:', error);
            return "0";
        }
    }
    
    getContinentFromTimezone(timezone) {
        const continent = timezone.split('/')[0];
        const continentMap = {
            'America': 'North America',
            'Europe': 'Europe',
            'Asia': 'Asia',
            'Africa': 'Africa',
            'Australia': 'Australia',
            'Pacific': 'Pacific',
            'Atlantic': 'Atlantic',
            'Indian': 'Indian Ocean'
        };
        return continentMap[continent] || continent;
    }
    
    updateTimezoneDetails() {
        const detailsEl = document.getElementById('timezoneDetails');
        if (!detailsEl) return;
        
        try {
            const now = new Date();
            const offset = Math.round(-now.getTimezoneOffset() / 60);
            const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
            
            detailsEl.innerHTML = `
                <span class="sun-info">🌍 ${offsetStr} - ${this.userTimezone}</span>
            `;
        } catch (error) {
            console.error('Failed to update timezone details:', error);
        }
    }
    
    renderPopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        const citiesHTML = this.popularCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            
            return `
                <a href="#" class="popular-city" onclick="event.preventDefault(); window.timelyApp.addCityToGrid('${cityName}')">
                    <span class="city-flag">${city.flag}</span>
                    <span class="city-name">${cityName}</span>
                    <span class="city-time">${time}</span>
                </a>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="popular-cities-list">
                ${citiesHTML}
            </div>
        `;
    }
    
    updatePopularCities() {
        const container = document.getElementById('popularCities');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.city-time');
        timeElements.forEach((el, index) => {
            if (index < this.popularCities.length) {
                const cityName = this.popularCities[index];
                const city = this.countryTimezones[cityName];
                if (city) {
                    el.textContent = this.getTimeForTimezone(city.timezone);
                }
            }
        });
    }
    
    async addCityToGrid(cityName) {
        console.log(`🔍 Searching for city: "${cityName}"`);
        
        if (this.addedCities.has(cityName)) {
            console.log(`${cityName} already added`);
            return;
        }
        
        const city = this.findCityByName(cityName);
        console.log(`🏙️ Found city data:`, city);
        
        if (!city) {
            console.log(`❌ City not found, showing suggestions...`);
            this.showSearchSuggestions(cityName);
            return;
        }
        
        console.log(`✅ Adding city: ${cityName}`);
        this.addedCities.add(cityName);
        
        // Also add to favorites for quick access
        this.addToFavorites(cityName);
        
        if (window.timelyAuth && window.timelyAuth.isLoggedIn()) {
            await window.timelyAuth.addWorldClock({
                name: cityName,
                timezone: city.timezone,
                country: city.country,
                flag: city.flag
            });
        }
        
        this.renderWorldClockCards(); // Use new card interface
        
        const headerSearchInput = document.getElementById('headerCitySearchInput');
        if (headerSearchInput) {
            headerSearchInput.value = '';
        }
    }
    
    showSearchSuggestions(searchTerm) {
        const suggestions = this.getSearchSuggestions(searchTerm);
        if (suggestions.length > 0) {
            // Try to add the first suggestion automatically if it's a close match
            const firstSuggestion = suggestions[0];
            const normalizedSearch = searchTerm.toLowerCase().trim();
            const normalizedSuggestion = firstSuggestion.name.toLowerCase();
            
            if (normalizedSuggestion.includes(normalizedSearch) || normalizedSearch.includes(normalizedSuggestion)) {
                console.log(`Auto-adding close match: ${firstSuggestion.name}`);
                this.addedCities.add(firstSuggestion.name);
                this.renderWorldClockCards();
                return;
            }
            
            const suggestionNames = suggestions.slice(0, 5).map(city => city.name).join(', ');
            alert(`Did you mean: ${suggestionNames}?\n\nTry typing the exact city name.`);
        } else {
            alert(`City "${searchTerm}" not found. Try cities like: Tokyo, London, New York, Paris, Mumbai, Jamaica, etc.`);
        }
    }
    
    getSearchSuggestions(searchTerm) {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        const suggestions = [];
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(normalizedSearch) || 
                cityData.country.toLowerCase().includes(normalizedSearch)) {
                suggestions.push({ name: cityName, ...cityData });
            }
            if (suggestions.length >= 8) break; // Limit suggestions
        }
        
        return suggestions;
    }
    
    displaySuggestions(suggestions) {
        this.hideSuggestions();
        
        const searchContainer = document.querySelector('.simple-search-container');
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.innerHTML = suggestions.map(city => 
            `<div class="suggestion-item" onclick="window.timelyApp.addCityToGrid('${city.name}')">
                <span class="suggestion-flag">${city.flag}</span>
                <span class="suggestion-name">${city.name}</span>
                <span class="suggestion-country">${city.country}</span>
            </div>`
        ).join('');
        
        searchContainer.appendChild(suggestionsDiv);
    }
    
    hideSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
    
    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        // Enhanced search with real-time suggestions
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                const suggestions = this.getSearchSuggestions(value);
                if (suggestions.length > 0) {
                    this.displaySuggestions(suggestions);
                } else {
                    this.hideSuggestions();
                }
            } else {
                this.hideSuggestions();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.simple-search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    initializeHeaderSearch() {
        const headerSearchInput = document.getElementById('headerCitySearchInput');
        if (!headerSearchInput) {
            console.error('❌ Header search input not found!');
            return;
        }
        
        console.log('✅ Header search input found, setting up listeners');
        
        let searchTimeout;
        
        // Enhanced search with local database (simplified for reliability)
        headerSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const value = e.target.value.trim();
            
            if (value.length >= 2) {
                searchTimeout = setTimeout(() => {
                    try {
                        console.log(`🔍 Searching for: "${value}"`);
                        const localSuggestions = this.searchLocalDatabase(value);
                        console.log(`Found ${localSuggestions.length} local results`);
                        
                        if (localSuggestions.length > 0) {
                            this.displayHeaderSuggestions(localSuggestions.slice(0, 8));
                        } else {
                            this.hideHeaderSuggestions();
                            console.log('No local results found');
                        }
                    } catch (error) {
                        console.error('Header search error:', error);
                    }
                }, 200);
            } else {
                this.hideHeaderSuggestions();
            }
        });
        
        // Handle Enter key - simplified
        headerSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                console.log(`🎯 Enter pressed with query: "${query}"`);
                
                if (query) {
                    const city = this.findCityByName(query);
                    if (city) {
                        console.log(`✅ Found city: ${city.name}`);
                        this.addCityToGrid(city.name);
                        e.target.value = '';
                        this.hideHeaderSuggestions();
                    } else {
                        console.log(`❌ City not found: ${query}`);
                        this.showSearchError(`Could not find "${query}". Try a different spelling.`);
                    }
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header-search') && !e.target.closest('.search-suggestions')) {
                this.hideHeaderSuggestions();
            }
        });
    }
    
    async addCityFromHeaderSearch(cityName) {
        try {
            // Try API-enhanced search first
            const city = await this.findCityByNameAsync(cityName);
            
            if (city) {
                await this.addCityToGrid(city.name);
                console.log(`✅ Added ${city.name} from header search`);
            } else {
                // Show user-friendly error
                this.showSearchError(`Could not find "${cityName}". Try a different spelling or major city name.`);
            }
        } catch (error) {
            console.error('Error adding city from header search:', error);
            this.showSearchError('Error searching for city. Please try again.');
        }
    }
    
    displayHeaderSuggestions(suggestions) {
        this.hideHeaderSuggestions();
        
        if (suggestions.length === 0) return;
        
        const headerSearch = document.querySelector('.header-search');
        if (!headerSearch) return;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions header-suggestions';
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="window.timelyApp.selectHeaderSuggestion('${suggestion.name}')">
                <span class="suggestion-flag">${suggestion.flag}</span>
                <div class="suggestion-text">
                    <div class="suggestion-city">${suggestion.name}</div>
                    <div class="suggestion-country">${suggestion.country}</div>
                </div>
                <div class="suggestion-source">${suggestion.source?.replace('_', ' ') || 'local'}</div>
            </div>
        `).join('');
        
        headerSearch.appendChild(suggestionsContainer);
    }
    
    hideHeaderSuggestions() {
        const suggestions = document.querySelector('.header-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
    
    async selectHeaderSuggestion(cityName) {
        console.log(`🎯 Selected suggestion: ${cityName}`);
        this.addCityToGrid(cityName);
        const headerSearchInput = document.getElementById('headerCitySearchInput');
        if (headerSearchInput) {
            headerSearchInput.value = '';
        }
        this.hideHeaderSuggestions();
    }
    
    showSearchError(message) {
        let errorEl = document.getElementById('searchError');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'searchError';
            errorEl.className = 'search-error-message';
            document.body.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 3000);
    }
    
    initializeModernInterface() {
        this.renderWorldClockCards();
        this.initializeLocationPicker();
        this.initializeCitySearch();
        this.populateDefaultCities();
    }
    
    populateDefaultCities() {
        const defaultCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];
        defaultCities.forEach(city => {
            if (!this.addedCities.has(city)) {
                this.addedCities.add(city);
            }
        });
        this.renderWorldClockCards();
    }
    
    renderWorldClockCards() {
        const container = document.getElementById('clockCardsContainer');
        const emptyState = document.getElementById('emptyClockState');
        const paginationControls = document.getElementById('paginationControls');
        
        if (!container) return;
        
        const citiesToShow = Array.from(this.addedCities);
        
        if (citiesToShow.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            if (paginationControls) paginationControls.style.display = 'none';
            this.updateTotalClockCount(0);
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        // Calculate pagination
        this.totalPages = Math.ceil(citiesToShow.length / this.clocksPerPage);
        const startIndex = (this.currentPage - 1) * this.clocksPerPage;
        const endIndex = startIndex + this.clocksPerPage;
        const paginatedCities = citiesToShow.slice(startIndex, endIndex);
        
        // Render cards based on layout mode
        if (this.layoutMode === 'grid') {
            this.renderGridCards(container, paginatedCities);
        } else {
            this.renderCompactCards(container, paginatedCities);
        }
        
        this.updateTotalClockCount(citiesToShow.length);
        this.updatePaginationControls();
    }

    renderGridCards(container, cities) {
        const cardsHtml = cities.map((cityName) => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time24h = this.getTimeForTimezone(city.timezone);
            const time12h = this.getTimeForTimezone(city.timezone, true);
            const displayTime = this.timeFormat === '12h' ? time12h : time24h;
            const date = this.getDateForTimezone(city.timezone);
            const utcOffset = this.getUTCOffset(city.timezone);
            
            return `
                <div class="clock-card bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative group">
                    <!-- Desktop Grid Layout -->
                    <div class="hidden md:grid grid-cols-4 items-center">
                        <!-- Location Column -->
                        <div class="text-left">
                            <h3 class="text-base font-semibold text-gray-900 leading-tight">${cityName}</h3>
                            <p class="text-xs text-gray-600 mt-0.5">${city.country}</p>
                        </div>
                        
                        <!-- Flag Column -->
                        <div class="text-center">
                            <span class="text-2xl" title="${city.country}">${city.flag}</span>
                        </div>
                        
                        <!-- Time Column -->
                        <div class="text-center">
                            <div class="text-lg font-bold text-gray-900 font-mono leading-tight">${displayTime}</div>
                            <div class="text-xs text-gray-600 mt-0.5">${date}</div>
                        </div>
                        
                        <!-- UTC Offset Column -->
                        <div class="text-right">
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">${utcOffset}</span>
                        </div>
                    </div>
                    
                    <!-- Mobile Stacked Layout -->
                    <div class="md:hidden">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-3">
                                <span class="text-xl" title="${city.country}">${city.flag}</span>
                                <div>
                                    <h3 class="text-base font-semibold text-gray-900">${cityName}</h3>
                                    <p class="text-xs text-gray-600">${city.country}</p>
                                </div>
                            </div>
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">${utcOffset}</span>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-bold text-gray-900 font-mono">${displayTime}</div>
                            <div class="text-sm text-gray-600">${date}</div>
                        </div>
                    </div>
                    
                    <!-- Remove Button -->
                    <button class="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out" onclick="window.timelyApp.removeCity('${cityName}')" title="Remove ${cityName}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
        
        container.innerHTML = cardsHtml;
    }

    renderCompactCards(container, cities) {
        const cardsHtml = cities.map((cityName) => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time24h = this.getTimeForTimezone(city.timezone);
            const time12h = this.getTimeForTimezone(city.timezone, true);
            const displayTime = this.timeFormat === '12h' ? time12h : time24h;
            const date = this.getDateForTimezone(city.timezone);
            const utcOffset = this.getUTCOffset(city.timezone);
            
            return `
                <div class="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative group">
                    <!-- Header Row -->
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <span class="text-xl" title="${city.country}">${city.flag}</span>
                            <div>
                                <h3 class="text-base font-semibold text-gray-900 leading-tight">${cityName}</h3>
                                <p class="text-xs text-gray-600">${city.country}</p>
                            </div>
                        </div>
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">${utcOffset}</span>
                    </div>
                    
                    <!-- Time Row -->
                    <div class="space-y-1">
                        <div class="text-lg font-bold text-gray-900 font-mono">${displayTime}</div>
                        <div class="text-xs text-gray-600">${date}</div>
                    </div>
                    
                    <!-- Remove Button -->
                    <button class="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out" onclick="window.timelyApp.removeCity('${cityName}')" title="Remove ${cityName}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
        
        // Use responsive grid for compact view with consistent spacing
        container.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">${cardsHtml}</div>`;
    }

    updateTotalClockCount(count) {
        const headerCount = document.getElementById('totalClocksCountHeader');
        if (headerCount) {
            headerCount.textContent = count;
        }
    }

    updatePaginationControls() {
        const paginationWrapper = document.getElementById('paginationControls');
        const pageInfo = document.getElementById('currentPageInfo');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (!paginationWrapper) return;
        
        if (this.totalPages <= 1) {
            paginationWrapper.style.display = 'none';
            return;
        }
        
        paginationWrapper.style.display = 'flex';
        
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
    }

    updatePaginationControls() {
        const paginationWrapper = document.querySelector('.pagination-wrapper-tw');
        const prevBtn = document.querySelector('#prevPageBtn');
        const nextBtn = document.querySelector('#nextPageBtn');
        const pageInfo = document.querySelector('.page-text-tw');
        
        if (!paginationWrapper) return;
        
        const totalCities = this.addedCities.size;
        
        if (totalCities <= this.clocksPerPage) {
            paginationWrapper.style.display = 'none';
            return;
        }
        
        paginationWrapper.style.display = 'flex';
        
        // Update page info
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
    }

    changePage(direction) {
        const newPage = this.currentPage + direction;
        
        if (newPage < 1 || newPage > this.totalPages) {
            return;
        }
        
        this.currentPage = newPage;
        this.renderWorldClockCards();
    }

    // Layout switching methods
    loadLayoutPreference() {
        const saved = localStorage.getItem('timelyLayoutMode');
        if (saved && ['grid', 'compact'].includes(saved)) {
            this.layoutMode = saved;
        }
    }

    saveLayoutPreference() {
        localStorage.setItem('timelyLayoutMode', this.layoutMode);
    }

    toggleLayoutSwitcher() {
        const dropdown = document.getElementById('layoutDropdown');
        if (!dropdown) return;

        this.layoutDropdownOpen = !this.layoutDropdownOpen;
        
        if (this.layoutDropdownOpen) {
            dropdown.classList.remove('hidden');
            // Update checkmarks
            this.updateLayoutCheckmarks();
            // Close on outside click
            setTimeout(() => {
                document.addEventListener('click', this.handleOutsideClick.bind(this), { once: true });
            }, 0);
        } else {
            dropdown.classList.add('hidden');
        }
    }

    handleOutsideClick(event) {
        const dropdown = document.getElementById('layoutDropdown');
        const button = document.getElementById('layoutSwitcherBtn');
        
        if (dropdown && button && 
            !dropdown.contains(event.target) && 
            !button.contains(event.target)) {
            dropdown.classList.add('hidden');
            this.layoutDropdownOpen = false;
        }
    }

    setLayoutMode(mode) {
        if (!['grid', 'compact'].includes(mode)) return;
        
        this.layoutMode = mode;
        this.saveLayoutPreference();
        
        // Update UI
        this.updateLayoutUI();
        this.renderWorldClockCards();
        
        // Close dropdown
        const dropdown = document.getElementById('layoutDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
            this.layoutDropdownOpen = false;
        }
        
        console.log(`Layout mode changed to: ${mode}`);
    }

    updateLayoutUI() {
        const layoutText = document.getElementById('layoutText');
        const layoutIcon = document.getElementById('layoutIcon');
        const columnHeaders = document.getElementById('columnHeaders');
        
        if (layoutText) {
            layoutText.textContent = this.layoutMode === 'grid' ? 'Table' : 'Compact';
        }
        
        if (layoutIcon) {
            if (this.layoutMode === 'grid') {
                layoutIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>';
            } else {
                layoutIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>';
            }
        }
        
        // Show/hide column headers based on layout mode
        if (columnHeaders) {
            columnHeaders.style.display = this.layoutMode === 'grid' ? 'grid' : 'none';
        }
        
        this.updateLayoutCheckmarks();
    }

    updateLayoutCheckmarks() {
        const gridCheck = document.getElementById('gridCheck');
        const compactCheck = document.getElementById('compactCheck');
        
        if (gridCheck) {
            gridCheck.classList.toggle('hidden', this.layoutMode !== 'grid');
        }
        
        if (compactCheck) {
            compactCheck.classList.toggle('hidden', this.layoutMode !== 'compact');
        }
    }

    renderWorldClockItemsFromCities(cities, viewMode = 'table') {
        const sortedCities = this.sortWorldClocks(cities, this.currentSort || 'city');
        
        switch (viewMode) {
            case 'compact':
                return this.renderCompactViewFromCities(sortedCities);
            case 'clocks':
                return this.renderClocksViewFromCities(sortedCities);
            default:
                return this.renderTableViewFromCities(sortedCities);
        }
    }

    renderTableViewFromCities(cities) {
        return cities.map((cityName) => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const dateInfo = this.getDateInfo(city.timezone);
            const isPrimary = this.isPrimaryLocation(cityName);
            
            return `
                <div class="clock-row ${isPrimary ? 'primary-location' : ''}" data-timezone="${city.timezone}">
                    <div class="location-info">
                        <span class="country-flag">${city.flag}</span>
                        <div class="location-details">
                            <a href="#" class="city-name" onclick="window.timelyApp.showLocationDetails('${cityName}', '${city.timezone}'); return false;">${cityName}</a>
                        </div>
                    </div>
                    <div class="time-info">
                        <div class="current-time">
                            <span class="day-indicator">${dateInfo.dayName}</span>
                            <span class="time-display">${time}</span>
                        </div>
                    </div>
                    <div class="row-actions">
                        ${isPrimary ? 
                            '<span class="primary-badge">Primary</span>' : 
                            `<button class="action-btn small" onclick="window.timelyApp.setPrimaryLocationFromCard('${cityName}', '${city.timezone}')" title="Set as Primary">⭐</button>`
                        }
                        <button class="action-btn small remove-btn" onclick="window.timelyApp.removeCityFromFavourites('${cityName}')" title="Remove">×</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCompactViewFromCities(cities) {
        return `
            <div class="compact-grid">
                ${cities.map(cityName => {
                    const city = this.countryTimezones[cityName];
                    if (!city) return '';
                    
                    const time = this.getTimeForTimezone(city.timezone);
                    const isPrimary = this.isPrimaryLocation(cityName);
                    
                    return `
                        <div class="compact-clock ${isPrimary ? 'primary' : ''}" data-timezone="${city.timezone}">
                            <div class="compact-location">
                                <span class="flag">${city.flag}</span>
                                <span class="city">${cityName}</span>
                            </div>
                            <div class="compact-time">${time}</div>
                            <div class="compact-actions">
                                ${!isPrimary ? `<button onclick="window.timelyApp.setPrimaryLocationFromCard('${cityName}', '${city.timezone}')">⭐</button>` : ''}
                                <button onclick="window.timelyApp.removeCityFromFavourites('${cityName}')">×</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderClocksViewFromCities(cities) {
        return `
            <div class="clocks-grid">
                ${cities.map(cityName => {
                    const city = this.countryTimezones[cityName];
                    if (!city) return '';
                    
                    const time = this.getTimeForTimezone(city.timezone);
                    const isPrimary = this.isPrimaryLocation(cityName);
                    
                    return `
                        <div class="analog-clock ${isPrimary ? 'primary' : ''}" data-timezone="${city.timezone}">
                            <div class="clock-header">
                                <span class="flag">${city.flag}</span>
                                <span class="city">${cityName}</span>
                            </div>
                            <div class="clock-face" id="clock-face-${city.timezone.replace(/[^a-zA-Z0-9]/g, '')}">
                                <div class="clock-center"></div>
                                <div class="hand hour-hand" id="hour-hand-${city.timezone.replace(/[^a-zA-Z0-9]/g, '')}"></div>
                                <div class="hand minute-hand" id="minute-hand-${city.timezone.replace(/[^a-zA-Z0-9]/g, '')}"></div>
                                <div class="hand second-hand" id="second-hand-${city.timezone.replace(/[^a-zA-Z0-9]/g, '')}"></div>
                                <div class="numbers">
                                    ${Array.from({length: 12}, (_, i) => `<div class="number" style="transform: rotate(${(i + 1) * 30}deg) translateY(-40px)">${i + 1 === 13 ? 1 : i + 1}</div>`).join('')}
                                </div>
                            </div>
                            <div class="digital-time">${time}</div>
                            <div class="clock-actions">
                                ${!isPrimary ? `<button onclick="window.timelyApp.setPrimaryLocationFromCard('${cityName}', '${city.timezone}')">⭐</button>` : ''}
                                <button onclick="window.timelyApp.removeCityFromFavourites('${cityName}')">×</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    showLocationDetails(cityName, timezone) {
        const city = this.countryTimezones[cityName];
        if (!city) return;
        
        const time = this.getTimeForTimezone(timezone);
        const date = this.getDateForTimezone(timezone);
        const utcOffset = this.getUTCOffset(timezone);
        
        const modal = document.createElement('div');
        modal.className = 'location-details-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>${city.flag} ${cityName}, ${city.country}</h3>
                        <button class="close-btn" onclick="this.closest('.location-details-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-item">
                            <strong>Current Time:</strong> ${time}
                        </div>
                        <div class="detail-item">
                            <strong>Current Date:</strong> ${date}
                        </div>
                        <div class="detail-item">
                            <strong>Timezone:</strong> ${timezone}
                        </div>
                        <div class="detail-item">
                            <strong>UTC Offset:</strong> ${utcOffset}
                        </div>
                        <div class="detail-item">
                            <strong>Country:</strong> ${city.country}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn primary" onclick="window.timelyApp.setPrimaryLocationFromCard('${cityName}', '${timezone}')">Set as Primary</button>
                        <button class="btn secondary" onclick="this.closest('.location-details-modal').remove()">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Helper functions for the new timeanddate.com inspired design
    setupWorldClockControls() {
        this.currentSort = 'city';
        this.currentView = 'table';
        
        // Setup view mode buttons from unified control panel
        const viewModeButtons = document.querySelectorAll('.control-btn');
        viewModeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewModeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.refreshWorldClockView();
            });
        });
        
        // Setup sort controls from unified control panel
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.refreshWorldClockView();
            });
        }
    }
    
    refreshWorldClockView() {
        const listContainer = document.getElementById('worldClockList');
        if (!listContainer) return;
        
        const citiesToShow = Array.from(this.addedCities);
        listContainer.innerHTML = this.renderWorldClockItems(citiesToShow, this.currentView);
        
        if (this.currentView === 'clocks') {
            this.updateAnalogClocks();
        }
    }
    
    sortWorldClocks(cities, sortType) {
        const citiesWithData = cities.map(cityName => ({
            name: cityName,
            data: this.countryTimezones[cityName]
        })).filter(city => city.data);
        
        switch (sortType) {
            case 'country':
                return citiesWithData.sort((a, b) => a.data.country.localeCompare(b.data.country)).map(c => c.name);
            case 'time':
                return citiesWithData.sort((a, b) => {
                    const timeA = new Date().toLocaleString('en-US', { timeZone: a.data.timezone });
                    const timeB = new Date().toLocaleString('en-US', { timeZone: b.data.timezone });
                    return new Date(timeA) - new Date(timeB);
                }).map(c => c.name);
            case 'time-reverse':
                return citiesWithData.sort((a, b) => {
                    const timeA = new Date().toLocaleString('en-US', { timeZone: a.data.timezone });
                    const timeB = new Date().toLocaleString('en-US', { timeZone: b.data.timezone });
                    return new Date(timeB) - new Date(timeA);
                }).map(c => c.name);
            default: // city
                return citiesWithData.sort((a, b) => a.name.localeCompare(b.name)).map(c => c.name);
        }
    }
    
    getDateInfo(timezone) {
        try {
            const date = new Date();
            const options = { 
                timeZone: timezone,
                weekday: 'short'
            };
            return {
                dayName: date.toLocaleDateString('en-US', options)
            };
        } catch (error) {
            return { dayName: 'Today' };
        }
    }
    
    isPrimaryLocation(cityName) {
        const primaryLocation = localStorage.getItem('primaryLocation');
        return primaryLocation && JSON.parse(primaryLocation).name === cityName;
    }
    
    setPrimaryLocationFromCard(cityName, timezone) {
        const city = this.countryTimezones[cityName];
        if (city) {
            this.setPrimaryLocation(cityName, timezone, city.country, city.flag);
        }
    }
    
    shareWorldClock() {
        const cities = Array.from(this.addedCities);
        const shareText = `My Personal World Clock:\n${cities.map(city => {
            const cityData = this.countryTimezones[city];
            const time = this.getTimeForTimezone(cityData.timezone);
            return `${cityData.flag} ${city}: ${time}`;
        }).join('\n')}\n\nCreated with Timely World Clock`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Personal World Clock',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('World clock times copied to clipboard!');
            });
        }
    }
    
    showHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>💡 Help - Personal World Clock</h3>
                        <button class="close-btn" onclick="this.closest('.help-modal').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <h4>How to use your Personal World Clock:</h4>
                        <ul>
                            <li><strong>Add Cities:</strong> Click the "+ Add City" button to search and add new locations</li>
                            <li><strong>View Modes:</strong> Switch between Table, Compact, and Clock views</li>
                            <li><strong>Sorting:</strong> Re-order your clocks by City, Country, or Time</li>
                            <li><strong>Set Primary:</strong> Click the ⭐ button to set a location as your primary timezone</li>
                            <li><strong>Remove Cities:</strong> Click the × button to remove cities from your list</li>
                            <li><strong>Share:</strong> Use the Share button to share your world clock with others</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="btn primary" onclick="this.closest('.help-modal').remove()">Got it!</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
    }

    removeCity(cityName) {
        this.removeCityFromFavourites(cityName);
    }

    removeCityFromFavourites(cityName) {
        console.log(`🗑️ Removing ${cityName} from favourites`);
        
        if (this.addedCities.has(cityName)) {
            this.addedCities.delete(cityName);
            
            // Adjust pagination if necessary
            const totalCities = this.addedCities.size;
            const maxPages = Math.ceil(totalCities / this.clocksPerPage);
            
            if (this.currentPage > maxPages && maxPages > 0) {
                this.currentPage = maxPages;
            } else if (totalCities === 0) {
                this.currentPage = 1;
            }
            
            this.renderWorldClockCards();
            this.showNotification(`${cityName} removed from favourites`, 'info');
        }
    }

    // =====================================================
    // FAVORITE CLOCKS SECTION (Time.is Style)
    // =====================================================
    
    loadFavoriteCities() {
        try {
            const stored = localStorage.getItem('timely_favorite_cities');
            if (stored) {
                this.favoriteCities = new Set(JSON.parse(stored));
            } else {
                // Initialize with popular default favorites
                this.favoriteCities = new Set([
                    'Tokyo', 'Beijing', 'Paris', 'London', 'New York', 'Los Angeles'
                ]);
                this.saveFavoriteCities();
            }
        } catch (error) {
            console.error('Error loading favorite cities:', error);
            this.favoriteCities = new Set(['Tokyo', 'London', 'New York']);
        }
    }
    
    saveFavoriteCities() {
        try {
            localStorage.setItem('timely_favorite_cities', JSON.stringify([...this.favoriteCities]));
        } catch (error) {
            console.error('Error saving favorite cities:', error);
        }
    }
    
    addToFavorites(cityName) {
        if (this.countryTimezones[cityName]) {
            this.favoriteCities.add(cityName);
            this.saveFavoriteCities();
            this.renderFavoriteClocks();
            this.showNotification(`${cityName} added to favorites`, 'success');
        }
    }
    
    removeFromFavorites(cityName) {
        this.favoriteCities.delete(cityName);
        this.saveFavoriteCities();
        this.renderFavoriteClocks();
        this.showNotification(`${cityName} removed from favorites`, 'info');
    }
    
    renderFavoriteClocks() {
        const container = document.getElementById('favoriteClocksList');
        const emptyState = document.getElementById('emptyFavorites');
        
        if (!container || !emptyState) return;
        
        if (this.favoriteCities.size === 0) {
            container.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        container.classList.remove('hidden');
        
        const favoriteClocks = Array.from(this.favoriteCities)
            .filter(cityName => this.countryTimezones[cityName])
            .map(cityName => {
                const city = this.countryTimezones[cityName];
                const time24h = this.getTimeForTimezone(city.timezone);
                const time12h = this.getTimeForTimezone(city.timezone, true);
                const displayTime = this.timeFormat === '12h' ? time12h : time24h;
                
                return `
                    <div class="favorite-clock-item bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative group"
                         onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${city.timezone}', true)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-lg" title="${city.country}">${city.flag}</span>
                                <span class="text-sm font-medium text-gray-900">${cityName}</span>
                            </div>
                            <button class="remove-favorite-btn absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out"
                                    onclick="event.stopPropagation(); window.timelyApp.removeFromFavorites('${cityName}')" 
                                    title="Remove from favorites">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="text-lg font-bold text-blue-600 font-mono mt-1">${displayTime}</div>
                    </div>
                `;
            }).join('');
            
        container.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                ${favoriteClocks}
            </div>
        `;
    }
    
    manageFavorites() {
        // Open location picker for managing favorites
        this.toggleLocationPicker();
        
        // Add some visual indication that we're in favorites mode
        setTimeout(() => {
            const modal = document.getElementById('locationPickerOverlay');
            if (modal) {
                const header = modal.querySelector('.modal-header h3');
                if (header) {
                    header.textContent = '⭐ Manage Favorite Locations';
                }
            }
        }, 100);
    }
    
    showCardMenu(cityName) {
        const existingMenu = document.querySelector('.card-context-menu');
        if (existingMenu) existingMenu.remove();
        
        const menu = document.createElement('div');
        menu.className = 'card-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${this.countryTimezones[cityName]?.timezone}', true)">
                🎯 Set as Primary
            </div>
            <div class="context-menu-item" onclick="window.timelyApp.showCityCountryDetails('${cityName}')">
                📍 View Details
            </div>
            <div class="context-menu-item" onclick="window.timelyApp.duplicateFavourite('${cityName}')">
                📋 Duplicate
            </div>
            <div class="context-menu-item danger" onclick="window.timelyApp.removeCityFromFavourites('${cityName}')">
                🗑️ Remove
            </div>
        `;
        
        document.body.appendChild(menu);
        
        const button = event.target;
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = rect.bottom + 5 + 'px';
        menu.style.right = window.innerWidth - rect.right + 'px';
        menu.style.zIndex = '10000';
        
        setTimeout(() => {
            document.addEventListener('click', () => {
                if (menu.parentNode) menu.parentNode.removeChild(menu);
            }, { once: true });
        }, 100);
    }
    
    toggleManageMode() {
        const container = document.getElementById('worldClockCards');
        if (!container) return;
        
        container.classList.toggle('manage-mode');
        
        if (container.classList.contains('manage-mode')) {
            this.showNotification('Manage mode activated - drag to reorder', 'info');
        } else {
            this.showNotification('Manage mode deactivated', 'info');
        }
    }
    
    // Sync all world clocks - refresh all times
    syncAllClocks() {
        console.log('🔄 Syncing all world clocks...');
        
        this.renderWorldClockCards();
        
        if (typeof this.updateTime === 'function') {
            this.updateTime();
        }
        
        this.updateClockStats();
        
        this.showNotification('All clocks synchronized successfully', 'success');
        
        // Add visual feedback - briefly highlight all cards
        const cards = document.querySelectorAll('.professional-clock-card');
        cards.forEach(card => {
            card.style.animation = 'syncPulse 0.6s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        });
    }
    
    duplicateFavourite(cityName) {
        this.showNotification('Duplication feature coming soon!', 'info');
    }
    
    setViewMode(mode) {
        console.log(`👁️ Setting view mode: ${mode}`);
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${mode}"]`).classList.add('active');
        
        const container = document.querySelector('.professional-clocks-grid');
        if (!container) return;
        
        container.classList.remove('grid-view', 'list-view', 'compact-view');
        
        switch(mode) {
            case 'list':
                container.classList.add('list-view');
                break;
            case 'compact':
                container.classList.add('compact-view');
                break;
            case 'grid':
            default:
                container.classList.add('grid-view');
                break;
        }
        
        this.showNotification(`View changed to ${mode}`, 'info');
    }
    
    toggleSortMenu() {
        const menu = document.getElementById('sortMenu');
        if (menu) {
            menu.classList.toggle('show');
        }
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sort-dropdown')) {
                menu?.classList.remove('show');
            }
        }, { once: true });
    }
    
    sortClocks(sortBy) {
        console.log(`📊 Sorting clocks by: ${sortBy}`);
        
        // Update the current sort and refresh the view
        this.currentSort = sortBy;
        this.refreshWorldClockView();
        
        this.showNotification(`Sorted by ${sortBy}`, 'info');
    }
    
    exportFavourites() {
        console.log('📤 Exporting favourite locations...');
        
        const favourites = Array.from(this.addedCities).map(cityName => {
            const countryInfo = this.countryTimezones[cityName];
            return {
                city: cityName,
                country: countryInfo?.country || 'Unknown',
                timezone: countryInfo?.timezone || 'Unknown',
                addedDate: new Date().toISOString()
            };
        });
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalLocations: favourites.length,
            locations: favourites
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timely-favourite-clocks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification(`Exported ${favourites.length} locations`, 'success');
    }
    
    updateClockStats() {
        const totalCount = this.addedCities.size;
        const activeCount = document.querySelectorAll('.professional-clock-card:not([style*="display: none"])').length;
        
        const totalElement = document.getElementById('totalClocksCount');
        const activeElement = document.getElementById('activeClocksCount');
        
        if (totalElement) totalElement.textContent = totalCount;
        if (activeElement) activeElement.textContent = activeCount;
        
        // Show/hide empty state
        const emptyState = document.getElementById('emptyClockState');
        const clocksContainer = document.getElementById('worldClockCards');
        
        if (totalCount === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (clocksContainer) clocksContainer.style.display = 'none';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (clocksContainer) clocksContainer.style.display = 'block';
        }
    }
    
    openCitySearch() {
        console.log('🔍 Opening city search modal...');
        
        const modal = document.createElement('div');
        modal.className = 'city-search-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🌍 Add New Location</h2>
                    <button class="modal-close" onclick="this.closest('.city-search-modal').remove()">✕</button>
                </div>
                
                <div class="search-section">
                    <div class="search-input-container">
                        <input type="text" 
                               id="citySearchInput" 
                               placeholder="Search cities, countries, or regions..." 
                               autocomplete="off">
                        <button class="search-button" onclick="window.timelyApp.performCitySearch()">
                            <span>🔍</span>
                        </button>
                    </div>
                    <div class="search-help">
                        Try: "New York", "Tokyo", "London", "Sydney", "Dubai"
                    </div>
                </div>
                
                <div class="search-results" id="citySearchResults">
                    <div class="popular-cities">
                        <h3>Popular Cities</h3>
                        <div class="city-grid">
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('New York', 'America/New_York', 'United States', '🇺🇸')">
                                <span class="city-flag">🇺🇸</span>
                                <div class="city-info">
                                    <div class="city-name">New York</div>
                                    <div class="city-country">United States</div>
                                </div>
                            </div>
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('London', 'Europe/London', 'United Kingdom', '🇬🇧')">
                                <span class="city-flag">🇬🇧</span>
                                <div class="city-info">
                                    <div class="city-name">London</div>
                                    <div class="city-country">United Kingdom</div>
                                </div>
                            </div>
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Tokyo', 'Asia/Tokyo', 'Japan', '🇯🇵')">
                                <span class="city-flag">🇯🇵</span>
                                <div class="city-info">
                                    <div class="city-name">Tokyo</div>
                                    <div class="city-country">Japan</div>
                                </div>
                            </div>
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Sydney', 'Australia/Sydney', 'Australia', '🇦🇺')">
                                <span class="city-flag">🇦🇺</span>
                                <div class="city-info">
                                    <div class="city-name">Sydney</div>
                                    <div class="city-country">Australia</div>
                                </div>
                            </div>
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Dubai', 'Asia/Dubai', 'United Arab Emirates', '🇦🇪')">
                                <span class="city-flag">🇦🇪</span>
                                <div class="city-info">
                                    <div class="city-name">Dubai</div>
                                    <div class="city-country">UAE</div>
                                </div>
                            </div>
                            <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Singapore', 'Asia/Singapore', 'Singapore', '🇸🇬')">
                                <span class="city-flag">🇸🇬</span>
                                <div class="city-info">
                                    <div class="city-name">Singapore</div>
                                    <div class="city-country">Singapore</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            const input = document.getElementById('citySearchInput');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performCitySearch();
                    }
                });
                
                // Add real-time search
                input.addEventListener('input', () => {
                    this.performCitySearch();
                });
            }
        }, 100);
    }
    
    performCitySearch() {
        const input = document.getElementById('citySearchInput');
        const resultsContainer = document.getElementById('citySearchResults');
        
        if (!input || !resultsContainer) return;
        
        const query = input.value.trim().toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.innerHTML = `
                <div class="popular-cities">
                    <h3>Popular Cities</h3>
                    <div class="city-grid">
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('New York', 'America/New_York', 'United States', '🇺🇸')">
                            <span class="city-flag">🇺🇸</span>
                            <div class="city-info">
                                <div class="city-name">New York</div>
                                <div class="city-country">United States</div>
                            </div>
                        </div>
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('London', 'Europe/London', 'United Kingdom', '🇬🇧')">
                            <span class="city-flag">🇬🇧</span>
                            <div class="city-info">
                                <div class="city-name">London</div>
                                <div class="city-country">United Kingdom</div>
                            </div>
                        </div>
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Tokyo', 'Asia/Tokyo', 'Japan', '🇯🇵')">
                            <span class="city-flag">🇯🇵</span>
                            <div class="city-info">
                                <div class="city-name">Tokyo</div>
                                <div class="city-country">Japan</div>
                            </div>
                        </div>
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Sydney', 'Australia/Sydney', 'Australia', '🇦🇺')">
                            <span class="city-flag">🇦🇺</span>
                            <div class="city-info">
                                <div class="city-name">Sydney</div>
                                <div class="city-country">Australia</div>
                            </div>
                        </div>
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Dubai', 'Asia/Dubai', 'United Arab Emirates', '🇦🇪')">
                            <span class="city-flag">🇦🇪</span>
                            <div class="city-info">
                                <div class="city-name">Dubai</div>
                                <div class="city-country">UAE</div>
                            </div>
                        </div>
                        <div class="city-item" onclick="window.timelyApp.addCityFromSearch('Singapore', 'Asia/Singapore', 'Singapore', '🇸🇬')">
                            <span class="city-flag">🇸🇬</span>
                            <div class="city-info">
                                <div class="city-name">Singapore</div>
                                <div class="city-country">Singapore</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        const matches = [];
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(query) || 
                cityData.country.toLowerCase().includes(query)) {
                matches.push({ name: cityName, ...cityData });
            }
        }
        
        if (matches.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No cities found</h3>
                    <p>Try searching for a different city or country name.</p>
                </div>
            `;
        } else {
            const resultsHtml = matches.slice(0, 12).map(city => `
                <div class="city-item" onclick="window.timelyApp.addCityFromSearch('${city.name}', '${city.timezone}', '${city.country}', '${city.flag}')">
                    <span class="city-flag">${city.flag}</span>
                    <div class="city-info">
                        <div class="city-name">${city.name}</div>
                        <div class="city-country">${city.country}</div>
                    </div>
                </div>
            `).join('');
            
            resultsContainer.innerHTML = `
                <div class="search-results-section">
                    <h3>Search Results (${matches.length} found)</h3>
                    <div class="city-grid">
                        ${resultsHtml}
                    </div>
                </div>
            `;
        }
    }
    
    addCityFromSearch(cityName, timezone, country, flag) {
        console.log(`🌍 Adding city from search: ${cityName}`);
        
        if (this.addedCities.has(cityName)) {
            this.showNotification(`${cityName} is already in your favourites`, 'warning');
            return;
        }
        
        this.addCityToWorldClocks(cityName, timezone, country, flag);
        
        const modal = document.querySelector('.city-search-modal');
        if (modal) modal.remove();
        
        this.showNotification(`✅ ${cityName} added to your favourites`, 'success');
    }
    
    performSearch() {
        const headerInput = document.getElementById('headerCitySearchInput');
        if (headerInput && headerInput.value.trim()) {
            this.addCityToGrid(headerInput.value.trim());
            headerInput.value = '';
        }
    }
    
    performHeaderSearch() {
        const input = document.getElementById('headerCitySearchInput');
        if (input && input.value.trim()) {
            this.addCityToGrid(input.value.trim());
            input.value = '';
            
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    showCountryDetails() {
        const cityName = this.currentPrimaryCity || 'New York';
        this.showCityCountryDetails(cityName);
    }
    
    showCityCountryDetails(cityName) {
        const city = this.countryTimezones[cityName];
        if (!city) return;
        
        const mainSections = document.querySelectorAll('.world-clocks-section, .features-section');
        mainSections.forEach(section => section.style.display = 'none');
        
        const countryPage = document.getElementById('countryDetailsPage');
        if (countryPage) {
            countryPage.style.display = 'block';
            this.populateCountryDetails(cityName, city);
        }
    }
    
    hideCountryDetails() {
        const mainSections = document.querySelectorAll('.world-clocks-section, .features-section');
        mainSections.forEach(section => section.style.display = 'block');
        
        const countryPage = document.getElementById('countryDetailsPage');
        if (countryPage) {
            countryPage.style.display = 'none';
        }
    }
    
    populateCountryDetails(cityName, city) {
        const pageTitle = document.getElementById('countryPageTitle');
        const infoCard = document.getElementById('countryInfoCard');
        const showcase = document.getElementById('citiesShowcase');
        
        if (pageTitle) {
            pageTitle.textContent = `${city.country} - Time Zone Details`;
        }
        
        if (infoCard) {
            const currentTime = this.getTimeForTimezone(city.timezone);
            const utcOffset = this.getUTCOffset(city.timezone);
            const continent = this.getContinentFromTimezone(city.timezone);
            
            infoCard.innerHTML = `
                <div class="country-flag-display">${city.flag}</div>
                <h2 style="text-align: center; margin: 0 0 20px 0; font-size: 2.5rem;">${city.country}</h2>
                <p style="text-align: center; font-size: 1.2rem; opacity: 0.9; margin-bottom: 30px;">
                    Current time in ${cityName}: ${currentTime}
                </p>
                <div class="country-stats">
                    <div class="stat-item">
                        <div class="stat-value">UTC${utcOffset}</div>
                        <div class="stat-label">Time Zone Offset</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${continent}</div>
                        <div class="stat-label">Continent</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${city.timezone}</div>
                        <div class="stat-label">IANA Time Zone</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${cityName}</div>
                        <div class="stat-label">Reference City</div>
                    </div>
                </div>
            `;
        }
        
        if (showcase) {
            this.populateCitiesShowcase(city.country);
        }
    }
    
    populateCitiesShowcase(countryName) {
        const showcase = document.getElementById('citiesShowcase');
        if (!showcase) return;
        
        const countryCities = Object.keys(this.countryTimezones).filter(cityName => 
            this.countryTimezones[cityName].country === countryName
        );
        
        const cityLists = {
            'United States': [
                'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 
                'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
                'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
                'Denver', 'Washington DC', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Miami'
            ],
            'Jamaica': [
                'Kingston', 'Spanish Town', 'Portmore', 'Montego Bay', 'May Pen', 'Mandeville',
                'Old Harbour', 'Savanna-la-Mar', 'Ocho Rios', 'Port Antonio', 'Linstead',
                'Half Way Tree', 'Saint Ann\'s Bay', 'Constant Spring', 'Port Maria', 'Yallahs',
                'Bog Walk', 'Bull Savannah', 'Ewarton', 'Falmouth', 'Hayes', 'Morant Bay',
                'Old Harbour Bay', 'Santa Cruz', 'Stony Hill'
            ],
            'United Kingdom': [
                'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield',
                'Edinburgh', 'Bristol', 'Cardiff', 'Leicester', 'Coventry', 'Bradford', 'Belfast',
                'Nottingham', 'Hull', 'Newcastle', 'Stoke-on-Trent', 'Southampton', 'Derby',
                'Portsmouth', 'Brighton', 'Plymouth', 'Northampton', 'Reading', 'Luton'
            ],
            'Canada': [
                'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Mississauga',
                'Winnipeg', 'Quebec City', 'Hamilton', 'Brampton', 'Surrey', 'Laval', 'Halifax',
                'London', 'Markham', 'Vaughan', 'Gatineau', 'Longueuil', 'Burnaby', 'Saskatoon',
                'Kitchener', 'Windsor', 'Regina', 'Richmond', 'Richmond Hill'
            ],
            'Australia': [
                'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle',
                'Canberra', 'Sunshine Coast', 'Wollongong', 'Geelong', 'Hobart', 'Townsville',
                'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Albury', 'Launceston',
                'Mackay', 'Rockhampton', 'Bunbury', 'Bundaberg', 'Coffs Harbour'
            ]
        };
        
        const citiesToShow = cityLists[countryName] || countryCities;
        
        if (citiesToShow.length === 0) {
            showcase.innerHTML = `
                <div class="cities-title">Cities in ${countryName}</div>
                <div class="cities-cloud">
                    <p style="text-align: center; color: #666; font-size: 1.1rem;">
                        No additional cities available for this country.
                    </p>
                </div>
            `;
            return;
        }
        
        const shuffledCities = [...citiesToShow].sort(() => Math.random() - 0.5);
        
        showcase.innerHTML = `
            <div class="cities-title">The ${shuffledCities.length} largest cities in<br><strong>${countryName}</strong></div>
            <div class="cities-cloud">
                ${shuffledCities.map(cityName => 
                    `<span class="city-bubble" onclick="window.timelyApp.addCityFromCountryPage('${cityName}')">${cityName}</span>`
                ).join(' ')}
            </div>
        `;
    }
    
    addCityFromCountryPage(cityName) {
        if (this.countryTimezones[cityName]) {
            this.addCityToGrid(cityName);
            const bubble = event.target;
            const originalText = bubble.textContent;
            bubble.textContent = '✓ Added!';
            bubble.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
            bubble.style.color = 'white';
            
            setTimeout(() => {
                bubble.textContent = originalText;
                bubble.style.background = '';
                bubble.style.color = '';
            }, 2000);
        } else {
            const bubble = event.target;
            const originalText = bubble.textContent;
            bubble.textContent = 'Not available';
            bubble.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            bubble.style.color = 'white';
            
            setTimeout(() => {
                bubble.textContent = originalText;
                bubble.style.background = '';
                bubble.style.color = '';
            }, 2000);
        }
    }
    
    toggleLocationPicker() {
        this.locationPickerOpen = !this.locationPickerOpen;
        const overlay = document.getElementById('locationPickerOverlay');
        
        if (this.locationPickerOpen) {
            overlay.classList.add('active');
            this.initializeLocationPicker();
            setTimeout(() => {
                const searchInput = document.getElementById('locationSearchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        } else {
            overlay.classList.remove('active');
            this.clearSearchResults();
        }
    }
    
    // Global Search Functions for Modern Header
    toggleGlobalSearch() {
        this.globalSearchOpen = !this.globalSearchOpen;
        const overlay = document.getElementById('globalSearchOverlay');
        
        if (this.globalSearchOpen) {
            overlay.classList.add('active');
            this.initializeGlobalSearch();
            setTimeout(() => {
                const searchInput = document.getElementById('globalSearchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        } else {
            overlay.classList.remove('active');
            this.clearGlobalSearchResults();
        }
    }
    
    async initializeGlobalSearch() {
        console.log('🔍 Initializing global search...');
        
        try {
            const searchInput = document.getElementById('globalSearchInput');
            const suggestionsContainer = document.getElementById('globalSearchSuggestions');
            
            if (searchInput && suggestionsContainer) {
                this.setupGlobalSearchHandlers(searchInput, suggestionsContainer);
            }
            
            console.log('✅ Global search initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing global search:', error);
        }
    }
    
    setupGlobalSearchHandlers(searchInput, suggestionsContainer) {
        let searchTimeout;
        
        // Search input handler
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    this.performGlobalSearch(query, suggestionsContainer);
                }, 300);
            } else {
                this.clearGlobalSearchResults();
            }
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleGlobalSearch();
            } else if (e.key === 'Enter') {
                const firstResult = suggestionsContainer.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.globalSearchOpen && !e.target.closest('.global-search-container')) {
                this.toggleGlobalSearch();
            }
        });
    }
    
    async performGlobalSearch(query, suggestionsContainer) {
        try {
            const results = this.searchCitiesAndTimezones(query);
            this.displayGlobalSearchResults(results, suggestionsContainer);
        } catch (error) {
            console.error('❌ Error performing global search:', error);
        }
    }
    
    searchCitiesAndTimezones(query) {
        const lowerQuery = query.toLowerCase();
        const results = [];
        
        // Search through our city database
        Object.entries(this.countryTimezones).forEach(([city, data]) => {
            const cityLower = city.toLowerCase();
            const countryLower = data.country.toLowerCase();
            
            if (cityLower.includes(lowerQuery) || countryLower.includes(lowerQuery)) {
                results.push({
                    type: 'city',
                    city: city,
                    country: data.country,
                    timezone: data.timezone,
                    flag: data.flag,
                    score: this.calculateSearchScore(query, city, data.country)
                });
            }
        });
        
        // Search for timezone patterns (UTC+/-X, GMT+/-X)
        if (query.match(/^(utc|gmt)[+-]?\d*$/i)) {
            results.push({
                type: 'timezone',
                display: query.toUpperCase(),
                timezone: this.parseTimezoneQuery(query),
                score: 100
            });
        }
        
        // Sort by relevance score
        return results.sort((a, b) => b.score - a.score).slice(0, 8);
    }
    
    calculateSearchScore(query, city, country) {
        const lowerQuery = query.toLowerCase();
        const cityLower = city.toLowerCase();
        const countryLower = country.toLowerCase();
        
        let score = 0;
        
        // Exact matches get highest score
        if (cityLower === lowerQuery || countryLower === lowerQuery) {
            score += 100;
        }
        // Starts with query gets high score
        else if (cityLower.startsWith(lowerQuery) || countryLower.startsWith(lowerQuery)) {
            score += 80;
        }
        // Contains query gets medium score
        else if (cityLower.includes(lowerQuery) || countryLower.includes(lowerQuery)) {
            score += 60;
        }
        
        // Boost popular cities
        const popularCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Los Angeles', 'Dubai', 'Singapore'];
        if (popularCities.includes(city)) {
            score += 20;
        }
        
        return score;
    }
    
    displayGlobalSearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">No locations found</div>
                    <div class="no-results-hint">Try searching for a city, country, or timezone</div>
                </div>
            `;
            return;
        }
        
        const resultHTML = results.map(result => {
            if (result.type === 'city') {
                return `
                    <div class="search-result-item" onclick="window.timelyApp.selectGlobalSearchResult('${result.city}', '${result.timezone}')">
                        <div class="result-flag">${result.flag}</div>
                        <div class="result-info">
                            <div class="result-city">${result.city}</div>
                            <div class="result-country">${result.country}</div>
                        </div>
                        <div class="result-action">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"/>
                            </svg>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="search-result-item timezone-result" onclick="window.timelyApp.selectTimezoneResult('${result.timezone}')">
                        <div class="result-flag">🌍</div>
                        <div class="result-info">
                            <div class="result-city">${result.display}</div>
                            <div class="result-country">Timezone Offset</div>
                        </div>
                        <div class="result-action">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9,18 15,12 9,6"/>
                            </svg>
                        </div>
                    </div>
                `;
            }
        }).join('');
        
        container.innerHTML = resultHTML;
        container.style.display = 'block';
    }
    
    selectGlobalSearchResult(city, timezone) {
        // Add the city to world clocks
        this.addCityToWorldClocks(city, timezone);
        this.toggleGlobalSearch();
    }
    
    addCityToWorldClocks(city, timezone) {
        // Check if the city is already added
        if (this.addedCities.has(city)) {
            this.showNotification(`${city} is already in your world clocks`, 'info');
            return;
        }
        
        try {
            // Add to the set of added cities
            this.addedCities.add(city);
            
            // Get city data
            const cityData = this.countryTimezones[city];
            if (cityData) {
                // Add to world clocks and refresh display
                this.renderWorldClockCards();
                this.showNotification(`${city} added to your world clocks!`, 'success');
            } else {
                // Handle timezone-only additions
                this.showNotification(`Timezone ${city} added!`, 'success');
            }
        } catch (error) {
            console.error('Error adding city to world clocks:', error);
            this.showNotification('Failed to add city. Please try again.', 'error');
        }
    }
    
    selectTimezoneResult(timezone) {
        // Handle timezone selection
        this.showNotification(`Timezone ${timezone} selected!`, 'info');
        this.toggleGlobalSearch();
    }
    
    parseTimezoneQuery(query) {
        // Simple timezone parser for UTC/GMT offsets
        const match = query.match(/^(utc|gmt)([+-]?\d+)$/i);
        if (match) {
            const offset = parseInt(match[2]) || 0;
            return `UTC${offset >= 0 ? '+' : ''}${offset}`;
        }
        return 'UTC';
    }
    
    clearGlobalSearchResults() {
        const suggestionsContainer = document.getElementById('globalSearchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    }
    
    async initializeLocationPicker() {
        console.log('🌍 Initializing enhanced location picker...');
        
        try {
            await this.loadGlobalCountriesData();
            
            this.setupLocationSearch();
            
            this.populatePopularCities();
            
            this.populateAllLocations();
            
            console.log('✅ Location picker initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing location picker:', error);
            this.showLocationPickerError('Failed to load locations. Please try again.');
        }
    }
    
    setupLocationSearch() {
        console.log('🔧 Initializing enhanced location search...');
        
        // Ensure DOM is ready
        setTimeout(() => {
            this.initializeSearchComponents();
        }, 100);
    }

    initializeSearchComponents() {
        const searchInput = document.getElementById('locationSearchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!searchInput) {
            console.error('❌ Search input element not found');
            return;
        }
        
        if (!suggestionsContainer) {
            console.error('❌ Search suggestions container not found');
            return;
        }
        
        console.log('✅ Search components found, setting up functionality...');
        
        // Clear any existing event listeners
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        
        // Setup new event listeners
        this.setupSearchEventListeners(newInput, suggestionsContainer);
        
        // Initialize search state
        this.searchState = {
            isSearching: false,
            lastQuery: '',
            selectedIndex: -1,
            results: []
        };
        
        console.log('✅ Location search initialized successfully');
    }

    setupSearchEventListeners(searchInput, suggestionsContainer) {
        let searchTimeout;
        
        // Input event for real-time search
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query === this.searchState.lastQuery) return;
            this.searchState.lastQuery = query;
            
            if (query.length === 0) {
                this.clearSearchResults();
                return;
            }
            
            if (query.length < 2) {
                this.showSearchHint('Type at least 2 characters to search...');
                return;
            }
            
            // Debounced search
            searchTimeout = setTimeout(() => {
                this.performLocationSearch(query);
            }, 300);
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleSearchKeydown(e);
        });
        
        // Focus events
        searchInput.addEventListener('focus', () => {
            if (this.searchState.results.length > 0) {
                suggestionsContainer.style.display = 'block';
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.clearSearchResults();
            }
        });
    }

    handleSearchKeydown(e) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (this.searchState.selectedIndex >= 0 && suggestions[this.searchState.selectedIndex]) {
                    suggestions[this.searchState.selectedIndex].click();
                } else if (e.target.value.trim()) {
                    this.selectFirstSearchResult(e.target.value.trim());
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSearch(1, suggestions);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSearch(-1, suggestions);
                break;
                
            case 'Escape':
                this.clearSearchResults();
                e.target.blur();
                break;
        }
    }

    navigateSearch(direction, suggestions) {
        if (suggestions.length === 0) return;
        
        // Remove current selection
        if (this.searchState.selectedIndex >= 0) {
            suggestions[this.searchState.selectedIndex]?.classList.remove('selected');
        }
        
        // Calculate new index
        this.searchState.selectedIndex += direction;
        
        if (this.searchState.selectedIndex < -1) {
            this.searchState.selectedIndex = suggestions.length - 1;
        } else if (this.searchState.selectedIndex >= suggestions.length) {
            this.searchState.selectedIndex = -1;
        }
        
        // Apply new selection
        if (this.searchState.selectedIndex >= 0) {
            suggestions[this.searchState.selectedIndex].classList.add('selected');
            suggestions[this.searchState.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    async performLocationSearch(query) {
        console.log(`🔍 Searching for: "${query}"`);
        
        this.searchState.isSearching = true;
        this.showSearchLoading();
        
        try {
            const results = await this.searchLocations(query);
            this.searchState.results = results;
            this.displaySearchResults(results);
        } catch (error) {
            console.error('❌ Search error:', error);
            this.showSearchError('Search failed. Please try again.');
        } finally {
            this.searchState.isSearching = false;
        }
    }

    async searchLocations(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        
        // Search in our timezone database
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            const cityLower = cityName.toLowerCase();
            const countryLower = cityData.country.toLowerCase();
            
            // Prioritize exact matches
            if (cityLower === normalizedQuery || countryLower === normalizedQuery) {
                results.unshift({
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    type: 'exact',
                    score: 100
                });
                continue;
            }
            
            // Then starts with matches
            if (cityLower.startsWith(normalizedQuery) || countryLower.startsWith(normalizedQuery)) {
                results.push({
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    type: 'starts',
                    score: 90
                });
                continue;
            }
            
            // Finally contains matches
            if (cityLower.includes(normalizedQuery) || countryLower.includes(normalizedQuery)) {
                results.push({
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    type: 'contains',
                    score: 80
                });
            }
            
            // Limit results for performance
            if (results.length >= 50) break;
        }
        
        // Sort by score and then alphabetically
        results.sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });
        
        // Limit final results
        return results.slice(0, 12);
    }

    displaySearchResults(results) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        this.searchState.selectedIndex = -1;
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        const html = results.map((location, index) => {
            const currentTime = this.getCurrentTimeForLocation(location.timezone);
            const timeDiff = this.getTimeDifferenceFromUser(location.timezone);
            
            return `
                <div class="suggestion-item" 
                     data-index="${index}"
                     onclick="window.timelyApp.selectLocation('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}')">
                    <div class="suggestion-content">
                        <div class="location-main">
                            <span class="location-flag">${location.flag}</span>
                            <div class="location-text">
                                <div class="location-name">${this.highlightMatch(location.name, this.searchState.lastQuery)}</div>
                                <div class="location-country">${this.highlightMatch(location.country, this.searchState.lastQuery)}</div>
                            </div>
                        </div>
                        <div class="location-time">
                            <div class="current-time">${currentTime}</div>
                            <div class="time-diff ${timeDiff.class}">${timeDiff.text}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
        
        console.log(`✅ Displayed ${results.length} search results`);
    }

    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getCurrentTimeForLocation(timezone) {
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return '--:--';
        }
    }

    getTimeDifferenceFromUser(timezone) {
        try {
            const userTime = new Date();
            const locationTime = new Date(userTime.toLocaleString('en-US', { timeZone: timezone }));
            const userLocalTime = new Date(userTime.toLocaleString('en-US', { timeZone: this.userTimezone }));
            
            const diffMs = locationTime - userLocalTime;
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            
            if (diffHours === 0) {
                return { text: 'Same time', class: 'same' };
            } else if (diffHours > 0) {
                return { text: `+${diffHours}h`, class: 'ahead' };
            } else {
                return { text: `${diffHours}h`, class: 'behind' };
            }
        } catch (error) {
            return { text: '', class: '' };
        }
    }

    showSearchLoading() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-status loading">
                <div class="loading-spinner">🔍</div>
                <div class="status-text">Searching worldwide locations...</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }

    showSearchHint(message) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-status hint">
                <div class="hint-icon">💡</div>
                <div class="status-text">${message}</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }

    showNoResults() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-status no-results">
                <div class="no-results-icon">🌍</div>
                <div class="status-text">No locations found</div>
                <div class="status-hint">Try searching for a city or country name</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }

    showSearchError(message) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-status error">
                <div class="error-icon">⚠️</div>
                <div class="status-text">${message}</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }

    clearSearchResults() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
            suggestionsContainer.innerHTML = '';
        }
        
        if (this.searchState) {
            this.searchState.selectedIndex = -1;
            this.searchState.results = [];
        }
    }

    selectLocation(cityName, timezone, country, flag) {
        console.log(`📍 Location selected: ${cityName}, ${country}`);
        
        // Clear search
        this.clearSearchResults();
        const searchInput = document.getElementById('locationSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Set as primary location
        this.setPrimaryLocation(cityName, timezone, country, flag);
        
        // Close modal
        this.toggleLocationPicker();
    }

    selectFirstSearchResult(query) {
        if (this.searchState.results.length > 0) {
            const firstResult = this.searchState.results[0];
            this.selectLocation(firstResult.name, firstResult.timezone, firstResult.country, firstResult.flag);
        } else {
            console.log(`No results found for "${query}"`);
            this.showNoResults();
        }
    }
    
    showSearchLoading() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner">🔍</div>
                <div class="loading-text">Searching worldwide locations...</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }
    
    showSearchError() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;
        
        suggestionsContainer.innerHTML = `
            <div class="search-error">
                <div class="error-icon">⚠️</div>
                <div class="error-text">Search failed</div>
                <div class="error-hint">Please try again</div>
            </div>
        `;
        suggestionsContainer.style.display = 'block';
    }
    
    displaySearchSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        console.log('📝 Displaying suggestions...', { 
            containerFound: !!suggestionsContainer, 
            suggestionsCount: suggestions.length 
        });
        
        if (!suggestionsContainer) {
            console.error('❌ searchSuggestions container not found!');
            return;
        }
        
        if (suggestions.length === 0) {
            console.log('📭 No suggestions to display');
            suggestionsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">No locations found</div>
                    <div class="no-results-hint">Try searching for a city or country name</div>
                </div>
            `;
            suggestionsContainer.style.display = 'block';
            return;
        }
        
        const html = suggestions.map((location, index) => {
            const currentTime = this.getTimeForTimezone(location.timezone);
            const timeString = currentTime ? currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }) : '';
            
            // Calculate time difference from user's timezone
            const timeDiff = this.getTimeDifference(this.userTimezone, location.timezone);
            const diffText = timeDiff === 0 ? 'Same time' : 
                            timeDiff > 0 ? `+${timeDiff}h` : `${timeDiff}h`;
            
            return `
                <div class="suggestion-item enhanced-suggestion" 
                     data-city="${location.name}" 
                     data-country="${location.country}"
                     onclick="window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'primary')"
                     style="animation-delay: ${index * 0.05}s">
                    <div class="suggestion-main">
                        <span class="location-flag">${location.flag}</span>
                        <div class="location-info">
                            <div class="location-city-name">${location.name}</div>
                            <div class="location-details">
                                <span class="location-country-name">${location.country}</span>
                                ${timeString ? `<span class="location-time">${timeString}</span>` : ''}
                                <span class="time-difference ${timeDiff === 0 ? 'same-time' : timeDiff > 0 ? 'ahead' : 'behind'}">${diffText}</span>
                            </div>
                        </div>
                    </div>
                    <div class="suggestion-actions">
                        <button class="mini-btn primary-btn" 
                                onclick="event.stopPropagation(); window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'primary')" 
                                title="Set as Primary Location">
                            🎯
                        </button>
                        <button class="mini-btn favorite-btn" 
                                onclick="event.stopPropagation(); window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'favorite')" 
                                title="Add to World Clocks">
                            ⭐
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
        
        // Smart positioning: Check if suggestions would overflow modal
        this.adjustSuggestionsPosition(suggestionsContainer);
        
        console.log('✅ Enhanced suggestions displayed successfully');
    }
    
    adjustSuggestionsPosition(suggestionsContainer) {
        const modal = document.querySelector('.location-picker-modal');
        const searchInput = document.getElementById('locationSearchInput');
        
        if (!modal || !searchInput || !suggestionsContainer) return;
        
        const modalRect = modal.getBoundingClientRect();
        const inputRect = searchInput.getBoundingClientRect();
        const modalBottom = modalRect.bottom;
        const inputBottom = inputRect.bottom;
        const availableSpaceBelow = modalBottom - inputBottom - 40; // 40px margin
        
        // Estimate suggestions height (approximate)
        const estimatedHeight = Math.min(180, suggestionsContainer.scrollHeight);
        
        // If not enough space below, position above
        if (availableSpaceBelow < estimatedHeight && inputRect.top - modalRect.top > estimatedHeight) {
            suggestionsContainer.classList.add('position-above');
            console.log('📍 Positioning suggestions above input due to space constraints');
        } else {
            suggestionsContainer.classList.remove('position-above');
            console.log('📍 Positioning suggestions below input');
        }
    }
    
    getTimeForTimezone(timezone) {
        try {
            return new Date().toLocaleString('en-US', { 
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            console.warn(`Unable to get time for timezone: ${timezone}`, error);
            return null;
        }
    }
    
    getTimeDifference(fromTimezone, toTimezone) {
        try {
            const now = new Date();
            const fromTime = new Date(now.toLocaleString('en-US', { timeZone: fromTimezone }));
            const toTime = new Date(now.toLocaleString('en-US', { timeZone: toTimezone }));
            const diffMs = toTime.getTime() - fromTime.getTime();
            const diffHours = Math.round(diffMs / (1000 * 60 * 60));
            return diffHours;
        } catch (error) {
            console.warn(`Unable to calculate time difference between ${fromTimezone} and ${toTimezone}`, error);
            return 0;
        }
    }
    
    selectFirstSearchResult(query) {
        const firstSuggestion = document.querySelector('.suggestion-item');
        if (firstSuggestion) {
            firstSuggestion.click();
        }
    }
    
    populatePopularCities() {
        const grid = document.getElementById('popularCitiesGrid');
        if (!grid) return;
        
        const popularCities = [
            'New York', 'London', 'Tokyo', 'Sydney', 'Dubai', 'Los Angeles',
            'Paris', 'Singapore', 'Hong Kong', 'Mumbai', 'Berlin', 'Toronto'
        ];
        
        const html = popularCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            return `
                <div class="popular-city-item" onclick="window.timelyApp.selectLocationAction('${cityName}', '${city.timezone}', '${city.country}', '${city.flag}', 'primary')">
                    <span class="popular-city-flag">${city.flag}</span>
                    <div class="popular-city-name">${cityName}</div>
                </div>
            `;
        }).filter(Boolean).join('');
        
        grid.innerHTML = html;
    }
    
    showRecentLocations() {
        console.log('📍 Showing recent locations...');
        const recentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');
        
        if (recentLocations.length === 0) {
            this.showNotification('No recent locations found', 'info');
            return;
        }
        
        const grid = document.getElementById('popularCitiesGrid');
        const sectionTitle = document.querySelector('.section-title');
        
        if (grid && sectionTitle) {
            sectionTitle.textContent = 'Recent Locations';
            
            const html = recentLocations.slice(0, 8).map(location => `
                <div class="popular-city-item" onclick="window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'primary')">
                    <span class="popular-city-flag">${location.flag}</span>
                    <div class="popular-city-name">${location.name}</div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
            
            setTimeout(() => {
                sectionTitle.textContent = 'Popular Cities';
                this.populatePopularCities();
            }, 5000);
        }
    }
    
    async populateAllLocations() {
        const grid = document.getElementById('locationGrid');
        if (!grid) return;
        
        grid.innerHTML = '<div class="loading-spinner">🌍 Loading worldwide locations...</div>';
        
        try {
            const allLocations = [];
            
            for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
                allLocations.push({
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    continent: this.getContinentFromTimezone(cityData.timezone)
                });
            }
            
            if (this.globalCountries.length > 0) {
                for (const country of this.globalCountries) {
                    const exists = allLocations.some(loc => 
                        loc.name === country.capital && loc.country === country.name
                    );
                    
                    if (!exists) {
                        allLocations.push({
                            name: country.capital,
                            country: country.name,
                            timezone: country.primaryTimezone,
                            flag: country.flagEmoji,
                            continent: country.region
                        });
                    }
                }
            }
            
            allLocations.sort((a, b) => a.name.localeCompare(b.name));
            
            const html = allLocations.map(location => `
                <div class="location-item" data-continent="${location.continent.toLowerCase()}" 
                     onclick="window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'primary')">
                    <span class="location-flag">${location.flag}</span>
                    <div class="location-info">
                        <div class="location-city-name">${location.name}</div>
                        <div class="location-country-name">${location.country}</div>
                        <div class="location-timezone">${location.timezone}</div>
                    </div>
                    <div class="location-actions">
                        <button class="mini-btn primary-btn" onclick="event.stopPropagation(); window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'primary')" title="Set as Primary">🎯</button>
                        <button class="mini-btn favorite-btn" onclick="event.stopPropagation(); window.timelyApp.selectLocationAction('${location.name}', '${location.timezone}', '${location.country}', '${location.flag}', 'favorite')" title="Add to World Clocks">⭐</button>
                    </div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
            console.log(`✅ Populated ${allLocations.length} locations`);
            
        } catch (error) {
            console.error('❌ Error populating locations:', error);
            grid.innerHTML = '<div class="error-message">Failed to load locations. Please try again.</div>';
        }
    }
    
    filterLocations(continent) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${continent}"]`).classList.add('active');
        
        const items = document.querySelectorAll('.location-item');
        items.forEach(item => {
            if (continent === 'all') {
                item.style.display = 'flex';
            } else {
                const itemContinent = item.getAttribute('data-continent');
                if (this.continentMatches(itemContinent, continent)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }
    
    continentMatches(itemContinent, filterContinent) {
        const continentMap = {
            'africa': ['africa'],
            'asia': ['asia'],
            'europe': ['europe'],
            'americas': ['america', 'north america', 'south america'],
            'oceania': ['australia', 'pacific', 'oceania']
        };
        
        const validContinents = continentMap[filterContinent] || [];
        return validContinents.some(continent => 
            itemContinent.includes(continent.toLowerCase())
        );
    }
    
    filterLocationGrid(query) {
        const items = document.querySelectorAll('.location-item');
        const normalizedQuery = query.toLowerCase();
        
        items.forEach(item => {
            const cityName = item.querySelector('.location-city-name').textContent.toLowerCase();
            const countryName = item.querySelector('.location-country-name').textContent.toLowerCase();
            
            if (cityName.includes(normalizedQuery) || countryName.includes(normalizedQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    showAllLocations() {
        const items = document.querySelectorAll('.location-item');
        items.forEach(item => {
            item.style.display = 'flex';
        });
        
        // Reset to "All" filter
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('[data-filter="all"]').classList.add('active');
    }
    
    async autoDetectLocation() {
        console.log('📍 Auto-detecting user location...');
        
        try {
            const button = document.querySelector('.auto-detect-btn');
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="btn-icon">⏳</span> Detecting...';
            button.disabled = true;
            
            const location = await this.detectUserLocation();
            
            if (location.city && location.city !== 'Local Time') {
                this.selectLocationAction(location.city, location.timezone, location.country, '🌍', 'primary');
            } else {
                this.showNotification('Unable to detect your location. Please select manually.', 'error');
            }
            
            button.innerHTML = originalText;
            button.disabled = false;
            
        } catch (error) {
            console.error('❌ Auto-detection failed:', error);
            alert('Location detection failed. Please select manually.');
        }
    }
    
    selectLocationAction(cityName, timezone, country, flag, action) {
        console.log(`🎯 Selected location action: ${cityName}, ${country} (${timezone}) - Action: ${action}`);
        
        this.saveRecentLocation(cityName, timezone, country, flag);
        
        if (action === 'primary') {
            this.selectLocation(cityName, timezone, country, flag);
        } else if (action === 'favorite') {
            // Add to World Clocks (favorites)
            this.addCityToWorldClocks(cityName, timezone, country, flag);
        }
    }
    
    saveRecentLocation(cityName, timezone, country, flag) {
        try {
            const recentLocations = JSON.parse(localStorage.getItem('recentLocations') || '[]');
            
            const filteredLocations = recentLocations.filter(loc => loc.name !== cityName);
            
            filteredLocations.unshift({
                name: cityName,
                timezone: timezone,
                country: country,
                flag: flag,
                timestamp: Date.now()
            });
            
            // Keep only last 10 recent locations
            const limitedLocations = filteredLocations.slice(0, 10);
            
            localStorage.setItem('recentLocations', JSON.stringify(limitedLocations));
            console.log(`💾 Saved ${cityName} to recent locations`);
        } catch (error) {
            console.warn('Failed to save recent location:', error);
        }
    }
    
    async addCityToWorldClocks(cityName, timezone, country, flag) {
        console.log(`⭐ Adding ${cityName} to World Clocks`);
        
        if (this.addedCities.has(cityName)) {
            console.log(`${cityName} already in World Clocks`);
            this.showNotification(`${cityName} is already in your World Clocks`, 'info');
            return;
        }
        
        this.addedCities.add(cityName);
        
        // Create city object for our database if it doesn't exist
        if (!this.countryTimezones[cityName]) {
            this.countryTimezones[cityName] = {
                timezone: timezone,
                flag: flag,
                country: country
            };
        }
        
        if (window.timelyAuth && window.timelyAuth.isLoggedIn()) {
            await window.timelyAuth.addWorldClock({
                name: cityName,
                timezone: timezone,
                country: country,
                flag: flag
            });
        }
        
        this.renderWorldClockCards();
        
        this.showNotification(`✅ ${cityName} added to World Clocks!`, 'success');
        
        console.log(`✅ Successfully added ${cityName} to World Clocks`);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    selectLocation(cityName, timezone, country, flag) {
        console.log(`🎯 Selected location: ${cityName}, ${country} (${timezone})`);
        
        const searchInput = document.getElementById('locationSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.clearSearchResults();
        
        this.setPrimaryLocation(cityName, timezone);
        
        this.toggleLocationPicker();
    }
    
    showLocationPickerError(message) {
        const grid = document.getElementById('locationGrid');
        if (grid) {
            grid.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
    
    setPrimaryLocation(cityName, timezone, fromMenu = false) {
        console.log(`🎯 Setting primary location: ${cityName} (${timezone})`);
        this.currentPrimaryCity = cityName;
        this.currentPrimaryTimezone = timezone;
        
        localStorage.setItem('timely-primary-city', cityName);
        localStorage.setItem('timely-primary-timezone', timezone);
        console.log(`💾 Saved primary location: ${cityName} (${timezone})`);
        
        const countryCode = this.getCountryCodeFromCity(cityName);
        if (this.config && typeof this.config.setDefaultCountry === 'function') {
            this.config.setDefaultCountry(countryCode);
            console.log(`🌍 Updated default country to: ${countryCode}`);
        } else {
            // Fallback: save directly to localStorage
            localStorage.setItem('timely-default-country', countryCode);
            console.log(`🌍 Saved default country to localStorage: ${countryCode}`);
        }
        
        const titleEl = document.getElementById('locationTitle');
        const subtitleEl = document.getElementById('locationSubtitle');
        
        if (titleEl) titleEl.textContent = `Time in ${cityName} now`;
        if (subtitleEl) subtitleEl.textContent = this.getTimezoneInfo(timezone);
        
        if (!fromMenu) {
            this.toggleLocationPicker();
        }
        
        this.updatePrimaryTimeForLocation();
        
        this.updatePrimaryTime();
        
        if (fromMenu) {
            this.showNotification(`✅ ${cityName} set as primary location`, 'success');
        }
        
        // Debug: Check if location was saved correctly
        setTimeout(() => {
            this.debugLocationPersistence();
        }, 100);
    }
    
    debugLocationPersistence() {
        console.log('🔍 Debug Location Persistence:');
        console.log('Current Primary City:', this.currentPrimaryCity);
        console.log('Current Primary Timezone:', this.currentPrimaryTimezone);
        console.log('Saved City in localStorage:', localStorage.getItem('timely-primary-city'));
        console.log('Saved Timezone in localStorage:', localStorage.getItem('timely-primary-timezone'));
        
        const locationFlagEl = document.getElementById('locationFlag');
        const locationNameEl = document.getElementById('locationName');
        const locationCountryEl = document.getElementById('locationCountry');
        
        console.log('HTML Elements:');
        console.log('Flag element content:', locationFlagEl?.textContent);
        console.log('Name element content:', locationNameEl?.textContent);
        console.log('Country element content:', locationCountryEl?.textContent);
    }
    
    // Clear saved primary location (reset to auto-detect)
    clearSavedPrimaryLocation() {
        localStorage.removeItem('timely-primary-city');
        localStorage.removeItem('timely-primary-timezone');
        console.log('🗑️ Cleared saved primary location');
        
        // Reset to local time and re-detect
        this.currentPrimaryCity = 'Local Time';
        this.currentPrimaryTimezone = this.userTimezone;
        this.detectUserLocation().then(location => {
            if (location.city !== 'Local Time') {
                const matchedCity = this.getCityFromTimezone(location.timezone);
                if (this.countryTimezones[matchedCity]) {
                    this.currentPrimaryCity = matchedCity;
                    this.currentPrimaryTimezone = location.timezone;
                    this.updatePrimaryTime();
                }
            }
        });
    }
    
    updatePrimaryTimeForLocation() {
        const timeEl = document.getElementById('primaryTime');
        const dateEl = document.getElementById('primaryDate');
        const sunTimesEl = document.getElementById('sunInfo');
        
        const locationFlagEl = document.getElementById('locationFlag');
        const locationNameEl = document.getElementById('locationName');
        const locationCountryEl = document.getElementById('locationCountry');
        
        if (timeEl) {
            const time = this.getTimeForTimezone(this.currentPrimaryTimezone);
            timeEl.textContent = time;
        }
        
        if (dateEl) {
            const date = this.getDateForTimezone(this.currentPrimaryTimezone);
            const weekNumber = this.getWeekNumber(new Date());
            dateEl.textContent = `${date}, week ${weekNumber}`;
        }
        
        const locationInfo = this.countryTimezones[this.currentPrimaryCity];
        if (locationInfo) {
            if (locationFlagEl) {
                locationFlagEl.textContent = locationInfo.flag;
            }
            if (locationNameEl) {
                locationNameEl.textContent = this.currentPrimaryCity;
            }
            if (locationCountryEl) {
                locationCountryEl.textContent = locationInfo.country;
            }
        } else {
            if (locationFlagEl) {
                locationFlagEl.textContent = '🌍';
            }
            if (locationNameEl) {
                locationNameEl.textContent = this.currentPrimaryCity;
            }
            if (locationCountryEl) {
                locationCountryEl.textContent = 'Unknown';
            }
        }
        
        if (sunTimesEl) {
            // Simple sunrise/sunset calculation
            const sunrise = "06:30";
            const sunset = "18:45";
            const dayLength = "12h 15m";
            sunTimesEl.textContent = `↑ ${sunrise} ↓ ${sunset} (${dayLength})`;
        }
    }
    
    showSection(sectionName) {
        this.activeSection = sectionName;
        
        document.querySelectorAll('.quick-tile').forEach(tile => {
            tile.classList.remove('active');
        });
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionName === 'popular') {
            document.querySelector('.popular-tile')?.classList.add('active');
            document.getElementById('popularSection')?.classList.add('active');
            this.renderCityTiles();
        } else if (sectionName === 'add') {
            document.querySelector('.add-tile')?.classList.add('active');
            document.getElementById('addCitySection')?.classList.add('active');
        } else if (sectionName === 'business') {
            document.querySelector('.business-tile')?.classList.add('active');
            document.getElementById('businessSection')?.classList.add('active');
            this.renderBusinessHours();
        } else if (sectionName === 'timezone') {
            document.querySelector('.timezone-tile')?.classList.add('active');
            document.getElementById('timezoneSection')?.classList.add('active');
            this.renderTimezoneOverview();
        }
    }
    
    openCitySearch() {
        this.showSection('add');
        setTimeout(() => {
            const headerSearchInput = document.getElementById('headerCitySearchInput');
            if (headerSearchInput) {
                headerSearchInput.focus();
            }
        }, 100);
    }
    
    showPopularCities() {
        this.showSection('popular');
    }
    
    showBusinessHours() {
        this.showSection('business');
    }
    
    showTimezoneMap() {
        this.showSection('timezone');
    }
    
    renderCityTiles() {
        const grid = document.getElementById('citiesGrid');
        if (!grid) return;
        
        const citiesToShow = Array.from(this.addedCities).slice(0, 8); // Show max 8 tiles
        
        if (citiesToShow.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🌍</div>
                    <h3>No cities added yet</h3>
                    <p>Add your first city to get started!</p>
                    <button class="action-btn primary" onclick="window.timelyApp.openCitySearch()">Add City</button>
                </div>
            `;
            return;
        }
        
        const html = citiesToShow.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const date = this.getDateForTimezone(city.timezone);
            
            return `
                <div class="city-tile">
                    <div class="city-tile-header">
                        <span class="city-flag">${city.flag}</span>
                        <div class="city-info">
                            <h3>${cityName}</h3>
                            <p>${city.country}</p>
                        </div>
                    </div>
                    <div class="city-time-display">
                        <div class="city-time">${time}</div>
                        <div class="city-date">${date}</div>
                    </div>
                    <div class="city-actions">
                        <button class="action-btn primary" onclick="window.timelyApp.setPrimaryLocation('${cityName}', '${city.timezone}')">
                            Set Primary
                        </button>
                        <button class="action-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    debugLocationSearch(query = 'london') {
        console.log('🔧 Manual debug test starting...');
        
        const searchInput = document.getElementById('locationSearchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        console.log('Element check:', {
            searchInput: !!searchInput,
            suggestionsContainer: !!suggestionsContainer,
            citiesCount: Object.keys(this.countryTimezones).length
        });
        
        if (searchInput) {
            console.log('Search input found, current value:', searchInput.value);
            searchInput.value = query;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        console.log('Testing performLocationSearch directly...');
        this.performLocationSearch(query);
        
        return {
            searchInput: !!searchInput,
            suggestionsContainer: !!suggestionsContainer,
            citiesCount: Object.keys(this.countryTimezones).length
        };
    }
    
    renderBusinessHours() {
        const grid = document.getElementById('businessGrid');
        if (!grid) return;
        
        const businessCities = ['New York', 'London', 'Tokyo', 'Sydney', 'Dubai', 'Singapore'];
        
        const html = businessCities.map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const time = this.getTimeForTimezone(city.timezone);
            const hour = parseInt(time.split(':')[0]);
            const isBusinessHours = hour >= 9 && hour <= 17;
            
            return `
                <div class="business-card">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <span style="font-size: 1.5rem;">${city.flag}</span>
                        <strong>${cityName}</strong>
                    </div>
                    <div style="font-size: 1.2rem; margin: 10px 0;">${time}</div>
                    <span class="business-status ${isBusinessHours ? 'open' : 'closed'}">
                        ${isBusinessHours ? '🟢 Business Hours' : '🔴 After Hours'}
                    </span>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }
    
    renderTimezoneOverview() {
        const overview = document.getElementById('timezoneOverview');
        if (!overview) return;
        
        const timezones = [
            { name: 'Pacific Time', offset: '-8', cities: ['Los Angeles', 'Seattle'] },
            { name: 'Mountain Time', offset: '-7', cities: ['Denver', 'Phoenix'] },
            { name: 'Central Time', offset: '-6', cities: ['Chicago', 'Dallas'] },
            { name: 'Eastern Time', offset: '-5', cities: ['New York', 'Miami'] },
            { name: 'Greenwich Mean Time', offset: '0', cities: ['London', 'Dublin'] },
            { name: 'Central European Time', offset: '+1', cities: ['Paris', 'Berlin'] },
            { name: 'Eastern European Time', offset: '+2', cities: ['Cairo', 'Helsinki'] },
            { name: 'Moscow Time', offset: '+3', cities: ['Moscow', 'Istanbul'] },
            { name: 'Gulf Standard Time', offset: '+4', cities: ['Dubai', 'Abu Dhabi'] },
            { name: 'India Standard Time', offset: '+5', cities: ['Mumbai', 'Delhi'] },
            { name: 'China Standard Time', offset: '+8', cities: ['Beijing', 'Shanghai'] },
            { name: 'Japan Standard Time', offset: '+9', cities: ['Tokyo', 'Osaka'] },
            { name: 'Australian Eastern Time', offset: '+10', cities: ['Sydney', 'Melbourne'] }
        ];
        
        const html = timezones.map(tz => `
            <div class="timezone-card">
                <div class="timezone-offset">${tz.offset}</div>
                <div class="timezone-name">${tz.name}</div>
                <div style="margin-top: 10px; color: #888; font-size: 0.8rem;">
                    ${tz.cities.join(', ')}
                </div>
            </div>
        `).join('');
        
        overview.innerHTML = html;
    }
    
    initializeCitySearch() {
        const headerSearchInput = document.getElementById('headerCitySearchInput');
        if (headerSearchInput) {
            headerSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.addCityToGrid(query);
                        e.target.value = '';
                        
                        const mainContent = document.querySelector('.main-content');
                        if (mainContent) {
                            mainContent.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        }
    }
    
    handleCitySearch(query) {
        if (query.length < 2) {
            this.hideCitySearchSuggestions();
            return;
        }
        
        const suggestions = Object.keys(this.countryTimezones)
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);
        
        this.showCitySearchSuggestions(suggestions);
    }
    
    showCitySearchSuggestions(suggestions) {
        const container = document.getElementById('searchSuggestions');
        if (!container) return;
        
        if (suggestions.length === 0) {
            container.classList.remove('active');
            return;
        }
        
        const html = suggestions.map(cityName => {
            const city = this.countryTimezones[cityName];
            return `
                <div class="suggestion-item" onclick="window.timelyApp.selectCityFromSuggestion('${cityName}')">
                    <span style="font-size: 1.2rem;">${city.flag}</span>
                    <div>
                        <strong>${cityName}</strong>
                        <div style="font-size: 0.8rem; color: #666;">${city.country}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        container.classList.add('active');
    }
    
    hideCitySearchSuggestions() {
        const container = document.getElementById('searchSuggestions');
        if (container) {
            container.classList.remove('active');
        }
    }
    
    selectCityFromSuggestion(cityName) {
        this.addCityToGrid(cityName);
        const headerSearchInput = document.getElementById('headerCitySearchInput');
        if (headerSearchInput) {
            headerSearchInput.value = '';
        }
        this.hideCitySearchSuggestions();
    }
    
    // Feature card methods (placeholders for future implementation)
    openWorldMap() {
        alert('🌍 World Map feature coming soon!');
    }
    
    openMeetingPlanner() {
        alert('📅 Meeting Planner feature coming soon!');
    }
    
    openConverter() {
        alert('🔄 Time Converter feature coming soon!');
    }
    
    removeCityFromGrid(cityName) {
        this.addedCities.delete(cityName);
        this.renderWorldClockCards(); // Use new card interface
    }
    
    renderWorldCities() {
        const container = document.getElementById('worldCitiesGrid');
        if (!container) return;
        
        if (this.addedCities.size === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = Array.from(this.addedCities).map(cityName => {
            const city = this.countryTimezones[cityName];
            if (!city) return '';
            
            const now = new Date();
            const time = this.getTimeForTimezone(city.timezone);
            const date = this.getDateForTimezone(city.timezone);
            
            let clockDisplay = '';
            
            if (this.clockStyle === 'digital' || this.clockStyle === 'both') {
                clockDisplay += `<div class="digital-time">${time}</div>`;
            }
            
            if (this.clockStyle === 'analog' || this.clockStyle === 'both') {
                clockDisplay += this.generateAnalogClock(city.timezone);
            }
            
            return `
                <div class="world-city-item ${this.clockStyle}">
                    <span class="flag">${city.flag}</span>
                    <div class="city-name">${cityName}</div>
                    <div class="clock-container">
                        ${clockDisplay}
                    </div>
                    <div class="city-date">${date}</div>
                    <div class="city-timezone">${this.getTimezoneInfo(city.timezone)}</div>
                    <button class="remove-btn" onclick="window.timelyApp.removeCityFromGrid('${cityName}')">×</button>
                </div>
            `;
        }).join('');
    }
    
    updateWorldCities() {
        this.updateWorldClockCards();
        
        const container = document.getElementById('worldCitiesGrid');
        if (!container) return;
        
        const digitalTimeElements = container.querySelectorAll('.digital-time');
        const dateElements = container.querySelectorAll('.city-date');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city) {
                if (digitalTimeElements[index]) {
                    digitalTimeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                }
                if (dateElements[index]) {
                    dateElements[index].textContent = this.getDateForTimezone(city.timezone);
                }
                
                const analogClocks = container.querySelectorAll('.analog-clock');
                if (analogClocks[index]) {
                    const clockFace = analogClocks[index].querySelector('.clock-face');
                    if (clockFace) {
                        clockFace.innerHTML = this.generateAnalogClockFace(city.timezone);
                    }
                }
            }
        });
    }
    
    updateWorldClockCards() {
        const container = document.getElementById('worldClockCards');
        if (!container) return;
        
        const timeElements = container.querySelectorAll('.current-time');
        const dateElements = container.querySelectorAll('.current-date');
        const timezoneElements = container.querySelectorAll('.timezone-info');
        
        Array.from(this.addedCities).forEach((cityName, index) => {
            const city = this.countryTimezones[cityName];
            if (city && timeElements[index] && dateElements[index] && timezoneElements[index]) {
                timeElements[index].textContent = this.getTimeForTimezone(city.timezone);
                dateElements[index].textContent = this.getDateForTimezone(city.timezone);
                timezoneElements[index].textContent = `UTC${this.getUTCOffset(city.timezone)}`;
            }
        });
    }
    
    generateAnalogClock(timezone) {
        return `
            <div class="analog-clock">
                <div class="clock-face">
                    ${this.generateAnalogClockFace(timezone)}
                </div>
            </div>
        `;
    }
    
    generateAnalogClockFace(timezone) {
        const now = new Date();
        const timeInZone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
        
        const hours = timeInZone.getHours() % 12;
        const minutes = timeInZone.getMinutes();
        const seconds = timeInZone.getSeconds();
        
        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = minutes * 6;
        const secondAngle = seconds * 6;
        
        return `
            <div class="hour-hand" style="transform: rotate(${hourAngle}deg)"></div>
            <div class="minute-hand" style="transform: rotate(${minuteAngle}deg)"></div>
            <div class="second-hand" style="transform: rotate(${secondAngle}deg)"></div>
            <div class="center-dot"></div>
            <div class="hour-markers">
                ${Array.from({length: 12}, (_, i) => 
                    `<div class="marker" style="transform: rotate(${i * 30}deg)"></div>`
                ).join('')}
            </div>
        `;
    }
    
    getTimezoneInfo(timezone) {
        try {
            const now = new Date();
            const timeInZone = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
            const offset = (timeInZone.getTime() - now.getTime()) / (1000 * 60 * 60);
            const offsetInt = Math.round(offset);
            const offsetStr = offsetInt >= 0 ? `+${offsetInt}` : `${offsetInt}`;
            return `UTC${offsetStr}`;
        } catch (error) {
            return 'UTC';
        }
    }
    
    getTimeForTimezone(timezone) {
        try {
            const options = {
                timeZone: timezone,
                hour12: this.timeFormat === '12h',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            if (this.clockStyle === 'digital' || this.clockStyle === 'both') {
                options.second = '2-digit';
            }
            
            return new Date().toLocaleTimeString('en-US', options);
        } catch (error) {
            return '??:??';
        }
    }
    
    getDateForTimezone(timezone) {
        try {
            return new Date().toLocaleDateString('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return '---';
        }
    }
    
    async searchCitiesWithAPI(query) {
        if (!query || query.length < 2) return [];
        
        try {
            console.log(`🔍 Searching for cities with query: "${query}"`);
            
            // First, search our local database
            const localResults = this.searchLocalDatabase(query);
            
            // If we have good local results, use them
            if (localResults.length >= 5) {
                return localResults.slice(0, 10);
            }
            
            // Otherwise, enhance with API results
            const apiResults = await this.searchWithAPIs(query);
            
            const allResults = [...localResults, ...apiResults];
            const uniqueResults = this.deduplicateResults(allResults);
            
            return uniqueResults.slice(0, 10);
            
        } catch (error) {
            console.error('Search error:', error);
            return this.searchLocalDatabase(query).slice(0, 10);
        }
    }
    
    searchLocalDatabase(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            const cityLower = cityName.toLowerCase();
            const countryLower = cityData.country.toLowerCase();
            
            let score = 0;
            
            if (cityLower === normalizedQuery || countryLower === normalizedQuery) {
                score = 100;
            }
            else if (cityLower.startsWith(normalizedQuery) || countryLower.startsWith(normalizedQuery)) {
                score = 80;
            }
            else if (cityLower.includes(normalizedQuery) || countryLower.includes(normalizedQuery)) {
                score = 60;
            }
            
            if (score > 0) {
                results.push({
                    name: cityName,
                    country: cityData.country,
                    timezone: cityData.timezone,
                    flag: cityData.flag,
                    score: score,
                    source: 'local'
                });
            }
        }
        
        // Sort by score, then alphabetically
        return results.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });
    }
    
    async searchWithAPIs(query) {
        const results = [];
        
        try {
            // Use REST Countries API (free, no key required)
            const countryResults = await this.searchCountriesAPI(query);
            results.push(...countryResults);
            
            // Use GeoNames API (free, but rate limited)
            const geoResults = await this.searchGeoNamesAPI(query);
            results.push(...geoResults);
            
        } catch (error) {
            console.warn('API search failed:', error);
        }
        
        return results;
    }
    
    async searchCountriesAPI(query) {
        try {
            // REST Countries API - free and open source
            const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=name,capital,timezones,flag,cca2`);
            
            if (!response.ok) return [];
            
            const countries = await response.json();
            const results = [];
            
            for (const country of countries) {
                if (country.capital && country.capital[0]) {
                    const capital = country.capital[0];
                    const timezone = country.timezones[0] || 'UTC';
                    
                    results.push({
                        name: capital,
                        country: country.name.common,
                        timezone: timezone,
                        flag: country.flag || '🏴',
                        score: 70,
                        source: 'rest_countries_api'
                    });
                }
            }
            
            return results;
            
        } catch (error) {
            console.warn('REST Countries API error:', error);
            return [];
        }
    }
    
    async searchGeoNamesAPI(query) {
        try {
            // GeoNames API - free username: demo (limited requests)
            // For production, register at http://www.geonames.org/login
            const username = 'demo'; // Replace with your username for production
            const response = await fetch(
                `http://api.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=5&featureClass=P&username=${username}`
            );
            
            if (!response.ok) return [];
            
            const data = await response.json();
            const results = [];
            
            if (data.geonames) {
                for (const place of data.geonames) {
                    const timezone = await this.getTimezoneFromCoords(place.lat, place.lng);
                    
                    results.push({
                        name: place.name,
                        country: place.countryName,
                        timezone: timezone,
                        flag: this.getCountryFlag(place.countryCode),
                        score: 60,
                        source: 'geonames_api'
                    });
                }
            }
            
            return results;
            
        } catch (error) {
            console.warn('GeoNames API error:', error);
            return [];
        }
    }
    
    async getTimezoneFromCoords(lat, lng) {
        try {
            const response = await fetch(
                `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=demo`
            );
            
            if (!response.ok) return 'UTC';
            
            const data = await response.json();
            return data.timezoneId || 'UTC';
            
        } catch (error) {
            return 'UTC';
        }
    }
    
    getCountryFlag(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '🏴';
        
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        
        return String.fromCodePoint(...codePoints);
    }
    
    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(result => {
            const key = `${result.name.toLowerCase()}-${result.country.toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    async findCityByNameAsync(searchName) {
        const localResult = this.findCityByName(searchName);
        if (localResult) return localResult;
        
        // If not found locally, try API search
        const apiResults = await this.searchCitiesWithAPI(searchName);
        
        if (apiResults.length > 0) {
            const result = apiResults[0];
            return {
                name: result.name,
                timezone: result.timezone,
                flag: result.flag,
                country: result.country
            };
        }
        
        return null;
    }
    
    findCityByName(searchName) {
        const normalizedSearch = searchName.toLowerCase().trim();
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase() === normalizedSearch) {
                return { name: cityName, ...cityData };
            }
        }
        
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityName.toLowerCase().includes(normalizedSearch) || 
                cityData.country.toLowerCase().includes(normalizedSearch)) {
                return { name: cityName, ...cityData };
            }
        }
        
        return null;
    }
    
    getCityFromTimezone(timezone) {
        for (const [cityName, cityData] of Object.entries(this.countryTimezones)) {
            if (cityData.timezone === timezone) {
                return cityName;
            }
        }
        
        return timezone.split('/').pop().replace(/_/g, ' ');
    }
    
    toggleMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const dropdown = document.getElementById('dropdownMenu');
        
        hamburger.classList.toggle('active');
        dropdown.classList.toggle('active');
        
        if (dropdown.classList.contains('active')) {
            document.addEventListener('click', this.closeMenuOnOutsideClick.bind(this));
        } else {
            document.removeEventListener('click', this.closeMenuOnOutsideClick.bind(this));
        }
    }
    
    closeMenuOnOutsideClick(event) {
        const hamburger = document.getElementById('hamburgerMenu');
        const dropdown = document.getElementById('dropdownMenu');
        
        if (!hamburger.contains(event.target) && !dropdown.contains(event.target)) {
            hamburger.classList.remove('active');
            dropdown.classList.remove('active');
            document.removeEventListener('click', this.closeMenuOnOutsideClick.bind(this));
        }
    }
    
    showSignIn() {
        this.hideAllModals();
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.classList.add('active');
            this.closeMenu();
        }
    }
    
    showSignUp() {
        this.hideAllModals();
        const modal = document.getElementById('signUpModal');
        if (modal) {
            modal.classList.add('active');
            this.closeMenu();
        }
    }
    
    hideSignIn() {
        const modal = document.getElementById('signInModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    hideSignUp() {
        const modal = document.getElementById('signUpModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    switchToSignUp() {
        this.hideSignIn();
        this.showSignUp();
    }
    
    switchToSignIn() {
        this.hideSignUp();
        this.showSignIn();
    }
    
    hideAllModals() {
        const modals = ['signInModal', 'signUpModal', 'locationPickerOverlay'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    closeMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const dropdown = document.getElementById('dropdownMenu');
        
        if (hamburger) hamburger.classList.remove('active');
        if (dropdown) dropdown.classList.remove('active');
        document.removeEventListener('click', this.closeMenuOnOutsideClick.bind(this));
    }
    
    openWorldMap() {
        this.closeMenu();
        alert('🌍 World Map feature coming soon! This will show an interactive timezone map.');
    }
    
    openMeetingPlanner() {
        this.closeMenu();
        alert('📅 Meeting Planner feature coming soon! This will help you find the best meeting times across timezones.');
    }
    
    openConverter() {
        this.closeMenu();
        alert('🔄 Time Converter feature coming soon! This will convert times between different timezones.');
    }
    
    openTimezones() {
        this.closeMenu();
        alert('🕐 Timezone Explorer feature coming soon! This will show detailed timezone information.');
    }
    
    openAlarms() {
        this.closeMenu();
        alert('⏰ Alarms feature coming soon! This will let you set world time alarms.');
    }
    
    toggleTimeFormat() {
        this.timeFormat = this.timeFormat === '12h' ? '24h' : '12h';
        localStorage.setItem('timely-time-format', this.timeFormat);
        
        // Update button text
        const formatText = document.getElementById('formatText');
        if (formatText) {
            formatText.textContent = this.timeFormat === '12h' ? '12H' : '24H';
        }
        
        this.renderWorldClockCards();
        this.updateAllTimes();
        this.showNotification(`Switched to ${this.timeFormat === '12h' ? '12-hour' : '24-hour'} format`, 'success');
    }
    
    openSettings() {
        this.closeMenu();
        alert('⚙️ Settings feature coming soon! This will provide customization options.');
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

function addCityFromSearch() {
    const input = document.getElementById('searchInput');
    const city = input.value.trim();
    if (city && window.timelyApp) {
        window.timelyApp.addCityToGrid(city);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting Timely with Open Source APIs...');
        window.timelyApp = new SimpleTimelyApp();
        await window.timelyApp.init();
        
        setupAuthForms();
        
    } catch (error) {
        console.error('Failed to initialize Timely:', error);
    }
});

// Performance-optimized authentication handlers
function setupAuthForms() {
    document.addEventListener('DOMContentLoaded', () => {
        setupFormHandlers();
        setupGoogleButtons();
    });
}

function setupFormHandlers() {
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        // Add real-time validation
        const inputs = signUpForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', debounce(clearFieldError, 300));
        });
        
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(signUpForm);
            const userData = {
                name: formData.get('signUpName')?.trim() || document.getElementById('signUpName').value,
                email: formData.get('signUpEmail')?.trim() || document.getElementById('signUpEmail').value,
                password: formData.get('signUpPassword') || document.getElementById('signUpPassword').value,
                confirmPassword: formData.get('confirmPassword') || document.getElementById('confirmPassword').value
            };
            
            const agreeTerms = document.getElementById('agreeTerms')?.checked;
            if (!agreeTerms) {
                showAuthMessage('❌ Please agree to the Terms of Service and Privacy Policy.', 'error');
                return;
            }
            
            // Client-side validation before sending
            if (!validateForm(signUpForm)) {
                return;
            }
            
            setFormLoading('signup', true);
            
            try {
                const result = await window.timelyAuth.signUp(userData);
                
                if (result.success) {
                    showAuthMessage('🎉 Account created successfully! Welcome to Timely!', 'success');
                    window.timelyApp.hideSignUp();
                    await updateUIAfterAuth();
                } else {
                    showAuthMessage(`❌ ${result.error}`, 'error');
                }
            } catch (error) {
                showAuthMessage('❌ Network error. Please check your connection.', 'error');
                console.error('Signup error:', error);
            }
            
            setFormLoading('signup', false);
        });
    }
    
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        // Add real-time validation
        const inputs = signInForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', debounce(clearFieldError, 300));
        });
        
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(signInForm);
            const credentials = {
                email: formData.get('signInEmail')?.trim() || document.getElementById('signInEmail').value,
                password: formData.get('signInPassword') || document.getElementById('signInPassword').value,
                rememberMe: formData.get('rememberMe') === 'on' || document.getElementById('rememberMe')?.checked
            };
            
            // Client-side validation
            if (!validateForm(signInForm)) {
                return;
            }
            
            setFormLoading('signin', true);
            
            try {
                const result = await window.timelyAuth.signIn(credentials);
                
                if (result.success) {
                    showAuthMessage('👋 Welcome back! Signed in successfully!', 'success');
                    window.timelyApp.hideSignIn();
                    await updateUIAfterAuth();
                } else {
                    showAuthMessage(`❌ ${result.error}`, 'error');
                }
            } catch (error) {
                showAuthMessage('❌ Network error. Please check your connection.', 'error');
                console.error('Signin error:', error);
            }
            
            setFormLoading('signin', false);
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('auth-modal-overlay')) {
            window.timelyApp.hideAllModals();
        }
    });
}

function setupGoogleButtons() {
    window.addEventListener('load', () => {
        const googleSignInBtns = document.querySelectorAll('.google-btn[onclick*="signInWithGoogle"]');
        const googleSignUpBtns = document.querySelectorAll('.google-btn[onclick*="signUpWithGoogle"]');
        
        googleSignInBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.signInWithGoogle) {
                    window.signInWithGoogle();
                } else {
                    showAuthMessage('❌ Google Sign-In is loading. Please try again in a moment.', 'warning');
                }
            });
        });
        
        googleSignUpBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.signUpWithGoogle) {
                    window.signUpWithGoogle();
                } else {
                    showAuthMessage('❌ Google Sign-In is loading. Please try again in a moment.', 'warning');
                }
            });
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
            }
            break;
        case 'password':
            if (field.name === 'signUpPassword' && value && value.length < 8) {
                showFieldError(field, 'Password must be at least 8 characters');
            }
            if (field.name === 'confirmPassword') {
                const password = field.form.querySelector('input[name="signUpPassword"], input[id="signUpPassword"]').value;
                if (value && value !== password) {
                    showFieldError(field, 'Passwords do not match');
                }
            }
            break;
        case 'text':
            if (field.name === 'signUpName' && value && value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
            }
            break;
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="password"]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && !value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
            return;
        }
        
        if (input.type === 'password' && input.name === 'signUpPassword' && value && value.length < 8) {
            showFieldError(input, 'Password must be at least 8 characters');
            isValid = false;
            return;
        }
        
        if (input.name === 'confirmPassword' && value) {
            const password = form.querySelector('input[name="signUpPassword"], input[id="signUpPassword"]').value;
            if (value !== password) {
                showFieldError(input, 'Passwords do not match');
                isValid = false;
                return;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setFormLoading(formType, isLoading) {
    const form = formType === 'signup' ? document.getElementById('signUpForm') : document.getElementById('signInForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('.auth-submit-btn');
    if (!submitBtn) return;
    
    if (isLoading) {
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = formType === 'signup' ? 'Creating Account...' : 'Signing In...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.textContent = submitBtn.dataset.originalText || (formType === 'signup' ? 'Create Account' : 'Sign In');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

async function updateUIAfterAuth() {
    if (window.timelyAuth) {
        window.timelyAuth.updateAuthUI(window.timelyAuth.isLoggedIn());
    }
    
    // Update timezone list with user's saved clocks
    const user = window.timelyAuth?.getCurrentUser();
    if (user?.profile?.worldClocks?.length > 0) {
        // Add user's saved world clocks to the display
        user.profile.worldClocks.forEach(clock => {
            if (!document.querySelector(`[data-timezone="${clock.timezone}"]`)) {
                window.timelyApp.addCityToGrid(clock.name);
            }
        });
    }
    
    if (user?.profile?.preferences) {
        if (user.profile.preferences.format24h) {
            window.timelyApp.use24HourFormat = true;
        }
        if (user.profile.theme) {
            window.timelyApp.setTheme(user.profile.theme);
        }
    }
    
    // Smooth fade-in effect
    document.body.style.opacity = '0.8';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 300);
}

function showAuthMessage(message, type = 'info') {
    let messageEl = document.getElementById('authMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'authMessage';
        messageEl.className = 'auth-message';
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type} show`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}
