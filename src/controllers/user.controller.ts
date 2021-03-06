import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {EventoRepository} from '../repositories/evento.repository';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(EventoRepository) protected eventoRepository: EventoRepository,
  ) { }

  @post('/users/postSocialLogin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async postSocialLogin(
    @requestBody() data: any,
  ): Promise<{token: string, admin: string}> {

    console.log('DATA: ', data);

    let user: User;
    try {
      user = await this.userService.findUserById(data.googleId);
    } catch (error) {
      console.log('ERROR: ', error);
      user = await this.userRepository.create({
        email: data.email,
        id: data.googleId,
        username: data.username
      });
    }

    console.log('USER: ', user);

    const userProfile = this.userService.convertToUserProfile(user);

    console.log('USER PROFILE: ', userProfile);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    const admin: string = String(user.admin) || 'false';

    console.log('token y admin: ', {token, admin})

    return {token, admin};
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string, admin: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    const admin: string = String(user.admin) || 'false';
    return {token, admin};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @authenticate('jwt')
  @get('/users', {
    responses: {
      '200': {
        description: 'Return user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getUsers(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User[]> {
    const id = currentUserProfile[securityId];
    const user = await this.userService.findUserById(id);
    console.log(user);
    if (user.admin) {
      return this.userService.userRepository.find();
    } else {
      // https://loopback.io/doc/en/lb4/Controller.html
      const error = new HttpErrors[403];
      error.message = 'Sólo administradores pueden hacer esta petición';
      throw error;
    }
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    console.log('sign up');
    console.log(newUserRequest);
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  @post('/signupAdmin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async newAdminUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    console.log('sign up');
    console.log(newUserRequest);
    newUserRequest.admin = true;
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  @authenticate('jwt')
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Evento DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {

    const usuarioID: string = id;
    const eventos = await this.eventoRepository.find({where: {usuarioCreadorID: usuarioID}});
    eventos.forEach(async evento => {
      console.log('Por eliminar el evento ', evento.id);
      let r = await this.eventoRepository.deleteById(evento.id);
      console.log('Respuesta: ', r);
      console.log('------------')
    });
    console.log('Se eliminaron todos los eventos');
    const response = await this.userRepository.deleteById(id);
    console.log(response);
    return response;
  }
}
