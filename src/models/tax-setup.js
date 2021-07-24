'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class TaxSetup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });

        this.hasMany(models.Tax, {
          as: 'tax',
          foreignKey: 'tax_setup',
        });
    }
    
    toJSON() {
      const attrs = { ...this.get() };
      for (const a of PROTECTED_ATTRS){
        delete attrs[a];
      }
      return attrs;
     /* return { 
        ...this.get(), 
        password: undefined 
      }; */
    }
  };
  
  TaxSetup.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required.' },
        notNull: { msg: 'Title is required.' },
        async isUnique(value) {
          const title = await TaxSetup.findOne({
            where: { title: value }
          });
          if (title) {
            throw new Error('Title already exists');
          }
        },
      },
    },
    rate: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate." },
        validateRate (value) {
          if(value < 0) {
            throw new Error("Invalid rate.");
          }
        }
      },
    },
    option: { 
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Option is required.' },
        notNull: { msg: 'Option is required.' },
      },
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Active",
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: 'id',
      }
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: 'id',
      }
    },
  }, 
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'TaxSetup',
    tableName: 'tax_setup',
  }
  );
  return TaxSetup;
};