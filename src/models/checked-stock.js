'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class CheckedStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Batch, {
          foreignKey: "batch_no",
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
  
  CheckedStock.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    batch_no: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.Batch,
        key: 'id',
      }
    },
    expected_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Expected Qty is required." },
        notNull: { msg: "Expected Qty is required." },
        validateExpectedQty (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    actual_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Actual Qty is required." },
        notNull: { msg: "Actual Qty is required." },
        validateActualQty (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    reason:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Reason is required." },
        notNull: { msg: "Reason is required." },
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'CheckedStock',
    tableName: 'checked_stock',
  }
  );
  return CheckedStock;
};