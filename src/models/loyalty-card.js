'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class LoyaltyCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: "customer",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.LoyaltyCardSetup, {
          foreignKey: "lc_setup",
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
           
        this.hasMany(models.LoyaltyCardLog, {
          foreignKey: 'loyalty_card',
        });
        this.hasMany(models.SaleReceipt, {
          foreignKey: 'loyalty_card',
        });
        this.hasMany(models.Discount, {
          foreignKey: 'loyalty_card',
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
  
  LoyaltyCard.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    loyalty_card_no: {
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Loyalty card no. is required." },
        notNull: { msg: "Loyalty card no. is required." },
        isNumeric: { msg: 'Invalid loyalty card no.' },
        async isUnique(value) {
          const loyalty_card_no = await LoyaltyCard.findOne({
            where: { loyalty_card_no: value }
          });
          if (loyalty_card_no) {
            throw new Error('Loyalty card no. already exists');
          }
        },
      },
    },
    customer: {
      type:DataTypes.UUID,
      references: {
        model: sequelize.User,
        key: "id",
      },
    },
    lc_setup: {
      type:DataTypes.UUID,
      references: {
        model: sequelize.LoyaltyCardSetup,
        key: "id",
      },
    },
    loyalty_points: {
      type: DataTypes.DECIMAL(6,2),
      defaultValue: 5.00,
      allowNull: false,
      validate: {
        notNull: { msg: "Loyalty points is required." },
        validateLoyaltyPoints (value) {
          if(value < 0) {
            throw new Error("Invalid loyalty points.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("loyalty_points");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Reserved",
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
        fields: ['loyalty_card_no'],
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'LoyaltyCard',
    tableName: 'loyalty_card',
  }
  );
  return LoyaltyCard;
};