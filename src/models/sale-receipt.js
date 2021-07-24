'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class SaleReceipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: "employee",
        });
        this.belongsTo(models.User, {
          foreignKey: "customer",
        }); 
        this.belongsTo(models.LoyaltyCard, {
          foreignKey: "loyalty_card",
        });
        this.belongsTo(models.Branch, {
          foreignKey: "branch",
        });
        this.belongsTo(SaleReceipt, {
          foreignKey: "prev_void_receipt",
        });
        this.belongsTo(models.Discount, {
          foreignKey: "discount",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.SrItem, {
          as: 'sr_item',
          foreignKey: 'sale_receipt',
        });
        this.hasOne(models.ReturnedProducts, {
          foreignKey: 'sale_receipt',
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
  
  SaleReceipt.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.User,
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
    branch: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Branch,
            key: "id",
        }
    },
    prev_void_receipt: {
      type: DataTypes.UUID,
        references: {
            model: SaleReceipt,
            key: "id",
        }
    },
    discount: {
      type: DataTypes.UUID,
        references: {
            model: sequelize.Discount,
            key: "id",
        }
    },
    transaction_no: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Transaction No. is required." },
        notNull: { msg: "Transaction No. is required." },
      },
      unique: { msg: "Transaction No. already exists." },
    },
    transaction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
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
        notEmpty: { msg: "Validity End is required." },
        notNull: { msg: "Validity End is required." },
        isDate: { msg: 'Invalid.' },
      },
    },
    loyalty_points_used: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateLoyaltyPointsUsed (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    payment_method: { // !
      type: DataTypes.STRING(50),
      defaultValue: 'cash', 
      allowNull: false,
      validate: {
        notNull: { msg: 'invalid.' },
        isIn: [['check','cash','debit card','credit card','e-payment','e-bank transfer']],
      },
    },
    amount_received: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Amount Received is required.' },
        notNull: { msg: "Amount Received is required." },
        validateAmountReceived (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    balance_due: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateBalanceDue (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    total_discount: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateTotalDiscount (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
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
    modelName: 'SaleReceipt',
    tableName: 'sale_receipt',
  }
  );
  return SaleReceipt;
};