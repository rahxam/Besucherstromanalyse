service TestService @(requires : 'test') {
  action reset();
  entity Auth {
    dummy : String;
  }
}
