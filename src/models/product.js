'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Category, {
          foreignKey: "category",
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

        this.hasMany(models.SupplierProduct, {
          as: 'supplier_product',
          foreignKey: 'product_type',
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
  
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    category: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.Category,
        key: 'id'
      },
      unique: 'Both product name & category already exist.',
    },
    product_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'product_code',
    },
    product_name: { // Generic
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Product name is required." },
        notNull: { msg: "Product name is required." },
      },
      unique: 'Both product name & category already exist.',
    },
    product_pic: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("product_pic");
        return rawValue ? "public/products/" + rawValue : null;
      },  
    },
    price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Price is required.' },
        notNull: { msg: "Price is required." },
        validateCost (value) {
          if(value < 0) {
            throw new Error("Invalid price.");
          }
        }
      },
    },  
    critical_level: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid critical level." },
        validateCriticalLevel (value) {
          if(value < 0) {
            throw new Error("Invalid critical level.");
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
        fields: ['product_code']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'Product',
    freezeTableName: true,
  }
  );
  return Product;
};