function Config(env) {
    if (env == 'development') {
        this.proxyHost =  "http://localhost/experigen_proxy/pass?url=";
        this.baseURL = "http://localhost/experigen/";
    } else if (env == 'production') {
        this.proxyHost =  "http://phonetics.fas.harvard.edu/experigen_proxy/pass?url=";
        this.baseURL = "http://phonetics.fas.harvard.edu/experigen/";
    }
    this.proxyURL = this.proxyHost + this.baseURL;
    this.experiment = "French";
    this.title = "French Questionaire"
    this.databaseHost = "";
}

var env = (window.location.host == 'localhost') ? 'development' : 'production';
CONFIG = new Config(env);