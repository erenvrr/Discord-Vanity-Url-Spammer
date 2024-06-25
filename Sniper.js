const fetch = require('node-fetch');
const chalk = require('chalk');
const fs = require('fs');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

class Sniper {
  constructor(options) {
    this.guildId = ''; //server id to get vanity url from
    this.tokenPosition = 0;
    this.snipped = false;
    this.interval = 10000; //YOU WILL WRITE MS HERE FOR EXAMPLE 1 SECOND 1000 IF YOU WRITE MS 1000 IT WILL TRY IT EVERY 1 SECOND

    this.tokens = this.loadTokensFromTxt('tokens.txt');
    this.checkLicense();
  }

  loadTokensFromTxt(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data.split('\n').map((token) => token.trim()).filter(Boolean);
    } catch (err) {
      console.error(`Error reading tokens from '${filePath}':`, err);
      return [];
    }
  }

  checkLicense = async () => {
    console.clear();
    this.start();
  };

  start = async () => {
    console.clear();
    console.log(chalk.red.bold('') + chalk.red.bold() + '' + chalk.red.bold('Ms Accuracy') + chalk.red.bold(':') + chalk.red.bold(` ${this.interval}ms`));
    console.log('\x1b[31m%s\x1b[0m', '                                -----------------------                           \n');
    console.log('\x1b[31m%s\x1b[0m', '                              This Tool Has Made By erenvr                                         \n');
    console.log('\x1b[31m%s\x1b[0m', '                                -----------------------                           \n');
    console.log('\x1b[31m%s\x1b[0m', '                                WELCOME TO SPAMMER V1                           \n');
    console.log('\x1b[31m%s\x1b[0m', '                                -----------------------                           \n');
    console.log('\x1b[31m%s\x1b[0m', '                              Welcome To : discord.gg/vrshop                        \n');
    console.log('\x1b[31m%s\x1b[0m', '                                -----------------------                           \n');

    while (!this.snipped) {
      this.snipe();
      await this.sleep(this.interval);
    }

    process.exit();
  };

  snipe = async () => {
    for (let [key, vanity] of Object.entries([''])) { //vanity url will come here
      let date = Date.now();
      let currentToken = this.token;

      const response = await fetch(`https://discord.com/api/v7/guilds/${this.guildId}/vanity-url`, {
        "credentials": "include",
        "headers": {
          "accept": "*/*",
          "authorization": `${currentToken}`,
          "Content-Type": "application/json",
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({
          "code": vanity
        }),
        "method": "PATCH",
        "mode": "cors"
      });

      const json = await response.json();
      if (json?.code === 50001) {
        return console.log(chalk.red.bold("") + chalk.red.bold + ' - ' + chalk.red.bold('Vanity') + chalk.red.bold("|") + " " + chalk.red.bold(""));
      }

      if (json?.errors?.code?._errors[0]?.code === 'no bro') {
        return console.log(chalk.red.bold("") + chalk.red.bold + ' - ' + chalk.red.bold('Vanity') + chalk.red.bold("|") + " " + chalk.red.bold(""));
      }

      if (json?.errors?.code?._errors[0]?.code) {
        return console.log(chalk.red.bold("") + chalk.red.bold + ' - ' + chalk.red.bold('ERROR') + chalk.red.bold("|") + " " + chalk.red.bold(json?.errors?.code?._errors[0]?.message));
      }

      if (json?.code === 0) {
        return console.log(chalk.red.bold("") + chalk.red.bold() + '' + chalk.red.bold('FAILED') + chalk.red.bold("") + " " + chalk.red.bold(''));
      }

      if (json.code === vanity) {
        console.log(chalk.red.bold(chalk.red.bold`` + 'VANITY CLAIMED!') + ' - ' + ' { ' + chalk.red.bold(vanity) + ' } ', chalk.red.bold`${(Date.now() - date) / 100000}s`);
        setTimeout(() => {
          return this.snipped = true;
        }, 100);

        return this.snipped = false;
      } else {
        if (json.retry_after) {
        } else if (json.code == 50020) {
          console.log(chalk.red.bold`` + chalk.red.bold("[+] ") + '  -  ' + chalk.red.bold() + '' + '' + '[' + chalk.red.bold(vanity) + ']');
        }
      }
    }
  };

  getCooldown = (cooldown) => {
    const time = parseInt(cooldown - Date.now());
    const pretty = this.prettyMs(time * 1000);
    return pretty;
  };

  pluralize = (word, count) => count === 1 ? word : `${word}s`;

  prettyMs = (milliseconds, options = {}) => {
    if (!Number.isFinite(milliseconds)) {
        throw new TypeError('Expected a finite number');
    }

    if (options.colonNotation) {
        options.compact = false;
        options.formatSubMilliseconds = false;
        options.separateMilliseconds = false;
        options.verbose = false;
    }

    if (options.compact) {
        options.secondsDecimalDigits = 0;
        options.millisecondsDecimalDigits = 0;
    }

    const result = [];

    const floorDecimals = (value, decimalDigits) => {
        const floowhiteInterimValue = Math.floor((value * (10 ** decimalDigits)) + 0.0000001);
        const floowhiteValue = Math.round(floowhiteInterimValue) / (10 ** decimalDigits);
        return floowhiteValue.toFixed(decimalDigits);
    };

    const add = (value, long, short, valueString) => {
        if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === 'm')) {
            return;
        }

        valueString = (valueString || value || '0').toString();
        let prefix;
        let suffix;
        if (options.colonNotation) {
            prefix = result.length > 0 ? ':' : '';
            suffix = '';
            const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length;
            const minLength = result.length > 0 ? 2 : 1;
            valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString;
        } else {
            prefix = '';
            suffix = options.verbose ? ' ' + this.pluralize(long, value) : short;
        }

        result.push(prefix + valueString + suffix);
    };

    const parsed = parseMilliseconds(milliseconds);

    function parseMilliseconds(milliseconds) {
        if (typeof milliseconds !== 'number') {
            throw new TypeError('Expected a number');
        }

        const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

        return {
            days: roundTowardsZero(milliseconds / 86400000),
            hours: roundTowardsZero(milliseconds / 3600000) % 24,
            minutes: roundTowardsZero(milliseconds / 60000) % 60,
            seconds: roundTowardsZero(milliseconds / 1000) % 60,
            milliseconds: roundTowardsZero(milliseconds) % 1000,
            microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
            nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
        };
    }

    add(Math.trunc(parsed.days / 365), 'année', 'y');
    add(parsed.days % 365, 'jour', 'd');
    add(parsed.hours, 'heure', 'h');
    add(parsed.minutes, 'minute', 'm');

    if (
        options.separateMilliseconds ||
        options.formatSubMilliseconds ||
        (!options.colonNotation && milliseconds < 1000)
    ) {
        add(parsed.seconds, 'seconde', 's');
        if (options.formatSubMilliseconds) {
            add(parsed.milliseconds, 'milliseconde', 'ms');
            add(parsed.microseconds, 'microseconde', 'µs');
            add(parsed.nanoseconds, 'nanoseconde', 'ns');
        } else {
            const millisecondsAndBelow =
                parsed.milliseconds +
                (parsed.microseconds / 1000) +
                (parsed.nanoseconds / 1e6);

            const millisecondsDecimalDigits =
                typeof options.millisecondsDecimalDigits === 'number' ?
                    options.millisecondsDecimalDigits :
                    0;

            const roundedMiliseconds = millisecondsAndBelow >= 1 ?
                Math.round(millisecondsAndBelow) :
                Math.ceil(millisecondsAndBelow);

            const millisecondsString = millisecondsDecimalDigits ?
                millisecondsAndBelow.toFixed(millisecondsDecimalDigits) :
                roundedMiliseconds;

            add(
                Number.parseFloat(millisecondsString, 10),
                'millisecond',
                'ms',
                millisecondsString
            );
        }
    } else {
        const seconds = (milliseconds / 1000) % 60;
        const secondsDecimalDigits =
            typeof options.secondsDecimalDigits === 'number' ?
                options.secondsDecimalDigits :
                1;
        const secondsFixed = floorDecimals(seconds, secondsDecimalDigits);
        const secondsString = options.keepDecimalsOnWholeSeconds ?
            secondsFixed :
            secondsFixed.replace(/\.0+$/, '');
        add(Number.parseFloat(secondsString, 10), 'seconde', 's', secondsString);
    }

    if (result.length === 0) {
        return '0' + (options.verbose ? ' milliseconds' : 'ms');
    }

    if (options.compact) {
        if (result.length >= 3) return result.slice(0, 2).join(' et ');
        else return result[0];
    }

    if (typeof options.unitCount === 'number') {
        const separator = options.colonNotation ? '' : ' ';
        return result.slice(0, Math.max(options.unitCount, 1)).join(separator);
    }

    return options.colonNotation ? result.join('') : result.join(' ');
}


  sleep = (interval) => {
    return new Promise(resolve => setTimeout(resolve, interval));
  };

  get token() {
    if (this.tokenPosition > this.tokens.length - 1) this.tokenPosition = 0;
    const token = this.tokens[this.tokenPosition];
    this.tokenPosition++;
    return token;
  }

  get time() {
    return require("moment-timezone").tz(Date.now(), "Europe/Paris").format("HH:mm:ss");
  }
}

module.exports = Sniper;