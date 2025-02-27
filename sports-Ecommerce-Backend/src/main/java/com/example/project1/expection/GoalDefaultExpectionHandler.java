package com.example.project1.expection;
import com.example.project1.local.Translator;
import com.example.project1.model.dto.ResponseResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpServerErrorException;

@Slf4j
@RestControllerAdvice
public class GoalDefaultExpectionHandler {

    @ExceptionHandler(value = HttpServerErrorException.InternalServerError.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseResult<String> handleInternalException() {
        return ResponseResult.errorServer(Translator.toMessage("common.server.internal"));
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseResult<String> defaultExceptionHandler(Exception e) {
        log.error(e.getMessage(), e);
        return ResponseResult.errorServer(Translator.toMessage("common.server.internal"));
    }

    @ExceptionHandler({ValidateException.class})
    public ResponseResult<String> handleValidateException(ValidateException exception) {
        return ResponseResult.ofFail(Translator.toMessage(exception.getMessage()));
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ResponseResult<String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        String message = "Invalid request";
        try {
            message = Translator.toMessage(exception.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        } catch (Exception ignore) {
        }
        return ResponseEntity.badRequest().body(ResponseResult.ofFail(message));
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseResult<String> handleAccessDeniedException() {
        return ResponseResult.ofFail(Translator.toMessage("error.user.granted_role.not_exist"));
    }

}
