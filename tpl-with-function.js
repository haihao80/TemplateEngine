function tpl(str, data) {
  const tplStr = str.replace(/\n/g, '')
     .replace(/{{(.+?)}}/g, (match, p) => `' + ${p} + '`)
     .replace(/{@(.+?)@}/g, (match, p) => ` '; ${p} tpl += '`);
  print(tplStr)
  return new Function('data', `let tpl=' ${tplStr}'; return tpl;`)(data);
}