export const en: AppMessage = {
    OK: "Ok",
    SERVER_ERROR: "Server could not handle the request",
    USER_UNAUTHENTICATED: "Unauthenticated",
    PASSWORD_LENGTH: "Password must be at least eight characters",
    USER_INVALID_ID: "User Id is not found",
    USER_DATA_NOT_VALID: "User Data is not valid",
    USER_CREATE_SUCCESS: "User created successfully",
    USER_CREATE_FAILED: "User creation failed",
    USER_GET_ALL_SUCCESS: "User(s) retrieved successfully",
    USER_GET_ONE_SUCCESS: "User retrieved successfully",
    USER_DELETE_SUCCESS: "User deleted successfully",
    USER_EMAIL_EXIST: "Email already exist",
    CREDENTIAL_NOT_MATCH: "Credentials not matched", 
};


interface AppMessage {
    [key: string]: string;
}