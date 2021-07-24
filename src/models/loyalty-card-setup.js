'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class LoyaltyCardSetup extends Model {
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
        
        this.hasMany(models.LoyaltyCard, {
          as: 'loyalty_card',
          foreignKey: 'lc_setup',
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
  
  LoyaltyCardSetup.init({
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
          const title = await LoyaltyCardSetup.findOne({
            where: { title: value }
          });
          if (title) {
            throw new Error('Title already exists');
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    pts_per_transaction_rate: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0.05,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid pts / transaction rate." },
        validatePtsPerTransactionRate (value) {
          if(value < 0) {
            throw new Error("Invalid pts / transaction rate.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_per_transaction_rate");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    amount: {
      type: DataTypes.DECIMAL(7,2),
      defaultValue: 100.00,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid amount." },
        validateAmount (value) {
          if(value < 0) {
            throw new Error("Invalid amount.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("amount");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    pts_per_amount: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 5.00,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid points per amount." },
        validatePtsPerAmount (value) {
          if(value < 0) {
            throw new Error("Invalid points per amount.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_per_amount");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid quantity." },
        validateQty (value) {
          if(value < 0) {
            throw new Error("Invalid quantity.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("qty");
        return rawValue != 0 ? rawValue : '';
      },
    },
    pts_per_qty: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 10.00,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid points per quantity." },
        validatePtsPerQty (value) {
          if(value < 0) {
            throw new Error("Invalid points per quantity.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_per_qty");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    pts_for_pwd: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid points for pwd." },
        validatePtsForPwd (value) {
          if(value < 0) {
            throw new Error("Invalid points for pwd.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_for_pwd");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    pts_for_senior: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid points for senior." },
        validatePtsForSenior (value) {
          if(value < 0) {
            throw new Error("Invalid points for senior.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_for_senior");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    pts_for_single_parent: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid points for single parent." },
        validatePtsForSingleParent (value) {
          if(value < 0) {
            throw new Error("Invalid points for single parent.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("pts_for_single_parent");
        return rawValue != 0 ? "P" + rawValue : '';
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
    modelName: 'LoyaltyCardSetup',
    tableName: 'loyalty_card_setup',
  }
  );
  return LoyaltyCardSetup;
};