enum ResponseCode {
    //200
    SUCCESS = "SU",

    //400
    VALIDATION_FAILED = "VF",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TELNUMBER = "DT",
    NON_EXISTENT_USER = "NEU",
    NON_EXISTENT_POST = "NEP",
    NON_EXISTENT_COMMENT = "NEC",

    //401
    LOGIN_FAILED = "LF",
    AUTHENTICATION_FAILED = "AF",
    
    //403
    NO_PERMISSION = "NP",

    //500
    DATABASE_ERROR = "DBE",
}

export default ResponseCode;