import { DataTypes } from 'sequelize';
import { Model, Table, Column, HasMany, Default } from 'sequelize-typescript';

@Table({ tableName: 'user', paranoid: true, timestamps: true })
export class User extends Model<User> {

    @Column(DataTypes.STRING)
    password: string;

    @Column({ allowNull: false })
    email: string;

    @Default(false)
    @Column(DataTypes.BOOLEAN)
    with_linkedin: boolean;
}