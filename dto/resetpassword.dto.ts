
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";


export class ResetPasswordDto {

  @IsString()
  resetToken: string;


  @IsString()
  @IsNotEmpty()
  @Matches(
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Weak password' },
    )
  @ApiProperty()
  @IsString()
  @Length(8)
  newPassword: string;
}
