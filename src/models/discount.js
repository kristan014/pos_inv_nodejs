'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.DiscountSetup, {
          as: 'setup',
          foreignKey: "discount_setup",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.User, {
          foreignKey: "customer",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.LoyaltyCard, {
          foreignKey: "loyalty_card",
          allowNull: false,
          onUpdate: 'CASCADE',
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });

        this.hasMany(models.SaleReceipt, {
          foreignKey: 'discount',
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
  
  Discount.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    discount_setup: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.DiscountSetup,
        key: "id",
      }
    },
    customer: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: "id",
      }
    },
    loyalty_card: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.LoyaltyCard,
        key: "id",
      }
    },
    discount_code: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Discount Code is required." },
        notNull: { msg: "Discount Code is required." },
      },
      unique: { msg: "Discount Code already exists." },
    },
    discount_rate: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Discount Rate is required." },
        notNull: { msg: "Discount Rate is required." },
        validateDiscountRate (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    validity_start: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    validity_end: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Validity End is required.' },
        notNull: { msg: 'Validity End is required.' },
        isDate: { msg: 'Invalid.' },
        validateValidityEnd (value) {
          if(value < this.validity_start) {
            throw new Error("Invalid.");
          }
        }
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
    modelName: 'Discount',
    freezeTableName: true,
  }
  );
  return Discount;
};