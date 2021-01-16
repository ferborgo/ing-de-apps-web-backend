import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongoCloud',
  connector: 'mongodb',
  url: 'mongodb://fernando:RyNgCh3D12MruG04@cluster0-shard-00-00.s1c8p.mongodb.net:27017,cluster0-shard-00-01.s1c8p.mongodb.net:27017,cluster0-shard-00-02.s1c8p.mongodb.net:27017/%3Cdbname%3E?ssl=true&replicaSet=atlas-cby9pq-shard-0&authSource=admin&retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoCloudDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongoCloud';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongoCloud', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
