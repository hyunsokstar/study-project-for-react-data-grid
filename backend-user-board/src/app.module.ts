// import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { UsersModel } from "./users/entities/users.entity";
import { APP_FILTER } from "@nestjs/core";
import { TypeORMExceptionFilter } from "./filters/exceptions.filter";
import { ConfigModule } from '@nestjs/config';
import { UserPostingsModel } from "./postings/entities/user_postings.entity";
import { PostingsModule } from './postings/postings.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from "./middlewares/AuthMiddleware";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "userAdminBoard",
      entities: [UsersModel, UserPostingsModel],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 사용할 수 있도록 설정
      envFilePath: '.env', // 환경 변수 파일 경로 지정
    }),
    UsersModule,
    PostingsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
  ],
})
// export class AppModule { }

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // 사용할 미들웨어
      // .forRoutes('/users/login-check-by-accessToken'); // 적용할 경로 설정
      .forRoutes('*'); // 적용할 경로 설정
  }
}
