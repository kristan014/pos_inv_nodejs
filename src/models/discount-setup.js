'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class DiscountSetup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Stock, {
          foreignKey: "item",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.Discount, {
          as: 'discount',
          foreignKey: 'discount_setup',
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
  
  DiscountSetup.init({
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
          const title = await DiscountSetup.findOne({
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
    item: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.Stock,
        key: "id",
      }
    },
    rate_for_item: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for item." },
        validateRateForItem (value) {
          if(value < 0) {
            throw new Error("Invalid rate for item.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_item");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
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
    rate_per_qty: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0.05,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate / qty." },
        validateRatePerQty (value) {
          if(value < 0) {
            throw new Error("Invalid rate / qty.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_per_qty");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    rate_per_transaction: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0.05,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate / transaction." },
        validateRatePerTransaction (value) {
          if(value < 0) {
            throw new Error("Invalid rate / transaction.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_per_transaction");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    amount: {
      type: DataTypes.DECIMAL(7,2),
      defaultValue: 5000.00,
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
    rate_per_amount: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0.05,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate / amount." },
        validateRatePerAmount (value) {
          if(value < 0) {
            throw new Error("Invalid rate / amount.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_per_amount");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    special_day: {
      type: DataTypes.DATE,
    },
    rate_for_special_day: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for special day." },
        validateRateForSpecialDay (value) {
          if(value < 0) {
            throw new Error("Invalid rate for special day.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_special_day");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    rate_for_first_timer: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0, // 0.05
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for first timer." },
        validateRateForFirstTimer (value) {
          if(value < 0) {
            throw new Error("Invalid rate for first timer.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_first_timer");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    rate_for_single_parent: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0, // 0.2
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for single parent." },
        validateRateForSingleParent (value) {
          if(value < 0) {
            throw new Error("Invalid rate for single parent.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_single_parent");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    rate_for_senior: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0, // 0.2
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for senior." },
        validateRateForSenior (value) {
          if(value < 0) {
            throw new Error("Invalid rate for senior.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_senior");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
      },
    },
    rate_for_pwd: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0, // 0.2
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid rate for pwd." },
        validateRateForPwd (value) {
          if(value < 0) {
            throw new Error("Invalid rate for pwd.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("rate_for_pwd");
        return rawValue != 0 ? Math.round(rawValue * 100) + "%" : '';
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
    modelName: 'DiscountSetup',
    tableName: 'discount_setup'
  }
  );
  return DiscountSetup;
};