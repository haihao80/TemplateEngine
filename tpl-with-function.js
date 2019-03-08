// function tpl(str, data) {
//   const tplStr = str.replace(/\n/g, '')
//      .replace(/{{(.+?)}}/g, (match, p) => `' + ${p} + '`)
//      .replace(/{@(.+?)@}/g, (match, p) => ` '; ${p} tpl += '`);
//   print(tplStr)
//   return new Function('data', `let tpl=' ${tplStr}'; return tpl;`)(data);
// }


class Tpl {
  constructor(config) {
    const defaultConfig = {
      signs: {
        varSign: ['{{', '}}'],
        evalSign: ['{@', '@}'],
        commentSign: ['<!--', '-->'],
        noCommentSign: ['{#', '#}']
      }
    }
    this.config = Object.assign({}, defaultConfig, config);
    Object.keys(this.config.signs).forEach(key => {
      this.config.signs[key].splice(1, 0, '(.+?)');
      this.config.signs[key] = new RegExp(this.config.signs[key].join(''), 'g');
    })
  }

  _compile(str, data) {
    console.log9
    const tplStr = str.replace(/\n/g, '')
    //注释
     .replace(this.config.signs.noCommentSign, '')
     .replace(this.config.signs.commentSign, (match, p) => {
        const exp = p.replace(/[\{\}\<\>]/g, match => `&*&${match.charCodeAt()}&*&`)
        return `'+'<!--${exp}-->'+'`
     })
     .replace(this.config.signs.varSign, (match, p) => `' + ${p} + '`)
     .replace(this.config.signs.evalSign, (match, p) => {
       return ` '; ${p} tpl += '`
      })
      .replace(/\&\*\&(.+?)\&\*\&/g, (match, p) => {
        console.log(p,String.fromCharCode(p))
        String.fromCharCode(p);
      });
      console.log(tplStr)
    return new Function('data', `let tpl=' ${tplStr}'; return tpl;`)(data);
  }
  compile(str, data) {
    return this._compile(str, data);
  }
}

function tpl(config) {
  return new Tpl(config);
}