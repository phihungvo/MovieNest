package carevn.luv2code.MovieNest.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

     String email;

     String address;

     String phone_number;

     String profile_picture;

     String bio;

}
