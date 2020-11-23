import {JWTAuthenticationComponent} from '@loopback/authentication-jwt/dist/jwt-authentication-component';
import {UserServiceBindings} from '@loopback/authentication-jwt/dist/keys';
import {AuthenticationComponent} from '@loopback/authentication/dist/authentication.component';
import {AuthorizationComponent} from '@loopback/authorization/dist/authorization-component';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MongoCloudDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class PruebaloopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent);
    this.dataSource(MongoCloudDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.setUpBindings();
  }

  setUpBindings(): void {
    // this.bind(PasswordHasherBindings.ROUNDS).to(10);
    // this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    // this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTCustomService);
    // this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    // this.bind(CustomAuthorizeProvider.AUTHORIZE_PROVIDER)
    //   .toProvider(Customauthorize).tag(AuthorizationTags.AUTHORIZER);
    // }
  }
}
