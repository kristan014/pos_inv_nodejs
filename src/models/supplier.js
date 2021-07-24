'use strict';

const { Model } = require('sequelize');

const PROTECTED_ATTRS = [""];

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
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
          foreignKey: "supplier",
        });
        this.hasMany(models.PurchaseOrder, {
          foreignKey: "supplier",
        });
        this.hasMany(models.ReturnedOrder, {
          foreignKey: "supplier",
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
  
  Supplier.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Company name is required." },
        notNull: { msg: "Company name is required." },
        async isUnique(value) {
          const company_name = await Supplier.findOne({
            where: { company_name: value }
          });
          if (company_name) {
            throw new Error('Company name already exists');
          }
        },
      },
    },
    contact_fname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name is required." },
        notNull: { msg: "First name is required." },
      },
    },
    contact_mname: {
      type: DataTypes.STRING(50),
    },
    contact_lname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name is required." },
        notNull: { msg: "Last name is required." },
      },
    },
    contact_name: {
      type: DataTypes.STRING(150),
      set(value) {
        this.setDataValue(
          "contact_name",
          this.contact_lname + ", " + this.contact_fname + " " + (this.contact_mname ? this.contact_mname : "")
        );
      },
    },
    contact_no: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Contact no. is required." },
          notNull: { msg: "Contact no. is required." },
          isNumeric: { msg: "Invalid contact no." },
          len: {
            args: [10,11],
            msg: "Must be 10-11 character long." 
          },
          async isUnique(value) {
            const contact_no = await Supplier.findOne({
              where: { contact_no: value }
            });
            if (contact_no) {
              throw new Error('Contact no. already exists');
            }
          },
        },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email address is required." },
        notNull: { msg: "Email address is required." },
        isEmail: { msg: 'Invalid email address.'},
        async isUnique(value) {
          const email = await Supplier.findOne({
            where: { email: value }
          });
          if (email) {
            throw new Error('Email address already exists');
          }
        },
      },
    },
    discount_rate: {
      type: DataTypes.DECIMAL(4,2),
      defaultValue: 0,
      allowNull: false,
      validate: {
        notNull: { msg: "Invalid discount rate." },
        validateDiscountRate (value) {
          if(value < 0) {
            throw new Error("Invalid discount rate.");
          }
        }
      },
    },
    unit_or_floor_no: {
      type: DataTypes.STRING(10),
    },
    house_or_bldg_name: {
      type: DataTypes.STRING(50),
    },
    street_no: {
      type: DataTypes.STRING(10),
    },
    street_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street name is required." },
        notNull: { msg: "Street name is required." },
      },
    },
    barangay: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barangay is required." },
        notNull: { msg: "Barangay is required." },
      },
    },
    city: {
      type: DataTypes.STRING(50),
      defaultValue: "Quezon City",
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required." },
        notNull: { msg: "City is required." },
      },
    },
    zip_code: {
      type: DataTypes.STRING(10),
    },
    region: {
      type: DataTypes.STRING(50),
      defaultValue: "Metro Manila",
      allowNull: false,
      validate: {
        notEmpty: { msg: "Region is required." },
        notNull: { msg: "Region is required." },
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
        fields: ['company_name', 'contact_no', 'email'],
      }
    ],
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'Supplier',
    freezeTableName: true,
  }
  );
  return Supplier;
};