package main

import (
	"context"
	"go-mongodb/db"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/create-user", CreateUser)
	e.GET("/get-user", GetUser)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func CreateUser(c echo.Context) error {
	client, err := db.MgoConn()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to connect to MongoDB")
	}
	defer client.Disconnect(c.Request().Context())

	var table = db.MgoCollection("user", client)

	_, err = table.InsertOne(c.Request().Context(), db.User{
		Name:      "Cinta Salma",
		Age:       20,
		CreatedAt: time.Now(),
	})

	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to create user")
	}

	return c.String(http.StatusOK, "User created successfully")
}

func GetUser(c echo.Context) error {
	ageStr := c.QueryParam("age")
	age, err := strconv.Atoi(ageStr)
	if err != nil {
		return c.String(http.StatusBadRequest, "Invalid age parameter")
	}

	// Mongo connection
	client, err := db.MgoConn()
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to connect to MongoDB")
	}
	defer client.Disconnect(context.TODO())

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var users = make([]db.User, 0)

	// Get data
	coll := db.MgoCollection("user", client)
	filter := bson.M{
		"age": age,
	}
	result, err := coll.Find(ctx, filter)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Failed to query users")
	}
	defer result.Close(ctx)

	for result.Next(ctx) {
		var user db.User
		if err := result.Decode(&user); err != nil {
			return c.String(http.StatusInternalServerError, "Failed to decode user")
		}
		users = append(users, user)
	}

	if err := result.Err(); err != nil {
		return c.String(http.StatusInternalServerError, "Error while querying users")
	}

	return c.JSON(http.StatusOK, users)
}
