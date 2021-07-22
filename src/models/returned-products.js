'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class ReturnedProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: "employee",
        });
        this.belongsTo(models.Branch, {
          foreignKey: "branch",
        });
        this.belongsTo(models.SaleReceipt, {
          foreignKey: "sale_receipt",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.RpItem, {
          as: 'rp_item',
          foreignKey: 'returned_products',
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
  
  ReturnedProducts.init({
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
    branch: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Branch,
            key: "id",
        }
    },
    sale_receipt: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.SaleReceipt,
            key: "id",
        }
    },
    date_returned: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    refund_method: { // !
        type: DataTypes.STRING(50),
        defaultValue: 'cash', 
        allowNull: false,
        validate: {
          notNull: { msg: 'invalid.' },
          isIn: [['check','cash','debit card','credit card','e-payment','e-bank transfer']],
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
    modelName: 'ReturnedProducts',
    tableName: 'returned_products',
  }
  );
  return ReturnedProducts;
};