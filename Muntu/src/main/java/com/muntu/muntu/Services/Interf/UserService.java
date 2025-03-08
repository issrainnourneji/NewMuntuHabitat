package com.muntu.muntu.Services.Interf;

import com.muntu.muntu.Dto.LoginRequest;
import com.muntu.muntu.Dto.Response;
import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response registerAgent(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getLoginUser();
    Response getUserInfo();


}
