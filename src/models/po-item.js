'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class PoItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.PurchaseOrder, {
          foreignKey: "purchase_order",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.SupplierProduct, {
          foreignKey: "product",
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
        
        this.hasOne(models.Batch, {
          as: 'batch',
          foreignKey: "po_item",
        });
        this.hasOne(models.RoItem, {
          foreignKey: 'po_item',
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
  
  PoItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    purchase_order: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.PurchaseOrder,
            key: "id",
        }
    },
    product: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.SupplierProduct,
            key: "id",
        }
    },
    ordered_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid ordered quantity." },
        validateOrderedQty (value) {
          if(value < 0) {
            throw new Error("Invalid ordered quantity.");
          }
        }
      },
    },
    received_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid received quantity." },
        validateReceivedQty (value) {
          if(value < 0) {
            throw new Error("Invalid received quantity.");
          }
        }
      },
    },
    price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Price is required.' },
        notNull: { msg: "Price is required." },
        validatePrice (value) {
          if(value < 0) {
            throw new Error("Invalid price.");
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
    modelName: 'PoItem',
    tableName: 'po_item',
  }
  );
  return PoItem;
};