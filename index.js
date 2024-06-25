const Sniper = require('./Sniper');

new Sniper({
    guildId: 'BURAYA DA ID GELECEK',
});

    process.on('unhandledRejection', (reason, p) => {
    console.log(reason.stack ? reason.stack : reason)
    return;
    
    });
    process.on("uncaughtException", (err, origin) => {
    console.log(err.stack ? err.stack : err)
    return;
    
    }) 
    process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err.stack ? err.stack : err)
    return;
    });
    