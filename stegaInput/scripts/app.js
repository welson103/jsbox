function sayHello() {
  $ui.alert($l10n('HELLO_WORLD'));
}

module.exports = {
  //外部调用api名称(自定义)：本地函数名,
  sayHello1: sayHello,
  sayHello2: sayHello,
}
