'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {
          foreignKey: "ordered_by",
        });
        this.belongsTo(models.User, {
          foreignKey: "received_by",
        });
        this.belongsTo(models.Branch, {
          foreignKey: "branch",
        });
        this.belongsTo(models.Supplier, {
          foreignKey: "supplier",
        });
        this.belongsTo(PurchaseOrder, {
          foreignKey: "prev_void_order",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
       
        this.hasMany(models.PoItem, {
          as: 'po_item',
          foreignKey: "purchase_order",
        });
        this.hasOne(models.ReturnedOrder, {
          foreignKey: "purchase_order",
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
  
  PurchaseOrder.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ordered_by: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.User,
            key: "id",
        }
    },
    received_by: {
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
    supplier: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.Supplier,
            key: "id",
        }
    },
    prev_void_order: {
      type: DataTypes.UUID,
        references: {
            model: PurchaseOrder,
            key: "id",
        }
    },
    purchase_order_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'purchase_order_no',
    },
    date_ordered: {
      type: DataTypes.DATE,
    },
    date_expected: {
      type: DataTypes.DATE,
    },
    date_shipped: {
      type: DataTypes.DATE,
    },
    date_received: {
      type: DataTypes.DATE,
    },
    payment_method: { // !
        type: DataTypes.STRING(50),
        defaultValue: 'E-Bank Transfer', 
        allowNull: false,
        validate: {
          notNull: { msg: 'Invalid payment method.' },
        },
    },
    /*delivery_cost: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateDeliveryCost (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },*/
    amount_sent: {
      type: DataTypes.DECIMAL(7,2),
      defaultValue: 0,
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
        const rawValue = this.getDataValue("amount_sent");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    balance_due: {
      type: DataTypes.DECIMAL(7,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid balance due." },
        validateBalanceDue (value) {
          if(value < 0) {
            throw new Error("Invalid balance due.");
          }
        }
      },
      get(){
        const rawValue = this.getDataValue("balance_due");
        return rawValue != 0 ? "P" + rawValue : '';
      },
    },
    /*note: {
      type: DataTypes.TEXT,
    },*/
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Draft",
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
        fields: ['purchase_order_no']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'PurchaseOrder',
    tableName: 'purchase_order',
  }
  );
  return PurchaseOrder;
};