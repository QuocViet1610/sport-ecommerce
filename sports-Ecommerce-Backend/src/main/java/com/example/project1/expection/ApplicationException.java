package com.fft.springAPI.exception;


import com.fft.springAPI.models.enums.ErrorCodeEnum;
import com.fft.springAPI.locale.Translator;
import lombok.Getter;

@Getter
public class ApplicationException extends RuntimeException {

  private final ErrorCodeEnum code;
  private final transient Object[] args;

  public ApplicationException(ErrorCodeEnum code, Object... args) {
    super(Translator.toMessage(code, args));
    this.code = code;
    this.args = args;
  }
}
