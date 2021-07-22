'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class TsItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.TransferredStocks, {
          foreignKey: "transferred_stocks",
        });
        this.belongsTo(models.Stock, {
          foreignKey: "stock",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
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
  
  TsItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transferred_stocks: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.TransferredStocks,
            key: "id",
        }
    },
    stock: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Stock,
            key: "id",
        }
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Qty is required.' },
        notNull: { msg: "Qty is required." },
        validateQty (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Unit is required." },
        notNull: { msg: "Unit is required." },
      },
    },
    price: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validatePrice (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Inactive",
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'TsItem',
    tableName: 'ts_item',
  }
  );
  return TsItem;
};