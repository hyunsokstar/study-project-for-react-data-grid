import { Injectable, NestMiddleware, Res } from '@nestjs/common';
import { Request, Response } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly configService: ConfigService
    ) { }

    use(req: Request, res: any, next: Function) {
        const accessTokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
        console.log("accessTokenSecret : ", accessTokenSecret);

        // console.log("미들웨어 실행 확인 ");

        // 헤더에서 토큰 추출
        const authHeader = req.headers['authorization'];
        console.log("authHeader : ", authHeader);

        let token: string;
        token = authHeader && authHeader.split(' ')[1];
        console.log("token : ", token);

        if (!token) {
            // 토큰이 없을 경우 다음 핸들러로 요청을 넘깁니다.
            console.log("token 이 없음 ㅋㅋ ");

            return next();
        }

        try {
            const decoded = jwt.verify(token, accessTokenSecret);
            // 검증된 토큰에서 사용자 정보 설정
            console.log("decoded : ", decoded);

            req['user'] = {
                id: decoded['id'],
                email: decoded['email']
            };


            console.log("req['user'] ::: ", req['user']);

        } catch (error) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        next();
    }

}