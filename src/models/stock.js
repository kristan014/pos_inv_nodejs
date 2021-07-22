'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.SupplierProduct, {
          foreignKey: "product",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Branch, {
          foreignKey: "branch",
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
            
        this.hasMany(models.Batch, {
          as: 'batch',
          foreignKey: "stock",
        });
        this.hasMany(models.Tax, {
          foreignKey: "stock",
        });
        this.hasMany(models.SrItem, {
          foreignKey: "stock",
        });
        this.hasMany(models.Discount, {
          foreignKey: "item",
        });
        this.hasMany(models.TsItem, {
          foreignKey: "stock",
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
  
  Stock.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product: {
        type: DataTypes.UUID,
        references: {
            model: sequelize.SupplierProduct,
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
    sku: {/*
      type: DataTypes.STRING(8),
      allowNull: false,
      validate: {
        notEmpty: { msg: "SKU is required." },
        notNull: { msg: "SKU is required." },
      },
      unique: { msg: "SKU already exists." },*/
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'sku',
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid quantity." },
        validateQty (value) {
          if(value < 0) {
            throw new Error("Invalid quantity.");
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
    indexes: [
      {
        unique: true,
        fields: ['sku']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'Stock',
    freezeTableName: true,
  }
  );
  return Stock;
};