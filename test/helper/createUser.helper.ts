import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@src/entities";
import { EntityManager } from "typeorm";

export const createUser = async (manager: EntityManager, user: Partial<UserEntity> = {}) => {
    const {
        email = faker.internet.email(),
        firstName,
        lastName,
        password = faker.internet.password()
    } = user
    const jwtService = new JwtService({ secret: process.env.JWT_SECRET_KEY ,
        signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME
      }});
      console.log(process.env.JWT_SECRET_KEY);
    try {
        let getUser = await manager.findOne(UserEntity, { where: { email } })
        let userEntity
        if (!getUser) {
            userEntity = manager.create(UserEntity, {
                firstName: firstName ? firstName : faker.lorem.word(),
                lastName: lastName ? lastName : faker.lorem.word(),
                email,
                password
            })
            await manager.save<UserEntity>(userEntity)
        }
        const token = await jwtService.sign({ id: userEntity.id, username: user.firstName},{
        })
        return {
            token,
            user: userEntity
        }

    } catch (error) {
        throw error
    }

}