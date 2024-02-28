export interface MongoSettings {
  servers: string
  dbName: string
  username: string | undefined
  password: string | undefined
  repls: string | undefined
}
