'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class ReturnedOrder extends Model {
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
        this.belongsTo(models.PurchaseOrder, {
          foreignKey: "purchase_order",
        });
        this.belongsTo(models.Supplier, {
          foreignKey: "supplier",
        });
        this.belongsTo(models.User, {
          as: 'created',
          foreignKey: "created_by",
        });
        this.belongsTo(models.User, {
          as: 'updated',
          foreignKey: "updated_by",
        });
            
        this.hasMany(models.RoItem, {
          as: 'ro_item',
          foreignKey: 'returned_order',
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
  
  ReturnedOrder.init({
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
    purchase_order: {
      type: DataTypes.UUID,
        references: {
            model: sequelize.PurchaseOrder,
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
    receiving_fname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "First Name is required." },
        notNull: { msg: "First Name is required." },
      },
    },
    receiving_mname: {
      type: DataTypes.STRING(50),
    },
    receiving_lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last Name is required." },
        notNull: { msg: "Last Name is required." },
      },
    },
    full_name: {
      type: DataTypes.STRING(150),
      set(value) {
        this.setDataValue(
          "full_name",
          this.receiving_fname + " " + (this.receiving_mname ? this.receiving_mname + " " : "") + this.receiving_lname
        );
      },
    },
    contact_no: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Contact No. is required." },
        notNull: { msg: "Contact No. is required." },
        isNumeric: { msg: "Invalid." },
        len: {
          args: [10,11],
          msg: "Must be 10-11 character long." 
        },
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email is required." },
        notNull: { msg: "Email is required." },
        isEmail: { msg: 'Invalid.'},
      },
    },
    date_shipped: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        isDate: { msg: 'Invalid.' },
      },
    },
    date_returned: {
      type: DataTypes.DATE,
    },
    frieght: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid." },
        validateFrieght (value) {
          if(value < 0) {
            throw new Error("Invalid.");
          }
        }
      },
    },
    refund_method: { // !
        type: DataTypes.STRING(50),
        defaultValue: 'check', 
        allowNull: false,
        validate: {
          notNull: { msg: 'invalid.' },
          isIn: [['check','cash','debit card','credit card','e-payment','e-bank transfer']],
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
    modelName: 'ReturnedOrder',
    tableName: 'returned_order',
  }
  );
  return ReturnedOrder;
};