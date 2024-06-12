class ApiResponse {
    constructor(code, success, message, data) {
        this.code = code;
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static success(code, message = 'Operation successful',data) {
        return new ApiResponse(code, 'success', message, data);
    }

    static error(code,message = 'Operation failed', data = null) {
        return new ApiResponse(code, 'failed', message, data);
    }
}

export default ApiResponse;
