# Data base architecture

## Brief explanation

### user_role

Table that stores different user roles, each user have different capabilities for creating and updating tables.;

- **sales**: can create and update a production order.
- **inventory administrator**: can create and update materials.
- **production manager**: can create and update labors, can update manufactured quantity and status in a production order.
- **admin**: can perform all actions.

### user

Table that contains user information.

### labor

Table that contains information about labors.

- **created_at:** creation date of the resource
- **status:**
  - active: is labor still in use
  - inactive: labor is not in use or its want to be considered as deleted.
- **internal_code:** identification code for the company, it is not stored as primary key so it can be modified.
- **description**
- **price_per_unit:** price in euros per unit of labor.
- **time_per_unit:** time in minutes to perform a unit of labor.
- **unit:** the unit of labor. Example: "per square meter", "per unit", "per hole", "per nailed nail".
- **internal_note**
- **created_by:** user that created the resource.

### order

Table that contains information about production order.

- **created_by:** user that created the resource.
- **internal_code:** identification code for the company, it is not stored as primary key so it can be modified.
- **description**
- **status:**
  - pending: waiting for costumer approval
  - in production: order is in production
  - finished: order has been finished
  - canceled: order has been canceled or deleted.
- **manufactured:** quantity already produced. When a unit is manufactured, the stock of the materials get updated.
- **total_price:** total price of the order in euros. Calculated as `sum(quantity_labor_i * price_labor_i) + sum(quantity_material_i * price_material_i)`
- **total_production_time:** production time to complete the order in minutes. Calculated as `sum(quantity_labor_i * time_labor_i) + sum(quantity_material_i * time_material_i) + bigger_purchase_time_of_inexistent_material`
- **units_to_manufacture:** total quantity to manufacture.

### material

Table that contains information about the materials.

- **created_at:** creation date of the resource
- **status:**
  - active: material still in use
  - inactive: material is not in use or its want to be considered as deleted.
- **internal_code:** identification code for the company, it is not stored as primary key so it can be modified.
- **description**
- **stock**: available quantity of the material.
- **price_per_unit:** prince en euros per unit of material.
- **unit:** the unit of material. Example: "meters", "kilograms", "pounds".
- **purchase_time:** necessary time in minutes for having the material available when it runs out of stock.
- **internal_note**
- **created_by:** user that created the resource.

### order_has_labor

Table that contains all the labors present in a manufacture order.

- **order_id**: the production order id
- **labor_id**: the labor id present in the manufacture order
- **quantity**: the quantity of the labor.

### order_has_material

Table that contains all the materials present in a manufacture order.

- **order_id**: the production order id
- **material_id**: the material id present in the manufacture order
- **quantity**: the material quantity.

## EER diagram

![](../images/EER_diagram.png)
