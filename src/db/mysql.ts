import mysql, { ConnectionOptions } from 'mysql2';


export default class Database {
    private dbconn?: mysql.Connection;

    public constructor() {}

    public connect(host: string, port: number, db: string, user: string, passwd: string): Promise<void> {
        this.dbconn = mysql.createConnection({
            host: host,
            port: port,
            database: db,
            user: user,
            password: passwd,
            connectTimeout: 20000
        });
        return Promise.resolve();
    }

    public disconnect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.dbconn?.end((error) => {
                if (error) return reject(error);
                return resolve();
            });
        });
    }

    public query(sql: string, params?: any[]): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            this.dbconn?.query(sql, params, (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    public execute(sql: string, params?: any[]): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.dbconn?.execute(sql, params, (error, results, fields) => {
                if (error) {
                    return reject(error);
                }
                return resolve(0);
            });
        });
    }
}