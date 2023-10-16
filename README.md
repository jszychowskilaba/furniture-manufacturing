# Custom Furniture Manufacturing API

The `Custom Furniture Manufacturing API System` provides an interface for integrating a bespoke ordering and manufacturing system into your business infrastructure.

This API **streamlines the process** for estimating production time, materials cost, labor cost and order progress tracking. Additionally, the API incorporates the materials purchasing time into the production time when materials are not available.

## Table of content

- [Key features](#key-features)
- [API endpoints](#api-endpoints)
  - [authentication operations](#authentication-authentication-operations)
  - [inventory operations](#inventory-inventory-operations)
  - [labor operations](#labor-labor-operations)
  - [orders operations](#orders-orders-operations)
- [Installation](#installation)

## Key features

<details>
  <summary>Click here</summary>

- **Time estimation:** estimates an order production time based into;

- materials purchasing time
- production time for each manufacturing step

- **Cost calculation:** calculates an order cost based in;

  - materials using predefined material costs
  - labor using predefined cost structures

- **Progress tracking:** provide an order status based in:

  - reception of materials
  - actual manufacturing process step

- **Order management:**

  - provides information of all or individual orders
  - allows order cancellation or modification

- **Inventory management:**

  - manages inventory of materials and their associated cost and purchasing time
  - automatically adjust inventory when materials are used or reserved for an order

- **Manufacturing order placement:** accept and validates custom order placement based on;

  - material availability
  - pre existing labor structures
  - total production time

- **Labor structure management:** manages labor structured cost based on:

  - labor time
  - labor cost
  </details>

## API endpoints

### **`authentication`** authentication operations

<details>
  <summary>Click here</summary>


![](./images/post-colour.png) **`POST`** `/api/v1/auth/login` Login the user.

<details>
  <summary>Click here</summary>

Server side create OAuth 2.0 tokens, stores them in DB and return them.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/x-www-form-urlencoded

  // Body
  client_id=juan&client_secret=5678910

  ```

- **Responses**

  - 201 OK. Response with a **access_token**, **refresh_token** and **expires_in** (expiration time of access_token in seconds). Tokens must be stored by client.

  ```
  // Example

  // Header
  HTTP/1.1 200 OK
  Content-Type: application/json; charset=utf-8

  // Body
  {
    "access_token": "1ad67c7c-785d-4968-b34d-2d77d5802bbf",
    "refresh_token": "d4917ddd-11bb-404b-ac6d-a3123de3e24c",
    "expires_in": 60
  }
  ```

  - 400 Bad Request. (Missing argument). Response body with a JSON informative message.

  - 404 Not Found. (Invalid credentials). Response body with a JSON informative message.

  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/delete-colour.png) **`DELETE`** `/api/v1/auth/logout` Logout the user.

<details>
  <summary>Click here</summary>

Server side delete the OAuth 2.0 tokens from the DB.

- **Request**

  ```
  // Example

  // Header
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token
  ```

- **Responses**

  - 204 No Content. (Successful logout).

  - 400 Bad Request. (Missing authentication token). Response body with a JSON informative message.

  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.

  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/post-colour.png) **`POST`** `/api/v1/auth/refresh-tokens` Refresh the OAuth 2.0 tokens.

<details>
  <summary>Click here</summary>

Server side generates a new token and a new refresh token, update the old ones in the DB side and response with the new tokens.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/x-www-form-urlencoded

  // Body
  refresh_token=1ea0e31e-2fc8-429b-9038-827f35e42dc3
  ```

- **Responses**

  - 200 OK. Response with a **new token** and a **new refresh token**. Tokens must be stored by client.

  ```
  // Example

  // Header
  HTTP/1.1 200 OK
  Content-Type: application/json; charset=utf-8

  // Body
  {
    "access_token": "add11a75-3dfa-4f76-888e-967a1a1a738a",
    "refresh_token": "51b27992-2043-4233-9dc9-56c31086688d",
    "expires_in": 60
  }
  ```

  - 400 Bad Request. (Missing authentication token). Response body with a JSON informative message.

  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.

  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

</details>

### **`inventory`** inventory operations

<details>
  <summary>Click here</summary>

![](./images/get-colour.png) **`GET`** `/v1/inventory` Returns all inventory

<details>
  <summary>Click here</summary>

Returns all inventory stored in DB.

- **Responses**

  - 200 OK

    ```
    // Example

    // Header
    HTTP 200 OK
    Content-Type: application/json

    // Body
    [
      {
        "id": "a7cbefaf-b451-4a40-8e77-753bf1f5f639",
        "createdAt": "4/10/2023, 3:58:56 PM",
        "status": "active",
        "internalCode": "w-01",
        "description": "wood",
        "quantity": 24,
        "pricePerUnit": 15,
        "unit": "m2",
        "purchaseTime": 5,
        "internalNotes": "some notes
      },
      {
        "id": "6f69f3d7-7d7f-4cac-b0c1-82fa337d797c",
        "createdAt": "3/10/2023, 2:58:56 PM",
        "status": "active",
        "internalCode" "n-01",
        "description": "nails",
        "quantity": 1000,
        "pricePerUnit": 0.12,
        "unit": "unit",
        "purchaseTime": 1,
        "internalNotes": "some notes
      }
    ]
    ```

  - 204 No Content. (Inventory is empty).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/post-colour.png) **`POST`** `/v1/inventory` Creates a new material

<details>
  <summary>Click here</summary>

Creates a new material and store it in DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "internalCode": "w-01",
    "description": "Light ocher reflective wood board of 2 inches wide",
    "quantity": 24,
    "pricePerUnit": 15,
    "unit": "m2",
    "purchaseTime": 5409
    "internalNotes": "used for tables top"
  }
  ```

- **Responses**
  - 204 No Content. The material has been created and stored in DB.
  - 400 Bad Request. Response body with a JSON informative message.
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 409 Conflict. (Internal code already used in another material). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/get-colour.png) **`GET`** `/v1/inventory/{materialID}` Returns a material by material ID

<details>
  <summary>Click here</summary>

Returns a material by material ID stored in the DB.

- **Responses**

  - 200 OK

    ```
    // Example

    // Header
    HTTP 200 OK
    Content-Type: application/json

    // Body
    {
      "id": "a7cbefaf-b451-4a40-8e77-753bf1f5f639",
      "createdAt": "4/10/2023, 3:58:56 PM",
      "status": "active",
      "internalCode": "w-01",
      "description": "wood",
      "quantity": 24,
      "pricePerUnit": 15,
      "unit": "m2",
      "purchaseTime": 5,
      "internalNotes": "some notes
    }
    ```

  - 404 No Found. (The material does not exist).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/patch-colour.png) **`PATCH`** `/v1/inventory/{materialID}` Updates a material by material ID

<details>
  <summary>Click here</summary>
  
  Updates a material by material ID and update the DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "status": "inactive",
    "internalCode": "new internal code",
    "description": "new description",
    "quantity": 3,
    "pricePerUnit": 2,
    "unit": "new unit",
    "purchaseTime": 3
    "internalNotes": "new internal note"
  }
  ```

- **Responses**
  - 204 No Content. (Successful update)
  - 400 Bad Request. Response body with a JSON informative message.
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 404 Not Found. (Material ID not found in DB). Response body with a JSON informative message.
  - 409 Conflict. (Internal code already used). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

</details>

### **`labor:`** labor operations

<details>
  <summary>Click here</summary>

![](./images/get-colour.png) **`GET`** `/v1/labors` Returns all labors

<details>
  <summary>Click here</summary>

Return all created labors from DB

- **Responses**

  - 200 OK

    ```
    // Example

    // Header
    HTTP 200 OK
      Content-Type: application/json

    // Body
    [
      {
        "id": "7b45ccd1-e1c3-4e75-99ed-aa41bcc98dd1",
        "createdAt": "4/10/2023, 1:55:56 PM",
        "status": "active",
        "internalCode": "S-01",
        "description": "screw a leg",
        "pricePerUnit": 1, // USD
        "timePerUnit": 2, // seconds
        "unit": "unit",
        "internalNote": "some internal note",
      },
      {
        "id": "cfb4b8ec-fea7-41c1-aa00-a88456ddf7c0",
        "createdAt": "2/10/2023, 1:23:54 PM",
        "status": "inactive",
        "internalCode": "S-23",
        "description": "sanding board surface",
        "pricePerUnit": 30, // USD
        "timePerUnit": 3600, // seconds
        "unit": "m2",
        "internalNote": "some internal note",
      }
    ]
    ```

  - 204 No Content. (Labor list is empty).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/post-colour.png) **`POST`** `/v1/labors` Creates a new labor

<details>
  <summary>Click here</summary>

Creates a new labor and stores it in DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "internalCode": "S-01",
    "description": "screw a leg",
    "pricePerUnit": 24, // USD
    "timePerUnit": 2, // seconds
    "unit": "unit"
    "internalNote": "some internal note"
  }
  ```

- **Responses**
  - 204 No Content. The resource has been created and stored in DB
  - 400 Bad Request. Response body with a JSON informative message
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 409 Conflict. (Internal code already used). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/get-colour.png) **`GET`** `/v1/labors/{laborID}` Returns a labor by labor ID

<details>
  <summary>Click here</summary>

Returns a labor stored in the DB by its ID

- **Responses**

  - 200 OK

  ```
  // Example

  // Header
  HTTP 200 OK
  Content-Type: application/json

  // Body
  {
    "id": "7b45ccd1-e1c3-4e75-99ed-aa41bcc98dd1",
    "createdAt": "4/10/2023, 1:55:56 PM",
    "status": "inactive",
    "internalNote": "S-01",
    "description": "screw a leg",
    "pricePerUnit": 1,
    "timePerUnit": 2,
    "unit": "unit",
    "internalNote": "some internal note"
  }
  ```

  - 404 Not Found. (The labor is not stored in the DB).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/patch-colour.png) **`PATCH`** `/v1/labors/{laborID}` Updates a labor by labor ID

<details>
  <summary>Click here</summary>

Updates labor by its ID and update the DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "status": "active",
    "internalCode": "S-01"
    "description": "screw a leg",
    "pricePerUnit": 1,
    "timePerUnit": 2,
    "unit": "unit",
    "internalNote": "new internal note"
  }
  ```

- **Responses**
  - 204 No Content. (Successful update)
  - 400 Bad Request. Response body with a JSON informative message.
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 404 Not Found. (Labor ID not found in DB). Response body with a JSON informative message
  - 409 Conflict. (Internal code already used). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

</details>

### **`orders:`** orders operations

<details>
  <summary>Click here</summary>

![](./images/get-colour.png) **`GET`** `/v1/orders` Returns all manufacture orders

<details>
  <summary>Click here</summary>

Return all manufacture orders stored in the DB.

- **Responses**

  - 200 OK

  ```
  // Example

  // Header
  HTTP 200 OK
  Content-Type: application/json

  // Body
  [
    {
      "id": "54c42fec-f0a5-4e39-b9f6-e42e2a3c0222",
      "createdAt": "4/10/2023, 1:55:56 PM",
      "internalCode": "AT-01",
      "description": "antique table",
      "status": "pending",
      "manufactured": 0,
      "price": 450,
      "totalProductionTime": 143,
      "unitsToManufacture": 25,
      "materials": [
        { "id": "4818bf86-d823-447c-8b44-314b9f3c6006", "quantity": 4 },
        { "id": "1e763ff7-c953-4648-8662-535e2666ddb9", "quantity": 8 }
      ],
      "labors": [
        { "id": "58aed305-ca17-4885-8be7-0d66160112b9", "quantity": 1 },
        { "id": "557fa85c-08bf-48dd-a7d5-7d3df895881c", "quantity": 3 }
      ],
      "internalNote": "some special instructions about the order"
    },
    {
      "id": "26cfc6a8-3b4f-462c-bac7-5225e8586797",
      "createdAt": "2/10/2023, 1:23:54 PM",
      "internalCode": "AT-02",
      "description": "antique chair",
      "status": "in production",
      "manufactured": 40,
      "price": 3000,
      "totalProductionTime": 15,
      "unitsToManufacture": 100,
      "materials": [
        { "id": "4818bf86-d823-447c-8b44-314b9f3c6006", "quantity": 4 },
        { "id": "1e763ff7-c953-4648-8662-535e2666ddb9", "quantity": 1450 }
      ],
      "labors": [
        { "id": "58aed305-ca17-4885-8be7-0d66160112b9", "quantity": 1 },
        { "id": "557fa85c-08bf-48dd-a7d5-7d3df895881c", "quantity": 100 }
      ],
      "internalNote": "some special instructions about the order"
    }
  ]
  ```

  - 204 No Content. (Manufacture order list is empty).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/post-colour.png) **`POST`** `/v1/orders` Creates a new manufacture order

<details>
  <summary>Click here</summary>

Creates a new manufacture order and stores it in DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "internalCode": "AT-01",
    "description": "antique table",
    "unitsToManufacture": 25,
    "materials": [
      { "id": "4818bf86-d823-447c-8b44-314b9f3c6006", "quantity": 4 },
      { "id": "1e763ff7-c953-4648-8662-535e2666ddb9", "quantity": 8 }
    ],
    "labors": [
      { "id": "58aed305-ca17-4885-8be7-0d66160112b9", "quantity": 1 },
      { "id": "557fa85c-08bf-48dd-a7d5-7d3df895881c", "quantity": 3 }
    ],
    "internalNote": "some internal note"
  }
  ```

- **Responses**
  - 204 No Content. The manufacture order has been created and stored in DB.
  - 400 Bad Request. Response body with a JSON informative message.
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 409 Conflict. (Internal code already used in another material). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/get-colour.png) **`GET`** `/v1/orders/{orderID}` Returns a manufacture order by manufacture order ID

<details>
  <summary>Click here</summary>

Return a manufacture order stored in DB by its ID.

- **Responses**

  - 200 OK

    ```
    // Example

    // Header
    HTTP 200 OK
    Content-Type: application/json

    // Body
    {
      "id": "54c42fec-f0a5-4e39-b9f6-e42e2a3c0222",
      "createdAt": "4/10/2023, 1:55:56 PM",
      "internalCode": "AT-01",
      "description": "antique table",
      "status": "pending",
      "manufactured": 0,
      "price": 450,
      "totalProductionTime": 143,
      "unitsToManufacture": 25,
      "materials": [
        { "id": "4818bf86-d823-447c-8b44-314b9f3c6006", "quantity": 4 },
        { "id": "1e763ff7-c953-4648-8662-535e2666ddb9", "quantity": 8 }
      ],
      "labors": [
        { "id": "58aed305-ca17-4885-8be7-0d66160112b9", "quantity": 1 },
        { "id": "557fa85c-08bf-48dd-a7d5-7d3df895881c", "quantity": 3 }
      ],
      "internalNote": "some internal note"
    }
    ```

  - 404 No Found. (The manufacture order does not exist).
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/patch-colour.png) **`PATCH`** `/v1/orders/{orderID}` Update a manufacture order by manufacture order ID

<details>
  <summary>Click here</summary>

Update a stored manufacture order in the DB.

- **Request**

  ```
  // Example

  // Header
  Content-Type: application/json; charset=utf-8
  Authorization: c326b621-167f-4192-9845-b11cc01597fb // Valid token

  // Body
  {
    "internalCode": "AT-3",
    "description": "antique table",
    "status": "pending",
    "manufactured": 0,
    "price": 450,
    "totalProductionTime": 143,
    "unitsToManufacture": 25,
    "materials": [
      { "id": "4818bf86-d823-447c-8b44-314b9f3c6006", "quantity": 4 },
      { "id": "1e763ff7-c953-4648-8662-535e2666ddb9", "quantity": 8 }
    ],
    "labors": [
      { "id": "58aed305-ca17-4885-8be7-0d66160112b9", "quantity": 1 },
      { "id": "557fa85c-08bf-48dd-a7d5-7d3df895881c", "quantity": 3 }
    ],
    "internalNote": "updating internal notes"
  }
  ```

- **Responses**
  - 204 No Content. (Successful update).
  - 400 Bad Request. Response body with a JSON informative message.
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 404 Not Found. (Manufacture order ID not found in DB). Response body with a JSON informative message.
  - 409 Conflict. (Internal code already used). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

![](./images/delete-colour.png) **`DELETE`** `/v1/orders/{orderID}` Delete an unplaced manufacture order by manufacture order ID

<details>
  <summary>Click here</summary>

Delete an unplaced manufacture order from the DB.

- **Responses**
  - 204 No Content. (Successful deletion)
  - 401 Unauthorized. (Invalid authentication token). Response body with a JSON informative message.
  - 404 Not Found. (Manufacture order ID not found in DB). Response body with a JSON informative message.
  - 500 Internal Server Error. Response body with a JSON informative message.

</details>

</details>

## Installation

1. `Clone` the repository

```bash
git clone https://github.com/jszychowskilaba/furniture-manufacturing.git
```

2. `Install` dependencies

```bash
npm install
```

3. `Compile` code if you modify TypeScript code

```bash
npx tsc
```

4. `Compose` docker containers

```bash
docker compose up
```

5. `Have fun`

```

```
