'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class SupplierProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Product, {
          foreignKey: "product_type",
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Supplier, {
          foreignKey: "supplier",
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
            
        this.hasMany(models.PoItem, {
          foreignKey: "product",
        });
        this.hasOne(models.Stock, {
          foreignKey: "product",
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
  
  SupplierProduct.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_type: {
      type: DataTypes.UUID,
      references: {
        model: sequelize.Product,
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
    product_pic: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("product_pic");
        return rawValue ? "public/supplier-products/" + rawValue : null;
      },  
    },  
    product_name: { // Specific
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Product name is required." },
        notNull: { msg: "Product name is required." },
        async isUnique(value) {
          const product_name = await SupplierProduct.findOne({
            where: { product_name: value }
          });
          if (product_name) {
            throw new Error('Product name already exists');
          }
        },
      },
    },
    cost: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Cost is required.' },
        notNull: { msg: "Cost is required." },
        validateCost (value) {
          if(value < 0) {
            throw new Error("Invalid cost.");
          }
        }
      },
    },
    /*price: {
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
    },U*/
    with_tax: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      validate: {
        notNull: { msg: 'Invalid.' },
      },
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Unit is required." },
        notNull: { msg: "Unit is required." },
      },
    },
    /*color: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Color is required." },
        notNull: { msg: "Color is required." },
      },
    },*/
    flavor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Flavor is required." },
        notNull: { msg: "Flavor is required." },
      },
    },
    is_halal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        notNull: { msg: 'Invalid.' },
      },
    },
    is_packaged: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      validate: {
        notNull: { msg: 'Invalid.' },
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
        fields: ['product_name']
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'SupplierProduct',
    tableName: 'supplier_product',
  }
  );
  return SupplierProduct;
};