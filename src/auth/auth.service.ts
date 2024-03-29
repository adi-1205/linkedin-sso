import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Response } from 'express';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User) private UserModel: typeof User,
    private jwtService: JwtService
  ) { }

  async callback(res: Response, code) {

    const redirect_uri = "http://localhost:3000/auth/callback";
    const access_token_url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${process.env.LINKEDIN_CLIENT_ID}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}`;
    const res_token = await axios.post(access_token_url)
    let access_token = res_token.data.access_token;

    const user_info_url = `https://api.linkedin.com/v2/userinfo`;
    let user_info
    if (access_token) {
      const res_user_info = await axios
        .get(user_info_url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      user_info = res_user_info.data;
    } else {
      throw new InternalServerErrorException('Something went wrong(: access)')
    }

    if (user_info) {
      let [user, created] = await this.UserModel.findOrCreate({
        where: { email: user_info.email, with_linkedin: true },
        defaults: {
          email: user_info.email,
          with_linkedin: true
        }
      })

      let token = this.jwtService.sign({ id: user.id },{secret:process.env.JWT_SECRET})
      res.cookie('auth', token)
      return 'Cookie set'
    }
    else {
      throw new InternalServerErrorException('Can not fetch details(: linkedin)')
    }
  }
}
