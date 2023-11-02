# Data base architecture

## Brief explanation

### user

Table that contains user information.

- **username**: used for user identification

  `{ type: 'string', maxLength: 16 }`

- **email**: the user email address

  `{ type: 'string', maxLength: 50 }`

- **password**: the user password

  `{ type: 'string', minLength: 5, maxLength: 32 }`

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **name**: the user name

  `{ type: 'string', maxLength: 45 }`

- **lastName**

  `{ type: 'string', maxLength: 45 }`

- **role**: the user can have one of the following roles. All roles can get all of the information.

  `{ type: 'string', enum: ['inactive', 'sales', 'inventoryManager', 'productionManager', 'admin'] }`

  - **inactive**: do not access to the system.
  - **sales**: can create and update a production order.
  - **inventoryAdministrator**: can create and update materials.
  - **productionManager**: can create and update labors, can update manufactured quantity and status in a production order.
  - **admin**: can perform all actions.

### labor

Table that contains information about labors.

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **status:**

  `{ type: 'string', enum: ['active', 'inactive'] }`

  - **active**: labor still in use and can be used
  - **inactive**: labor is not in use and can not be used in new manufacture orders.

- **internalCode:** identification code for the company, it is not stored as primary key so it can be modified.

  `{ type: 'string', maxLength: 255 }`

- **description**: description of the labor.
  `{ type: 'string',  maxLength: 255 }`

- **pricePerUnit:** price in euros per unit of labor.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **timePerUnit:** time in minutes to perform a unit of labor.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **unit:** the unit of labor. Example: "per square meter", "per unit", "per hole", "per nailed nail", "kg", "m".

  `{ type: 'string',  maxLength: 255 }`

- **internalNotes**: some internal note that can be used to give more information to the labor.

  `{ type: 'string',  maxLength: 255 }`

- **username:** user that created the resource.

  `{ type: 'string', maxLength: 16 }`

### order

Table that contains information about production order.

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **internalCode:** identification code for the company, it is not stored as primary key so it can be modified.

`{ type: 'string',  maxLength: 255 }`

- **internalNotes**: some internal note that can be used to give more information to the labor.

  `{ type: 'string',  maxLength: 255 }`

- **description**: description of the labor.

  `{ type: 'string',  maxLength: 255 }`

- **status:**

  `{ type: 'string', enum: ['pending', 'inProduction', 'finished'] }`

  - pending: waiting for costumer approval
  - in production: order is in production
  - finished: order has been finished
  - canceled: order has been canceled or deleted.

- **manufactured:** quantity already produced. When a unit is manufactured, the stock of the materials get updated.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **totalPrice:** total price of the order in euros.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

  - Calculated as:

    `[ sum(quantity_labor_i * price_labor_i) + sum(quantity_material_i * price_material_i) ] * unitsToManufacture`

- **totalProductionTime:** production time to complete the order in minutes.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

  - Calculated as:

    `[ sum(quantity_labor_i * time_labor_i) + sum(quantity_material_i * time_material_i) ] * unitsToManufacture`

- **unitsToManufacture:** total quantity to manufacture.

  `{ type: 'number', minimum: 0, maximum: 9999999 }`

- **username:** user that created the resource.

  `{ type: 'string', maxLength: 16 }`

### material

Table that contains information about the materials.

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **status:**

  `{ type: 'string', enum: ['active', 'inactive'] }`

  - **active**: labor still in use and can be used
  - **inactive**: labor is not in use and can not be used in new manufacture orders.

- **internalCode:** identification code for the company, it is not stored as primary key so it can be modified.

  `{ type: 'string', maxLength: 255 }`

- **description**: description of the labor.
  `{ type: 'string',  maxLength: 255 }`

- **pricePerUnit:** price in euros per unit of labor.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **stock**: available quantity of the material.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **reservedStock**: planed material to be used in production orders. When a production order is created, stock corresponding quantity of a material will decrease and reserved_stock will increase by the same quantity. When a furniture is manufactured, the corresponding quantity of material will be taken from reserved_Stock.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

- **unit:** the unit of material. Example: "meters", "kilograms", "pounds".

  `{ type: 'string',  maxLength: 255 }`

- **purchaseTime:** necessary time in minutes for having the material available when it runs out of stock.

  `{ type: 'number', minimum: 0, maximum: 999,9 }`

- **internalNotes**: some internal note that can be used to give more information to the labor.

  `{ type: 'string',  maxLength: 255 }`

- **username:** user that created the resource.

  `{ type: 'string',  maxLength: 16 }`

### orderHasLabor

Table that contains all the labors present in a manufacture order.

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **orderId**: the production order id

  `{ type: string, format:  length: 32 }`

- **laborId**: the labor id present in the manufacture order

  `{ type: string, format:  length: 32 }`

- **quantity**: the quantity of the labor.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

### orderHasMaterial

Table that contains all the materials present in a manufacture order.

- **createdAt:**: creation date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **updatedAt:** update date of the resource

  `{ type: Date, format:  ISO 8601 }`

- **orderId**: the production order id

  `{ type: string, format:  length: 32 }`

- **materialId**: the material id present in the manufacture
  order

  `{ type: string, format:  length: 32 }`

- **quantity**: the material quantity.

  `{ type: 'number', minimum: 0, maximum: 9999999,99 }`

## Relationship between tables

### user -> labor

An user can create many labors, each labor contains the user_id that created the labor.

### user -> order

An user can create many orders, each order contains the user_id that created the order.

### user -> material

An user can create many materials, each material contains the user_id that created the material.

### order -> orderHasLabor <- labor

An order can contain many labors, and a labor can be in many orders, the table order_has_labor allows to create the relationship many to many.

### order -> orderHasMaterial <- material

An order can contain many materials, and a material can be in many orders, the table order_has_material allows to create the relationship many to many.

## EER diagram

![](../images/EER_diagram.png)
