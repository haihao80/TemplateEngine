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
        endEvalSign: ['{/@', '@}'],
        commentSign: ['<!--', '-->'],
        noCommentSign: ['{#', '#}']
      },
      syntax: false
    }
    this.config = Object.assign({}, defaultConfig, config);
    Object.keys(this.config.signs).forEach(key => {
      this.config.signs[key].splice(1, 0, '(.+?)');
      this.config.signs[key] = new RegExp(this.config.signs[key].join(''), 'g');
    })
  }

  _syntax(str) {
    const arr = str.trim().split(/\s+/);
    let exp = str;
    if(arr[0] == 'if') {
      exp = `if (${arr.slice(1).join(' ')}) {`;
    }
    else if(arr[0] == 'elif') {
      exp = `} else if ( ${arr.slice(1).join(' ')} ) {`
    }
    else if(arr[0] == 'else') {
      exp = '} else {'
    }
    else if(arr[0] == 'each') {
      exp = `for(let index=0, len=${arr[1].length}; index<len; index++) {
        let item = ${arr[1]}[index];
        `
    }
    return exp;
  }

  _compile(str, data) {
    console.log9
    const tplStr = str.replace(/\n/g, '')
    //commment no displsy
     .replace(this.config.signs.noCommentSign, '')
     //display comment
     .replace(this.config.signs.commentSign, (match, p) => {
        const exp = p.replace(/[\{\}\<\>]/g, match => `&*&${match.charCodeAt()}&*&`)
        return `'+'<!--${exp}-->'+'`
     })
     //variable
     .replace(this.config.signs.varSign, (match, p) => `' + (${p}) + '`)
     //syntax
     .replace(this.config.signs.evalSign, (match, p) => {
       let exp = p.replace('&lt;', '<').replace('&gt;', '>');
       exp = this.config.syntax ? this._syntax(exp) : exp;
       return ` '; ${exp} tpl += '`;
      })
      //end syntax tag
      .replace(this.config.signs.endEvalSign, (match) => {
        return `'} tpl += '`
      })
      //recover syntax in comment
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
