import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';
import { db } from '../dbconnection.ts';

class Internship extends Model {
    static table = 'Internships';

    static fields = {
        id: {
            type: DataTypes.BIG_INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            length: 255,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        startDate:{ 
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate:{ 
            type: DataTypes.DATE,
            allowNull: true,
        },
    };
}

db.link([Internship]);

export {Internship};