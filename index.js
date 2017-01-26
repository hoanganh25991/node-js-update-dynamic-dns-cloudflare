const publicIp = require('public-ip');
const config = require('./config');

const default_record = {
        type: 'A',
        name: 'recordName',
        content: 'url'
    };

async function updateRecord(config, record) {
	if(typeof record !== 'object') throw record;

 
	let ip = await publicIp.v4().then(ip => ip);

	record.content = ip;

	//merge default_record with user define
	Object
		.keys(default_record)
		.forEach(key => {
			if(record[key] == undefined) record[key] = default_record[key];
		});

    let options = {
        method: 'PUT',
        url: `https://api.cloudflare.com/client/v4/zones/${config['zone-id']}/dns_records/23e11649dfbc2b3825ee02191e4a88df`,
        headers: {
            'postman-token': 'c84994a6-7d2d-4941-f6ad-451e74d7a631',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'x-auth-key': config['x-auth-key'],
            'x-auth-email': config['x-auth-email']
        },
        body: record,
        json: true
    };
    
    let request = require("request");

    request(options, (error, response, body) => {
        if (error) throw new Error(error);
        
        console.log(body);
    });
}

// updateRecord(config, 'hoanganh25991');
// updateRecord(config, {type: 'A', name: 'auto-home'});
const one_day = 86400000;
//auto renew each day
setTimeout(updateRecord(config, {type: 'A', name: 'auto-home'}), one_day);