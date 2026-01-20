{
  "openapi": "3.0.1",
  "info": {
    "title": "EduJob Application Tracker API",
    "description": "REST API for tracking job and study applications, managing documents and companies.",
    "contact": {
      "name": "API Support",
      "email": "support@edujobapp.lu"
    },
    "version": "1.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080",
      "description": "Local Development Server"
    }
  ],
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "tags": [
    {
      "name": "Application",
      "description": "Application management APIs"
    },
    {
      "name": "Authentication",
      "description": "Authentication APIs"
    },
    {
      "name": "User",
      "description": "User management APIs"
    },
    {
      "name": "Dashboard",
      "description": "Dashboard statistics APIs"
    },
    {
      "name": "Document",
      "description": "Document management APIs"
    },
    {
      "name": "Company",
      "description": "Company management APIs"
    }
  ],
  "paths": {
    "/api/users/{id}": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Get user by ID (Admin only)",
        "operationId": "getUserById",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "User"
        ],
        "summary": "Update user by ID (Admin only)",
        "operationId": "updateUser",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "User"
        ],
        "summary": "Delete user by ID (Admin only)",
        "operationId": "deleteUser",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/users/me": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Get current user profile",
        "operationId": "getCurrentUser",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "User"
        ],
        "summary": "Update current user profile",
        "operationId": "updateCurrentUser",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/documents/{id}": {
      "get": {
        "tags": [
          "Document"
        ],
        "summary": "Get metadata for a single document",
        "operationId": "getDocumentMetadata",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/DocumentResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Document"
        ],
        "summary": "Update a document's metadata",
        "operationId": "updateDocumentMetadata",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DocumentRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/DocumentResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Document"
        ],
        "summary": "Delete a document",
        "operationId": "deleteDocument",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/companies/{id}": {
      "get": {
        "tags": [
          "Company"
        ],
        "summary": "Get a single company by ID",
        "operationId": "getCompanyById",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Company"
        ],
        "summary": "Update a company",
        "operationId": "updateCompany",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CompanyRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Company"
        ],
        "summary": "Delete a company",
        "operationId": "deleteCompany",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/applications/{id}": {
      "get": {
        "tags": [
          "Application"
        ],
        "summary": "Get a single application by ID",
        "operationId": "getApplicationById",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApplicationResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Application"
        ],
        "summary": "Update an application",
        "operationId": "updateApplication",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ApplicationRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApplicationResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Application"
        ],
        "summary": "Delete an application",
        "operationId": "deleteApplication",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/documents/upload": {
      "post": {
        "tags": [
          "Document"
        ],
        "summary": "Upload a new document",
        "operationId": "uploadDocument",
        "parameters": [
          {
            "name": "fileName",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "contentType",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "docStatus",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "required": [
                  "file"
                ],
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/DocumentResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/companies": {
      "get": {
        "tags": [
          "Company"
        ],
        "summary": "Get all companies for the logged-in user",
        "operationId": "getMyCompanies",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/CompanyResponse"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Company"
        ],
        "summary": "Create a new company",
        "operationId": "createCompany",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CompanyRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/CompanyResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Register a new user",
        "operationId": "register",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterUserRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/AuthUserResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Authenticate user and get token",
        "operationId": "login",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginUserRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/AuthUserResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/applications": {
      "get": {
        "tags": [
          "Application"
        ],
        "summary": "Get all applications for the logged-in user",
        "operationId": "getMyApplications",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ApplicationResponse"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Application"
        ],
        "summary": "Create a new application",
        "operationId": "createApplication",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ApplicationRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ApplicationResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/users": {
      "get": {
        "tags": [
          "User"
        ],
        "summary": "Get all users (Admin only)",
        "operationId": "getAllUsers",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/UserResponse"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/jobs": {
      "get": {
        "tags": [
          "public-controller"
        ],
        "operationId": "getPublicJobs",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PublicJobResponse"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/documents": {
      "get": {
        "tags": [
          "Document"
        ],
        "summary": "Get all documents for the logged-in user",
        "operationId": "getMyDocuments",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/DocumentResponse"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/documents/{id}/download": {
      "get": {
        "tags": [
          "Document"
        ],
        "summary": "Download a document",
        "operationId": "downloadDocument",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/api/documents/{id}/applications": {
      "get": {
        "tags": [
          "Document"
        ],
        "summary": "Get all applications using a specific document",
        "operationId": "getApplicationsByDocument",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ApplicationResponse"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/dashboard": {
      "get": {
        "tags": [
          "Dashboard"
        ],
        "summary": "Get dashboard statistics for the logged-in user",
        "operationId": "getDashboardStats",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/DashboardResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/companies/{id}/applications": {
      "get": {
        "tags": [
          "Company"
        ],
        "summary": "Get all applications for a specific company",
        "operationId": "getApplicationsByCompany",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ApplicationResponse"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "UpdateUserRequestDto": {
        "required": [
          "email",
          "firstName",
          "lastName",
          "username"
        ],
        "type": "object",
        "properties": {
          "username": {
            "maxLength": 50,
            "minLength": 3,
            "type": "string"
          },
          "email": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "firstName": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "lastName": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "birthDate": {
            "type": "string",
            "format": "date"
          },
          "phone": {
            "maxLength": 20,
            "minLength": 0,
            "type": "string"
          }
        }
      },
      "UserResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "username": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "birthDate": {
            "type": "string",
            "format": "date"
          },
          "phone": {
            "type": "string"
          },
          "role": {
            "type": "string"
          }
        }
      },
      "DocumentRequest": {
        "required": [
          "docStatus",
          "fileName",
          "userId"
        ],
        "type": "object",
        "properties": {
          "fileName": {
            "type": "string"
          },
          "contentType": {
            "type": "string"
          },
          "docStatus": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "DocumentResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "fileName": {
            "type": "string"
          },
          "contentType": {
            "type": "string"
          },
          "uploadDate": {
            "type": "string",
            "format": "date-time"
          },
          "docStatus": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "downloadUrl": {
            "type": "string"
          },
          "applicationCount": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "CompanyRequest": {
        "required": [
          "country",
          "name",
          "type",
          "userId"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "country": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "website": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "CompanyResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "country": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "website": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "applicationCount": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "ApplicationRequest": {
        "required": [
          "appStatus",
          "applicationType",
          "companyId",
          "title",
          "userId"
        ],
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "applicationType": {
            "type": "string"
          },
          "submitDate": {
            "type": "string",
            "format": "date"
          },
          "submitDeadline": {
            "type": "string",
            "format": "date"
          },
          "responseDeadline": {
            "type": "string",
            "format": "date"
          },
          "appStatus": {
            "type": "string"
          },
          "resultNotes": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "companyId": {
            "type": "integer",
            "format": "int64"
          },
          "documentIds": {
            "uniqueItems": true,
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            }
          }
        }
      },
      "ApplicationResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "applicationType": {
            "type": "string"
          },
          "creationDate": {
            "type": "string",
            "format": "date-time"
          },
          "submitDate": {
            "type": "string",
            "format": "date"
          },
          "submitDeadline": {
            "type": "string",
            "format": "date"
          },
          "responseDeadline": {
            "type": "string",
            "format": "date"
          },
          "appStatus": {
            "type": "string"
          },
          "resultNotes": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "company": {
            "$ref": "#/components/schemas/CompanyResponse"
          },
          "documents": {
            "uniqueItems": true,
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/DocumentResponse"
            }
          }
        }
      },
      "RegisterUserRequestDto": {
        "required": [
          "email",
          "firstName",
          "lastName",
          "password",
          "username"
        ],
        "type": "object",
        "properties": {
          "username": {
            "maxLength": 50,
            "minLength": 3,
            "type": "string"
          },
          "password": {
            "maxLength": 120,
            "minLength": 8,
            "type": "string"
          },
          "email": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "firstName": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "lastName": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string"
          },
          "birthDate": {
            "type": "string",
            "format": "date"
          },
          "phone": {
            "maxLength": 20,
            "minLength": 0,
            "type": "string"
          }
        }
      },
      "AuthUserResponseDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "userId": {
            "type": "integer",
            "format": "int64"
          },
          "username": {
            "type": "string"
          },
          "role": {
            "type": "string"
          }
        }
      },
      "LoginUserRequestDto": {
        "required": [
          "password",
          "username"
        ],
        "type": "object",
        "properties": {
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      },
      "PublicJobResponse": {
        "type": "object",
        "properties": {
          "company_name": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "remote": {
            "type": "boolean"
          },
          "job_types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "tags": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "location": {
            "type": "string"
          }
        }
      },
      "DashboardResponse": {
        "type": "object",
        "properties": {
          "totalApplications": {
            "type": "integer",
            "format": "int64"
          },
          "totalDocuments": {
            "type": "integer",
            "format": "int64"
          },
          "totalCompanies": {
            "type": "integer",
            "format": "int64"
          },
          "applicationsByStatus": {
            "type": "object",
            "additionalProperties": {
              "type": "integer",
              "format": "int64"
            }
          },
          "applicationsByType": {
            "type": "object",
            "additionalProperties": {
              "type": "integer",
              "format": "int64"
            }
          },
          "documentNames": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "companyNames": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "allApplications": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ApplicationResponse"
            }
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "description": "JWT Authentication",
        "in": "header",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}