    
    const SteamUser         = require('steam-user');
    const SteamTOTP         = require('steam-totp');
    const SteamCommunity    = require('steamcommunity');
    const rl                = require('readline-sync');

    const config            = require('./cfg.json');

    const client            = new SteamUser();
    const community         = new SteamCommunity();

    const INTERVAL  = 10 * 60 * 1000; 


    function Login () {client.logOn({"accountName": config.username,"password": config.password})};

    client.on('steamGuard', function (domain, callback) {
        if (config.totp) {
            callback(SteamTOTP.generateAuthCode(config.totp));
        } else {
            let a = rl.question('Steam guard code: ');
            callback(a);
        };
    });

    client.on('error', (err) => {
        console.log(err);
        client.logOff(); // Avoiding ERROR: Logged on, Cannot log on again.
        setInterval(() => { login() }, INTERVAL );
    })

    client.on('loggedOn', function (details) {

        console.log(`Connected to steam as ${client.steamID.getSteamID64()}`);

        client.setPersona(SteamUser.EPersonaState.Online);
        client.gamesPlayed(config.games);

    });

    client.on('webSession', (cookies) => { 
        community.setCookies(cookies);
    });
