 function tpl(str, data) {
  const reg = /{{([a-zA-Z$_][a-zA-Z0-9$_\.]*)}}/g;
  return str.replace(reg, function(match, p) {
    let array = p.split('.');//data a
    print(array)
    let result = data;
    while(array.length) {
      result = result[ array.shift() ];
    }
    return String(result) || match;
  });
 }