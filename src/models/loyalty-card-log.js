'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class LoyaltyCardLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.LoyaltyCard, {
          foreignKey: "loyalty_card",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
  
  LoyaltyCardLog.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    loyalty_card: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.LoyaltyCard,
        key: "id",
      },
    },
    old_pts: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Old Pts is required." },
        notNull: { msg: "Old Pts is required." },
        validateOldPts (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    new_pts: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: "New Pts is required." },
        notNull: { msg: "New Pts is required." },
        validateNewPts (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required." },
        notNull: { msg: "Description is required." },
      },
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "active",
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
    modelName: 'LoyaltyCardLog',
    tableName: 'loyalty_card_log',
  }
  );
  return LoyaltyCardLog;
};