const fs = require('fs');
const tinycolor = require('tinycolor2');
const yaml = require('js-yaml');

const withAlphaType = new yaml.Type('!alpha', {
    kind: 'sequence',
    construct: (data) => {
        return data[0] + data[1];
    },
    represent: (data) => {
        return [ data[0], data[1] ];
    }
});
const schema = yaml.Schema.create([ withAlphaType ]);
const standard = fs.readFileSync(`${__dirname}/src/Lucario-color-theme.yml`, 'utf8');

yamlObj = yaml.load(standard, { schema });

yamlObj.colors = Object.keys(yamlObj.colors).reduce((obj, key) => {
    if (yamlObj.colors[key] === null) {
        return obj;
    }
    return Object.assign({}, obj, { [key]: yamlObj.colors[key] });
}, {});

const brightColors = [ ...yamlObj.lucario.ansi, ...yamlObj.lucario.brightOther ];

const soft = standard.replace(/'(#[0-9A-Z]{6})/g, (match, hex) => {
    if (brightColors.indexOf(hex) > -1) {
        return `'${tinycolor(hex).desaturate(20).toHexString()}`;
    }
    return `'${tinycolor(hex).toHexString()}`;
});

fs.writeFileSync(`${__dirname}/theme/Lucario-color-theme.json`, JSON.stringify(yaml.load(standard, { schema }), null, 4));