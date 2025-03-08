package com.muntu.muntu.Mapper;

import com.muntu.muntu.Dto.UserDto;
import com.muntu.muntu.Entity.User;
import org.springframework.stereotype.Component;


@Component
public class EntityDtoMapper {
    public UserDto mapUserToDtoBasic(User user){
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().name());
        userDto.setName(user.getName());
        userDto.setAddress(user.getAddress());
        return userDto;

    }


}
